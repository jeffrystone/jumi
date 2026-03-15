import type { TemplateData, TemplateAtom } from "../TemplateRenderer";

/**
 * Сливает дочерний шаблон с базовым: атомы с совпадающим ref заменяются на дочерние,
 * остальные остаются из базы; атомы дочернего с новым ref добавляются в конец.
 * layout берётся из child, если задан, иначе из base.
 */
export function mergeTemplates(base: TemplateData, child: TemplateData): TemplateData {
  const baseRefs = new Set(base.atoms.map((a) => a.ref));
  const overrides = new Map<string, TemplateAtom>();
  for (const a of child.atoms) {
    overrides.set(a.ref, a);
  }
  const mergedAtoms: TemplateAtom[] = base.atoms.map((a) => overrides.get(a.ref) ?? a);
  for (const a of child.atoms) {
    if (!baseRefs.has(a.ref)) {
      mergedAtoms.push(a);
    }
  }
  return {
    layout: child.layout ?? base.layout,
    padding: child.padding ?? base.padding,
    atoms: mergedAtoms,
  };
}
