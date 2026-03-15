import type { TemplateData } from "@/renderer/TemplateRenderer";
import navbar1 from "@/templates/navbar/navbar1.json";
import navbar2 from "@/templates/navbar/navbar2.json";
import navbar3 from "@/templates/navbar/navbar3.json";
import navbar4 from "@/templates/navbar/navbar4.json";
import hero1 from "@/templates/hero/hero1.json";
import hero2 from "@/templates/hero/hero2.json";
import hero3 from "@/templates/hero/hero3.json";
import hero4 from "@/templates/hero/hero4.json";

/** Все hero1*.json (hero1, hero1A, hero1B, …) — подхват при сборке. */
const hero1VariantContext = require.context(
  "@/templates/hero",
  false,
  /^\.\/hero1[A-Za-z0-9]*\.json$/
);

/**
 * Строгое соответствие: navbarN ↔ heroN (индекс пары).
 * heroId/navbarId — строки (hero1, hero1A, navbar1, …).
 */
export interface TemplatePair {
  pairIndex: number;
  navbarId: string;
  heroId: string;
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

/** Варианты hero1: автоматически все hero1*.json из templates/hero (hero1, hero1A, hero1B, …). */
export function getHero1VariantPairs(): readonly TemplatePair[] {
  const keys = hero1VariantContext.keys().sort((a, b) => {
    if (a === "./hero1.json") return -1;
    if (b === "./hero1.json") return 1;
    return a.localeCompare(b);
  });
  const navbar = navbar1 as TemplateData;
  return keys.map((key, i) => {
    const id = key.replace(/^\.\/(.*)\.json$/, "$1");
    const mod = hero1VariantContext(key) as { default?: TemplateData };
    const template = (mod?.default ?? mod) as TemplateData;
    return {
      pairIndex: i + 1,
      navbarId: "navbar1",
      heroId: id,
      navbar,
      hero: template,
    };
  });
}
