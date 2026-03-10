import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ensureDir, findFirstExistingPath, readFirstExistingFile } from "./fs.js";

describe("fs utils", () => {
  it("ensureDir creates missing directory", () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), "jumi-core-fs-"));
    const target = path.join(base, "nested", "dir");

    ensureDir(target);

    expect(fs.existsSync(target)).toBe(true);
  });

  it("findFirstExistingPath returns first existing path", () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), "jumi-core-find-"));
    const existing = path.join(base, "exists.txt");
    fs.writeFileSync(existing, "ok");

    const found = findFirstExistingPath([
      path.join(base, "missing.txt"),
      existing,
      path.join(base, "also-missing.txt"),
    ]);

    expect(found).toBe(existing);
  });

  it("readFirstExistingFile reads from first existing candidate", () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), "jumi-core-read-"));
    const existing = path.join(base, "prompt.txt");
    fs.writeFileSync(existing, "hello");

    const content = readFirstExistingFile([
      path.join(base, "none.txt"),
      existing,
    ]);

    expect(content).toBe("hello");
  });
});
