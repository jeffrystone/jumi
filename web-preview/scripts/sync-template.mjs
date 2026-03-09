import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const sourcePath = path.resolve(
  projectRoot,
  "..",
  "core",
  "src",
  "knowledges",
  "templates",
  "template1.json"
);
const targetPath = path.resolve(projectRoot, "test.json");

const onceMode = process.argv.includes("--once");

function syncTemplate() {
  try {
    const raw = fs.readFileSync(sourcePath, "utf-8");
    const parsed = JSON.parse(raw);

    let atoms = [];
    if (Array.isArray(parsed?.atoms)) {
      atoms = parsed.atoms;
    } else if (parsed && typeof parsed === "object") {
      const firstSection = Object.values(parsed)[0];
      if (
        firstSection &&
        typeof firstSection === "object" &&
        Array.isArray(firstSection.atoms)
      ) {
        atoms = firstSection.atoms;
      }
    }

    const output = JSON.stringify({ atoms }, null, 2);
    fs.writeFileSync(targetPath, output, "utf-8");
    const stamp = new Date().toLocaleTimeString("ru-RU");
    console.log(`[${stamp}] atoms synced -> test.json`);
  } catch (error) {
    console.error("Failed to sync template:", error);
  }
}

syncTemplate();

if (onceMode) {
  process.exit(0);
}

console.log(`Watching: ${sourcePath}`);

let timer = null;
const debouncedSync = () => {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    syncTemplate();
    timer = null;
  }, 100);
};

fs.watch(sourcePath, (eventType) => {
  if (eventType === "change" || eventType === "rename") {
    debouncedSync();
  }
});
