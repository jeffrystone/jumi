import type { TemplateData } from "@/renderer/TemplateRenderer";
import navbar1 from "@/templates/navbar/navbar1.json";
import navbar2 from "@/templates/navbar/navbar2.json";
import navbar3 from "@/templates/navbar/navbar3.json";
import navbar4 from "@/templates/navbar/navbar4.json";
import hero1 from "@/templates/hero/hero1.json";
import hero2 from "@/templates/hero/hero2.json";
import hero3 from "@/templates/hero/hero3.json";
import hero4 from "@/templates/hero/hero4.json";

/**
 * Строгое соответствие: navbarN ↔ heroN (индекс пары).
 * Сейчас 4 пары шаблонов.
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
  {
    pairIndex: 3,
    navbarId: "navbar3",
    heroId: "hero3",
    navbar: navbar3 as TemplateData,
    hero: hero3 as TemplateData,
  },
  {
    pairIndex: 4,
    navbarId: "navbar4",
    heroId: "hero4",
    navbar: navbar4 as TemplateData,
    hero: hero4 as TemplateData,
  },
];

export function getTemplatePairs(): readonly TemplatePair[] {
  return pairs;
}

export function getPairByIndex(index: number): TemplatePair | undefined {
  return pairs.find((p) => p.pairIndex === index);
}
