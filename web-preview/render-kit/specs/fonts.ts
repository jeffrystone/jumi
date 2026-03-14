import { AVAILABLE_LOCAL_FONT_FAMILIES } from "@/ui/theme";
import type { FontSpecimen, FontSpecimenSample } from "../types";

const SAMPLE_TEXT =
  "Sphinx of black quartz, judge my vow. Съешь ещё этих мягких французских булок, да выпей чаю.";

const SAMPLE_SCALES: Omit<FontSpecimenSample, "id" | "text">[] = [
  { label: "Display / 48", fontSize: "3rem", fontWeight: 700, lineHeight: "1.1", tracking: "-0.02em" },
  { label: "Heading / 32", fontSize: "2rem", fontWeight: 600, lineHeight: "1.2", tracking: "-0.01em" },
  { label: "Subheading / 24", fontSize: "1.5rem", fontWeight: 500, lineHeight: "1.3" },
  { label: "Body / 18", fontSize: "1.125rem", fontWeight: 400, lineHeight: "1.5" },
  { label: "Body / 16", fontSize: "1rem", fontWeight: 400, lineHeight: "1.55" },
  { label: "Small / 14", fontSize: "0.875rem", fontWeight: 400, lineHeight: "1.45" },
];

export const FONT_SPECIMENS: FontSpecimen[] = AVAILABLE_LOCAL_FONT_FAMILIES.map((family) => ({
  id: family.toLowerCase().replace(/\s+/g, "-"),
  title: family,
  fontFamily: `${family}, system-ui, sans-serif`,
  samples: SAMPLE_SCALES.map((sample, index) => ({
    id: `${family.toLowerCase().replace(/\s+/g, "-")}-${index}`,
    text: SAMPLE_TEXT,
    ...sample,
  })),
}));
