import heroTemplate from "@/test.json";
import navbarTemplate from "@/test-navbar.json";
import featuresTemplate from "@/test-features.json";
import { FeaturesRenderer, HeroRenderer, NavbarRenderer } from "@/renderer";
import { readGeneratedJson } from "@/utils/generatedPreview";

type WriterAnswer = Partial<Record<"title" | "subtitle" | "cta", string>>;

export default function Home() {
  const writerAnswer = readGeneratedJson<WriterAnswer>("writer-answer.json");
  const heroWithWriter = {
    ...heroTemplate,
    atoms: heroTemplate.atoms.map((atom) => {
      const nextValue =
        atom.ref === "title"
          ? writerAnswer?.title
          : atom.ref === "subtitle"
            ? writerAnswer?.subtitle
            : atom.ref === "cta"
              ? writerAnswer?.cta
              : undefined;

      if (typeof nextValue !== "string" || nextValue.trim().length === 0) {
        return atom;
      }

      return { ...atom, value: nextValue };
    }),
  };

  return (
    <main>
      {/* <NavbarRenderer template={navbarTemplate} /> */}
      <HeroRenderer template={heroWithWriter} />
      <FeaturesRenderer template={featuresTemplate} />
    </main>
  );
}
