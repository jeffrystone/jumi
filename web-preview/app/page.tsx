import heroTemplate from "@/test.json";
import navbarTemplate from "@/test-navbar.json";
import { HeroRenderer, NavbarRenderer } from "@/renderer";

export default function Home() {
  return (
    <main>
      <NavbarRenderer template={navbarTemplate} />
      <HeroRenderer template={heroTemplate} />
    </main>
  );
}
