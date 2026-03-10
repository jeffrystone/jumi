import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const syncTargets = [
  {
    sourcePath: path.resolve(
      projectRoot,
      "..",
      "core",
      "src",
      "knowledges",
      "templates",
      "template1.json"
    ),
    targetPath: path.resolve(projectRoot, "test.json"),
    name: "hero",
  },
  {
    sourcePath: path.resolve(
      projectRoot,
      "..",
      "core",
      "src",
      "knowledges",
      "templates",
      "template2.json"
    ),
    targetPath: path.resolve(projectRoot, "test-navbar.json"),
    name: "navbar",
  },
  {
    sourcePath: path.resolve(
      projectRoot,
      "..",
      "core",
      "src",
      "knowledges",
      "templates",
      "template3.json"
    ),
    targetPath: path.resolve(projectRoot, "test-features.json"),
    name: "features",
  },
];

const onceMode = process.argv.includes("--once");

function extractTemplateData(parsed) {
  let atoms = [];
  let layout = "grid-6x6";

  if (Array.isArray(parsed?.atoms)) {
    atoms = parsed.atoms;
    if (typeof parsed.layout === "string") {
      layout = parsed.layout;
    }
    return { layout, atoms };
  }

  if (parsed && typeof parsed === "object") {
    const firstSection = Object.values(parsed)[0];
    if (
      firstSection &&
      typeof firstSection === "object" &&
      Array.isArray(firstSection.atoms)
    ) {
      atoms = firstSection.atoms;
      if (typeof firstSection.layout === "string") {
        layout = firstSection.layout;
      }
    }
  }

  return { layout, atoms };
}

function syncTemplate(sourcePath, targetPath, name) {
  try {
    const raw = fs.readFileSync(sourcePath, "utf-8");
    const parsed = JSON.parse(raw);
    const { layout, atoms } = extractTemplateData(parsed);
    const output = JSON.stringify({ layout, atoms }, null, 2);
    fs.writeFileSync(targetPath, output, "utf-8");
    const stamp = new Date().toLocaleTimeString("ru-RU");
    console.log(`[${stamp}] ${name} template synced -> ${path.basename(targetPath)}`);
  } catch (error) {
    console.error(`Failed to sync ${name} template:`, error);
  }
}

for (const target of syncTargets) {
  syncTemplate(target.sourcePath, target.targetPath, target.name);
}

if (onceMode) {
  process.exit(0);
}

for (const target of syncTargets) {
  console.log(`Watching ${target.name}: ${target.sourcePath}`);

  let timer = null;
  const debouncedSync = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      syncTemplate(target.sourcePath, target.targetPath, target.name);
      timer = null;
    }, 100);
  };

  fs.watch(target.sourcePath, (eventType) => {
    if (eventType === "change" || eventType === "rename") {
      debouncedSync();
    }
  });
}
