import { TemplateAtomPreviewGrid } from "@/render-kit/components/TemplateAtomPreviewGrid";
import { buildThemePreviewModels } from "@/render-kit/controllers/themekitController";
import { getHero1VariantPairs } from "@/render-kit/models/templatePairMapper";

export default function TemplateAtomPreviewPage() {
  const models = buildThemePreviewModels();
  const hero1Pairs = getHero1VariantPairs();

  return (
    <main style={{ minHeight: "100vh" }}>
      <header style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)" }}>
        <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Atom preview — связки шаблонов</h1>
        <p style={{ margin: "8px 0 0", fontSize: "14px", color: "var(--color-text-muted)" }}>
          Темы из <code>theme_settings.json</code>. Ниже — только варианты hero1 (базовый + hero1A с
          наследованием по <code>extends</code>).
        </p>
      </header>
      <TemplateAtomPreviewGrid models={models} pairs={hero1Pairs} />
    </main>
  );
}
