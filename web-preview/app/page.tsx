import heroTemplate from "@/test.json";
import navbarTemplate from "@/test-navbar.json";
import featuresTemplate from "@/test-features.json";
import { FeaturesRenderer, HeroRenderer, NavbarRenderer } from "@/renderer";

export default function Home() {
  return (
    <main>
      <NavbarRenderer template={navbarTemplate} />
      <HeroRenderer template={heroTemplate} />
      <FeaturesRenderer template={featuresTemplate} />
    </main>
  );
}
