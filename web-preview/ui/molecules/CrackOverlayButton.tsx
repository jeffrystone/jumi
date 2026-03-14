"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/ui/atoms/Button";
import { cn } from "@utils";
import {
  buildCrackPolylines,
  type BuildCrackPolylinesOpts,
  type CrackPolyline,
} from "@/lib/buildCrackPolylines";

export type CrackIntensity = BuildCrackPolylinesOpts["intensity"];

export interface CrackOverlayButtonProps extends ButtonProps {
  crackIntensity?: CrackIntensity;
  crackDurationMs?: number;
  /** null — трещина до следующего клика; число — сброс через N ms */
  resetAfterMs?: number | null;
  wrapperClassName?: string;
}

const DEFAULT_DURATION = 260;
const FLASH_MS = 100;

export function CrackOverlayButton({
  crackIntensity = "normal",
  crackDurationMs = DEFAULT_DURATION,
  resetAfterMs = 2800,
  wrapperClassName,
  className,
  onClick,
  onPointerDown,
  onKeyDown,
  disabled,
  children,
  ...buttonProps
}: CrackOverlayButtonProps) {
  const wrapRef = React.useRef<HTMLSpanElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [frame, setFrame] = React.useState(0);
  const [polylines, setPolylines] = React.useState<CrackPolyline[]>([]);
  const [flashOpacity, setFlashOpacity] = React.useState(0);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const resetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const clearResetTimer = React.useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  const scheduleReset = React.useCallback(() => {
    clearResetTimer();
    if (resetAfterMs == null) return;
    resetTimerRef.current = setTimeout(() => {
      setPolylines([]);
      setFrame((f) => f + 1);
      setFlashOpacity(0);
    }, resetAfterMs);
  }, [resetAfterMs, clearResetTimer]);

  React.useEffect(() => () => clearResetTimer(), [clearResetTimer]);

  const spawnCrack = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = wrapRef.current;
      if (!el || disabled) return;
      const r = el.getBoundingClientRect();
      const w = r.width;
      const h = r.height;
      if (w < 2 || h < 2) return;
      const cx = clientX - r.left;
      const cy = clientY - r.top;
      const seed = (Date.now() ^ (Math.floor(cx * 1000) + Math.floor(cy * 1000))) >>> 0;
      const paths = buildCrackPolylines(w, h, cx, cy, {
        seed,
        intensity: crackIntensity,
        microPass: crackIntensity !== "subtle",
      });
      setPolylines(paths);
      setFrame((f) => f + 1);
      if (!reducedMotion) {
        setFlashOpacity(0.16);
        setTimeout(() => setFlashOpacity(0), FLASH_MS);
      }
      scheduleReset();
    },
    [disabled, crackIntensity, scheduleReset, reducedMotion]
  );

  const spawnCenter = React.useCallback(() => {
    const el = wrapRef.current;
    if (!el || disabled) return;
    const r = el.getBoundingClientRect();
    spawnCrack(r.left + r.width / 2, r.top + r.height / 2);
  }, [disabled, spawnCrack]);

  const duration = reducedMotion ? 0 : crackDurationMs;
  const easing = "cubic-bezier(0.2, 0.9, 0.2, 1)";

  React.useLayoutEffect(() => {
    if (reducedMotion || !polylines.length || duration === 0) return;
    const root = svgRef.current;
    if (!root) return;
    const paths = root.querySelectorAll<SVGPathElement>("path[data-crack-draw]");
    paths.forEach((p) => {
      p.style.strokeDashoffset = `${p.getTotalLength()}`;
    });
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        paths.forEach((p) => {
          p.style.strokeDashoffset = "0";
        });
      });
    });
    return () => cancelAnimationFrame(id);
  }, [frame, polylines.length, reducedMotion, duration]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerDown?.(e);
    if (e.button !== 0 || disabled) return;
    spawnCrack(e.clientX, e.clientY);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      if (!e.repeat) spawnCenter();
    }
  };

  return (
    <span
      ref={wrapRef}
      className={cn(
        "relative inline-flex overflow-hidden rounded-md",
        wrapperClassName
      )}
    >
      <Button
        type="button"
        className={cn("relative z-0 rounded-md", className)}
        disabled={disabled}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        onClick={onClick}
        {...buttonProps}
      >
        {children}
      </Button>
      {polylines.length > 0 && (
        <svg
          ref={svgRef}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full rounded-md"
          aria-hidden
        >
          <defs>
            <filter id={`crack-glow-${frame}`} x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.45" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {flashOpacity > 0 && (
            <rect
              width="100%"
              height="100%"
              fill="currentColor"
              className="text-foreground"
              style={{
                opacity: flashOpacity,
                transition: reducedMotion ? undefined : `opacity ${FLASH_MS}ms ease-out`,
              }}
            />
          )}
          {polylines.map((pl, i) => {
            const micro = pl.micro;
            const strokeW = micro ? 0.55 : 1.25;
            const opacity = micro ? 0.42 : 0.9;
            const len = pl.length;
            return (
              <g key={`${frame}-${i}`}>
                <path
                  data-crack-draw
                  d={pl.d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeW + 1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground/80"
                  style={{
                    opacity: opacity * 0.4,
                    filter: reducedMotion ? undefined : `url(#crack-glow-${frame})`,
                    strokeDasharray: len,
                    strokeDashoffset: reducedMotion ? 0 : len,
                    transition:
                      reducedMotion || duration === 0
                        ? undefined
                        : `stroke-dashoffset ${duration}ms ${easing}`,
                  }}
                />
                <path
                  data-crack-draw
                  d={pl.d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeW}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-background"
                  style={{
                    opacity: micro ? 0.3 : 0.5,
                    strokeDasharray: len,
                    strokeDashoffset: reducedMotion ? 0 : len,
                    mixBlendMode: "screen",
                    transition:
                      reducedMotion || duration === 0
                        ? undefined
                        : `stroke-dashoffset ${duration}ms ${easing}`,
                  }}
                />
                <path
                  data-crack-draw
                  d={pl.d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={micro ? 0.45 : 0.95}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground"
                  style={{
                    opacity,
                    strokeDasharray: len,
                    strokeDashoffset: reducedMotion ? 0 : len,
                    transition:
                      reducedMotion || duration === 0
                        ? undefined
                        : `stroke-dashoffset ${duration}ms ${easing}`,
                  }}
                />
              </g>
            );
          })}
        </svg>
      )}
    </span>
  );
}
