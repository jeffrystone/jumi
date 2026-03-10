import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import {
  assert,
  buildHeroPromptPayload,
  buildHrPayload,
  buildThemaPayload,
  buildWriterPayload,
  findFirstExistingPath,
  parseJsonFromText,
  type LandingInputData,
  writeTextFile,
} from "@jumi/core";
import {
  createHeroPromptAssistant,
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
  const value = (process.env.IS_REAL_CONNECTION ?? "").trim().toLowerCase();
  return value === "true" || value === "1" || value === "yes";
}

async function run(): Promise<void> {
  console.log("[SCENARIO] start");

  if (!isRealConnectionEnabled()) {
    console.log("[SCENARIO] skipped: set IS_REAL_CONNECTION=true to run real agent calls");
    return;
  }

  const inputPath = path.resolve(process.cwd(), "input.json");
  const outputsDir = path.resolve(process.cwd(), "outputs");
  const inputRaw = fs.readFileSync(inputPath, "utf-8");
  const input = JSON.parse(inputRaw) as LandingInputData;

  const provider = YandexProvider.fromEnv();
  const hrAgent = createHrAssistant(provider);
  const themaAgent = createThemaAssistant(provider);
  const heroPromptAgent = createHeroPromptAssistant(provider);
  const writerAgent = createWriterAssistant(provider);

  const hrPayload = buildHrPayload(input);
  const hrAnswer = await hrAgent.reply(JSON.stringify(hrPayload, null, 2));
  assert(hrAnswer.trim().length > 0, "HR answer should not be empty");
  writeTextFile(path.join(outputsDir, "hr-answer.txt"), hrAnswer);
  console.log(`[SCENARIO] hr answer: ${hrAnswer}`);

  const themaPayload = buildThemaPayload(input);
  const themaAnswer = await themaAgent.reply(JSON.stringify(themaPayload, null, 2));
  assert(themaAnswer.trim().length > 0, "Thema answer should not be empty");
  writeTextFile(path.join(outputsDir, "thema-answer.txt"), themaAnswer);
  console.log(`[SCENARIO] thema answer: ${themaAnswer}`);

  const hrJson = parseJsonFromText(hrAnswer);
  const themeJson = parseJsonFromText(themaAnswer);

  const heroPayload = buildHeroPromptPayload(input, hrJson, themeJson);
  const heroAnswer = await heroPromptAgent.reply(JSON.stringify(heroPayload, null, 2));
  assert(heroAnswer.trim().length > 0, "Hero_Prompt answer should not be empty");
  writeTextFile(path.join(outputsDir, "hero-prompt-answer.txt"), heroAnswer);
  console.log(`[SCENARIO] hero_prompt answer: ${heroAnswer}`);

  const writerPayload = buildWriterPayload(input, themeJson);
  const writerAnswer = await writerAgent.reply(JSON.stringify(writerPayload, null, 2));
  assert(writerAnswer.trim().length > 0, "Writer answer should not be empty");
  writeTextFile(path.join(outputsDir, "writer-answer.txt"), writerAnswer);
  console.log(`[SCENARIO] writer answer: ${writerAnswer}`);

  console.log("[SCENARIO] success");
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[SCENARIO] failed: ${message}`);
  process.exit(1);
});
