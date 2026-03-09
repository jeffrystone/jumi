"use client";

import { useEffect } from "react";

type ThemePrimitive = string | number;
type ThemeCategory = Record<string, ThemePrimitive>;
export type Theme = Record<string, ThemePrimitive | ThemeCategory>;

export interface ThemeProviderProps {
  theme: Theme;
  children: React.ReactNode;
}

function setThemeVars(theme: Theme): void {
  const root = document.documentElement;

  Object.entries(theme).forEach(([category, values]) => {
    if (values !== null && typeof values === "object") {
      Object.entries(values).forEach(([key, value]) => {
        root.style.setProperty(`--${category}-${key}`, String(value));
      });
      return;
    }
    root.style.setProperty(`--${category}`, String(values));
  });
}

function removeThemeVars(theme: Theme): void {
  const root = document.documentElement;

  Object.entries(theme).forEach(([category, values]) => {
    if (values !== null && typeof values === "object") {
      Object.keys(values).forEach((key) => {
        root.style.removeProperty(`--${category}-${key}`);
      });
      return;
    }
    root.style.removeProperty(`--${category}`);
  });
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    setThemeVars(theme);
    return () => removeThemeVars(theme);
  }, [theme]);

  return <>{children}</>;
}
