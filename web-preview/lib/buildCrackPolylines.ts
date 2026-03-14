/**
 * Процедурная генерация полилиний трещин для SVG (без React).
 * Лучи от (cx, cy) к границе прямоугольника + ответвления + опционально микротрещины.
 */

export type CrackIntensity = "subtle" | "normal" | "heavy";

export interface BuildCrackPolylinesOpts {
  /** Сид для воспроизводимости */
  seed?: number;
  intensity?: CrackIntensity;
  /** Число основных лучей (по умолчанию от intensity) */
  mainRays?: number;
  /** Второй проход — тонкие микротрещины */
  microPass?: boolean;
}

export interface CrackPolyline {
  /** SVG path d (полилиния) */
  d: string;
  /** Длина пути для stroke-dasharray / анимации */
  length: number;
  /** true — микротрещина (можно рисовать тоньше/прозрачнее) */
  micro?: boolean;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function polylineLength(pts: { x: number; y: number }[]): number {
  let L = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    L += Math.hypot(dx, dy);
  }
  return L;
}

function toPathD(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  const [p0, ...rest] = pts;
  return (
    `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}` +
    rest.map((p) => ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join("")
  );
}

/** Сегмент от (x,y) в направлении (ux,uy) до выхода из [0,w]×[0,h] */
function rayToEdge(
  x: number,
  y: number,
  ux: number,
  uy: number,
  w: number,
  h: number
): { x: number; y: number } | null {
  const eps = 1e-6;
  let tMin = Infinity;
  if (Math.abs(ux) > eps) {
    const t0 = (0 - x) / ux;
    const t1 = (w - x) / ux;
    if (t0 > eps) tMin = Math.min(tMin, t0);
    if (t1 > eps) tMin = Math.min(tMin, t1);
  }
  if (Math.abs(uy) > eps) {
    const t0 = (0 - y) / uy;
    const t1 = (h - y) / uy;
    if (t0 > eps) tMin = Math.min(tMin, t0);
    if (t1 > eps) tMin = Math.min(tMin, t1);
  }
  if (!Number.isFinite(tMin) || tMin <= 0) return null;
  return { x: clamp(x + ux * tMin, 0, w), y: clamp(y + uy * tMin, 0, h) };
}

function buildRayPolyline(
  cx: number,
  cy: number,
  angle: number,
  w: number,
  h: number,
  rand: () => number,
  step: number,
  noiseScale: number,
  maxSteps: number
): { x: number; y: number }[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const px = -sin;
  const py = cos;
  const end = rayToEdge(cx, cy, cos, sin, w, h);
  if (!end) return [{ x: cx, y: cy }];

  const pts: { x: number; y: number }[] = [{ x: cx, y: cy }];
  let x = cx;
  let y = cy;
  const totalDist = Math.hypot(end.x - cx, end.y - cy);
  let traveled = 0;

  for (let i = 0; i < maxSteps && traveled < totalDist - step * 0.5; i++) {
    const noise = (rand() - 0.5) * 2 * noiseScale;
    x += cos * step + px * noise;
    y += sin * step + py * noise;
    x = clamp(x, 0, w);
    y = clamp(y, 0, h);
    traveled = Math.hypot(x - cx, y - cy);
    pts.push({ x, y });
  }
  pts.push(end);
  return pts;
}

function branchPolyline(
  from: { x: number; y: number },
  baseAngle: number,
  w: number,
  h: number,
  rand: () => number,
  step: number,
  noiseScale: number,
  lengthFactor: number
): { x: number; y: number }[] {
  const sign = rand() > 0.5 ? 1 : -1;
  const delta = sign * (0.35 + rand() * 0.55);
  const angle = baseAngle + delta;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const end = rayToEdge(from.x, from.y, cos, sin, w, h);
  if (!end) return [from];

  const maxDist = Math.hypot(end.x - from.x, end.y - from.y) * lengthFactor;
  const pts: { x: number; y: number }[] = [from];
  let x = from.x;
  let y = from.y;
  const px = -sin;
  const py = cos;
  let traveled = 0;

  while (traveled < maxDist - step * 0.3) {
    const noise = (rand() - 0.5) * 2 * noiseScale;
    x += cos * step + px * noise;
    y += sin * step + py * noise;
    x = clamp(x, 0, w);
    y = clamp(y, 0, h);
    traveled = Math.hypot(x - from.x, y - from.y);
    pts.push({ x, y });
    if (traveled >= maxDist) break;
  }
  const t = lengthFactor;
  const last = {
    x: clamp(from.x + (end.x - from.x) * t, 0, w),
    y: clamp(from.y + (end.y - from.y) * t, 0, h),
  };
  if (pts.length === 1 || Math.hypot(last.x - pts[pts.length - 1].x, last.y - pts[pts.length - 1].y) > 0.5) {
    pts.push(last);
  }
  return pts;
}

const INTENSITY_RAYS: Record<CrackIntensity, { min: number; max: number }> = {
  subtle: { min: 5, max: 6 },
  normal: { min: 6, max: 8 },
  heavy: { min: 8, max: 11 },
};

/**
 * Строит набор SVG-путей (полилиний) трещин от точки (cx, cy) в прямоугольнике w×h.
 */
export function buildCrackPolylines(
  w: number,
  h: number,
  cx: number,
  cy: number,
  opts: BuildCrackPolylinesOpts = {}
): CrackPolyline[] {
  if (w <= 0 || h <= 0) return [];

  const seed = opts.seed ?? Date.now() % 1e9;
  const rand = mulberry32(seed >>> 0);
  const intensity = opts.intensity ?? "normal";
  const rayRange = INTENSITY_RAYS[intensity];
  let nRays =
    opts.mainRays ??
    Math.floor(rayRange.min + rand() * (rayRange.max - rayRange.min + 1 - 1e-6));
  nRays = clamp(nRays, 4, 14);

  const step = intensity === "subtle" ? 5 : intensity === "heavy" ? 3.5 : 4;
  const noise =
    intensity === "subtle" ? 1.2 : intensity === "heavy" ? 2.4 : 1.8;
  const maxSteps = Math.ceil(Math.hypot(w, h) / step) + 8;

  const result: CrackPolyline[] = [];
  const usedAngles: number[] = [];

  for (let r = 0; r < nRays; r++) {
    let angle = rand() * Math.PI * 2;
    for (let k = 0; k < 8; k++) {
      let ok = true;
      for (const a of usedAngles) {
        const d = Math.abs(angle - a);
        const dist = Math.min(d, Math.PI * 2 - d);
        if (dist < 0.25) {
          ok = false;
          break;
        }
      }
      if (ok) break;
      angle = rand() * Math.PI * 2;
    }
    usedAngles.push(angle);

    const main = buildRayPolyline(cx, cy, angle, w, h, rand, step, noise, maxSteps);
    if (main.length >= 2) {
      result.push({
        d: toPathD(main),
        length: polylineLength(main),
        micro: false,
      });
    }

    const nBranches = rand() > 0.35 ? (rand() > 0.5 ? 2 : 1) : 1;
    for (let b = 0; b < nBranches; b++) {
      const idx = 1 + Math.floor(rand() * Math.max(1, main.length - 2));
      const from = main[Math.min(idx, main.length - 1)];
      const lenF = 0.22 + rand() * 0.35;
      const branch = branchPolyline(from, angle, w, h, rand, step * 0.9, noise * 0.85, lenF);
      if (branch.length >= 2) {
        result.push({
          d: toPathD(branch),
          length: polylineLength(branch),
          micro: false,
        });
      }
    }
  }

  if (opts.microPass !== false && intensity !== "subtle") {
    const microCount = intensity === "heavy" ? 10 : 6;
    for (let m = 0; m < microCount; m++) {
      const angle = rand() * Math.PI * 2;
      const lenF = 0.08 + rand() * 0.15;
      const startDist = rand() * Math.min(w, h) * 0.15;
      const sx = clamp(cx + Math.cos(angle) * startDist, 0, w);
      const sy = clamp(cy + Math.sin(angle) * startDist, 0, h);
      const branch = branchPolyline({ x: sx, y: sy }, angle + (rand() - 0.5) * 0.5, w, h, rand, step * 0.7, noise * 0.5, lenF);
      if (branch.length >= 2) {
        result.push({
          d: toPathD(branch),
          length: polylineLength(branch),
          micro: true,
        });
      }
    }
  }

  if (opts.microPass === true && intensity === "subtle") {
    for (let m = 0; m < 4; m++) {
      const angle = rand() * Math.PI * 2;
      const lenF = 0.06 + rand() * 0.1;
      const sx = clamp(cx + Math.cos(angle) * rand() * 8, 0, w);
      const sy = clamp(cy + Math.sin(angle) * rand() * 8, 0, h);
      const branch = branchPolyline({ x: sx, y: sy }, angle, w, h, rand, step * 0.6, noise * 0.4, lenF);
      if (branch.length >= 2) {
        result.push({ d: toPathD(branch), length: polylineLength(branch), micro: true });
      }
    }
  }

  return result;
}
