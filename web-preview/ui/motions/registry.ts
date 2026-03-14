import type { MotionId, MotionMeta, MotionTarget } from "./types";

/** Полное описание пресетов (документация + валидация маппинга). */
export const MOTION_CATALOG: MotionMeta[] = [
  {
    id: "none",
    label: "Без эффекта",
    targets: ["button", "block", "inline", "media", "text"],
    implementation: "css",
    reducedMotion: "ok",
  },
  {
    id: "crack",
    label: "Трещина от клика (SVG)",
    targets: ["button"],
    implementation: "svg",
    reducedMotion: "simplify",
    notes: "CrackOverlayButton",
  },
  {
    id: "ripple",
    label: "Волна от точки клика",
    targets: ["button", "block"],
    implementation: "css",
    reducedMotion: "disable",
    notes: "Ripple — чистый CSS/DOM",
  },
  {
    id: "pulse-glow",
    label: "Пульс / свечение CTA",
    targets: ["button", "inline"],
    implementation: "css",
    reducedMotion: "simplify",
    notes: "keyframes box-shadow или ring",
  },
  {
    id: "press-scale",
    label: "Лёгкий scale при нажатии",
    targets: ["button", "inline"],
    implementation: "css",
    reducedMotion: "ok",
    notes: "active:scale-95",
  },
  {
    id: "shimmer",
    label: "Переливающаяся подложка (скелетон/акцент)",
    targets: ["block", "media"],
    implementation: "css",
    reducedMotion: "disable",
    notes: "gradient animation",
  },
  {
    id: "border-beam",
    label: "Бегущий луч по рамке",
    targets: ["button", "block"],
    implementation: "css",
    reducedMotion: "disable",
    notes: "conic-gradient mask animation",
  },
  {
    id: "magnetic-hover",
    label: "Магнит к курсору",
    targets: ["button", "inline"],
    implementation: "dom-layout",
    reducedMotion: "ok",
    notes: "pointer move → translate",
  },
  {
    id: "stagger-children",
    label: "Поячерёдный вход детей",
    targets: ["block"],
    implementation: "css",
    reducedMotion: "simplify",
    notes: "MotionBlock + delay",
  },
  {
    id: "logical-burst",
    label: "Рассып прямых детей (логические частицы)",
    targets: ["block"],
    implementation: "dom-layout",
    reducedMotion: "simplify",
    notes: "Каждый child — свой transform; не пиксели",
  },
  {
    id: "particle-surface",
    label: "Плоскость → частицы (canvas, цвет с блока)",
    targets: ["block", "media"],
    implementation: "canvas",
    reducedMotion: "disable",
    notes: "MVP без html2canvas; полный «все пиксели» — optional-html2canvas",
  },
];

const ALLOWED: Record<MotionTarget, Set<MotionId>> = {
  button: new Set(),
  block: new Set(),
  inline: new Set(),
  media: new Set(),
  text: new Set(),
};

for (const m of MOTION_CATALOG) {
  for (const t of m.targets) {
    ALLOWED[t].add(m.id);
  }
}

export function motionAllowedOn(id: MotionId, target: MotionTarget): boolean {
  return ALLOWED[target].has(id);
}

export function motionsForTarget(target: MotionTarget): MotionMeta[] {
  return MOTION_CATALOG.filter((m) => m.targets.includes(target));
}

export function normalizeMotionId(raw: string | undefined | null): MotionId {
  if (!raw || raw === "none") return "none";
  const known = MOTION_CATALOG.find((m) => m.id === raw);
  return known ? known.id : "none";
}
