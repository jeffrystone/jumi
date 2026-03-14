import { describe, expect, it } from "vitest";
import { resolveThemeFontFamily } from "./themeFonts";
import { defaultThemaTheme } from "./defaultThemaTheme";

describe("themeFonts", () => {
  it("resolves supported family as-is", () => {
    const theme = {
      ...defaultThemaTheme,
      typography: {
        ...defaultThemaTheme.typography,
        fontFamily: "Inter, system-ui, sans-serif",
      },
    };

    expect(resolveThemeFontFamily(theme)).toBe("Inter, system-ui, sans-serif");
  });

  it("maps non-open family to closest open alternative", () => {
    const theme = {
      ...defaultThemaTheme,
      typography: {
        ...defaultThemaTheme.typography,
        fontFamily: "Helvetica Now, sans-serif",
      },
    };

    expect(resolveThemeFontFamily(theme)).toBe("Inter, system-ui, sans-serif");
  });
});
