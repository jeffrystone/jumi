import { ensureThemaTheme } from "./themeSchema";

/**
 * Каждое имя из theme_settings (нижний регистр) → семейство Google Fonts.
 * Несуществующие на GF имена (брендовые) замаплены на ближайший аналог.
 */
const FONT_ALIASES = new Map<string, string>([
  ["abril fatface", "Abril Fatface"],
  ["alfa slab", "Alfa Slab One"],
  ["ankish", "Noto Sans"],
  ["arvo", "Arvo"],
  ["bebas neue", "Bebas Neue"],
  ["big shoulders display", "Big Shoulders Display"],
  ["bodoni moda", "Bodoni Moda"],
  ["bold display", "Anton"],
  ["brettaline", "DM Sans"],
  ["calive pixel", "Pixelify Sans"],
  ["canicule display", "Syne"],
  ["cs brooklyn", "Oswald"],
  ["bricolage grotesque", "Bricolage Grotesque"],
  ["clean sans", "Noto Sans"],
  ["condensed sans", "Barlow Condensed"],
  ["corben", "Corben"],
  ["cormorant garamond", "Cormorant Garamond"],
  ["crimson pro", "Crimson Pro"],
  ["crimson text", "Crimson Text"],
  ["dm sans", "DM Sans"],
  ["dm serif display", "DM Serif Display"],
  ["dancing script", "Dancing Script"],
  ["domine", "Domine"],
  ["eb garamond", "EB Garamond"],
  ["elsie", "Elsie"],
  ["experimental / distorted", "Bebas Neue"],
  ["ff meta", "Source Sans 3"],
  ["figtree", "Figtree"],
  ["fraunces", "Fraunces"],
  ["futuristic geometric", "Space Grotesk"],
  ["geist", "Inter"],
  ["geist mono", "Roboto Mono"],
  ["golos text", "Golos Text"],
  ["golos ui", "Golos Text"],
  ["grand sans", "Space Grotesk"],
  ["grand serif", "Cormorant Garamond"],
  ["helvetica now", "Inter"],
  ["ibm plex mono", "IBM Plex Mono"],
  ["ibm plex sans bold", "IBM Plex Sans"],
  ["ibm plex sans condensed", "IBM Plex Sans Condensed"],
  ["instrument sans", "Instrument Sans"],
  ["instrument serif", "Instrument Serif"],
  ["inter", "Inter"],
  ["inter bold", "Inter"],
  ["inter light", "Inter"],
  ["josefin sans", "Josefin Sans"],
  ["lato", "Lato"],
  ["ledger", "Ledger"],
  ["libre baskerville", "Libre Baskerville"],
  ["literata", "Literata"],
  ["lobster", "Lobster"],
  ["lora", "Lora"],
  ["manrope", "Manrope"],
  ["merriweather", "Merriweather"],
  ["merriweather black", "Merriweather"],
  ["merriweather light", "Merriweather"],
  ["modern serif revival", "Cormorant Garamond"],
  ["monoton", "Monoton"],
  ["montserrat", "Montserrat"],
  ["mulish", "Mulish"],
  ["museomoderno", "MuseoModerno"],
  ["neo calligraphy", "Great Vibes"],
  ["nevanta", "Outfit"],
  ["neutral sans", "Noto Sans"],
  ["nobile", "Nobile"],
  ["norelli", "Playfair Display"],
  ["nunito", "Nunito"],
  ["nunito sans", "Nunito Sans"],
  ["onest", "Onest"],
  ["open sans", "Open Sans"],
  ["oswald", "Oswald"],
  ["outfit", "Outfit"],
  ["playfair display", "Playfair Display"],
  ["poppins", "Poppins"],
  ["poiret one", "Poiret One"],
  ["proza libre", "Proza Libre"],
  ["quicksand", "Quicksand"],
  ["raleway", "Raleway"],
  ["rebak", "DM Sans"],
  ["rantaro grotesk", "Space Grotesk"],
  ["roboto", "Roboto"],
  ["roboto black", "Roboto"],
  ["roboto mono light", "Roboto Mono"],
  ["roboto slab", "Roboto Slab"],
  ["roena", "Lora"],
  ["rubik", "Rubik"],
  ["sansita", "Sansita"],
  ["sense font", "Noto Sans"],
  ["sora", "Sora"],
  ["source sans pro", "Source Sans 3"],
  ["source code pro", "Source Code Pro"],
  ["source serif pro", "Source Serif 4"],
  ["space grotesk", "Space Grotesk"],
  ["spectral", "Spectral"],
  ["unbounded", "Unbounded"],
  ["urbanist", "Urbanist"],
  ["warm script", "Great Vibes"],
  ["work sans", "Work Sans"],
]);

/** Уникальные семейства для Google Fonts API */
export const GOOGLE_FONT_FAMILIES = Array.from(new Set(FONT_ALIASES.values())).sort((a, b) =>
  a.localeCompare(b)
);

export const AVAILABLE_LOCAL_FONT_FAMILIES = GOOGLE_FONT_FAMILIES;

function normalizeFamilyName(value: string): string {
  return value.trim().replace(/^['"]|['"]$/g, "").toLowerCase();
}

export function resolveFontAlias(fontFamily: string): string {
  const normalized = normalizeFamilyName(fontFamily);
  return FONT_ALIASES.get(normalized) ?? "Inter";
}

/** Батчи URL Google Fonts (ограничение длины URL) */
export function getGoogleFontStylesheetHrefs(): string[] {
  const weights = "wght@300;400;500;600;700;800;900";
  const families = GOOGLE_FONT_FAMILIES.map(
    (name) => `family=${encodeURIComponent(name).replace(/%20/g, "+")}:${weights}`
  );
  const base = "https://fonts.googleapis.com/css2?";
  const display = "&display=swap";
  const maxLen = 1800;
  const hrefs: string[] = [];
  let batch: string[] = [];
  let len = base.length + display.length;

  for (const f of families) {
    const add = batch.length ? `&${f}` : f;
    if (len + add.length > maxLen && batch.length) {
      hrefs.push(`${base}${batch.join("&")}${display}`);
      batch = [f];
      len = base.length + f.length + display.length;
    } else {
      batch.push(f);
      len += add.length;
    }
  }
  if (batch.length) {
    hrefs.push(`${base}${batch.join("&")}${display}`);
  }
  return hrefs;
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

    const mappedFamily = resolveFontAlias(primaryFamily);
    return `${mappedFamily}, system-ui, sans-serif`;
  } catch {
    return null;
  }
}
