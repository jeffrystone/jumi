import { parseJsonFromText } from "./json.js";

describe("parseJsonFromText", () => {
  it("parses plain JSON text", () => {
    const input = '{"a":1,"b":"x"}';
    const parsed = parseJsonFromText(input);
    expect(parsed).toEqual({ a: 1, b: "x" });
  });

  it("parses fenced json block", () => {
    const input = [
      "some intro",
      "```json",
      '{ "title": "hello", "count": 2 }',
      "```",
    ].join("\n");
    const parsed = parseJsonFromText(input);
    expect(parsed).toEqual({ title: "hello", count: 2 });
  });

  it("returns null on invalid JSON", () => {
    const input = "not a json";
    const parsed = parseJsonFromText(input);
    expect(parsed).toBeNull();
  });
});
