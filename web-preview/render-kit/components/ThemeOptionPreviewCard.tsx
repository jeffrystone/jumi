import { Button, Heading, Link, Text } from "@/ui/atoms";
import {
  buildScopedThemeVars,
  hslColor,
  type ThemePreviewModel,
} from "@/render-kit/controllers/themekitController";

interface ThemeOptionPreviewCardProps {
  model: ThemePreviewModel;
}

export function ThemeOptionPreviewCard({ model }: ThemeOptionPreviewCardProps) {
  return (
    <article
      className="rounded-xl border p-5"
      style={{
        backgroundColor: hslColor(model.palette.background),
        borderColor: hslColor(model.palette.secondary),
      }}
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-lg p-4" style={{ backgroundColor: hslColor(model.palette.secondary) }}>
          <p className="mb-3 text-xs uppercase tracking-wider text-faint-foreground">Inline Preview</p>
          <h3
            className="mb-2"
            style={{
              fontFamily: model.headingFamily,
              color: hslColor(model.palette.textColors.base),
              fontSize: "2rem",
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {model.pairType}
          </h3>
          <h4
            className="mb-2"
            style={{
              fontFamily: model.headingFamily,
              color: hslColor(model.palette.textColors.base),
              fontSize: "3rem",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {model.pairType}
          </h4>

          <p
            style={{
              fontFamily: model.bodyFamily,
              color: hslColor(model.palette.textColors.base),
              fontSize: "1rem",
              lineHeight: 1.5,
            }}
          >
            Base text: The quick brown fox jumps over the lazy dog.
          </p>
          <p
            style={{
              fontFamily: model.bodyFamily,
              color: hslColor(model.palette.textColors.muted),
              fontSize: "0.95rem",
              lineHeight: 1.5,
            }}
          >
            Muted text: secondary hierarchy for supporting content.
          </p>
          <p
            style={{
              fontFamily: model.bodyFamily,
              color: hslColor(model.palette.textColors.faint),
              fontSize: "0.85rem",
              lineHeight: 1.4,
            }}
          >
            Faint text: meta labels, notes and subtle details.
          </p>
          <p
            style={{
              fontFamily: model.bodyFamily,
              color: hslColor(model.palette.textColors.accent),
              fontSize: "1rem",
              lineHeight: 1.45,
              fontWeight: 600,
            }}
          >
            Accent text: highlighted phrase for emphasis.
          </p>

          <div className="mt-3 grid grid-cols-1 gap-2">
            <div
              className="h-8 rounded"
              style={{
                backgroundImage: model.gradients.primary,
                border: `1px solid ${hslColor(model.palette.primaryHover)}`,
              }}
            />
            <div
              className="h-8 rounded"
              style={{
                backgroundImage: model.gradients.secondary,
                border: `1px solid ${hslColor(model.palette.secondaryHover)}`,
              }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: hslColor(model.palette.primary),
                color: hslColor(model.palette.background),
                fontFamily: model.bodyFamily,
              }}
            >
              Buy
            </button>
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: hslColor(model.palette.primaryHover),
                color: hslColor(model.palette.background),
                fontFamily: model.bodyFamily,
              }}
            >
              Buy (hover)
            </button>
            <button
              type="button"
              disabled
              className="rounded-md px-4 py-2 text-sm font-semibold opacity-80"
              style={{
                backgroundColor: hslColor(model.palette.primaryDisabled),
                color: hslColor(model.palette.background),
                fontFamily: model.bodyFamily,
              }}
            >
              Buy (disabled)
            </button>
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: hslColor(model.palette.secondary),
                color: hslColor(model.palette.textColors.base),
                fontFamily: model.bodyFamily,
              }}
            >
              Buy
            </button>
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: hslColor(model.palette.secondary),
                color: hslColor(model.palette.textColors.base),
                fontFamily: model.bodyFamily,
                border: `1px solid ${hslColor(model.palette.primary)}`,
              }}
            >
              Buy
            </button>
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: hslColor(model.palette.secondaryHover),
                color: hslColor(model.palette.textColors.base),
                fontFamily: model.bodyFamily,
                border: `1px solid ${hslColor(model.palette.primary)}`,
              }}
            >
              Buy (hover)
            </button>
            <button
              type="button"
              disabled
              className="rounded-md px-4 py-2 text-sm font-semibold opacity-80"
              style={{
                backgroundColor: hslColor(model.palette.secondaryDisabled),
                color: hslColor(model.palette.textColors.base),
                fontFamily: model.bodyFamily,
                border: `1px solid ${hslColor(model.palette.secondaryDisabled)}`,
              }}
            >
              Buy (disabled)
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm" style={{ fontFamily: model.bodyFamily }}>
            <a href="#inline-link" style={{ color: hslColor(model.link.color) }}>
              Link
            </a>
            <a href="#inline-link-hover" style={{ color: hslColor(model.link.hover) }}>
              Link hover
            </a>
            <a href="#inline-link-visited" style={{ color: hslColor(model.link.visited) }}>
              Link visited
            </a>
          </div>
        </div>

        <div
          className="rounded-lg p-4"
          style={{
            ...buildScopedThemeVars(model),
            backgroundColor: "hsl(var(--secondary))",
            fontFamily: model.bodyFamily,
          }}
        >
          <p className="mb-3 text-xs uppercase tracking-wider text-faint-foreground">Atoms Preview</p>
          <Heading level={1} style={{ fontFamily: model.headingFamily }}>
            {model.pairType}
          </Heading>
          <Heading
            level={1}
            style={{ fontFamily: model.headingFamily, fontSize: "3rem", lineHeight: 1.1 }}
          >
            {model.pairType}
          </Heading>
          <div className="mt-3 space-y-2">
            <Text color="default">Base text: The quick brown fox jumps over the lazy dog.</Text>
            <Text color="muted">Muted text: secondary hierarchy for supporting content.</Text>
            <Text color="faint" size="sm">
              Faint text: meta labels, notes and subtle details.
            </Text>
            <Text color="accent">Accent text: highlighted phrase for emphasis.</Text>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="default">Buy</Button>
            <Button variant="default" className="bg-primary-hover">
              Buy (hover)
            </Button>
            <Button variant="default" disabled>
              Buy (disabled)
            </Button>
            <Button variant="blank">Buy</Button>
            <Button variant="blank" className="bg-secondary-hover">
              Buy (hover)
            </Button>
            <Button variant="blank" disabled className="bg-secondary-disabled">
              Buy (disabled)
            </Button>
            <Button variant="secondary">Buy</Button>
            <Button variant="secondary" className="bg-secondary-hover">
              Buy (hover)
            </Button>
            <Button variant="secondary" disabled>
              Buy (disabled)
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <Link href="#atom-link">Link</Link>
            <Link href="#atom-link-hover" className="text-link-hover">
              Link hover
            </Link>
            <Link href="#atom-link-visited" className="text-link-visited">
              Link visited
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
