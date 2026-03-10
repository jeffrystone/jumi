import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import {
  assert,
  buildThemaPayload,
  buildWriterPayload,
  findFirstExistingPath,
  parseJsonFromText,
  type LandingInputData,
} from "@jumi/core";
import {
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
  const inputRaw = fs.readFileSync(inputPath, "utf-8");
  const input = JSON.parse(inputRaw) as LandingInputData;

  const provider = YandexProvider.fromEnv();
  const themaAgent = createThemaAssistant(provider);
  const writerAgent = createWriterAssistant(provider);

  const themaPayload = buildThemaPayload(input);
  const themaAnswer = await themaAgent.reply(JSON.stringify(themaPayload, null, 2));
  assert(themaAnswer.trim().length > 0, "Thema answer should not be empty");
  console.log(`[SCENARIO] thema answer: ${themaAnswer}`);

  const themeJson = parseJsonFromText(themaAnswer);
  const writerPayload = buildWriterPayload(input, themeJson);
  const writerAnswer = await writerAgent.reply(JSON.stringify(writerPayload, null, 2));
  assert(writerAnswer.trim().length > 0, "Writer answer should not be empty");
  console.log(`[SCENARIO] writer answer: ${writerAnswer}`);

  console.log("[SCENARIO] success");
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[SCENARIO] failed: ${message}`);
  process.exit(1);
});
