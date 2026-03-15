import type { CSSProperties } from "react";
import type { TemplateAtom } from "../TemplateRenderer";

/** Число из шаблона → `Nrem` (fontSize | rem). */
export function atomFontRem(atom: TemplateAtom): string | undefined {
  const n = atom.fontSize ?? atom.rem;
  if (n == null || typeof n !== "number" || !Number.isFinite(n) || n <= 0) {
    return undefined;
  }
  return `${n}rem`;
}

/** Строку padding ("1.25 0.625" или "10rem 0 3rem 0") → CSS-значение (числа без единиц → rem). */
export function parsePaddingValue(input: string | undefined): string | undefined {
  if (typeof input !== "string" || !input.trim()) return undefined;
  const parts = input.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return undefined;
  const rem = parts
    .map((p) => {
      const n = Number(p);
      return Number.isFinite(n) ? `${n}rem` : p;
    })
    .join(" ");
  return rem;
}

/** "1.25 0.625" → "1.25rem 0.625rem" (1–4 значения в rem). */
export function atomPaddingStyle(atom: TemplateAtom): CSSProperties | undefined {
  const value = parsePaddingValue(atom.padding);
  return value ? { padding: value } : undefined;
}

/** fontColor из шаблона ("textColors.base" и т.д.) → color из темы (CSS-переменные). */
const THEME_COLOR_VAR: Record<string, string> = {
  "textColors.base": "foreground",
  "textColors.muted": "muted-foreground",
  "textColors.faint": "faint-foreground",
  "textColors.accent": "accent",
};

export function atomFontColorStyle(atom: TemplateAtom): CSSProperties | undefined {
  const key = typeof atom.fontColor === "string" ? atom.fontColor.trim() : "";
  if (!key) return undefined;
  const varName = THEME_COLOR_VAR[key];
  if (!varName) return undefined;
  return { color: `hsl(var(--${varName}))` };
}

/** maxWidth, textAlign, lineHeight, borderRadius из шаблона → CSS. */
export function atomLayoutStyle(atom: TemplateAtom): CSSProperties | undefined {
  const out: CSSProperties = {};
  if (typeof atom.maxWidth === "string" && atom.maxWidth.trim()) {
    out.maxWidth = atom.maxWidth.trim();
  }
  if (
    typeof atom.textAlign === "string" &&
    ["left", "right", "center", "justify"].includes(atom.textAlign.trim())
  ) {
    out.textAlign = atom.textAlign.trim() as CSSProperties["textAlign"];
  }
  if (atom.lineHeight !== undefined && atom.lineHeight !== null) {
    if (typeof atom.lineHeight === "number" && Number.isFinite(atom.lineHeight)) {
      out.lineHeight = atom.lineHeight;
    } else if (typeof atom.lineHeight === "string" && atom.lineHeight.trim()) {
      out.lineHeight = atom.lineHeight.trim();
    }
  }
  const shapeRadius =
    atom.buttonType === "round"
      ? "9999px"
      : atom.buttonType === "square"
        ? "0.2rem"
        : typeof atom.borderRadius === "string" && atom.borderRadius.trim()
          ? atom.borderRadius.trim()
          : undefined;
  if (shapeRadius !== undefined) {
    out.borderRadius = shapeRadius;
  }
  return Object.keys(out).length ? out : undefined;
}
