import { describe, expect, it } from "vitest";
import { adaptThemaTheme, buildThemeVarEntries, safeAdaptThemaTheme } from "./themeAdapter";
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
    expect(vars.get("primary-hover")).toBe(defaultThemaTheme.colorPalette.primaryHover);
    expect(vars.get("primary-disabled")).toBe(defaultThemaTheme.colorPalette.primaryDisabled);
    expect(vars.get("secondary-hover")).toBe(defaultThemaTheme.colorPalette.secondaryHover);
    expect(vars.get("secondary-disabled")).toBe(defaultThemaTheme.colorPalette.secondaryDisabled);
    expect(vars.get("gradient-primary")).toBe(defaultThemaTheme.gradients.primary);
    expect(vars.get("gradient-secondary")).toBe(defaultThemaTheme.gradients.secondary);
    expect(vars.get("link-color")).toBe(defaultThemaTheme.link.color);
    expect(vars.get("link-hover")).toBe(defaultThemaTheme.link.hover);
    expect(vars.get("link-visited")).toBe(defaultThemaTheme.link.visited);

    expect(vars.get("spacing-section-padding")).toBe(defaultThemaTheme.spacing.sectionPadding);
    expect(vars.get("section-padding")).toBe(defaultThemaTheme.spacing.sectionPadding);

    expect(vars.get("spacing-border-radius")).toBe(defaultThemaTheme.spacing.borderRadius);
    expect(vars.get("radius")).toBe(defaultThemaTheme.spacing.borderRadius);
    expect(vars.get("border-radius")).toBe(defaultThemaTheme.spacing.borderRadius);

    expect(vars.get("typography-heading-h1-font-size")).toBe(
      defaultThemaTheme.typography.heading.h1.fontSize
    );
    expect(vars.get("h1-font-size")).toBe(defaultThemaTheme.typography.heading.h1.fontSize);
    expect(vars.get("accent-text-font-weight")).toBe(defaultThemaTheme.typography.body.accentWeight);
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

  it("adapts legacy colors payload to new colorPalette", () => {
    const legacyTheme = {
      colors: {
        background: "0 0% 100%",
        foreground: "222.2 84% 4.9%",
        primary: "221.2 83.2% 53.3%",
        secondary: "210 40% 96.1%",
        "secondary-foreground": "222.2 47.4% 11.2%",
        accent: "210 40% 90%",
        muted: "210 40% 96.1%",
      },
      typography: defaultThemaTheme.typography,
      spacing: defaultThemaTheme.spacing,
      imageStyle: defaultThemaTheme.imageStyle,
    };

    const normalized = adaptThemaTheme(legacyTheme) as unknown as {
      colorPalette: { textColors: { base: string; accent: string } };
    };
    expect(normalized.colorPalette.textColors.base).toBe("222.2 84% 4.9%");
    expect(normalized.colorPalette.textColors.accent).toBe("210 40% 90%");
  });

  it("fills new fields when old colorPalette shape is passed", () => {
    const oldShapeTheme = {
      colorPalette: {
        background: "0 0% 100%",
        textColors: {
          base: "222.2 84% 4.9%",
          muted: "215.4 16.3% 46.9%",
          faint: "215 20.2% 65.1%",
          accent: "221.2 83.2% 53.3%",
        },
        primary: "221.2 83.2% 53.3%",
        secondary: "210 40% 96.1%",
      },
      typography: defaultThemaTheme.typography,
      spacing: defaultThemaTheme.spacing,
      imageStyle: defaultThemaTheme.imageStyle,
    };

    const result = adaptThemaTheme(oldShapeTheme) as unknown as {
      colorPalette: { primaryHover: string; secondaryDisabled: string };
      gradients: { primary: string };
      link: { color: string };
      typography: { body: { accentWeight: string } };
    };

    expect(result.colorPalette.primaryHover).toBe("221.2 83.2% 53.3%");
    expect(result.colorPalette.secondaryDisabled).toBe("210 40% 96.1%");
    expect(result.gradients.primary).toContain("linear-gradient");
    expect(result.link.color).toBe("221.2 83.2% 53.3%");
    expect(result.typography.body.accentWeight).toBe("600");
  });
});
