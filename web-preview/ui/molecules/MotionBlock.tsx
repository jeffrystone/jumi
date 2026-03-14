"use client";

import * as React from "react";
import { cn } from "@utils";
import type { MotionId, MotionBlockOptions } from "@/ui/motions";
import { motionAllowedOn, normalizeMotionId } from "@/ui/motions";

export interface MotionBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  motion?: MotionId | string | null;
  motionOptions?: MotionBlockOptions;
  burst?: boolean;
  children: React.ReactNode;
}

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const u = () => setReduced(mq.matches);
    u();
    mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);
  return reduced;
}

export function MotionBlock({
  motion: motionRaw,
  motionOptions,
  burst = false,
  className,
  children,
  ...rest
}: MotionBlockProps) {
  const motion = normalizeMotionId(motionRaw ?? "none") as MotionId;
  const reduced = useReducedMotion();
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [, setParticlesDone] = React.useState(false);

  const dur = motionOptions?.burstDurationMs ?? 650;
  const particleCount = motionOptions?.particleCount ?? 80;
  const arrayChildren = React.Children.toArray(children).filter(Boolean);

  const isParticle =
    motion === "particle-surface" && motionAllowedOn("particle-surface", "block");

  React.useEffect(() => {
    if (!isParticle || !burst || reduced) return;
    setParticlesDone(false);
    const el = wrapRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;
    const raf = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const w = Math.max(1, Math.floor(r.width));
      const h = Math.max(1, Math.floor(r.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor || "rgba(100,100,100,0.8)";
      const parts: { x: number; y: number; vx: number; vy: number; s: number; a: number }[] =
        [];
      for (let i = 0; i < particleCount; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8 - 2,
          s: 2 + Math.random() * 4,
          a: 1,
        });
      }
      let frame = 0;
      const maxFrames = 48;
      const tick = () => {
        frame++;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = bg;
        for (const p of parts) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15;
          p.a *= 0.96;
          ctx.globalAlpha = Math.max(0, p.a);
          ctx.fillRect(p.x, p.y, p.s, p.s);
        }
        ctx.globalAlpha = 1;
        if (frame < maxFrames) requestAnimationFrame(tick);
        else setParticlesDone(true);
      };
      requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [isParticle, burst, reduced, particleCount]);

  if (motion === "stagger-children" && motionAllowedOn("stagger-children", "block")) {
    return (
      <div className={cn(className)} {...rest}>
        {arrayChildren.map((child, i) => (
          <div
            key={i}
            style={{
              animation: reduced
                ? undefined
                : `motion-stagger-in 0.45s ease-out ${i * 0.06}s both`,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }

  if (motion === "logical-burst" && motionAllowedOn("logical-burst", "block")) {
    return (
      <div className={cn("relative", className)} {...rest}>
        {arrayChildren.map((child, i) => {
          const bx = (Math.sin(i * 12.9898) * 43758.5453) % 1 * 100 - 50;
          const by = (Math.cos(i * 78.233) * 12345.67) % 1 * 100 - 50;
          const br = ((i * 17) % 60) - 30;
          return (
            <div
              key={i}
              className={cn(burst && !reduced && "motion-logical-burst-item")}
              style={
                burst
                  ? ({
                      ["--bx" as string]: `${bx}px`,
                      ["--by" as string]: `${by}px`,
                      ["--br" as string]: `${br}deg`,
                      ["--bdur" as string]: `${dur}ms`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }

  if (isParticle) {
    return (
      <div
        ref={wrapRef}
        className={cn("relative overflow-hidden", className)}
        {...rest}
      >
        <div
          className={cn(
            "transition-opacity duration-300",
            burst && !reduced && "pointer-events-none opacity-0"
          )}
          aria-hidden={burst && !reduced}
        >
          {children}
        </div>
        {burst && !reduced && (
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-10"
            aria-hidden
          />
        )}
      </div>
    );
  }

  if (motion === "shimmer" && !reduced && motionAllowedOn("shimmer", "block")) {
    return (
      <div className={cn("relative overflow-hidden rounded-[inherit]", className)} {...rest}>
        <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[motion-shimmer-slide_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        {children}
      </div>
    );
  }

  return (
    <div className={cn(className)} {...rest}>
      {children}
    </div>
  );
}
