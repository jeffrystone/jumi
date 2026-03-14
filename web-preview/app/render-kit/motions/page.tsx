"use client";

import * as React from "react";
import { MotionButton } from "@/ui/molecules/MotionButton";
import { MotionBlock } from "@/ui/molecules/MotionBlock";
import { MOTION_CATALOG, motionsForTarget } from "@/ui/motions";

export default function MotionsDemoPage() {
  const [burst, setBurst] = React.useState(false);
  const [particleBurst, setParticleBurst] = React.useState(false);

  return (
    <main style={{ minHeight: "100vh", padding: "24px" }}>
      <header
        style={{
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--color-border, #e5e5e5)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.35rem" }}>Motions — пресеты и маппинг</h1>
        <p
          style={{
            margin: "10px 0 0",
            fontSize: "14px",
            color: "var(--color-text-muted, #666)",
            maxWidth: "48rem",
            lineHeight: 1.5,
          }}
        >
          <code>MotionButton motion=&quot;…&quot;</code> — строка из темы. Реестр:{" "}
          <code>ui/motions/registry.ts</code>, каталог средств: <code>ui/motions/catalog.md</code>.
        </p>
      </header>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "12px" }}>Кнопки (MotionButton)</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <MotionButton motion="none" variant="outline">
            none
          </MotionButton>
          <MotionButton motion="crack" variant="default">
            crack
          </MotionButton>
          <MotionButton motion="ripple" variant="secondary">
            ripple
          </MotionButton>
          <MotionButton motion="pulse-glow" variant="default">
            pulse-glow
          </MotionButton>
          <MotionButton motion="press-scale" variant="outline">
            press-scale
          </MotionButton>
          <MotionButton motion="border-beam" variant="outline">
            border-beam
          </MotionButton>
          <MotionButton motion="magnetic-hover" variant="blank">
            magnetic
          </MotionButton>
        </div>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "12px" }}>Блок: stagger-children</h2>
        <MotionBlock motion="stagger-children" className="flex flex-col gap-2">
          <div className="rounded border border-secondary bg-secondary/40 px-3 py-2">Строка 1</div>
          <div className="rounded border border-secondary bg-secondary/40 px-3 py-2">Строка 2</div>
          <div className="rounded border border-secondary bg-secondary/40 px-3 py-2">Строка 3</div>
        </MotionBlock>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "12px" }}>Блок: logical-burst (прямые дети)</h2>
        <button
          type="button"
          className="mb-2 rounded border border-primary px-3 py-1 text-sm"
          onClick={() => setBurst((b) => !b)}
        >
          burst: {burst ? "on" : "off"}
        </button>
        <MotionBlock motion="logical-burst" burst={burst} className="flex gap-3 rounded-lg border p-4">
          <div className="rounded bg-primary px-4 py-3 text-background">A</div>
          <div className="rounded bg-secondary px-4 py-3">B</div>
          <div className="rounded border border-primary px-4 py-3">C</div>
        </MotionBlock>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "12px" }}>Блок: particle-surface (canvas MVP)</h2>
        <button
          type="button"
          className="mb-2 rounded border border-primary px-3 py-1 text-sm"
          onClick={() => setParticleBurst((b) => !b)}
        >
          burst: {particleBurst ? "on" : "off"}
        </button>
        <MotionBlock
          motion="particle-surface"
          burst={particleBurst}
          className="min-h-[100px] rounded-xl bg-secondary p-6"
          motionOptions={{ particleCount: 100 }}
        >
          <p className="m-0 font-medium">Контент скрывается, частицы — цвет фона блока. Пиксельный снимок детей — см. catalog.md (html2canvas).</p>
        </MotionBlock>
      </section>

      <section>
        <h2 style={{ fontSize: "1rem", marginBottom: "8px" }}>Таблица пресетов → цели</h2>
        <div style={{ overflowX: "auto", fontSize: "13px" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: "56rem" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
                <th style={{ padding: "8px" }}>id</th>
                <th style={{ padding: "8px" }}>targets</th>
                <th style={{ padding: "8px" }}>implementation</th>
              </tr>
            </thead>
            <tbody>
              {MOTION_CATALOG.filter((m) => m.id !== "none").map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px", fontFamily: "monospace" }}>{m.id}</td>
                  <td style={{ padding: "8px" }}>{m.targets.join(", ")}</td>
                  <td style={{ padding: "8px" }}>{m.implementation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "12px" }}>
          Для target <code>button</code>: {motionsForTarget("button").map((x) => x.id).join(", ")}
        </p>
      </section>
    </main>
  );
}
