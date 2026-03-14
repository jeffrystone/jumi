import type { TemplateData } from "@/renderer/TemplateRenderer";
import templateA from "@/templates/samples/templateA.json";
import templateB from "@/templates/samples/templateB.json";

export interface SampleTemplateItem {
  id: "templateA" | "templateB";
  label: string;
  template: TemplateData;
}

export const SAMPLE_TEMPLATES: readonly SampleTemplateItem[] = [
  { id: "templateA", label: "templateA", template: templateA as TemplateData },
  { id: "templateB", label: "templateB", template: templateB as TemplateData },
];
