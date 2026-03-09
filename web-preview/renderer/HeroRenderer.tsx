import { Box, Container, Grid, Section } from "@/ui/layout";
import { renderHeroAtom } from "./utils/renderHeroAtom";

type HeroAtomType =
  | "atom.heading"
  | "atom.subheading"
  | "atom.button"
  | "atom.image"
  | "atom.link";

export interface HeroAtom {
  ref: string;
  type: HeroAtomType | string;
  value?: string;
  href?: string;
  src?: string;
  alt?: string;
  col: number;
  row: number;
  colSpan?: number;
  rowSpan?: number;
}

export interface HeroTemplate {
  atoms: HeroAtom[];
}

interface HeroRendererProps {
  template: HeroTemplate;
  className?: string;
}

export function HeroRenderer({ template, className }: HeroRendererProps) {
  return (
    <Section className={className}>
      <Container>
        <Grid cols={6} rows={6}>
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
