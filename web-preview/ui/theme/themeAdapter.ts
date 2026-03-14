import { ensureThemaTheme, type Theme, type ThemeNode, type ThemePrimitive } from "./themeSchema";

interface FlatThemeEntry {
  path: string[];
  value: ThemePrimitive;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

function flattenTheme(
  node: ThemeNode,
  path: string[] = [],
  acc: FlatThemeEntry[] = []
): FlatThemeEntry[] {
  if (node !== null && typeof node === "object") {
    Object.entries(node).forEach(([key, value]) => {
      flattenTheme(value, [...path, key], acc);
    });
    return acc;
  }

  acc.push({ path, value: node });
  return acc;
}

function buildAliases(path: string[]): string[] {
  if (path.length === 2 && path[0] === "colorPalette") {
    const [, key] = path;
    if (key === "background") return ["background"];
    if (key === "primary") return ["primary"];
    if (key === "secondary") return ["secondary"];
  }

  if (path.length === 3 && path[0] === "colorPalette" && path[1] === "textColors") {
    const [, , key] = path;
    if (key === "base") return ["foreground"];
    if (key === "muted") return ["muted-foreground"];
    if (key === "faint") return ["faint-foreground"];
    if (key === "accent") return ["accent"];
  }

  if (path.length === 2 && path[0] === "spacing") {
    const [, key] = path;
    if (key === "sectionPadding") return ["section-padding"];
    if (key === "containerWidth") return ["container-width"];
    if (key === "borderRadius") return ["radius", "border-radius"];
    if (key === "gap") return ["gap"];
  }

  if (path.length === 2 && path[0] === "typography" && path[1] === "fontFamily") {
    return ["font-family"];
  }

  if (path.length === 4 && path[0] === "typography" && path[1] === "heading") {
    const [, , level, prop] = path;
    if (prop === "fontSize") return [`${level}-font-size`];
    if (prop === "fontWeight") return [`${level}-font-weight`];
  }

  if (path.length === 3 && path[0] === "typography") {
    const [, section, prop] = path;
    if (section === "body" && prop === "fontSize") return ["body-font-size"];
    if (section === "body" && prop === "fontWeight") return ["body-font-weight"];
    if (section === "button" && prop === "fontSize") return ["button-font-size"];
    if (section === "button" && prop === "fontWeight") return ["button-font-weight"];
  }

  if (path.length === 1 && path[0] === "imageStyle") {
    return ["image-style"];
  }

  return [];
}

export function buildThemeVarEntries(theme: Theme): Array<{ key: string; value: ThemePrimitive }> {
  const result: Array<{ key: string; value: ThemePrimitive }> = [];

  flattenTheme(theme).forEach(({ path, value }) => {
    const normalizedPath = path.map(toKebabCase);
    const key = normalizedPath.join("-");
    result.push({ key, value });

    buildAliases(path).forEach((aliasKey) => {
      result.push({ key: toKebabCase(aliasKey), value });
    });
  });

  return result;
}

export function adaptThemaTheme(rawTheme: unknown): Theme {
  if (isRecord(rawTheme) && !("colorPalette" in rawTheme) && isRecord(rawTheme.colors)) {
    const legacyColors = rawTheme.colors;
    const normalized = {
      ...rawTheme,
      colorPalette: {
        background: String(legacyColors.background ?? ""),
        textColors: {
          base: String(legacyColors.foreground ?? ""),
          muted: String(legacyColors["secondary-foreground"] ?? legacyColors.foreground ?? ""),
          faint: String(legacyColors.muted ?? legacyColors.secondary ?? ""),
          accent: String(legacyColors.accent ?? legacyColors.primary ?? ""),
        },
        primary: String(legacyColors.primary ?? ""),
        secondary: String(legacyColors.secondary ?? ""),
      },
    };
    return ensureThemaTheme(normalized) as unknown as Theme;
  }

  return ensureThemaTheme(rawTheme) as unknown as Theme;
}

export interface ThemeParseResult {
  theme: Theme | null;
  error: string | null;
}

export function safeAdaptThemaTheme(rawTheme: unknown): ThemeParseResult {
  try {
    return { theme: adaptThemaTheme(rawTheme), error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { theme: null, error: message };
  }
}
