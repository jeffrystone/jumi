import type { ImageProvider, LlmProvider } from "../llm/types.js";
import { ConfiguredAgent } from "./ConfiguredAgent.js";
import { ImageAgent } from "./ImageAgent.js";

const BEST_TEXT_MODEL = "yandexgpt-lite";
const BEST_IMAGE_MODEL = "yandex-art";

export function createPrManagerAssistant(provider: LlmProvider): ConfiguredAgent {
  return new ConfiguredAgent(provider, {
    name: "pr-manager",
    model: BEST_TEXT_MODEL,
    systemPrompt: "Pr-Manager",
  });
}

export function createLandingImageAssistant(provider: ImageProvider): ImageAgent {
  return new ImageAgent(provider, {
    name: "landing-image-generator",
    model: BEST_IMAGE_MODEL,
    systemPrompt: "Генератор картинок для лендинга",
  });
}
