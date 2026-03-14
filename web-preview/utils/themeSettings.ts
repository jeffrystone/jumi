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
  secondary: string;
}

export interface ThemeSettingsItem {
  pairType: string;
  fontHeading: string;
  fontBody: string;
  colorPalette: ThemeColorPalette;
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
