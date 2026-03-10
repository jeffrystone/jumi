import { Box, Container, Grid, Section } from "@/ui/layout";
import { renderHeroAtom } from "./utils/renderHeroAtom";

export type TemplateAtomType =
  | "atom.heading"
  | "atom.subheading"
  | "atom.button"
  | "atom.image"
  | "atom.link";

export interface TemplateAtom {
  ref: string;
  type: TemplateAtomType | string;
  value?: string;
  href?: string;
  src?: string;
  alt?: string;
  col: number;
  row: number;
  colSpan?: number;
  rowSpan?: number;
}

export interface TemplateData {
  layout?: string;
  atoms: TemplateAtom[];
}

interface TemplateRendererProps {
  template: TemplateData;
  className?: string;
  fallbackGrid?: { cols: number; rows: number };
}

function parseGridSize(
  layout: string | undefined,
  fallbackGrid: { cols: number; rows: number }
): { cols: number; rows: number } {
  const match = layout?.match(/^grid-(\d+)x(\d+)$/i);
  if (!match) {
    return fallbackGrid;
  }

  const cols = Number(match[1]);
  const rows = Number(match[2]);
  if (!Number.isFinite(cols) || !Number.isFinite(rows) || cols <= 0 || rows <= 0) {
    return fallbackGrid;
  }

  return { cols, rows };
}

export function TemplateRenderer({
  template,
  className,
  fallbackGrid = { cols: 6, rows: 6 },
}: TemplateRendererProps) {
  const { cols, rows } = parseGridSize(template.layout, fallbackGrid);

  return (
    <Section className={className}>
      <Container>
        <Grid cols={cols} rows={rows}>
          {template.atoms.map((atom) => (
            <Box
              key={atom.ref}
              style={{
                gridColumn: `${atom.col} / span ${atom.colSpan ?? 1}`,
                gridRow: `${atom.row} / span ${atom.rowSpan ?? 1}`,
              }}
            >
              {renderHeroAtom(atom)}
            </Box>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
