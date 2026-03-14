import fs from "node:fs";
import path from "node:path";

interface ThemeTextColors {
  base: string;
  muted: string;
  faint: string;
  accent: string;
}

interface ThemeColorPalette {
  background: string;
  textColors: ThemeTextColors;
  primary: string;
  primaryHover: string;
  primaryDisabled: string;
  secondary: string;
  secondaryHover: string;
  secondaryDisabled: string;
}

interface ThemeGradients {
  background: string;
  primary: string;
  secondary: string;
  text: string;
}

interface ThemeLinks {
  color: string;
  hover: string;
  visited: string;
}

export interface ThemeSettingsItem {
  pairType: string;
  fontHeading: string;
  fontBody: string;
  accentWeight: string;
  colorPalette: ThemeColorPalette;
  gradients: ThemeGradients;
  link: ThemeLinks;
}

interface ThemeSettingsPayload {
  data: ThemeSettingsItem[];
}

function themeSettingsPath(): string {
  return path.resolve(process.cwd(), "..", "core", "src", "knowledges", "theme_settings.json");
}

export function readThemeSettings(): ThemeSettingsItem[] {
  const filePath = themeSettingsPath();
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as ThemeSettingsPayload;
    return Array.isArray(parsed.data) ? parsed.data : [];
  } catch {
    return [];
  }
}
