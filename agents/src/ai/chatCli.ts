import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import type { ChatMessage } from "../llm/types.js";
import {
  createHrAssistant,
  createImageHeroAssistant,
  createThemaAssistant,
  createWriterAssistant,
} from "../agents/presets.js";
import { YandexImageProvider } from "../providers/yandex/YandexImageProvider.js";
import { YandexProvider } from "../providers/yandex/YandexProvider.js";

function resolveAgentPreset() {
  const preset = (process.env.AGENT_PRESET ?? "hr").toLowerCase();

  if (preset === "image-hero" || preset === "landing-image" || preset === "image") {
    return "image-hero" as const;
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
  const imageAgent = createImageHeroAssistant(imageProvider);

  const rl = createInterface({ input, output });
  const history: ChatMessage[] = [];

  const activeAgentName =
    preset === "image-hero"
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
      if (preset === "image-hero") {
        const image = await imageAgent.generate(userText);
        if (image.url) {
          console.log(`image(url)> ${image.url}`);
        } else if (image.base64) {
          const outDir = path.resolve(process.cwd(), "generated");
          if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
          }
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
