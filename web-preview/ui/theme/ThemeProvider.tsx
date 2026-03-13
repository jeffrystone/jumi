"use client";

import { useEffect } from "react";
import { buildThemeVarEntries } from "./themeAdapter";
import type { Theme } from "./themeSchema";
export type { Theme } from "./themeSchema";

export interface ThemeProviderProps {
  theme: Theme;
  children: React.ReactNode;
}

function setThemeVars(theme: Theme): void {
  const root = document.documentElement;
  buildThemeVarEntries(theme).forEach(({ key, value }) => {
    root.style.setProperty(`--${key}`, String(value));
  });
}

function removeThemeVars(theme: Theme): void {
  const root = document.documentElement;
  buildThemeVarEntries(theme).forEach(({ key }) => {
    root.style.removeProperty(`--${key}`);
  });
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    setThemeVars(theme);
    return () => removeThemeVars(theme);
  }, [theme]);

  return <>{children}</>;
}
