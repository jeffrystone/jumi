import { ThemeOptionPreviewCard, KitPage, KitSection } from "@/render-kit/components";
import { buildThemePreviewModels } from "@/render-kit/controllers/themekitController";

export default function RenderKitThemeKitPage() {
  const models = buildThemePreviewModels();

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
          {models.map((model) => (
            <ThemeOptionPreviewCard key={model.pairType} model={model} />
          ))}
        </div>
      </KitSection>
    </KitPage>
  );
}
