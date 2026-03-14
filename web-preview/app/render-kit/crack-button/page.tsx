import { CrackOverlayButton } from "@/ui/molecules/CrackOverlayButton";

export default function CrackButtonDemoPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "24px" }}>
      <header
        style={{
          marginBottom: "28px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--color-border, #e5e5e5)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.35rem" }}>CrackOverlayButton — демо</h1>
        <p
          style={{
            margin: "10px 0 0",
            fontSize: "14px",
            color: "var(--color-text-muted, #666)",
            maxWidth: "52rem",
            lineHeight: 1.5,
          }}
        >
          Клик — трещина от точки нажатия;{" "}
          <kbd style={{ padding: "2px 6px", borderRadius: 4, background: "var(--color-secondary, #f0f0f0)" }}>
            Enter
          </kbd>{" "}
          /{" "}
          <kbd style={{ padding: "2px 6px", borderRadius: 4, background: "var(--color-secondary, #f0f0f0)" }}>
            Space
          </kbd>{" "}
          — от центра. При <code>prefers-reduced-motion: reduce</code> анимация штриха отключена (трещина
          сразу целиком). Параметры: <code>crackIntensity</code>, <code>crackDurationMs</code>,{" "}
          <code>resetAfterMs</code> (или <code>null</code> — до следующего клика).
        </p>
      </header>

      <section style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "12px", marginBottom: "8px", color: "var(--color-text-muted)" }}>
            default · normal · reset 2.8s
          </div>
          <CrackOverlayButton variant="default">Кликни — трещина</CrackOverlayButton>
        </div>

        <div>
          <div style={{ fontSize: "12px", marginBottom: "8px", color: "var(--color-text-muted)" }}>
            outline · subtle · быстрее линия
          </div>
          <CrackOverlayButton
            variant="outline"
            crackIntensity="subtle"
            crackDurationMs={200}
            resetAfterMs={4000}
          >
            Subtle
          </CrackOverlayButton>
        </div>

        <div>
          <div style={{ fontSize: "12px", marginBottom: "8px", color: "var(--color-text-muted)" }}>
            secondary · heavy · долгая анимация
          </div>
          <CrackOverlayButton
            variant="secondary"
            crackIntensity="heavy"
            crackDurationMs={320}
            resetAfterMs={5000}
          >
            Heavy
          </CrackOverlayButton>
        </div>

        <div>
          <div style={{ fontSize: "12px", marginBottom: "8px", color: "var(--color-text-muted)" }}>
            resetAfterMs=null — трещина остаётся
          </div>
          <CrackOverlayButton variant="blank" resetAfterMs={null} crackIntensity="normal">
            Без сброса
          </CrackOverlayButton>
        </div>
      </section>
    </main>
  );
}
