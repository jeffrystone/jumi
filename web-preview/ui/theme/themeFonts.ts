import { ensureThemaTheme } from "./themeSchema";

const FONT_ALIASES = new Map<string, string>([
  ["inter", "Inter"],
  ["roboto", "Roboto"],
  ["open sans", "Open Sans"],
  ["montserrat", "Montserrat"],
  ["lato", "Lato"],
  ["poppins", "Poppins"],
  ["merriweather", "Merriweather"],
  ["raleway", "Raleway"],
  ["dm serif display", "DM Serif Display"],
  ["playfair display", "Playfair Display"],
  ["ibm plex mono", "IBM Plex Mono"],
  ["instrument serif", "Cormorant Garamond"],
  ["instrument sans", "Noto Sans"],
  ["grand sans", "Space Grotesk"],
  ["grand serif", "Cormorant Garamond"],
  ["neo calligraphy", "Great Vibes"],
  ["modern serif revival", "Cormorant Garamond"],
  ["futuristic geometric", "Space Grotesk"],
  ["warm script", "Great Vibes"],
  ["helvetica now", "Inter"],
  ["ff meta", "Source Sans 3"],
  ["condensed sans", "Barlow Condensed"],
  ["bold display", "Anton"],
  ["clean sans", "Noto Sans"],
  ["experimental / distorted", "Bebas Neue"],
  ["neutral sans", "Noto Sans"],
]);

function normalizeFamilyName(value: string): string {
  return value.trim().replace(/^['"]|['"]$/g, "").toLowerCase();
}

function readPrimaryFamily(fontFamily: string): string | null {
  const [first] = fontFamily.split(",");
  if (!first) {
    return null;
  }
  const normalized = normalizeFamilyName(first);
  return normalized.length > 0 ? normalized : null;
}

export function resolveThemeFontFamily(rawTheme: unknown): string | null {
  try {
    const theme = ensureThemaTheme(rawTheme);
    const primaryFamily = readPrimaryFamily(theme.typography.fontFamily);
    if (!primaryFamily) {
      return null;
    }

    const mappedFamily = FONT_ALIASES.get(primaryFamily) ?? "Inter";
    return `${mappedFamily}, system-ui, sans-serif`;
  } catch {
    return null;
  }
}
