import type { ThemaTheme } from "./themeSchema";

export const defaultThemaTheme: ThemaTheme = {
  colors: {
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",
    primary: "221.2 83.2% 53.3%",
    "primary-foreground": "210 40% 98%",
    secondary: "210 40% 96.1%",
    "secondary-foreground": "222.2 47.4% 11.2%",
    accent: "210 40% 96.1%",
    muted: "210 40% 96.1%",
    border: "214.3 31.8% 91.4%",
    ring: "221.2 83.2% 53.3%",
    destructive: "0 84.2% 60.2%",
    success: "142.1 70.6% 45.3%",
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
