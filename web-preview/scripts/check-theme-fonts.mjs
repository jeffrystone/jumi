import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const themeFontsPath = path.join(root, "web-preview/ui/theme/themeFonts.ts");
const themeSettingsPath = path.join(root, "core/src/knowledges/theme_settings.json");

const themeFontsTs = fs.readFileSync(themeFontsPath, "utf8");
const map = new Map();
for (const m of themeFontsTs.matchAll(/\["([^"]+)",\s*"([^"]+)"\]/g)) {
  map.set(m[1].trim().toLowerCase(), m[2]);
}

const j = JSON.parse(fs.readFileSync(themeSettingsPath, "utf8"));
const all = new Set();
for (const row of j.data || []) {
  all.add(row.fontHeading.trim());
  all.add(row.fontBody.trim());
}

function resolve(f) {
  const n = f.trim().replace(/^['"]|['"]$/g, "").toLowerCase();
  return map.get(n) ?? null;
}

const fallback = [];
const ok = [];
for (const f of [...all].sort()) {
  (resolve(f) ? ok : fallback).push(f);
}

console.log("В theme_settings уникальных имён шрифтов:", all.size);
console.log("С алиасом в themeFonts.ts (подключаются через @fontsource):", ok.length);
console.log("Без алиаса → в UI уйдёт Inter:", fallback.length);
if (fallback.length) {
  console.log("\nБез подключения (fallback Inter):\n", fallback.join(", "));
}
