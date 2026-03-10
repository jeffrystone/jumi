declare module "asciitree" {
  export default function drawTree(
    tree: unknown,
    getTitle?: (node: unknown) => string,
    getChildren?: (node: unknown) => unknown[] | null
  ): string;
}
