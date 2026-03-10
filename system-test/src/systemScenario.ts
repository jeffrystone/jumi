import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import {
  AsciiGraphView,
  Graph,
  Vertex,
  parseTemplateToGraph,
} from "@jumi/core";
import { YandexProvider, createPrManagerAssistant } from "@jumi/agents";

const localEnvPath = path.resolve(process.cwd(), ".env");
const agentsEnvPath = path.resolve(process.cwd(), "..", "agents", ".env");
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
} else if (fs.existsSync(agentsEnvPath)) {
  dotenv.config({ path: agentsEnvPath });
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function run(): Promise<void> {
  console.log("[SCENARIO] start");

  const graph = new Graph(
    new Vertex("root", [new Vertex("child-1"), new Vertex("child-2")])
  );
  const graphView = new AsciiGraphView(graph);
  const graphAscii = graphView.render();
  assert(graphAscii.includes("root"), "Graph should contain root node");
  console.log("[SCENARIO] graph built:\n" + graphAscii);

  const templatePath = path.resolve(
    process.cwd(),
    "..",
    "core",
    "src",
    "knowledges",
    "templates",
    "template1.json"
  );
  const templateRaw = fs.readFileSync(templatePath, "utf-8");
  const templateJson = JSON.parse(templateRaw) as unknown;
  const templateGraph = parseTemplateToGraph(templateJson);
  assert(
    templateGraph.root.children.length > 0,
    "Template graph should contain atoms"
  );
  console.log(
    `[SCENARIO] template graph parsed: ${templateGraph.root.children.length} atoms`
  );

  const provider = YandexProvider.fromEnv();
  const agent = createPrManagerAssistant(provider);
  const answer = await agent.reply("Привет, это системный тест. Кто ты?");
  assert(answer.trim().length > 0, "Agent answer should not be empty");
  console.log(`[SCENARIO] agent answer: ${answer}`);

  console.log("[SCENARIO] success");
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[SCENARIO] failed: ${message}`);
  process.exit(1);
});
