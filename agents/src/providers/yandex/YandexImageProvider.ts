import type {
  ImageGenerationOptions,
  ImageGenerationResult,
  ImageProvider,
} from "../../llm/types.js";

const DEFAULT_YANDEX_FOLDER_ID = "b1g6l715r51a1jt7e61c";

export interface YandexImageProviderConfig extends ImageGenerationOptions {
  apiKey: string;
  folderId: string;
  endpoint?: string;
  operationsEndpoint?: string;
}

export class YandexImageProvider implements ImageProvider {
  private readonly endpoint: string;
  private readonly operationsEndpoint: string;
  private readonly model: string;

  constructor(private readonly config: YandexImageProviderConfig) {
    this.model = config.model ?? "yandex-art/latest";
    this.endpoint =
      config.endpoint ??
      "https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync";
    this.operationsEndpoint =
      config.operationsEndpoint ??
      "https://operation.api.cloud.yandex.net/operations";
  }

  static fromEnv(env: NodeJS.ProcessEnv = process.env): YandexImageProvider {
    const apiKey = env.YANDEX_API_KEY;
    if (!apiKey) {
      throw new Error("Environment variable YANDEX_API_KEY is required");
    }

    return new YandexImageProvider({
      apiKey,
      folderId: env.YANDEX_FOLDER_ID ?? DEFAULT_YANDEX_FOLDER_ID,
      model: env.YANDEX_IMAGE_MODEL ?? "yandex-art/latest",
    });
  }

  async generate(
    prompt: string,
    options?: ImageGenerationOptions
  ): Promise<ImageGenerationResult> {
    const model = options?.model ?? this.model;
    const modelUri = model.startsWith("art://")
      ? model
      : `art://${this.config.folderId}/${model}`;

    const createResponse = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Api-Key ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        modelUri,
        generationOptions: {
          mimeType: "image/png",
        },
        messages: [{ weight: 1, text: prompt }],
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(
        `Yandex image generation request failed (${createResponse.status}): ${errorText}`
      );
    }

    const operation = (await createResponse.json()) as { id?: string };
    if (!operation.id) {
      throw new Error("Yandex image generation did not return operation id");
    }

    for (let attempt = 0; attempt < 30; attempt += 1) {
      const pollResponse = await fetch(
        `${this.operationsEndpoint}/${operation.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Api-Key ${this.config.apiKey}`,
          },
        }
      );

      if (!pollResponse.ok) {
        const errorText = await pollResponse.text();
        throw new Error(
          `Yandex image generation poll failed (${pollResponse.status}): ${errorText}`
        );
      }

      const pollData = (await pollResponse.json()) as {
        done?: boolean;
        error?: { message?: string };
        response?: { image?: string };
      };

      if (pollData.error?.message) {
        throw new Error(`Yandex image generation error: ${pollData.error.message}`);
      }

      if (pollData.done) {
        const imageBase64 = pollData.response?.image;
        if (!imageBase64) {
          throw new Error("Yandex image generation returned empty image payload");
        }
        return { base64: imageBase64, mimeType: "image/png" };
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error("Yandex image generation timeout");
  }
}
