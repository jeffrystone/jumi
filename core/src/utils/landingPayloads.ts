export interface LandingInputData {
  business: {
    product_name: string;
    product_description: string;
    problem: string;
    advantage: string;
  };
  audience: {
    target: string;
    tone_type: string;
  };
  marketing: {
    main_goal: string;
    primary_cta: string;
    promotions?: string;
  };
  visual: {
    tone: string;
    brand_colors?: string;
    image_mood: string;
    people_photos: string;
  };
}

export function buildThemaPayload(input: LandingInputData): Record<string, unknown> {
  return {
    tone: input.visual.tone,
    audience_type: input.audience.tone_type,
    brand_colors: input.visual.brand_colors,
    image_mood: input.visual.image_mood,
    people_photos: input.visual.people_photos,
    main_goal: input.marketing.main_goal,
  };
}

export function buildWriterPayload(
  input: LandingInputData,
  theme: Record<string, unknown> | null
): Record<string, unknown> {
  return {
    context: {
      product_name: input.business.product_name,
      product_description: input.business.product_description,
      problem: input.business.problem,
      advantage: input.business.advantage,
      target_audience: input.audience.target,
      tone: input.visual.tone,
      main_goal: input.marketing.main_goal,
      primary_cta: input.marketing.primary_cta,
      promotion: input.marketing.promotions,
    },
    structure: {
      title: {
        semantics:
          "Главный заголовок, привлекает внимание, содержит УТП или ключевую выгоду",
        maxLength: 40,
        required: true,
      },
      subtitle: {
        semantics:
          "Подзаголовок, уточняет предложение, может добавлять преимущество или снимать возражения",
        maxLength: 100,
        required: true,
      },
      cta: {
        semantics: "Текст кнопки призыва к действию, мотивирует к целевому действию",
        maxLength: 25,
        required: true,
      },
    },
    ...(theme ? { theme } : {}),
  };
}

export function buildHrPayload(input: LandingInputData): Record<string, unknown> {
  return input as unknown as Record<string, unknown>;
}

export function buildHeroPromptPayload(
  input: LandingInputData,
  hr: Record<string, unknown> | null,
  theme: Record<string, unknown> | null
): Record<string, unknown> {
  const hrContext = (hr?.context ?? {}) as Record<string, unknown>;
  const themeBlock = theme ?? {};

  return {
    context: {
      product_name: hrContext.product_name ?? input.business.product_name,
      product_description:
        hrContext.product_description ?? input.business.product_description,
      target_audience: hrContext.target_audience ?? input.audience.target,
      tone: hrContext.tone ?? input.visual.tone,
      people_photos: hrContext.people_photos ?? input.visual.people_photos,
    },
    theme: themeBlock,
  };
}
