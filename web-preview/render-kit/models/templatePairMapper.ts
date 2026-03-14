import type { TemplateData } from "@/renderer/TemplateRenderer";
import navbar1 from "@/templates/navbar/navbar1.json";
import navbar2 from "@/templates/navbar/navbar2.json";
import hero1 from "@/templates/hero/hero1.json";
import hero2 from "@/templates/hero/hero2.json";

/**
 * Строгое соответствие: navbarN ↔ heroN (индекс пары).
 * При добавлении шаблонов — новая строка и импорты navbar3/hero3 и т.д.
 */
export interface TemplatePair {
  /** Индекс пары (1 → navbar1 + hero1) */
  pairIndex: number;
  navbarId: `navbar${number}`;
  heroId: `hero${number}`;
  navbar: TemplateData;
  hero: TemplateData;
}

const pairs: TemplatePair[] = [
  {
    pairIndex: 1,
    navbarId: "navbar1",
    heroId: "hero1",
    navbar: navbar1 as TemplateData,
    hero: hero1 as TemplateData,
  },
  {
    pairIndex: 2,
    navbarId: "navbar2",
    heroId: "hero2",
    navbar: navbar2 as TemplateData,
    hero: hero2 as TemplateData,
  },
];

export function getTemplatePairs(): readonly TemplatePair[] {
  return pairs;
}

export function getPairByIndex(index: number): TemplatePair | undefined {
  return pairs.find((p) => p.pairIndex === index);
}
