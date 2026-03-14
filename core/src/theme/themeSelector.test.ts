import {
  rankThemes,
  selectBestTheme,
  type HrThemeProfile,
  type ThemeCandidate,
} from "./themeSelector.js";

const candidates: ThemeCandidate[] = [
  {
    pairType: "Современный корпоративный",
    sectors: ["Корпоративные сайты", "SaaS", "Digital-агентства", "B2B"],
    tone: ["экспертный", "профессиональный", "уверенный"],
    audienceType: ["B2B", "B2C"],
  },
  {
    pairType: "Тёплый и уютный",
    sectors: ["Лайфстайл-блоги", "Кафе", "Детские проекты"],
    tone: ["дружеский", "уютный", "заботливый"],
    audienceType: ["B2C"],
  },
  {
    pairType: "Футуристичный технологичный",
    sectors: ["AI-стартапы", "Инновационные технологии", "Робототехника"],
    tone: ["футуристичный", "смелый", "инновационный"],
    audienceType: ["B2B", "B2C"],
  },
  {
    pairType: "Классическая элегантность",
    sectors: ["Люксовые бренды", "Бутики", "Fashion-лендинги"],
    tone: ["элегантный", "премиальный", "утонченный"],
    audienceType: ["B2C"],
  },
  {
    pairType: "Лабораторная точность (Pharma Serif)",
    sectors: ["Медицинские сервисы", "Фармацевтика", "Спортивное питание"],
    tone: ["экспертный", "доверительный", "научный"],
    audienceType: ["B2B", "B2C"],
  },
  {
    pairType: "Дерзкий максимализм",
    sectors: ["Спортивные бренды", "Фестивали", "Молодёжные проекты"],
    tone: ["дерзкий", "энергичный", "смелый"],
    audienceType: ["B2C"],
  },
  {
    pairType: "Романтичный акцент",
    sectors: ["Свадебные агентства", "Бутики", "Beauty-бренды", "Флористика"],
    tone: ["романтичный", "нежный", "заботливый"],
    audienceType: ["B2C"],
  },
  {
    pairType: "Авторитетная классика",
    sectors: ["Издания", "Культурные институции", "Премиальные бренды с историей"],
    tone: ["авторитетный", "классический", "доверительный"],
    audienceType: ["B2B", "B2C"],
  },
  {
    pairType: "Обложка журнала (Cover Story)",
    sectors: ["Fashion-лендинги", "Бьюти-бренды", "Lifestyle-проекты", "Премиум-товары"],
    tone: ["гламурный", "премиальный", "стильный"],
    audienceType: ["B2C"],
  },
];

describe("themeSelector", () => {
  it.each([
    {
      caseName: "B2B SaaS expert profile",
      profile: {
        sectors: ["SaaS", "B2B"],
        tone: ["экспертный", "профессиональный"],
        audienceType: ["B2B"],
      } satisfies HrThemeProfile,
      expected: "Современный корпоративный",
    },
    {
      caseName: "AI startup innovation profile",
      profile: {
        sectors: ["AI-стартапы", "Робототехника"],
        tone: ["инновационный", "футуристичный"],
        audienceType: ["B2C"],
      } satisfies HrThemeProfile,
      expected: "Футуристичный технологичный",
    },
    {
      caseName: "Lifestyle cozy B2C profile",
      profile: {
        sectors: ["Кафе", "Лайфстайл-блоги"],
        tone: ["уютный", "дружеский"],
        audienceType: ["B2C"],
      } satisfies HrThemeProfile,
      expected: "Тёплый и уютный",
    },
    {
      caseName: "Luxury fashion premium profile",
      profile: {
        sectors: ["Люксовые бренды", "Fashion-лендинги"],
        tone: ["премиальный", "утонченный"],
        audienceType: ["B2C"],
      } satisfies HrThemeProfile,
      expected: "Классическая элегантность",
    },
    {
      caseName: "Pharma scientific profile",
      profile: {
        sectors: ["Фармацевтика", "Медицинские сервисы"],
        tone: ["научный", "доверительный"],
        audienceType: ["B2B"],
      } satisfies HrThemeProfile,
      expected: "Лабораторная точность (Pharma Serif)",
    },
    {
      caseName: "Youth festival bold profile",
      profile: {
        sectors: ["Фестивали", "Молодёжные проекты"],
        tone: ["дерзкий", "энергичный"],
        audienceType: ["B2C"],
      } satisfies HrThemeProfile,
      expected: "Дерзкий максимализм",
    },
    {
      caseName: "Wedding romantic profile",
      profile: {
        sectors: ["Свадебные агентства", "Флористика"],
        tone: ["романтичный", "нежный"],
        audienceType: ["B2C"],
      } satisfies HrThemeProfile,
      expected: "Романтичный акцент",
    },
    {
      caseName: "Cultural authority profile",
      profile: {
        sectors: ["Культурные институции", "Издания"],
        tone: ["авторитетный", "классический"],
        audienceType: ["B2B"],
      } satisfies HrThemeProfile,
      expected: "Авторитетная классика",
    },
    {
      caseName: "Glossy beauty profile",
      profile: {
        sectors: ["Бьюти-бренды", "Премиум-товары"],
        tone: ["гламурный", "стильный"],
        audienceType: ["B2C"],
      } satisfies HrThemeProfile,
      expected: "Обложка журнала (Cover Story)",
    },
  ])("selects expected theme: $caseName", ({ profile, expected }) => {
    const result = selectBestTheme(profile, candidates);
    expect(result.bestTheme.pairType).toBe(expected);
    expect(result.topMatches[0]?.pairType).toBe(expected);
    expect(result.score).toBeGreaterThan(0.45);
  });

  it("selects expected template for hardcoded HR profile", () => {
    const profile: HrThemeProfile = {
      sectors: ["SaaS", "B2B"],
      tone: ["экспертный", "профессиональный"],
      audienceType: ["B2B"],
    };

    const result = selectBestTheme(profile, candidates);
    expect(result.bestTheme.pairType).toBe("Современный корпоративный");
    expect(result.topMatches[0]?.pairType).toBe("Современный корпоративный");
    expect(result.score).toBeGreaterThan(0.6);
  });

  it("supports string inputs and keeps deterministic ranking", () => {
    const profile: HrThemeProfile = {
      sectors: "AI-стартапы; Робототехника",
      tone: "инновационный",
      audienceType: "B2C",
    };

    const ranked = rankThemes(profile, candidates);
    expect(ranked[0]?.pairType).toBe("Футуристичный технологичный");
    expect(ranked[1]?.score).toBeGreaterThan(0);
    expect(ranked[1]?.pairType).not.toBe("Тёплый и уютный");
  });

  it("returns top-3 matches and reasons", () => {
    const profile: HrThemeProfile = {
      sectors: ["B2C"],
      tone: ["дружеский"],
      audienceType: ["B2C"],
    };

    const result = selectBestTheme(profile, candidates);
    expect(result.topMatches).toHaveLength(3);
    expect(result.topMatches[0]?.reasons.length).toBeGreaterThan(0);
    expect(result.topMatches[0]?.score).toBeGreaterThanOrEqual(result.topMatches[1]?.score ?? 0);
    expect(result.topMatches[1]?.score).toBeGreaterThanOrEqual(result.topMatches[2]?.score ?? 0);
  });

  it("keeps deterministic order when scores are equal", () => {
    const localCandidates: ThemeCandidate[] = [
      {
        pairType: "B theme",
        sectors: ["X"],
        tone: ["Y"],
        audienceType: ["Z"],
      },
      {
        pairType: "A theme",
        sectors: ["X"],
        tone: ["Y"],
        audienceType: ["Z"],
      },
    ];

    const ranked = rankThemes({ sectors: ["none"] }, localCandidates);
    expect(ranked[0]?.pairType).toBe("A theme");
    expect(ranked[1]?.pairType).toBe("B theme");
  });

  it("throws on empty candidate list", () => {
    expect(() => selectBestTheme({ tone: ["экспертный"] }, [])).toThrow(
      "No theme candidates available"
    );
  });

  it("prioritizes sectors over weaker signal matches", () => {
    const localCandidates: ThemeCandidate[] = [
      {
        pairType: "Sector Match",
        sectors: ["SaaS"],
        tone: ["нейтральный"],
        audienceType: ["B2B"],
      },
      {
        pairType: "Tone Match Only",
        sectors: ["Lifestyle"],
        tone: ["экспертный"],
        audienceType: ["B2C"],
      },
    ];

    const ranked = rankThemes(
      { sectors: ["SaaS"], tone: ["экспертный"], audienceType: ["B2B"] },
      localCandidates
    );

    expect(ranked[0]?.pairType).toBe("Sector Match");
  });
});
