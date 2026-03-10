import {
  buildHeroPromptPayload,
  buildHrPayload,
  buildThemaPayload,
  buildWriterPayload,
  type LandingInputData,
} from "./landingPayloads.js";

const input: LandingInputData = {
  business: {
    product_name: "Jumi English",
    product_description: "Онлайн школа английского",
    problem: "Люди боятся говорить",
    advantage: "Живые разговорные практики",
  },
  audience: {
    target: "Начинающие и продолжающие",
    tone_type: "дружелюбный",
  },
  marketing: {
    main_goal: "Запись на пробный урок",
    primary_cta: "Записаться",
    promotions: "Скидка 20%",
  },
  visual: {
    tone: "светлый",
    brand_colors: "синий, белый",
    image_mood: "живой",
    people_photos: "реальные студенты",
  },
};

describe("landing payload builders", () => {
  it("buildThemaPayload maps only required fields", () => {
    expect(buildThemaPayload(input)).toEqual({
      tone: "светлый",
      audience_type: "дружелюбный",
      brand_colors: "синий, белый",
      image_mood: "живой",
      people_photos: "реальные студенты",
      main_goal: "Запись на пробный урок",
    });
  });

  it("buildWriterPayload includes theme when provided", () => {
    const payload = buildWriterPayload(input, { colors: { primary: "blue" } });
    expect(payload).toMatchObject({
      context: {
        product_name: "Jumi English",
        primary_cta: "Записаться",
      },
      theme: {
        colors: { primary: "blue" },
      },
    });
  });

  it("buildWriterPayload omits theme when not provided", () => {
    const payload = buildWriterPayload(input, null);
    expect(payload).not.toHaveProperty("theme");
  });

  it("buildHrPayload forwards source input object", () => {
    const payload = buildHrPayload(input);
    expect(payload).toMatchObject({
      business: {
        product_name: "Jumi English",
      },
      visual: {
        people_photos: "реальные студенты",
      },
    });
  });

  it("buildHeroPromptPayload combines hr and theme answers", () => {
    const payload = buildHeroPromptPayload(
      input,
      {
        context: {
          product_name: "HR Product",
          product_description: "HR Description",
          target_audience: "HR Audience",
          tone: "HR Tone",
          people_photos: "HR People",
        },
      },
      {
        imageStyle: "minimal",
      }
    );

    expect(payload).toEqual({
      context: {
        product_name: "HR Product",
        product_description: "HR Description",
        target_audience: "HR Audience",
        tone: "HR Tone",
        people_photos: "HR People",
      },
      theme: {
        imageStyle: "minimal",
      },
    });
  });
});
