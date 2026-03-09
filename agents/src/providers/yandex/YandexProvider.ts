import type { ChatMessage, GenerationOptions, LlmProvider } from "../../llm/types.js";

const DEFAULT_YANDEX_FOLDER_ID = "b1g6l715r51a1jt7e61c";

export interface YandexProviderConfig extends GenerationOptions {
  apiKey: string;
  folderId: string;
  endpoint?: string;
}

export class YandexProvider implements LlmProvider {
  private readonly endpoint: string;
  private readonly model: string;

  constructor(private readonly config: YandexProviderConfig) {
    this.model = config.model ?? "yandexgpt-lite";
    this.endpoint =
      config.endpoint ??
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";
  }

  static fromEnv(env: NodeJS.ProcessEnv = process.env): YandexProvider {
    const apiKey = env.YANDEX_API_KEY;

    if (!apiKey) {
      throw new Error("Environment variable YANDEX_API_KEY is required");
    }

    return new YandexProvider({
      apiKey,
      folderId: env.YANDEX_FOLDER_ID ?? DEFAULT_YANDEX_FOLDER_ID,
      model: env.YANDEX_TEXT_MODEL ?? "yandexgpt-lite",
    });
  }

  async chat(messages: ChatMessage[], options?: GenerationOptions): Promise<string> {
    const model = options?.model ?? this.model;
    const modelUri = `gpt://${this.config.folderId}/${model}/latest`;
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Api-Key ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        modelUri,
        completionOptions: {
          stream: false,
          temperature: options?.temperature ?? this.config.temperature ?? 0.6,
          maxTokens: options?.maxTokens ?? this.config.maxTokens ?? 800,
        },
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`YandexGPT request failed (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as {
      result?: {
        alternatives?: Array<{ message?: { text?: string } }>;
      };
    };
    const text = data.result?.alternatives?.[0]?.message?.text;
    if (!text) {
      throw new Error("YandexGPT returned empty response text");
    }
    return text;
  }
}
