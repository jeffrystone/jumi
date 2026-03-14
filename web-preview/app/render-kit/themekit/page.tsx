import { resolveFontAlias } from "@/ui/theme";
import { KitPage, KitSection } from "@/render-kit/components";
import { readThemeSettings } from "@/utils/themeSettings";

function hslColor(value: string): string {
  return `hsl(${value})`;
}

export default function RenderKitThemeKitPage() {
  const settings = readThemeSettings();

  return (
    <KitPage
      title="Render Kit: ThemeKit"
      subtitle="Каждая карточка использует палитру и пару шрифтов из theme_settings."
    >
      <KitSection
        title="Theme Options"
        description="Внутри каждой карточки: все текстовые цвета, размеры текста, фон, secondary-подложка и кнопки Buy."
      >
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {settings.map((theme) => {
            const headingFamily = `${resolveFontAlias(theme.fontHeading)}, system-ui, sans-serif`;
            const bodyFamily = `${resolveFontAlias(theme.fontBody)}, system-ui, sans-serif`;

            return (
              <article
                key={theme.pairType}
                className="rounded-xl border border-black/10 p-5 shadow-sm"
                style={{ backgroundColor: hslColor(theme.colorPalette.background) }}
              >
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: hslColor(theme.colorPalette.secondary) }}
                >
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: headingFamily,
                      color: hslColor(theme.colorPalette.textColors.base),
                      fontSize: "2rem",
                      fontWeight: 700,
                      lineHeight: 1.15,
                    }}
                  >
                    {theme.pairType}
                  </h3>

                  <p
                    style={{
                      fontFamily: bodyFamily,
                      color: hslColor(theme.colorPalette.textColors.base),
                      fontSize: "1rem",
                      lineHeight: 1.5,
                    }}
                  >
                    Base text: The quick brown fox jumps over the lazy dog.
                  </p>
                  <p
                    style={{
                      fontFamily: bodyFamily,
                      color: hslColor(theme.colorPalette.textColors.muted),
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                    }}
                  >
                    Muted text: secondary hierarchy for supporting content.
                  </p>
                  <p
                    style={{
                      fontFamily: bodyFamily,
                      color: hslColor(theme.colorPalette.textColors.faint),
                      fontSize: "0.85rem",
                      lineHeight: 1.4,
                    }}
                  >
                    Faint text: meta labels, notes and subtle details.
                  </p>
                  <p
                    style={{
                      fontFamily: bodyFamily,
                      color: hslColor(theme.colorPalette.textColors.accent),
                      fontSize: "1rem",
                      lineHeight: 1.45,
                      fontWeight: 600,
                    }}
                  >
                    Accent text: highlighted phrase for emphasis.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-md px-4 py-2 text-sm font-semibold"
                      style={{
                        backgroundColor: hslColor(theme.colorPalette.primary),
                        color: hslColor(theme.colorPalette.background),
                        fontFamily: bodyFamily,
                      }}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      className="rounded-md px-4 py-2 text-sm font-semibold"
                      style={{
                        backgroundColor: hslColor(theme.colorPalette.secondary),
                        color: hslColor(theme.colorPalette.textColors.base),
                        fontFamily: bodyFamily,
                        border: `1px solid ${hslColor(theme.colorPalette.primary)}`,
                      }}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </KitSection>
    </KitPage>
  );
}
