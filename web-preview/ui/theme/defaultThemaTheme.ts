import type { ThemaTheme } from "./themeSchema";

export const defaultThemaTheme: ThemaTheme = {
  colorPalette: {
    background: "0 0% 100%",
    textColors: {
      base: "222.2 84% 4.9%",
      muted: "215.4 16.3% 46.9%",
      faint: "215 20.2% 65.1%",
      accent: "221.2 83.2% 53.3%",
    },
    primary: "221.2 83.2% 53.3%",
    primaryHover: "221.2 83.2% 45%",
    primaryDisabled: "221.2 40% 72%",
    secondary: "210 40% 96.1%",
    secondaryHover: "210 35% 88%",
    secondaryDisabled: "210 20% 94%",
  },
  gradients: {
    primary: "linear-gradient(135deg, hsl(221.2 83.2% 53.3%), hsl(210 80% 58%))",
    secondary: "linear-gradient(135deg, hsl(210 40% 96.1%), hsl(210 28% 90%))",
  },
  link: {
    color: "221.2 83.2% 53.3%",
    hover: "221.2 83.2% 45%",
    visited: "256 50% 48%",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    heading: {
      h1: { fontSize: "3rem", fontWeight: "700" },
      h2: { fontSize: "2.25rem", fontWeight: "600" },
      h3: { fontSize: "1.5rem", fontWeight: "600" },
    },
    body: { fontSize: "1rem", fontWeight: "400" },
    button: { fontSize: "1rem", fontWeight: "500" },
  },
  spacing: {
    gap: "1rem",
    sectionPadding: "64px",
    containerWidth: "1200px",
    borderRadius: "0.5rem",
  },
  imageStyle: "светлые нейтральные фото людей и продукта",
};
