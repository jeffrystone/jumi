import { YandexProvider } from "./YandexProvider.js";

describe("YandexProvider", () => {
  it("builds provider from env", () => {
    const provider = YandexProvider.fromEnv({
      YANDEX_API_KEY: "key",
    });

    expect(provider).toBeInstanceOf(YandexProvider);
    console.log(`[TEST] ${expect.getState().currentTestName} -> OK`);
  });

  it("throws when YANDEX_API_KEY is missing", () => {
    expect(() => YandexProvider.fromEnv({})).toThrow(
      "Environment variable YANDEX_API_KEY is required"
    );
    console.log(`[TEST] ${expect.getState().currentTestName} -> OK`);
  });
});
