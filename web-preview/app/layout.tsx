import {
  ThemeProvider,
  defaultThemaTheme,
  getGoogleFontHref,
  safeAdaptThemaTheme,
} from "@/ui/theme";
import { readGeneratedJson } from "@/utils/generatedPreview";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rawTheme: unknown = readGeneratedJson<unknown>("thema-answer.json") ?? defaultThemaTheme;
  const { theme, error } = safeAdaptThemaTheme(rawTheme);
  const googleFontHref = getGoogleFontHref(rawTheme);

  return (
    <html lang="ru">
      <head>
        {googleFontHref ? (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={googleFontHref} />
          </>
        ) : null}
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
