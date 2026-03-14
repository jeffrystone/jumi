import { KitPage, KitSection, ThemeKitSlider } from "@/render-kit/components";
import { buildThemePreviewModels } from "@/render-kit/controllers/themekitController";

export default function RenderKitThemeKitSliderPage() {
  const models = buildThemePreviewModels();

  return (
    <KitPage
      title="Render Kit: ThemeKit Slider"
      subtitle="Слайдер тем: inline и atoms preview для одной темы за раз."
    >
      <KitSection
        title="Theme Slider"
        description="Начинаем с первой темы, переключение стрелками слева и справа."
      >
        <ThemeKitSlider models={models} />
      </KitSection>
    </KitPage>
  );
}
