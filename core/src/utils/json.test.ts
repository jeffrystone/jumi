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

  it("parses fenced block with non-standard language tag", () => {
    const input = [
      "Спасибо! Вот данные:",
      "```jso",
      '{ "ok": true, "value": 42 }',
      "```",
    ].join("\n");
    const parsed = parseJsonFromText(input);
    expect(parsed).toEqual({ ok: true, value: 42 });
  });

  it("parses JSON object embedded in prose without fences", () => {
    const input =
      'Спасибо за ответы! Вот итог: {"business":{"product_name":"Jumi"},"marketing":{"main_goal":"лиды"}}';
    const parsed = parseJsonFromText(input);
    expect(parsed).toEqual({
      business: { product_name: "Jumi" },
      marketing: { main_goal: "лиды" },
    });
  });

  it("returns null on invalid JSON", () => {
    const input = "not a json";
    const parsed = parseJsonFromText(input);
    expect(parsed).toBeNull();
  });
});
