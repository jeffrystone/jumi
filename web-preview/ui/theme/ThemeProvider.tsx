"use client";

import { useEffect, useRef } from "react";
import { buildThemeVarEntries } from "./themeAdapter";
import type { Theme } from "./themeSchema";
export type { Theme } from "./themeSchema";

export interface ThemeProviderProps {
  theme: Theme;
  children: React.ReactNode;
  /** CSS-переменные только на обёртке (не на document); для сетки независимых превью */
  scoped?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function setThemeVarsOn(el: HTMLElement, theme: Theme): void {
  buildThemeVarEntries(theme).forEach(({ key, value }) => {
    el.style.setProperty(`--${key}`, String(value));
  });
}

function removeThemeVarsFrom(el: HTMLElement, theme: Theme): void {
  buildThemeVarEntries(theme).forEach(({ key }) => {
    el.style.removeProperty(`--${key}`);
  });
}

function setThemeVarsRoot(theme: Theme): void {
  setThemeVarsOn(document.documentElement, theme);
}

function removeThemeVarsRoot(theme: Theme): void {
  removeThemeVarsFrom(document.documentElement, theme);
}

export function ThemeProvider({
  theme,
  children,
  scoped = false,
  className,
  style,
}: ThemeProviderProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scoped) {
      const el = scopeRef.current;
      if (!el) {
        return;
      }
      setThemeVarsOn(el, theme);
      return () => removeThemeVarsFrom(el, theme);
    }
    setThemeVarsRoot(theme);
    return () => removeThemeVarsRoot(theme);
  }, [theme, scoped]);

  if (scoped) {
    return (
      <div ref={scopeRef} className={className} style={style}>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
