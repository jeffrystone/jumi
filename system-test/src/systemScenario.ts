import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import {
  assert,
  buildHrPayload,
  buildThemaPayload,
  buildWriterPayload,
  findFirstExistingPath,
  parseJsonFromText,
  type LandingInputData,
  writeTextFile,
} from "@jumi/core";
import {
  createHrAssistant,
  YandexProvider,
  createThemaAssistant,
  createWriterAssistant,
} from "@jumi/agents";

const localEnvPath = path.resolve(process.cwd(), ".env");
const agentsEnvPath = path.resolve(process.cwd(), "..", "agents", ".env");
const envPath = findFirstExistingPath([localEnvPath, agentsEnvPath]);
if (envPath) {
  dotenv.config({ path: envPath });
}

function isRealConnectionEnabled(): boolean {
  return true;
  const value = (process.env.IS_REAL_CONNECTION ?? "").trim().toLowerCase();
  return value === "true" || value === "1" || value === "yes";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function withHrContext(input: LandingInputData, hrJson: Record<string, unknown> | null): LandingInputData {
  if (!hrJson) {
    return input;
  }

  const business = isRecord(hrJson.business) ? hrJson.business : null;
  const audience = isRecord(hrJson.audience) ? hrJson.audience : null;
  const marketing = isRecord(hrJson.marketing) ? hrJson.marketing : null;
  const visual = isRecord(hrJson.visual) ? hrJson.visual : null;

  return {
    business: {
      product_name: readString(business?.product_name) ?? input.business.product_name,
      product_description:
        readString(business?.product_description) ?? input.business.product_description,
      problem: readString(business?.problem) ?? input.business.problem,
      advantage: readString(business?.advantage) ?? input.business.advantage,
    },
    audience: {
      target: readString(audience?.target) ?? input.audience.target,
      tone_type: readString(audience?.tone_type) ?? input.audience.tone_type,
    },
    marketing: {
      main_goal: readString(marketing?.main_goal) ?? input.marketing.main_goal,
      primary_cta: readString(marketing?.primary_cta) ?? input.marketing.primary_cta,
      promotions: readString(marketing?.promotions) ?? input.marketing.promotions,
    },
    visual: {
      tone: readString(visual?.tone) ?? input.visual.tone,
      brand_colors: readString(visual?.brand_colors) ?? input.visual.brand_colors,
      image_mood: readString(visual?.image_mood) ?? input.visual.image_mood,
      people_photos: readString(visual?.people_photos) ?? input.visual.people_photos,
    },
  };
}

async function run(): Promise<void> {
  console.log("[SCENARIO] start");

  if (!isRealConnectionEnabled()) {
    console.log("[SCENARIO] skipped: set IS_REAL_CONNECTION=true to run real agent calls");
    return;
  }

  const inputPath = path.resolve(process.cwd(), "input.json");
  const outputsDir = path.resolve(process.cwd(), "outputs");
  const webPreviewGeneratedDir = path.resolve(process.cwd(), "..", "web-preview", "generated");
  const inputRaw = fs.readFileSync(inputPath, "utf-8");
  const input = JSON.parse(inputRaw) as LandingInputData;

  const provider = YandexProvider.fromEnv();
  const hrAgent = createHrAssistant(provider);
  const themaAgent = createThemaAssistant(provider);
  const writerAgent = createWriterAssistant(provider);

  const hrPayload = buildHrPayload(input);
  const hrAnswer = await hrAgent.reply(JSON.stringify(hrPayload, null, 2));
  assert(hrAnswer.trim().length > 0, "HR answer should not be empty");
  writeTextFile(path.join(outputsDir, "hr-answer.txt"), hrAnswer);
  console.log(`[SCENARIO] hr answer: ${hrAnswer}`);
  const hrJson = parseJsonFromText(hrAnswer);
  // console.log(`[SCENARIO] hr json: ${JSON.stringify(hrJson, null, 2)}`);
  if (hrJson) {
    writeTextFile(path.join(webPreviewGeneratedDir, "hr-answer.json"), JSON.stringify(hrJson, null, 2));
  }

  const hrAdjustedInput = withHrContext(input, hrJson);
  const themaPayload = buildThemaPayload(hrAdjustedInput);
  const themaAnswer = await themaAgent.reply(JSON.stringify(themaPayload, null, 2));
  assert(themaAnswer.trim().length > 0, "Thema answer should not be empty");
  writeTextFile(path.join(outputsDir, "thema-answer.txt"), themaAnswer);
  // console.log(`[SCENARIO] thema answer: ${themaAnswer}`);
  const themeJson = parseJsonFromText(themaAnswer);
  console.log(`[SCENARIO] theme json: ${JSON.stringify(themeJson, null, 2)}`);
  if (themeJson) {
    writeTextFile(
      path.join(webPreviewGeneratedDir, "thema-answer.json"),
      JSON.stringify(themeJson, null, 2)
    );
  }

  const writerPayload = buildWriterPayload(hrAdjustedInput, themeJson);
  const writerAnswer = await writerAgent.reply(JSON.stringify(writerPayload, null, 2));
  assert(writerAnswer.trim().length > 0, "Writer answer should not be empty");
  writeTextFile(path.join(outputsDir, "writer-answer.txt"), writerAnswer);
  // console.log(`[SCENARIO] writer answer: ${writerAnswer}`);
  const writerJson = parseJsonFromText(writerAnswer);
  if (writerJson) {
    writeTextFile(
      path.join(webPreviewGeneratedDir, "writer-answer.json"),
      JSON.stringify(writerJson, null, 2)
    );
  }

  console.log("[SCENARIO] success");
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[SCENARIO] failed: ${message}`);
  process.exit(1);
});
