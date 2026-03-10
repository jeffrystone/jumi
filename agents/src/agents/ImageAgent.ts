import type {
  ImageGenerationResult,
  ImageProvider,
} from "../llm/types.js";

const MAX_IMAGE_PROMPT_LENGTH = 480;

export interface ImageAgentSettings {
  name: string;
  systemPrompt?: string;
  model?: string;
}

export class ImageAgent {
  constructor(
    private readonly provider: ImageProvider,
    private readonly settings: ImageAgentSettings
  ) {}

  get name(): string {
    return this.settings.name;
  }

  async generate(userPrompt: string): Promise<ImageGenerationResult> {
    const rawPrompt = this.settings.systemPrompt
      ? `${this.settings.systemPrompt}\n\n${userPrompt}`
      : userPrompt;
    const prompt =
      rawPrompt.length > MAX_IMAGE_PROMPT_LENGTH
        ? rawPrompt.slice(0, MAX_IMAGE_PROMPT_LENGTH)
        : rawPrompt;

    return this.provider.generate(prompt, {
      model: this.settings.model,
    });
  }
}
