import { TemplateRenderer, type TemplateData } from "./TemplateRenderer";

interface FeaturesRendererProps {
  template: TemplateData;
  className?: string;
}

export function FeaturesRenderer({ template, className }: FeaturesRendererProps) {
  return <TemplateRenderer template={template} className={className} fallbackGrid={{ cols: 9, rows: 9 }} />;
}
