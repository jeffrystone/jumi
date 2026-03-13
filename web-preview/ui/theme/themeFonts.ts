import { ensureThemaTheme } from "./themeSchema";

const GOOGLE_FONT_FAMILIES = new Map<string, string>([
  ["inter", "Inter"],
  ["roboto", "Roboto"],
  ["open sans", "Open Sans"],
  ["montserrat", "Montserrat"],
  ["lato", "Lato"],
  ["poppins", "Poppins"],
  ["manrope", "Manrope"],
  ["nunito", "Nunito"],
  ["pt sans", "PT Sans"],
  ["source sans 3", "Source Sans 3"],
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

export function getGoogleFontHref(rawTheme: unknown): string | null {
  try {
    const theme = ensureThemaTheme(rawTheme);
    const primaryFamily = readPrimaryFamily(theme.typography.fontFamily);
    if (!primaryFamily) {
      return null;
    }

    const googleFamily = GOOGLE_FONT_FAMILIES.get(primaryFamily);
    if (!googleFamily) {
      return null;
    }

    const familyParam = encodeURIComponent(`${googleFamily}:wght@400;500;600;700`);
    return `https://fonts.googleapis.com/css2?family=${familyParam}&display=swap&subset=latin,cyrillic`;
  } catch {
    return null;
  }
}
