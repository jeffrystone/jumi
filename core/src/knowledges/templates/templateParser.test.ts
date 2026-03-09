import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Graph, Vertex } from "../../structures/Graph/Graph.js";
import { AsciiGraphView } from "../../structures/Graph/AsciiGraphView.js";
import type { TemplateNode } from "./templateParser.js";
import { parseTemplateToGraph } from "./templateParser.js";

function templateNodeToLabel(node: TemplateNode): string {
  return node.kind === "section" ? node.id : node.ref;
}

function toDisplayGraph(
  vertex: Vertex<TemplateNode>
): Vertex<string> {
  const label = templateNodeToLabel(vertex.label as TemplateNode);
  const children = vertex.children.map(toDisplayGraph);
  return new Vertex(label, children);
}

describe("templateParser", () => {
  describe("parseTemplateToGraph", () => {
    it("парсит template1.json в дерево: секция → атомы", () => {
      const raw = readFileSync(
        join(process.cwd(), "src", "knowledges", "templates", "template1.json"),
        "utf-8"
      );
      const json = JSON.parse(raw) as unknown;
      const graph = parseTemplateToGraph(json);

      const displayGraph = new Graph(toDisplayGraph(graph.root));
      const view = new AsciiGraphView(displayGraph);
      console.log("Визуализация шаблона template1.json:");
      view.print();

      const root = graph.root;
      const rootNode = root.label as TemplateNode;

      expect(rootNode).toMatchObject({ kind: "section", id: "hero-split-4x4" });
      expect(rootNode.kind).toBe("section");
      if (rootNode.kind === "section") {
        expect(rootNode.name).toBe("Hero с сеткой 4×4 (две части)");
        expect(rootNode.type).toBe("section.hero");
        expect(rootNode.layout).toBe("grid-4x4");
      }

      expect(root.children).toHaveLength(4);

      const refs = root.children.map((v) => {
        const n = v.label as TemplateNode;
        return n.kind === "atom" ? n.ref : "";
      });
      expect(refs).toEqual(["title", "subtitle", "cta", "image"]);

      const titleAtom = root.children[0].label as TemplateNode;
      expect(titleAtom).toMatchObject({
        kind: "atom",
        ref: "title",
        type: "atom.heading",
        semantics: "Главный заголовок",
        required: true,
        col: 1,
        row: 1,
        colSpan: 2,
        rowSpan: 1,
      });

      const imageAtom = root.children[3].label as TemplateNode;
      expect(imageAtom).toMatchObject({
        kind: "atom",
        ref: "image",
        type: "atom.image",
        col: 3,
        row: 1,
        colSpan: 2,
        rowSpan: 3,
      });

      root.children.forEach((child) => {
        expect(child.children).toHaveLength(0);
      });
    });
  });
});
