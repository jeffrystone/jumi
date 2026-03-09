import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import {
  createLandingImageAssistant,
  createPrManagerAssistant,
} from "./presets.js";
import { YandexImageProvider } from "../providers/yandex/YandexImageProvider.js";
import { YandexProvider } from "../providers/yandex/YandexProvider.js";

describe("ConfiguredAgent (integration)", () => {
  jest.setTimeout(60_000);

  it("uses Pr-Manager system prompt and gets real response", async () => {
    const provider = YandexProvider.fromEnv();
    const agent = createPrManagerAssistant(provider);

    const answer = await agent.reply("привет, кто ты");

    expect(typeof answer).toBe("string");
    expect(answer.trim().length).toBeGreaterThan(0);
    console.log(`[TEST] ${expect.getState().currentTestName} -> ${answer}`);
  });

  it("uses landing image generator system prompt and gets real response", async () => {
    const provider = YandexImageProvider.fromEnv();
    const agent = createLandingImageAssistant(provider);

    const image = await agent.generate(
      "Сгенерируй hero-баннер для лендинга AI-продукта в минималистичном стиле"
    );

    expect(Boolean(image.url || image.base64)).toBe(true);

    if (image.url) {
      console.log(`[TEST] ${expect.getState().currentTestName} -> ${image.url}`);
      return;
    }

    if (image.base64) {
      const outDir = path.resolve(process.cwd(), "generated");
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      const filePath = path.join(outDir, "test-landing-image.png");
      fs.writeFileSync(filePath, Buffer.from(image.base64, "base64"));
      console.log(`[TEST] ${expect.getState().currentTestName} -> ${filePath}`);
    }
  });
});
