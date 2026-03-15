import { Box, Container, Grid, Section } from "@/ui/layout";
import { renderHeroAtom } from "./utils/renderHeroAtom";
import { parsePaddingValue } from "./utils/atomRemStyle";
import { resolveTemplate } from "./utils/resolveTemplate";
import { getTemplate } from "@/renderer/templateRegistry";

export type TemplateAtomType =
  | "atom.heading"
  | "atom.subheading"
  | "atom.paragraph"
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
  /** Размер шрифта в rem → inline `font-size: Nrem`. Алиас: `rem`. */
  fontSize?: number;
  rem?: number;
  /** Отступы в rem: "1.25 0.625" (vertical horizontal) или 1–4 числа через пробел. */
  padding?: string;
  /** Иконка слева/справа от текста (для кнопки/ссылки): имя из реестра, например "arrow-up", "chevron-right". */
  iconLeft?: string;
  iconRight?: string;
  /** Максимальная ширина, например "36rem". */
  maxWidth?: string;
  /** Выравнивание текста: "left" | "center" | "right" | "justify". */
  textAlign?: string;
  /** Межстрочный интервал: число (множитель, например 1.75) или строка с единицей ("1.5rem"). */
  lineHeight?: number | string;
  /** Скругление углов, например "0.5rem" или "9999px". */
  borderRadius?: string;
  /** Вариант формы кнопки: round = 9999px (капсула), square = без скругления. Имеет смысл для atom.button. */
  buttonType?: "round" | "square";
  /** Цвет текста из темы, например "textColors.base", "textColors.muted", "textColors.faint", "textColors.accent". */
  fontColor?: string;
}

export interface TemplateData {
  layout?: string;
  /** Отступы секции: "10rem 0 3rem 0" или "10 0 3 0" (числа без единиц → rem). */
  padding?: string;
  atoms: TemplateAtom[];
  /** Родительский шаблон по id (например "hero1", "navbar1"). Атомы из этого шаблона мержатся по ref: дочерний перезаписывает элемент с тем же ref. */
  extends?: string;
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
  template: rawTemplate,
  className,
  fallbackGrid = { cols: 6, rows: 6 },
}: TemplateRendererProps) {
  const template = resolveTemplate(rawTemplate, getTemplate);
  const { cols, rows } = parseGridSize(template.layout, fallbackGrid);
  const sectionPadding = parsePaddingValue(template.padding);

  return (
    <Section
      className={className}
      style={sectionPadding ? { padding: sectionPadding } : undefined}
    >
      <Container>
        <Grid cols={cols} rows={rows}>
          {template.atoms.map((atom) => (
            <Box
              key={atom.ref}
              className="min-w-0"
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
