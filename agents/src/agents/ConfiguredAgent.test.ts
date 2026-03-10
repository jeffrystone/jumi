import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import {
  createHrAssistant,
  createImageHeroAssistant,
  createThemaAssistant,
  createWriterAssistant,
} from "./presets.js";
import { YandexImageProvider } from "../providers/yandex/YandexImageProvider.js";
import { YandexProvider } from "../providers/yandex/YandexProvider.js";

describe("ConfiguredAgent (integration)", () => {
  jest.setTimeout(90_000);

  it("uses HR prompt template and gets real response", async () => {
    const provider = YandexProvider.fromEnv();
    const agent = createHrAssistant(provider);

    const answer = await agent.reply("Сделай краткое HR-интервью для frontend-разработчика.");

    expect(typeof answer).toBe("string");
    expect(answer.trim().length).toBeGreaterThan(0);
    console.log(`[TEST] ${expect.getState().currentTestName} -> ${answer}`);
  });

  it("uses Writer prompt template and gets real response", async () => {
    const provider = YandexProvider.fromEnv();
    const agent = createWriterAssistant(provider);

    const answer = await agent.reply("Напиши короткий продающий абзац для AI-сервиса.");

    expect(typeof answer).toBe("string");
    expect(answer.trim().length).toBeGreaterThan(0);
    console.log(`[TEST] ${expect.getState().currentTestName} -> ${answer}`);
  });

  it("uses Thema prompt template and gets real response", async () => {
    const provider = YandexProvider.fromEnv();
    const agent = createThemaAssistant(provider);

    const answer = await agent.reply("Предложи тему и палитру для лендинга b2b-продукта.");

    expect(typeof answer).toBe("string");
    expect(answer.trim().length).toBeGreaterThan(0);
    console.log(`[TEST] ${expect.getState().currentTestName} -> ${answer}`);
  });

  it("uses Image_Hero prompt template and gets real image response", async () => {
    const provider = YandexImageProvider.fromEnv();
    const agent = createImageHeroAssistant(provider);

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
