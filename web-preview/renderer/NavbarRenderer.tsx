import { TemplateRenderer, type TemplateData } from "./TemplateRenderer";

interface NavbarRendererProps {
  template: TemplateData;
  className?: string;
}

export function NavbarRenderer({ template, className }: NavbarRendererProps) {
  return <TemplateRenderer template={template} className={className} fallbackGrid={{ cols: 6, rows: 1 }} />;
}
