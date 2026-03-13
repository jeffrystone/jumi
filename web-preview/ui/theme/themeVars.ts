export const THEME_VARS = {
  gap: "--gap",
  sectionPadding: "--section-padding",
  containerWidth: "--container-width",
  fontFamily: "--font-family",
  h1FontSize: "--h1-font-size",
  h1FontWeight: "--h1-font-weight",
  h2FontSize: "--h2-font-size",
  h2FontWeight: "--h2-font-weight",
  h3FontSize: "--h3-font-size",
  h3FontWeight: "--h3-font-weight",
  bodyFontSize: "--body-font-size",
  bodyFontWeight: "--body-font-weight",
  buttonFontSize: "--button-font-size",
  buttonFontWeight: "--button-font-weight",
} as const;

export function cssVar(name: string): string {
  return `var(${name})`;
}
