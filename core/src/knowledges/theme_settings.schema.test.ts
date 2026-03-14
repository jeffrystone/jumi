import fs from "node:fs";
import path from "node:path";
import type { ErrorObject } from "ajv";
const Ajv = require("ajv");

describe("theme_settings knowledge base", () => {
  it("matches JSON schema", () => {
    const schemaPath = path.resolve(process.cwd(), "src", "knowledges", "theme_settings.schema.json");
    const dataPath = path.resolve(process.cwd(), "src", "knowledges", "theme_settings.json");

    const schemaRaw = fs.readFileSync(schemaPath, "utf-8");
    const dataRaw = fs.readFileSync(dataPath, "utf-8");
    const schema = JSON.parse(schemaRaw) as Record<string, unknown>;
    const data = JSON.parse(dataRaw) as Record<string, unknown>;

    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(schema);
    const isValid = validate(data);

    if (!isValid) {
      const details = (validate.errors ?? [])
        .map((error: ErrorObject) => `${error.instancePath || "/"} ${error.message ?? "validation error"}`)
        .join("; ");
      throw new Error(`theme_settings.json does not match schema: ${details}`);
    }

    expect(isValid).toBe(true);
  });
});
