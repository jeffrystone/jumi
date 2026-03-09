export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export interface GenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LlmProvider {
  chat(messages: ChatMessage[], options?: GenerationOptions): Promise<string>;
}

export interface ImageGenerationResult {
  url?: string;
  base64?: string;
  mimeType?: string;
}

export interface ImageGenerationOptions {
  model?: string;
}

export interface ImageProvider {
  generate(
    prompt: string,
    options?: ImageGenerationOptions
  ): Promise<ImageGenerationResult>;
}
