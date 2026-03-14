"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeOptionPreviewCard } from "./ThemeOptionPreviewCard";
import type { ThemePreviewModel } from "@/render-kit/models/themePreviewModel";

interface ThemeKitSliderProps {
  models: ThemePreviewModel[];
}

export function ThemeKitSlider({ models }: ThemeKitSliderProps) {
  const [index, setIndex] = useState(0);
  const total = models.length;

  const current = useMemo(() => models[index] ?? null, [models, index]);

  if (!current) {
    return (
      <div className="rounded-xl border border-secondary p-6 text-muted-foreground">
        Нет доступных тем для предпросмотра.
      </div>
    );
  }

  const goPrev = () => setIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setIndex((prev) => (prev + 1) % total);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-secondary bg-background px-3 py-2">
        <div className="text-sm font-medium text-foreground">
          Шаблон {index + 1} из {total}
        </div>
        <div className="text-sm text-muted-foreground">{current.pairType}</div>
      </div>
      <div className="flex items-stretch gap-3">
        <button
          type="button"
          aria-label="Предыдущая тема"
          onClick={goPrev}
          className="inline-flex w-12 shrink-0 items-center justify-center rounded-lg border border-secondary bg-background text-foreground transition-colors hover:bg-secondary-hover"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="min-w-0 flex-1">
          <ThemeOptionPreviewCard model={current} />
        </div>

        <button
          type="button"
          aria-label="Следующая тема"
          onClick={goNext}
          className="inline-flex w-12 shrink-0 items-center justify-center rounded-lg border border-secondary bg-background text-foreground transition-colors hover:bg-secondary-hover"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
