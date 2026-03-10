import type { ImageProvider, LlmProvider } from "../llm/types.js";
import fs from "node:fs";
import path from "node:path";
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

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, "utf-8");
    }
  }

  throw new Error(`Prompt file not found: ${fileName}`);
}

const HR_PROMPT = loadPromptFile("HR.txt");
const WRITER_PROMPT = loadPromptFile("Writer.txt");
const THEMA_PROMPT = loadPromptFile("Thema.txt");
const IMAGE_HERO_PROMPT = loadPromptFile("Image_Hero.txt");

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

export function createImageHeroAssistant(provider: ImageProvider): ImageAgent {
  return new ImageAgent(provider, {
    name: "image-hero",
    model: BEST_IMAGE_MODEL,
    systemPrompt: IMAGE_HERO_PROMPT,
  });
}

export function createLandingImageAssistant(provider: ImageProvider): ImageAgent {
  return createImageHeroAssistant(provider);
}
