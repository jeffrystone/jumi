import fs from "node:fs";
import path from "node:path";

function generatedPath(fileName: string): string {
  return path.resolve(process.cwd(), "generated", fileName);
}

export function readGeneratedJson<T>(fileName: string): T | null {
  const filePath = generatedPath(fileName);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    console.log(`[READ GENERATED JSON] ${fileName}: ${raw}`);
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
