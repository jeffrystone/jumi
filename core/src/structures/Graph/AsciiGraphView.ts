import type { Graph, Vertex } from "./Graph.js";

import drawTree from "asciitree";

/**
 * Визуальное представление графа в виде ASCII-дерева (пакет asciitree).
 */
export class AsciiGraphView<T = string> {
  constructor(private readonly graph: Graph<T>) {}

  /**
   * Преобразует вершину в формат для asciitree: [метка, ...дети].
   */
  private vertexToArray(vertex: Vertex<T>): [string, ...unknown[]] {
    const label = String(vertex.label);
    if (vertex.children.length === 0) {
      return [label];
    }
    const children = vertex.children.map((child) => this.vertexToArray(child));
    return [label, ...children];
  }

  /**
   * Возвращает строку с ASCII-деревом графа.
   */
  render(): string {
    const tree = this.vertexToArray(this.graph.root);
    return drawTree(tree);
  }

  /**
   * Выводит граф в консоль.
   */
  print(): void {
    console.log(this.render());
  }
}
