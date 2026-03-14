import { FontSpecimenCard, KitPage, KitSection } from "@/render-kit/components";
import { FONT_SPECIMENS } from "@/render-kit/specs/fonts";

export default function RenderKitFontsPage() {
  return (
    <KitPage
      title="Render Kit: Fonts"
      subtitle="Демо всех подключенных локальных шрифтов: одинаковый текст, разные размеры и веса."
    >
      <KitSection
        title="Font Specimens"
        description="Структура data-driven: для добавления нового сценария достаточно расширить specs."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FONT_SPECIMENS.map((specimen) => (
            <FontSpecimenCard key={specimen.id} specimen={specimen} />
          ))}
        </div>
      </KitSection>
    </KitPage>
  );
}
