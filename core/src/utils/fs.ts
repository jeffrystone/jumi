import fs from "node:fs";
import path from "node:path";

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function findFirstExistingPath(paths: string[]): string | null {
  for (const candidate of paths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

export function readFirstExistingFile(paths: string[]): string {
  const filePath = findFirstExistingPath(paths);
  if (!filePath) {
    throw new Error(`File not found. Checked paths: ${paths.join(", ")}`);
  }
  return fs.readFileSync(filePath, "utf-8");
}

export function writeTextFile(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}
