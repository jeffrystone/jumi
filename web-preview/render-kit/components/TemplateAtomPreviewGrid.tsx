"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroRenderer, NavbarRenderer } from "@/renderer";
import {
  buildScopedThemeVars,
  type ThemePreviewModel,
} from "@/render-kit/models/themePreviewModel";
import { getTemplatePairs, type TemplatePair } from "@/render-kit/models/templatePairMapper";

function PairCell({
  pair,
  model,
}: {
  pair: TemplatePair;
  model: ThemePreviewModel;
}) {
  const title = `${pair.heroId} + ${pair.navbarId}`;
  const scoped = useMemo(
    () => ({
      ...buildScopedThemeVars(model),
      backgroundImage: "var(--gradient-background)",
    }),
    [model]
  );

  return (
    <div
      className="rounded-lg border border-secondary shadow-sm"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "260px",
        overflow: "hidden",
        ...scoped,
      }}
    >
      <div
        className="border-b border-secondary px-3 py-2 text-xs text-muted-foreground"
        style={{ fontFamily: model.bodyFamily }}
      >
        {title} · <span className="text-faint-foreground">{model.pairType}</span>
      </div>
      <div
        className="flex min-h-0 flex-1 flex-col"
        style={{ fontFamily: model.bodyFamily }}
      >
        <NavbarRenderer
          template={pair.navbar}
          className="!py-3 [&_[class*='grid']]:!min-h-[100px] [&_[class*='grid']]:place-items-center [&_[class*='grid']]:justify-items-center"
        />
        <HeroRenderer
          template={pair.hero}
          className="!py-4 flex-1 [&_[class*='grid']]:!min-h-[100px] [&_[class*='grid']]:place-items-center"
        />
      </div>
    </div>
  );
}

export function TemplateAtomPreviewGrid({ models }: { models: ThemePreviewModel[] }) {
  const pairs = getTemplatePairs();
  const [index, setIndex] = useState(0);
  const total = models.length;
  const current = models[index] ?? null;

  if (!current || total === 0) {
    return (
      <div className="p-6 text-muted-foreground">
        Нет тем в theme_settings — проверьте путь к JSON.
      </div>
    );
  }

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <div className="space-y-4 px-6 pb-8 pt-2">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 rounded-lg border border-secondary bg-background px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Предыдущая тема"
            onClick={goPrev}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-secondary bg-background text-foreground hover:bg-secondary-hover"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-foreground">
            Тема {index + 1} / {total}
          </span>
          <button
            type="button"
            aria-label="Следующая тема"
            onClick={goNext}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-secondary bg-background text-foreground hover:bg-secondary-hover"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="text-sm text-muted-foreground sm:text-right">{current.pairType}</div>
      </div>

      <div
        className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 md:grid-cols-2"
        key={index}
      >
        {pairs.map((pair) => (
          <PairCell key={pair.pairIndex} pair={pair} model={current} />
        ))}
      </div>
    </div>
  );
}
