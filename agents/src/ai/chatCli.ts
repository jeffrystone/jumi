import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import type { ChatMessage } from "../llm/types.js";
import {
  createLandingImageAssistant,
  createPrManagerAssistant,
} from "../agents/presets.js";
import { YandexImageProvider } from "../providers/yandex/YandexImageProvider.js";
import { YandexProvider } from "../providers/yandex/YandexProvider.js";

function resolveAgentPreset() {
  const preset = (process.env.AGENT_PRESET ?? "pr-manager").toLowerCase();

  if (preset === "landing-image" || preset === "image") {
    return "landing-image" as const;
  }
  return "pr-manager" as const;
}

async function main(): Promise<void> {
  const preset = resolveAgentPreset();
  const textProvider = YandexProvider.fromEnv();
  const imageProvider = YandexImageProvider.fromEnv();
  const textAgent = createPrManagerAssistant(textProvider);
  const imageAgent = createLandingImageAssistant(imageProvider);

  const rl = createInterface({ input, output });
  const history: ChatMessage[] = [];

  const activeAgentName = preset === "landing-image" ? imageAgent.name : textAgent.name;
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
      if (preset === "landing-image") {
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
        const answer = await textAgent.reply(userText, history.slice(0, -1));
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
