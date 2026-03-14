import { TemplateAtomPreviewGrid } from "@/render-kit/components/TemplateAtomPreviewGrid";
import { buildThemePreviewModels } from "@/render-kit/controllers/themekitController";

export default function TemplateAtomPreviewPage() {
  const models = buildThemePreviewModels();

  return (
    <main style={{ minHeight: "100vh" }}>
      <header style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)" }}>
        <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Atom preview — связки шаблонов</h1>
        <p style={{ margin: "8px 0 0", fontSize: "14px", color: "var(--color-text-muted)" }}>
          Темы как в themekit-slider: из <code>theme_settings.json</code> → переключатель сверху.
          В каждой ячейке — инжект через <code>buildScopedThemeVars</code> (цвета, градиент фона, шрифты).
          Сверху сетки — образцы <code>templateA</code> и <code>templateB</code> (<code>templates/samples/</code>).
          Ниже — пары navbar↔hero (<code>templatePairMapper</code>).
        </p>
      </header>
      <TemplateAtomPreviewGrid models={models} />
    </main>
  );
}
