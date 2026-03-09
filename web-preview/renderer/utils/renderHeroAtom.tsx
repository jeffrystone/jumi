import { Button, Heading, Image, Link, Text } from "@/ui/atoms";
import type { HeroAtom } from "../HeroRenderer";

export function renderHeroAtom(atom: HeroAtom) {
  const content = atom.value ?? "";

  switch (atom.type) {
    case "atom.heading":
      return <Heading level={1}>{content}</Heading>;
    case "atom.subheading":
      return (
        <Text as="p" size="lg" color="muted">
          {content}
        </Text>
      );
    case "atom.button":
      return <Button>{content || "Action"}</Button>;
    case "atom.link":
      return <Link href={atom.href ?? "#"}>{content || "Learn more"}</Link>;
    case "atom.image":
      return (
        <Image
          src={atom.src ?? "https://placehold.co/960x720?text=Preview"}
          alt={atom.alt ?? (content || "Hero image")}
          width="100%"
          height="100%"
          objectFit="cover"
          rounded
        />
      );
    default:
      return <Text>{content}</Text>;
  }
}
