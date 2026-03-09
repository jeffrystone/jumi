import { Graph, Vertex } from "../../structures/Graph/Graph.js";

export interface SectionNode {
  kind: "section";
  id: string;
  name?: string;
  description?: string;
  version?: string;
  type?: string;
  layout?: string;
}

export interface AtomNode {
  kind: "atom";
  ref: string;
  type: string;
  semantics?: string;
  required?: boolean;
  col?: number;
  row?: number;
  colSpan?: number;
  rowSpan?: number;
}

export type TemplateNode = SectionNode | AtomNode;

interface AtomJson {
  ref: string;
  type: string;
  semantics?: string;
  required?: boolean;
  col?: number;
  row?: number;
  colSpan?: number;
  rowSpan?: number;
}

interface SectionJson {
  name?: string;
  description?: string;
  version?: string;
  type?: string;
  layout?: string;
  atoms?: AtomJson[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseAtom(atom: unknown): AtomNode {
  if (!isRecord(atom) || typeof atom.ref !== "string" || typeof atom.type !== "string") {
    throw new Error("Invalid atom: ref and type are required");
  }
  return {
    kind: "atom",
    ref: atom.ref,
    type: atom.type,
    semantics: typeof atom.semantics === "string" ? atom.semantics : undefined,
    required: typeof atom.required === "boolean" ? atom.required : undefined,
    col: typeof atom.col === "number" ? atom.col : undefined,
    row: typeof atom.row === "number" ? atom.row : undefined,
    colSpan: typeof atom.colSpan === "number" ? atom.colSpan : undefined,
    rowSpan: typeof atom.rowSpan === "number" ? atom.rowSpan : undefined,
  };
}

function parseSection(id: string, section: unknown): SectionNode {
  if (!isRecord(section)) {
    throw new Error("Section must be an object");
  }
  return {
    kind: "section",
    id,
    name: typeof section.name === "string" ? section.name : undefined,
    description: typeof section.description === "string" ? section.description : undefined,
    version: typeof section.version === "string" ? section.version : undefined,
    type: typeof section.type === "string" ? section.type : undefined,
    layout: typeof section.layout === "string" ? section.layout : undefined,
  };
}

export function parseTemplateToGraph(json: unknown): Graph<TemplateNode> {
  if (!isRecord(json)) {
    throw new Error("Template JSON must be an object");
  }

  const keys = Object.keys(json);
  if (keys.length === 0) {
    throw new Error("Template JSON must have at least one section");
  }

  const sectionId = keys[0];
  const sectionRaw = json[sectionId];
  const sectionNode = parseSection(sectionId, sectionRaw);

  const sectionRecord = sectionRaw as SectionJson;
  const atomsRaw = Array.isArray(sectionRecord.atoms) ? sectionRecord.atoms : [];
  const atomVertices: Vertex<TemplateNode>[] = atomsRaw.map((a) => {
    const node = parseAtom(a);
    return new Vertex(node, []);
  });

  const root = new Vertex(sectionNode as TemplateNode, atomVertices);
  return new Graph(root);
}
