import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const j = JSON.parse(fs.readFileSync(path.join(root, "core/src/knowledges/theme_settings.json"), "utf8"));
const all = new Set();
for (const r of j.data) {
  all.add(r.fontHeading.trim().toLowerCase());
  all.add(r.fontBody.trim().toLowerCase());
}
const ts = fs.readFileSync(path.join(root, "web-preview/ui/theme/themeFonts.ts"), "utf8");
const map = new Map();
for (const m of ts.matchAll(/\["([^"]+)",\s*"([^"]+)"\]/g)) {
  map.set(m[1], m[2]);
}
const missing = [...all].filter((f) => !map.has(f)).sort();
console.log(missing.length ? "MISSING:\n" + missing.join("\n") : "OK all " + all.size + " keys");
