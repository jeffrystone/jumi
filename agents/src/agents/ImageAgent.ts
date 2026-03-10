import type {
  ImageGenerationResult,
  ImageProvider,
} from "../llm/types.js";

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
    const prompt = this.settings.systemPrompt
      ? `${this.settings.systemPrompt}\n\n${userPrompt}`
      : userPrompt;

    return this.provider.generate(prompt, {
      model: this.settings.model,
    });
  }
}
