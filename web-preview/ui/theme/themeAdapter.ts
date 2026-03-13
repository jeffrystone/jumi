import { ensureThemaTheme, type Theme, type ThemeNode, type ThemePrimitive } from "./themeSchema";

interface FlatThemeEntry {
  path: string[];
  value: ThemePrimitive;
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
  if (path.length === 2 && path[0] === "colors") {
    return [path[1]];
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
