import { ThemeProvider } from "@/ui/theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = {
    colors: {
      primary: "#111111",
      "primary-foreground": "#ffffff",
      "muted-foreground": "#6b7280",
    },
    "section-padding": "64px",
    "container-width": "1200px",
    gap: "16px",
  };

  return (
    <html lang="ru">
      <body>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
