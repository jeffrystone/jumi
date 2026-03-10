import { AsciiGraphView, Graph, Vertex } from "./index.js";

function main(): void {
  const child1 = new Vertex("ребёнок 1");
  const child2 = new Vertex("ребёнок 2");
  const root = new Vertex("корень", [child1, child2]);
  const graph = new Graph(root);

  const view = new AsciiGraphView(graph);
  console.log("Граф:");
  view.print();
}

main();
