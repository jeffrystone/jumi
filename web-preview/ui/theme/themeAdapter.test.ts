import { describe, expect, it } from "vitest";
import { buildThemeVarEntries, safeAdaptThemaTheme } from "./themeAdapter";
import { defaultThemaTheme } from "./defaultThemaTheme";
import type { Theme } from "./themeSchema";

function toMap(entries: Array<{ key: string; value: string | number }>): Map<string, string> {
  return new Map(entries.map(({ key, value }) => [key, String(value)]));
}

describe("themeAdapter", () => {
  it("buildThemeVarEntries creates flattened vars and aliases", () => {
    const vars = toMap(buildThemeVarEntries(defaultThemaTheme as unknown as Theme));

    expect(vars.get("color-palette-primary")).toBe(defaultThemaTheme.colorPalette.primary);
    expect(vars.get("primary")).toBe(defaultThemaTheme.colorPalette.primary);

    expect(vars.get("spacing-section-padding")).toBe(defaultThemaTheme.spacing.sectionPadding);
    expect(vars.get("section-padding")).toBe(defaultThemaTheme.spacing.sectionPadding);

    expect(vars.get("spacing-border-radius")).toBe(defaultThemaTheme.spacing.borderRadius);
    expect(vars.get("radius")).toBe(defaultThemaTheme.spacing.borderRadius);
    expect(vars.get("border-radius")).toBe(defaultThemaTheme.spacing.borderRadius);

    expect(vars.get("typography-heading-h1-font-size")).toBe(
      defaultThemaTheme.typography.heading.h1.fontSize
    );
    expect(vars.get("h1-font-size")).toBe(defaultThemaTheme.typography.heading.h1.fontSize);
    expect(vars.get("foreground")).toBe(defaultThemaTheme.colorPalette.textColors.base);
    expect(vars.get("muted-foreground")).toBe(defaultThemaTheme.colorPalette.textColors.muted);
    expect(vars.get("faint-foreground")).toBe(defaultThemaTheme.colorPalette.textColors.faint);
    expect(vars.get("accent")).toBe(defaultThemaTheme.colorPalette.textColors.accent);

    expect(vars.get("image-style")).toBe(defaultThemaTheme.imageStyle);
  });

  it("safeAdaptThemaTheme returns parse error for invalid input", () => {
    const invalidTheme = {
      ...defaultThemaTheme,
      colorPalette: {
        ...defaultThemaTheme.colorPalette,
        primary: "",
      },
    };

    const result = safeAdaptThemaTheme(invalidTheme);
    expect(result.theme).toBeNull();
    expect(result.error).toContain("Invalid Thema theme");
    expect(result.error).toContain("colorPalette.primary must be a non-empty string");
  });
});
