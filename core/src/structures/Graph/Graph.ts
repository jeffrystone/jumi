/**
 * Вершина графа с меткой и списком дочерних вершин.
 */
export class Vertex<T = string> {
  constructor(
    public readonly label: T,
    public readonly children: Vertex<T>[] = []
  ) {}

  addChild(child: Vertex<T>): Vertex<T> {
    return new Vertex(this.label, [...this.children, child]);
  }

  isLeaf(): boolean {
    return this.children.length === 0;
  }
}

/**
 * Граф как дерево с одной корневой вершиной.
 */
export class Graph<T = string> {
  constructor(public readonly root: Vertex<T>) {}

  static fromRoot<T>(root: Vertex<T>): Graph<T> {
    return new Graph(root);
  }
}
