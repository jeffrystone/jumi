import type { ThemeSettingsItem } from "@/utils/themeSettings";
import type { CSSProperties } from "react";

export interface ThemePreviewModel {
  pairType: string;
  headingFamily: string;
  bodyFamily: string;
  accentWeight: string;
  palette: ThemeSettingsItem["colorPalette"];
  gradients: ThemeSettingsItem["gradients"];
  link: ThemeSettingsItem["link"];
}

export function hslColor(value: string): string {
  return `hsl(${value})`;
}

export function buildScopedThemeVars(model: ThemePreviewModel): CSSProperties {
  return {
    "--background": model.palette.background,
    "--foreground": model.palette.textColors.base,
    "--muted-foreground": model.palette.textColors.muted,
    "--faint-foreground": model.palette.textColors.faint,
    "--accent": model.palette.textColors.accent,
    "--primary": model.palette.primary,
    "--primary-hover": model.palette.primaryHover,
    "--primary-disabled": model.palette.primaryDisabled,
    "--secondary": model.palette.secondary,
    "--secondary-hover": model.palette.secondaryHover,
    "--secondary-disabled": model.palette.secondaryDisabled,
    "--gradient-primary": model.gradients.primary,
    "--gradient-secondary": model.gradients.secondary,
    "--gradient-text": model.gradients.text,
    "--link-color": model.link.color,
    "--link-hover": model.link.hover,
    "--link-visited": model.link.visited,
    "--body-font-size": "1rem",
    "--body-font-weight": "400",
    "--accent-text-font-weight": model.accentWeight,
    "--button-font-size": "0.95rem",
    "--button-font-weight": "600",
    "--h1-font-size": "2rem",
    "--h1-font-weight": "700",
    "--h2-font-size": "1.5rem",
    "--h2-font-weight": "600",
    "--h3-font-size": "1.25rem",
    "--h3-font-weight": "600",
  } as CSSProperties;
}
