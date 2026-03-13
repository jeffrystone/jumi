import { ThemeProvider, adaptThemaTheme, defaultThemaTheme } from "@/ui/theme";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = adaptThemaTheme(defaultThemaTheme);

  return (
    <html lang="ru">
      <body>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
