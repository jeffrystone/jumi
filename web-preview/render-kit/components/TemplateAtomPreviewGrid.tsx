"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { HeroRenderer, NavbarRenderer } from "@/renderer";
import {
  buildScopedThemeVars,
  type ThemePreviewModel,
} from "@/render-kit/models/themePreviewModel";
import { getTemplatePairs, type TemplatePair } from "@/render-kit/models/templatePairMapper";

function PairCell({
  pair,
  model,
  variant = "grid",
  onOpenFullscreen,
}: {
  pair: TemplatePair;
  model: ThemePreviewModel;
  variant?: "grid" | "fullscreen";
  onOpenFullscreen?: () => void;
}) {
  const title = `${pair.heroId} + ${pair.navbarId}`;
  const scoped = useMemo(
    () => ({
      ...buildScopedThemeVars(model),
      backgroundImage: "var(--gradient-background)",
    }),
    [model]
  );

  const isGrid = variant === "grid";

  return (
    <div
      role={isGrid && onOpenFullscreen ? "button" : undefined}
      tabIndex={isGrid && onOpenFullscreen ? 0 : undefined}
      onClick={isGrid ? onOpenFullscreen : undefined}
      onKeyDown={
        isGrid && onOpenFullscreen
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenFullscreen();
              }
            }
          : undefined
      }
      className={
        isGrid
          ? "cursor-pointer rounded-lg border border-secondary shadow-sm outline-none transition-shadow hover:ring-2 hover:ring-primary/30 focus-visible:ring-2 focus-visible:ring-primary"
          : "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 shadow-xl"
      }
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: isGrid ? "260px" : "min(88vh, 900px)",
        overflow: "hidden",
        ...scoped,
      }}
    >
      <div
        className={
          isGrid
            ? "border-b border-secondary px-3 py-2 text-xs text-muted-foreground"
            : "border-b border-white/10 px-4 py-3 text-sm text-muted-foreground"
        }
        style={{ fontFamily: model.bodyFamily }}
      >
        {title} · <span className="text-faint-foreground">{model.pairType}</span>
        {isGrid ? (
          <span className="ml-2 text-faint-foreground">· клик — на весь экран</span>
        ) : null}
      </div>
      <div
        className="flex min-h-0 flex-1 flex-col"
        style={{ fontFamily: model.bodyFamily }}
      >
        <NavbarRenderer
          template={pair.navbar}
          className={
            isGrid
              ? "!py-3 [&_[class*='grid']]:!min-h-[100px] [&_[class*='grid']]:place-items-center [&_[class*='grid']]:justify-items-center"
              : "!py-6 [&_[class*='grid']]:!min-h-[140px] [&_[class*='grid']]:place-items-center [&_[class*='grid']]:justify-items-center"
          }
        />
        <HeroRenderer
          template={pair.hero}
          className={
            isGrid
              ? "!py-4 flex-1 [&_[class*='grid']]:!min-h-[100px] [&_[class*='grid']]:place-items-center"
              : "!flex-1 !py-8 [&_[class*='grid']]:!min-h-[200px] [&_[class*='grid']]:place-items-center"
          }
        />
      </div>
    </div>
  );
}

export function TemplateAtomPreviewGrid({ models }: { models: ThemePreviewModel[] }) {
  const pairs = getTemplatePairs();
  const [index, setIndex] = useState(0);
  const [fullscreenPair, setFullscreenPair] = useState<TemplatePair | null>(null);
  const total = models.length;
  const current = models[index] ?? null;

  const closeFullscreen = useCallback(() => setFullscreenPair(null), []);

  useEffect(() => {
    if (!fullscreenPair) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeFullscreen();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [fullscreenPair, closeFullscreen]);

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
    <div className="space-y-6 px-4 pb-8 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center rounded-2xl border-2 border-secondary bg-background px-4 py-6 shadow-sm sm:px-8 sm:py-8">
        <p className="mb-1 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Тема оформления
        </p>
        <h2 className="mb-2 min-h-[2.5rem] max-w-full text-center text-xl font-semibold leading-tight text-foreground sm:text-2xl md:min-h-[3rem] md:text-3xl">
          {current.pairType}
        </h2>
        <div className="flex w-full max-w-2xl items-center gap-4 sm:gap-8">
          <button
            type="button"
            aria-label="Предыдущая тема"
            onClick={goPrev}
            className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-secondary bg-background text-foreground shadow-sm transition hover:scale-[1.04] hover:bg-secondary-hover active:scale-[0.97] sm:h-[4.5rem] sm:w-[4.5rem] md:h-20 md:w-20"
          >
            <ChevronLeft className="size-8 sm:size-10 md:size-11" strokeWidth={2.5} />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="text-lg font-medium tabular-nums text-muted-foreground sm:text-xl">
              {index + 1} / {total}
            </p>
          </div>
          <button
            type="button"
            aria-label="Следующая тема"
            onClick={goNext}
            className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-secondary bg-background text-foreground shadow-sm transition hover:scale-[1.04] hover:bg-secondary-hover active:scale-[0.97] sm:h-[4.5rem] sm:w-[4.5rem] md:h-20 md:w-20"
          >
            <ChevronRight className="size-8 sm:size-10 md:size-11" strokeWidth={2.5} />
          </button>
        </div>
        <p className="mt-5 text-center text-sm text-faint-foreground">
          ← предыдущая · следующая →
        </p>
      </div>

      <div
        className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 md:grid-cols-2"
        key={index}
      >
        {pairs.map((pair) => (
          <PairCell
            key={pair.pairIndex}
            pair={pair}
            model={current}
            variant="grid"
            onOpenFullscreen={() => setFullscreenPair(pair)}
          />
        ))}
      </div>

      {fullscreenPair ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center px-3 py-4 sm:px-5 sm:py-6"
          aria-modal
          aria-labelledby="fullscreen-preview-title"
          role="dialog"
        >
          <button
            type="button"
            aria-label="Закрыть просмотр"
            className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
            onClick={closeFullscreen}
          />
          <button
            type="button"
            aria-label="Закрыть"
            onClick={closeFullscreen}
            className="absolute right-4 top-4 z-[202] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white shadow-lg ring-1 ring-white/20 transition-colors hover:bg-white/20"
          >
            <X size={22} strokeWidth={2} />
          </button>
          <div
            id="fullscreen-preview-title"
            className="sr-only"
          >
            Полноэкранный просмотр: {fullscreenPair.heroId} и {fullscreenPair.navbarId}
          </div>
          <div
            className="relative z-[201] w-full max-w-[min(100%,calc(100vw-1.5rem))] sm:max-w-[min(100%,calc(100vw-2.5rem))]"
            onClick={(e) => e.stopPropagation()}
          >
            <PairCell pair={fullscreenPair} model={current} variant="fullscreen" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
