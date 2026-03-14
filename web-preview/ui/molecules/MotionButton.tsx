"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/ui/atoms/Button";
import { cn } from "@utils";
import type { MotionId, MotionButtonOptions } from "@/ui/motions";
import { motionAllowedOn, normalizeMotionId } from "@/ui/motions";
import { CrackOverlayButton } from "./CrackOverlayButton";

export interface MotionButtonProps extends ButtonProps {
  motion?: MotionId | string | null;
  motionOptions?: MotionButtonOptions;
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

function useRipple(reducedMotion: boolean) {
  const [ripples, setRipples] = React.useState<
    { x: number; y: number; id: number }[]
  >([]);
  const idRef = React.useRef(0);

  const add = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (reducedMotion || e.button !== 0) return;
      const t = e.currentTarget;
      const r = t.getBoundingClientRect();
      const id = ++idRef.current;
      setRipples((prev) => [
        ...prev,
        { x: e.clientX - r.left, y: e.clientY - r.top, id },
      ]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((x) => x.id !== id));
      }, 600);
    },
    [reducedMotion]
  );

  return { ripples, addRipple: add };
}

export function MotionButton({
  motion: motionRaw,
  motionOptions,
  className,
  onPointerDown,
  onPointerMove,
  onPointerLeave,
  style,
  ...buttonProps
}: MotionButtonProps) {
  const motion = normalizeMotionId(motionRaw ?? "none") as MotionId;
  const reduced = useReducedMotion();
  const magneticRef = React.useRef<HTMLSpanElement>(null);
  const [mag, setMag] = React.useState({ x: 0, y: 0 });

  if (motion === "crack" && motionAllowedOn("crack", "button")) {
    return (
      <CrackOverlayButton
        className={className}
        crackIntensity={motionOptions?.crackIntensity}
        crackDurationMs={motionOptions?.crackDurationMs}
        resetAfterMs={motionOptions?.resetAfterMs}
        style={style}
        {...buttonProps}
      />
    );
  }

  const { ripples, addRipple } = useRipple(reduced);

  const motionClass =
    motion === "press-scale"
      ? "active:scale-[0.97] transition-transform duration-100"
      : motion === "pulse-glow" && !reduced
        ? "motion-pulse-glow"
        : "";

  const showRipple =
    motion === "ripple" && !reduced && motionAllowedOn("ripple", "button");
  const borderBeam =
    motion === "border-beam" && !reduced && motionAllowedOn("border-beam", "button");
  const magnetic =
    motion === "magnetic-hover" && motionAllowedOn("magnetic-hover", "button");

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (showRipple) addRipple(e);
    onPointerDown?.(e);
  };

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (magnetic && magneticRef.current) {
      const r = magneticRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * 0.12;
      const dy = (e.clientY - cy) * 0.12;
      setMag({ x: dx, y: dy });
    }
    onPointerMove?.(e);
  };

  const handleLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    setMag({ x: 0, y: 0 });
    onPointerLeave?.(e);
  };

  return (
    <span
      ref={magneticRef}
      className={cn(
        "relative inline-flex overflow-hidden rounded-md",
        magnetic && "rounded-md"
      )}
    >
      <Button
        className={cn(
          "relative z-0 rounded-md",
          borderBeam && "motion-border-beam",
          motionClass,
          className
        )}
        style={{
          ...style,
          transform:
            magnetic && (mag.x !== 0 || mag.y !== 0)
              ? `translate(${mag.x}px, ${mag.y}px)`
              : style?.transform,
          transition: magnetic ? "transform 0.15s ease-out" : undefined,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={magnetic ? handleMove : onPointerMove}
        onPointerLeave={magnetic ? handleLeave : onPointerLeave}
        {...buttonProps}
      />
      {showRipple && (
        <span
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-md"
          aria-hidden
        >
          {ripples.map((rp) => (
            <span
              key={rp.id}
              className="motion-ripple-expand pointer-events-none absolute rounded-full bg-foreground/20"
              style={{
                left: rp.x,
                top: rp.y,
                width: 8,
                height: 8,
                marginLeft: -4,
                marginTop: -4,
              }}
            />
          ))}
        </span>
      )}
    </span>
  );
}
