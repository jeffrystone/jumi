import type { LucideIcon } from "lucide-react";
import {
  ArrowUp,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Sparkles,
} from "lucide-react";

/** Имена из JSON (kebab-case) → LucideIcon. Расширяйте по мере надобности. */
const MAP: Record<string, LucideIcon> = {
  "arrow-up": ArrowUp,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "arrow-down": ArrowDown,
  "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft,
  "chevron-up": ChevronUp,
  "chevron-down": ChevronDown,
  "external-link": ExternalLink,
  sparkles: Sparkles,
};

export function getTemplateIcon(name: string | undefined): LucideIcon | undefined {
  if (typeof name !== "string" || !name.trim()) return undefined;
  const key = name.trim().toLowerCase().replace(/\s+/g, "-");
  return MAP[key];
}
