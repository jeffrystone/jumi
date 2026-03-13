function tryParseObject(raw: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

function extractFromFencedBlocks(text: string): string[] {
  const candidates: string[] = [];
  const fenceRegex = /```[^\n]*\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(text)) !== null) {
    const body = match[1]?.trim();
    if (body) {
      candidates.push(body);
    }
  }

  return candidates;
}

function extractBalancedJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start < 0) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }
      if (ch === "\\") {
        isEscaped = true;
        continue;
      }
      if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") {
      depth += 1;
      continue;
    }
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

export function parseJsonFromText(text: string): Record<string, unknown> | null {
  const direct = tryParseObject(text.trim());
  if (direct) {
    return direct;
  }

  const fencedCandidates = extractFromFencedBlocks(text);
  for (const candidate of fencedCandidates) {
    const parsed = tryParseObject(candidate);
    if (parsed) {
      return parsed;
    }
  }

  const balancedObject = extractBalancedJsonObject(text);
  if (balancedObject) {
    return tryParseObject(balancedObject);
  }

  return null;
}
