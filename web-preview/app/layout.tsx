import { ThemeProvider } from "@/ui/theme";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = {
    primary: "221.2 83.2% 53.3%",
    "primary-foreground": "210 40% 98%",
    "muted-foreground": "215.4 16.3% 46.9%",
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
