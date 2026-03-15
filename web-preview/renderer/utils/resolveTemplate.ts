import type { TemplateData } from "../TemplateRenderer";
import { mergeTemplates } from "./mergeTemplates";

export type GetTemplate = (id: string) => TemplateData | undefined;

/**
 * Разрешает наследование: если у шаблона есть extends, подгружает родителя (рекурсивно),
 * мержит атомы по ref (дочерний перезаписывает), возвращает итоговый TemplateData без поля extends.
 */
export function resolveTemplate(
  data: TemplateData,
  getTemplate: GetTemplate,
  visited: Set<string> = new Set()
): TemplateData {
  const baseId = data.extends?.trim();
  if (!baseId) {
    const { extends: _, ...rest } = data;
    return rest;
  }
  if (visited.has(baseId)) {
    return data;
  }
  const base = getTemplate(baseId);
  if (!base) {
    const { extends: _, ...rest } = data;
    return rest;
  }
  visited.add(baseId);
  const resolvedBase = resolveTemplate(base, getTemplate, visited);
  const merged = mergeTemplates(resolvedBase, data);
  return resolveTemplate(merged, getTemplate, visited);
}
