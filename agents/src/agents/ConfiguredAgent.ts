import type { ChatMessage, LlmProvider } from "../llm/types.js";

export interface AgentPromptSettings {
  name: string;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export class ConfiguredAgent {
  constructor(
    private readonly provider: LlmProvider,
    private readonly settings: AgentPromptSettings
  ) {}

  get name(): string {
    return this.settings.name;
  }

  async reply(userText: string, history: ChatMessage[] = []): Promise<string> {
    const messages: ChatMessage[] = [];

    if (this.settings.systemPrompt) {
      messages.push({ role: "system", text: this.settings.systemPrompt });
    }

    messages.push(...history, { role: "user", text: userText });

    return this.provider.chat(messages, {
      model: this.settings.model,
      temperature: this.settings.temperature,
      maxTokens: this.settings.maxTokens,
    });
  }
}
