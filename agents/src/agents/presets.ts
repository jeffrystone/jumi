import type { ImageProvider, LlmProvider } from "../llm/types.js";
import path from "node:path";
import { readFirstExistingFile } from "@jumi/core";
import { ConfiguredAgent } from "./ConfiguredAgent.js";
import { ImageAgent } from "./ImageAgent.js";

const BEST_TEXT_MODEL = "yandexgpt";
const BEST_IMAGE_MODEL = "yandex-art/latest";

function loadPromptFile(fileName: string): string {
  const candidates = [
    path.resolve(process.cwd(), "src", "agents", "promts_base", fileName),
    path.resolve(process.cwd(), "agents", "src", "agents", "promts_base", fileName),
    path.resolve(process.cwd(), "..", "agents", "src", "agents", "promts_base", fileName),
  ];
  return readFirstExistingFile(candidates);
}

const HR_PROMPT = loadPromptFile("HR.txt");
const WRITER_PROMPT = loadPromptFile("Writer.txt");
const THEMA_PROMPT = loadPromptFile("Thema.txt");
const HERO_PROMPT = loadPromptFile("Hero_Prompt.txt");

export function createHrAssistant(provider: LlmProvider): ConfiguredAgent {
  return new ConfiguredAgent(provider, {
    name: "hr",
    model: BEST_TEXT_MODEL,
    systemPrompt: HR_PROMPT,
  });
}

export function createWriterAssistant(provider: LlmProvider): ConfiguredAgent {
  return new ConfiguredAgent(provider, {
    name: "writer",
    model: BEST_TEXT_MODEL,
    systemPrompt: WRITER_PROMPT,
  });
}

export function createThemaAssistant(provider: LlmProvider): ConfiguredAgent {
  return new ConfiguredAgent(provider, {
    name: "thema",
    model: BEST_TEXT_MODEL,
    systemPrompt: THEMA_PROMPT,
  });
}

export function createPrManagerAssistant(provider: LlmProvider): ConfiguredAgent {
  return createHrAssistant(provider);
}

export function createHeroPromptAssistant(provider: LlmProvider): ConfiguredAgent {
  return new ConfiguredAgent(provider, {
    name: "hero-prompt",
    model: BEST_TEXT_MODEL,
    systemPrompt: HERO_PROMPT,
  });
}

export function createImageHeroAssistant(provider: LlmProvider): ConfiguredAgent {
  return createHeroPromptAssistant(provider);
}

export function createLandingImageAssistant(provider: LlmProvider): ConfiguredAgent {
  return createHeroPromptAssistant(provider);
}

export interface CreateImageAgentOptions {
  name?: string;
  systemPrompt?: string;
  model?: string;
}

export function createImageAgent(
  provider: ImageProvider,
  options: CreateImageAgentOptions = {}
): ImageAgent {
  return new ImageAgent(provider, {
    name: options.name ?? "image",
    systemPrompt: options.systemPrompt,
    model: options.model ?? BEST_IMAGE_MODEL,
  });
}
