import {
  ThemeProvider,
  defaultThemaTheme,
  resolveThemeFontFamily,
  safeAdaptThemaTheme,
} from "@/ui/theme";
import { readGeneratedJson } from "@/utils/generatedPreview";
import { GoogleFontsLinks } from "./GoogleFontsLinks";
import "./globals.css";

function withResolvedFontFamily(rawTheme: unknown): unknown {
  const resolvedFontFamily = resolveThemeFontFamily(rawTheme);
  if (!resolvedFontFamily || rawTheme === null || typeof rawTheme !== "object") {
    return rawTheme;
  }

  const themeObject = rawTheme as Record<string, unknown>;
  const typography =
    themeObject.typography && typeof themeObject.typography === "object"
      ? (themeObject.typography as Record<string, unknown>)
      : {};

  return {
    ...themeObject,
    typography: {
      ...typography,
      fontFamily: resolvedFontFamily,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rawTheme: unknown =
    withResolvedFontFamily(readGeneratedJson<unknown>("thema-answer.json") ?? defaultThemaTheme);
  const { theme, error } = safeAdaptThemaTheme(rawTheme);

  return (
    <html lang="ru">
      <head>
        <GoogleFontsLinks />
      </head>
      <body>
        {error ? (
          <main
            style={{
              minHeight: "100vh",
              display: "grid",
              placeItems: "center",
              padding: "24px",
              background: "#19090b",
              color: "#ffb4bb",
              fontFamily: "monospace",
            }}
          >
            <section
              style={{
                width: "100%",
                maxWidth: "920px",
                border: "1px solid #b42318",
                borderRadius: "8px",
                padding: "16px",
                background: "#2e0b10",
              }}
            >
              <h1 style={{ margin: "0 0 8px", fontSize: "1rem", color: "#ff8a95" }}>
                ОШИБКА парсинга темы
              </h1>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{error}</pre>
            </section>
          </main>
        ) : theme ? (
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        ) : null}
      </body>
    </html>
  );
}
