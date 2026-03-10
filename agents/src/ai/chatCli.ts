import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { ensureDir } from "@jumi/core";
import type { ChatMessage } from "../llm/types.js";
import {
  createImageAgent,
  createHeroPromptAssistant,
  createHrAssistant,
  createThemaAssistant,
  createWriterAssistant,
} from "../agents/presets.js";
import { YandexImageProvider } from "../providers/yandex/YandexImageProvider.js";
import { YandexProvider } from "../providers/yandex/YandexProvider.js";

function resolveAgentPreset() {
  const preset = (process.env.AGENT_PRESET ?? "hr").toLowerCase();

  if (preset === "hero-prompt" || preset === "image-hero" || preset === "landing-image") {
    return "hero-prompt" as const;
  }
  if (preset === "image") {
    return "image" as const;
  }
  if (preset === "writer") {
    return "writer" as const;
  }
  if (preset === "thema" || preset === "theme") {
    return "thema" as const;
  }
  return "hr" as const;
}

async function main(): Promise<void> {
  const preset = resolveAgentPreset();
  const textProvider = YandexProvider.fromEnv();
  const imageProvider = YandexImageProvider.fromEnv();
  const hrAgent = createHrAssistant(textProvider);
  const writerAgent = createWriterAssistant(textProvider);
  const themaAgent = createThemaAssistant(textProvider);
  const heroPromptAgent = createHeroPromptAssistant(textProvider);
  const imageAgent = createImageAgent(imageProvider, {
    systemPrompt: process.env.IMAGE_AGENT_SYSTEM_PROMPT,
  });

  const rl = createInterface({ input, output });
  const history: ChatMessage[] = [];

  const activeAgentName =
    preset === "hero-prompt"
      ? heroPromptAgent.name
      : preset === "image"
        ? imageAgent.name
      : preset === "writer"
        ? writerAgent.name
        : preset === "thema"
          ? themaAgent.name
          : hrAgent.name;
  console.log(`Chat started with agent '${activeAgentName}'. Type 'exit' to quit.`);

  while (true) {
    const userText = (await rl.question("you> ")).trim();
    if (!userText) {
      continue;
    }
    if (userText.toLowerCase() === "exit") {
      break;
    }

    history.push({ role: "user", text: userText });

    try {
      if (preset === "image") {
        const image = await imageAgent.generate(userText);
        if (image.url) {
          console.log(`image(url)> ${image.url}`);
        } else if (image.base64) {
          const outDir = path.resolve(process.cwd(), "generated");
          ensureDir(outDir);
          const filePath = path.join(outDir, `image-${Date.now()}.png`);
          fs.writeFileSync(filePath, Buffer.from(image.base64, "base64"));
          console.log(`image(file)> ${filePath}`);
        } else {
          console.log("image> empty image response");
        }
      } else {
        const activeTextAgent =
          preset === "writer"
            ? writerAgent
            : preset === "thema"
              ? themaAgent
              : preset === "hero-prompt"
                ? heroPromptAgent
                : hrAgent;
        const answer = await activeTextAgent.reply(userText, history.slice(0, -1));
        history.push({ role: "assistant", text: answer });
        console.log(`bot> ${answer}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`bot(error)> ${message}`);
    }
  }

  rl.close();
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
