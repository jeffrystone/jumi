import { Graph, Vertex } from "./Graph.js";
import { AsciiGraphView } from "./AsciiGraphView.js";

describe("AsciiGraphView", () => {
  /**
   * Нормализует вывод asciitree: убирает лишние пробелы в конце строк,
   * приводит к единому переносу строк.
   */
  function normalize(s: string): string {
    return s
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n")
      .trim();
  }

  it("1: одна вершина без детей (лист)", () => {
    const root = new Vertex("A");
    const graph = new Graph(root);
    const view = new AsciiGraphView(graph);
    const out = view.render();

    console.log("Кейс 1 — одна вершина:\n" + out);

    expect(out).toContain("A");
    expect(normalize(out)).toBe("A");
  });

  it("2: корень с двумя детьми", () => {
    const root = new Vertex("root", [
      new Vertex("left"),
      new Vertex("right"),
    ]);
    const graph = new Graph(root);
    const view = new AsciiGraphView(graph);
    const out = view.render();

    console.log("Кейс 2 — корень с двумя детьми:\n" + out);

    expect(out).toContain("root");
    expect(out).toContain("left");
    expect(out).toContain("right");
    const normalized = normalize(out);
    expect(normalized).toMatch(/root/);
    expect(normalized).toMatch(/left/);
    expect(normalized).toMatch(/right/);
  });

  it("3: цепочка из трёх вершин (один ребёнок)", () => {
    const c = new Vertex("C");
    const b = new Vertex("B", [c]);
    const a = new Vertex("A", [b]);
    const graph = new Graph(a);
    const view = new AsciiGraphView(graph);
    const out = view.render();

    console.log("Кейс 3 — цепочка A -> B -> C:\n" + out);

    expect(out).toContain("A");
    expect(out).toContain("B");
    expect(out).toContain("C");
    expect(out.indexOf("A")).toBeLessThan(out.indexOf("B"));
    expect(out.indexOf("B")).toBeLessThan(out.indexOf("C"));
  });

  it("4: дерево из трёх уровней", () => {
    const root = new Vertex("1", [
      new Vertex("2", [new Vertex("4"), new Vertex("5")]),
      new Vertex("3"),
    ]);
    const graph = new Graph(root);
    const view = new AsciiGraphView(graph);
    const out = view.render();

    console.log("Кейс 4 — дерево (1: 2,3; 2: 4,5):\n" + out);

    expect(out).toContain("1");
    expect(out).toContain("2");
    expect(out).toContain("3");
    expect(out).toContain("4");
    expect(out).toContain("5");
    const normalized = normalize(out);
    expect(normalized).toMatch(/1/);
    expect(normalized).toMatch(/2/);
    expect(normalized).toMatch(/3/);
    expect(normalized).toMatch(/4/);
    expect(normalized).toMatch(/5/);
  });
});
