import { TemplateRenderer, type TemplateAtom, type TemplateData } from "./TemplateRenderer";

interface HeroRendererProps {
  template: TemplateData;
  className?: string;
}

export type HeroAtom = TemplateAtom;
export type HeroTemplate = TemplateData;

export function HeroRenderer({ template, className }: HeroRendererProps) {
  return <TemplateRenderer template={template} className={className} fallbackGrid={{ cols: 6, rows: 6 }} />;
}
