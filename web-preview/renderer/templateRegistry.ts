import type { TemplateData } from "./TemplateRenderer";
import hero1 from "@/templates/hero/hero1.json";
import hero2 from "@/templates/hero/hero2.json";
import hero3 from "@/templates/hero/hero3.json";
import hero4 from "@/templates/hero/hero4.json";
import navbar1 from "@/templates/navbar/navbar1.json";
import navbar2 from "@/templates/navbar/navbar2.json";
import navbar3 from "@/templates/navbar/navbar3.json";
import navbar4 from "@/templates/navbar/navbar4.json";

const REGISTRY: Record<string, TemplateData> = {
  hero1: hero1 as TemplateData,
  hero2: hero2 as TemplateData,
  hero3: hero3 as TemplateData,
  hero4: hero4 as TemplateData,
  navbar1: navbar1 as TemplateData,
  navbar2: navbar2 as TemplateData,
  navbar3: navbar3 as TemplateData,
  navbar4: navbar4 as TemplateData,
};

/**
 * Возвращает базовый шаблон по id (hero1, navbar1, …) или undefined.
 */
export function getTemplate(id: string): TemplateData | undefined {
  const key = id.trim();
  return REGISTRY[key];
}

export function getTemplateIds(): string[] {
  return Object.keys(REGISTRY);
}
