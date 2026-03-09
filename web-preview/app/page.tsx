import template from "@/test.json";
import { HeroRenderer } from "@/renderer";

export default function Home() {
  return (
    <main>
      <HeroRenderer template={template} />
    </main>
  );
}
