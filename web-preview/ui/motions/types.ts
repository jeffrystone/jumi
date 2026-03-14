/**
 * Идентификаторы пресетов анимации — строки из темы / JSON.
 * Расширяйте union при добавлении реализаций в molecules.
 */
export type MotionId =
  | "none"
  | "crack"
  | "ripple"
  | "pulse-glow"
  | "press-scale"
  | "shimmer"
  | "border-beam"
  | "magnetic-hover"
  | "stagger-children"
  | "logical-burst"
  | "particle-surface";

/** К каким UI-примитивам пресет имеет смысл (и есть обёртка). */
export type MotionTarget =
  | "button"
  | "block"
  | "inline"
  | "media"
  | "text";

export interface MotionMeta {
  id: MotionId;
  label: string;
  /** На чём реально есть компонент сегодня */
  targets: MotionTarget[];
  /** Чем делать «полную» версию */
  implementation: "css" | "svg" | "canvas" | "dom-layout" | "optional-html2canvas";
  reducedMotion: "disable" | "simplify" | "ok";
  notes?: string;
}

export interface MotionButtonOptions {
  crackIntensity?: "subtle" | "normal" | "heavy";
  crackDurationMs?: number;
  resetAfterMs?: number | null;
}

export interface MotionBlockOptions {
  /** logical-burst / stagger */
  burstDurationMs?: number;
  /** particle-surface: число частиц */
  particleCount?: number;
}
