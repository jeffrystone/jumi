export type ThemePrimitive = string | number;
export type ThemeNode = ThemePrimitive | ThemeObject;

export interface ThemeObject {
  [key: string]: ThemeNode;
}

export type Theme = ThemeObject;

export interface ThemaTheme {
  colorPalette: {
    background: string;
    textColors: {
      base: string;
      muted: string;
      faint: string;
      accent: string;
    };
    primary: string;
    secondary: string;
  };
  typography: {
    fontFamily: string;
    heading: {
      h1: { fontSize: string; fontWeight: string };
      h2: { fontSize: string; fontWeight: string };
      h3: { fontSize: string; fontWeight: string };
    };
    body: { fontSize: string; fontWeight: string };
    button: { fontSize: string; fontWeight: string };
  };
  spacing: {
    gap: string;
    sectionPadding: string;
    containerWidth: string;
    borderRadius: string;
  };
  imageStyle: string;
}

const REQUIRED_STRING_PATHS = [
  "colorPalette.background",
  "colorPalette.textColors.base",
  "colorPalette.textColors.muted",
  "colorPalette.textColors.faint",
  "colorPalette.textColors.accent",
  "colorPalette.primary",
  "colorPalette.secondary",
  "typography.fontFamily",
  "typography.heading.h1.fontSize",
  "typography.heading.h1.fontWeight",
  "typography.heading.h2.fontSize",
  "typography.heading.h2.fontWeight",
  "typography.heading.h3.fontSize",
  "typography.heading.h3.fontWeight",
  "typography.body.fontSize",
  "typography.body.fontWeight",
  "typography.button.fontSize",
  "typography.button.fontWeight",
  "spacing.gap",
  "spacing.sectionPadding",
  "spacing.containerWidth",
  "spacing.borderRadius",
  "imageStyle",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getByPath(input: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!isRecord(current)) {
      return undefined;
    }
    return current[key];
  }, input);
}

export function validateThemaTheme(rawTheme: unknown): string[] {
  if (!isRecord(rawTheme)) {
    return ["theme must be an object"];
  }

  const errors: string[] = [];
  REQUIRED_STRING_PATHS.forEach((path) => {
    const value = getByPath(rawTheme, path);
    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(`${path} must be a non-empty string`);
    }
  });

  return errors;
}

export function ensureThemaTheme(rawTheme: unknown): ThemaTheme {
  const errors = validateThemaTheme(rawTheme);
  if (errors.length > 0) {
    throw new Error(`Invalid Thema theme: ${errors.join("; ")}`);
  }
  return rawTheme as ThemaTheme;
}
