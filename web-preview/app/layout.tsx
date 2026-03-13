import { ThemeProvider, defaultThemaTheme, safeAdaptThemaTheme } from "@/ui/theme";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rawTheme: unknown = defaultThemaTheme;
  const { theme, error } = safeAdaptThemaTheme(rawTheme);

  return (
    <html lang="ru">
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
