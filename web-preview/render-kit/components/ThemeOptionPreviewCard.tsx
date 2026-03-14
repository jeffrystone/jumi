import { Button, Heading, Link, Text } from "@/ui/atoms";
import { IconText } from "@/ui/molecules";
import { LogIn, LogOut, Menu, Phone, ShieldQuestion } from "lucide-react";
import type { CSSProperties } from "react";
import {
  buildScopedThemeVars,
  hslColor,
} from "@/render-kit/models/themePreviewModel";
import type { ThemePreviewModel } from "@/render-kit/models/themePreviewModel";

interface ThemeOptionPreviewCardProps {
  model: ThemePreviewModel;
}

export function ThemeOptionPreviewCard({ model }: ThemeOptionPreviewCardProps) {
  const inlineScopedVars = {
    "--inline-primary": model.palette.primary,
    "--inline-primary-hover": model.palette.primaryHover,
    "--inline-primary-disabled": model.palette.primaryDisabled,
    "--inline-secondary": model.palette.secondary,
    "--inline-secondary-hover": model.palette.secondaryHover,
    "--inline-secondary-disabled": model.palette.secondaryDisabled,
    "--inline-on-primary": model.palette.background,
    "--inline-on-secondary": model.palette.textColors.base,
    "--inline-link": model.link.color,
    "--inline-link-hover": model.link.hover,
    "--inline-link-visited": model.link.visited,
  } as CSSProperties;

  return (
    <article
      className="rounded-xl border p-5"
      style={{
        backgroundColor: hslColor(model.palette.background),
        borderColor: hslColor(model.palette.secondary),
      }}
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div
          className="rounded-lg p-4"
          style={{ ...inlineScopedVars, backgroundColor: hslColor(model.palette.secondary) }}
        >
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
              fontWeight: model.accentWeight,
            }}
          >
            Accent text: highlighted phrase for emphasis.
          </p>
          <p
            style={{
              fontFamily: model.bodyFamily,
              backgroundImage: model.gradients.text,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              fontSize: "1rem",
              lineHeight: 1.45,
              fontWeight: model.accentWeight,
            }}
          >
            Gradient text: highlighted phrase for emphasis.
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

          <p className="mt-4 text-xs text-muted-foreground">Hover на активных кнопках/ссылках интерактивный.</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-semibold transition-colors bg-[hsl(var(--inline-primary))] hover:bg-[hsl(var(--inline-primary-hover))] text-[hsl(var(--inline-on-primary))]"
              style={{ fontFamily: model.bodyFamily }}
            >
              Buy
            </button>
            <button
              type="button"
              disabled
              className="rounded-md px-4 py-2 text-sm font-semibold opacity-80 disabled:cursor-not-allowed bg-[hsl(var(--inline-primary-disabled))] text-[hsl(var(--inline-on-primary))]"
              style={{ fontFamily: model.bodyFamily }}
            >
              Buy (disabled)
            </button>
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-95 text-[hsl(var(--inline-on-primary))]"
              style={{
                fontFamily: model.bodyFamily,
                backgroundImage: model.gradients.primary,
              }}
            >
              Buy (gradient)
            </button>
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-semibold transition-colors bg-[hsl(var(--inline-secondary))] hover:bg-[hsl(var(--inline-secondary-hover))] text-[hsl(var(--inline-on-secondary))]"
              style={{ fontFamily: model.bodyFamily }}
            >
              Buy
            </button>
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-semibold transition-colors border bg-[hsl(var(--inline-secondary))] hover:bg-[hsl(var(--inline-secondary-hover))] text-[hsl(var(--inline-on-secondary))] border-[hsl(var(--inline-primary))]"
              style={{ fontFamily: model.bodyFamily }}
            >
              Buy
            </button>
            <button
              type="button"
              disabled
              className="rounded-md px-4 py-2 text-sm font-semibold opacity-80 disabled:cursor-not-allowed border bg-[hsl(var(--inline-secondary-disabled))] text-[hsl(var(--inline-on-secondary))] border-[hsl(var(--inline-secondary-disabled))]"
              style={{ fontFamily: model.bodyFamily }}
            >
              Buy (disabled)
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm" style={{ fontFamily: model.bodyFamily }}>
            <a
              href="#inline-link"
              className="transition-colors text-[hsl(var(--inline-link))] hover:text-[hsl(var(--inline-link-hover))]"
            >
              Link
            </a>
            <a href="#inline-link-visited" className="text-[hsl(var(--inline-link-visited))]">
              Link visited
            </a>
          </div>

          <div className="mt-3 space-y-2" style={{ fontFamily: model.bodyFamily }}>
            <p
              className="text-sm"
              style={{ color: hslColor(model.palette.textColors.muted) }}
            >
              Icons (base color)
            </p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2">
                <LogIn size={20} color={hslColor(model.palette.textColors.base)} />
                <span style={{ color: hslColor(model.palette.textColors.base) }}>Login</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <Menu size={20} color={hslColor(model.palette.textColors.base)} />
                <span style={{ color: hslColor(model.palette.textColors.base) }}>Menu</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <LogOut size={20} color={hslColor(model.palette.textColors.base)} />
              <ShieldQuestion size={20} color={hslColor(model.palette.textColors.base)} />
              <Phone size={20} color={hslColor(model.palette.textColors.base)} />
            </div>
            <p
              className="text-sm"
              style={{ color: hslColor(model.palette.textColors.muted) }}
            >
              Icons (interactive color)
            </p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2">
                <LogIn size={20} color={hslColor(model.link.color)} />
                <span style={{ color: hslColor(model.link.color) }}>Login</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <Menu size={20} color={hslColor(model.link.color)} />
                <span style={{ color: hslColor(model.link.color) }}>Menu</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <LogOut size={20} color={hslColor(model.link.color)} />
              <ShieldQuestion size={20} color={hslColor(model.link.color)} />
              <Phone size={20} color={hslColor(model.link.color)} />
            </div>
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
            <Text color="gradient">Gradient text: highlighted phrase for emphasis.</Text>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2">
            <div
              className="h-8 rounded border"
              style={{
                backgroundImage: "var(--gradient-primary)",
                borderColor: "hsl(var(--primary-hover))",
              }}
            />
            <div
              className="h-8 rounded border"
              style={{
                backgroundImage: "var(--gradient-secondary)",
                borderColor: "hsl(var(--secondary-hover))",
              }}
            />
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Hover в atoms идет через theme inject (`--primary-hover`, `--secondary-hover`).
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button variant="default">Buy</Button>
            <Button variant="default" disabled>
              Buy (disabled)
            </Button>
            <Button
              variant="default"
              className="hover:opacity-95"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              Buy (gradient)
            </Button>
            <Button variant="blank">Buy</Button>
            <Button variant="blank" disabled className="bg-secondary-disabled">
              Buy (disabled)
            </Button>
            <Button variant="secondary">Buy</Button>
            <Button variant="secondary" disabled>
              Buy (disabled)
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <Link href="#atom-link">Link</Link>
            <Link href="#atom-link-visited" className="text-link-visited">
              Link visited
            </Link>
          </div>

          <div className="mt-3 space-y-2">
            <Text as="p" size="sm" color="muted">
              Icons (base color)
            </Text>
            <div className="flex items-center gap-4">
              <IconText icon={LogIn} text="Login" className="text-foreground" variant="interactive" />
              <IconText
                icon={Menu}
                text="Menu"
                className="text-foreground"
                iconPosition="right"
                variant="interactive"
              />
            </div>
            <div className="flex items-center gap-4 text-foreground">
              <IconText icon={LogOut} text="Logout" variant="interactive" />
              <IconText icon={ShieldQuestion} text="Support" variant="interactive" />
              <IconText icon={Phone} text="Phone" variant="interactive" />
            </div>
            <Text as="p" size="sm" color="muted">
              Icons (interactive color)
            </Text>
            <div className="flex items-center gap-4">
              <IconText icon={LogIn} text="Login" className="text-link" variant="interactive" />
              <IconText
                icon={Menu}
                text="Menu"
                className="text-link"
                iconPosition="right"
                variant="interactive-bordered"
              />
            </div>
            <div className="flex items-center gap-4 text-link">
              <IconText icon={LogOut} text="Logout" variant="interactive" />
              <IconText icon={ShieldQuestion} text="Support" variant="interactive-bordered" />
              <IconText icon={Phone} text="Phone" variant="interactive" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
