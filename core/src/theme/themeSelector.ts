import fs from "node:fs";
import path from "node:path";

export interface ThemeCandidate {
  pairType: string;
  sectors: string[];
  tone: string[];
  audienceType: string[];
}

export interface HrThemeProfile {
  sectors?: string[] | string;
  tone?: string[] | string;
  audienceType?: string[] | string;
}

export interface RankedTheme {
  pairType: string;
  score: number;
  reasons: string[];
}

export interface ThemeSelectionResult {
  bestTheme: ThemeCandidate;
  score: number;
  reasons: string[];
  topMatches: RankedTheme[];
}

interface ThemeSettingsPayload {
  data?: ThemeCandidate[];
}

const WEIGHTS = {
  sectors: 0.45,
  tone: 0.35,
  audienceType: 0.2,
} as const;

function toList(input: string[] | string | undefined): string[] {
  if (!input) {
    return [];
  }
  if (Array.isArray(input)) {
    return input.map((v) => v.trim()).filter(Boolean);
  }
  return input
    .split(/[;,|]/g)
    .map((v) => v.trim())
    .filter(Boolean);
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function overlapScore(expected: string[], actual: string[]): number {
  if (expected.length === 0 || actual.length === 0) {
    return 0;
  }

  const expectedNorm = expected.map(normalize);
  const actualNorm = actual.map(normalize);

  let matches = 0;
  expectedNorm.forEach((exp) => {
    const found = actualNorm.some((act) => act.includes(exp) || exp.includes(act));
    if (found) {
      matches += 1;
    }
  });

  return matches / expectedNorm.length;
}

function scoreTheme(profile: Required<HrThemeProfile>, theme: ThemeCandidate): RankedTheme {
  const reasons: string[] = [];
  const sectors = overlapScore(profile.sectors, theme.sectors);
  const tone = overlapScore(profile.tone, theme.tone);
  const audienceType = overlapScore(profile.audienceType, theme.audienceType);

  if (sectors > 0) reasons.push(`sectors: ${Math.round(sectors * 100)}%`);
  if (tone > 0) reasons.push(`tone: ${Math.round(tone * 100)}%`);
  if (audienceType > 0) reasons.push(`audienceType: ${Math.round(audienceType * 100)}%`);

  const score =
    sectors * WEIGHTS.sectors + tone * WEIGHTS.tone + audienceType * WEIGHTS.audienceType;

  return {
    pairType: theme.pairType,
    score: Number(score.toFixed(4)),
    reasons: reasons.length > 0 ? reasons : ["no direct matches"],
  };
}

function normalizeProfile(profile: HrThemeProfile): Required<HrThemeProfile> {
  return {
    sectors: toList(profile.sectors),
    tone: toList(profile.tone),
    audienceType: toList(profile.audienceType),
  };
}

export function readThemeCandidates(): ThemeCandidate[] {
  const filePath = path.resolve(process.cwd(), "src", "knowledges", "theme_settings.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw) as ThemeSettingsPayload;
  return Array.isArray(parsed.data) ? parsed.data : [];
}

export function rankThemes(
  profile: HrThemeProfile,
  candidates: ThemeCandidate[] = readThemeCandidates()
): RankedTheme[] {
  const normalized = normalizeProfile(profile);

  return candidates
    .map((theme) => scoreTheme(normalized, theme))
    .sort((a, b) => b.score - a.score || a.pairType.localeCompare(b.pairType));
}

export function selectBestTheme(
  profile: HrThemeProfile,
  candidates: ThemeCandidate[] = readThemeCandidates()
): ThemeSelectionResult {
  if (candidates.length === 0) {
    throw new Error("No theme candidates available");
  }

  const ranked = rankThemes(profile, candidates);
  const best = ranked[0];
  if (!best) {
    throw new Error("Unable to rank theme candidates");
  }

  const bestTheme = candidates.find((theme) => theme.pairType === best.pairType) ?? candidates[0];

  return {
    bestTheme,
    score: best.score,
    reasons: best.reasons,
    topMatches: ranked.slice(0, 3),
  };
}
