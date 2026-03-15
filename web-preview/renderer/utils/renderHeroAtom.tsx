import * as React from "react";
import { Button, Heading, Image, Link, Text } from "@/ui/atoms";
import type { TemplateAtom } from "../TemplateRenderer";
import { atomFontRem, atomPaddingStyle, atomLayoutStyle, atomFontColorStyle } from "./atomRemStyle";
import { getTemplateIcon } from "./templateIconMap";

export function renderHeroAtom(atom: TemplateAtom) {
  const content = atom.value ?? "";
  const fontSize = atomFontRem(atom);
  const fontStyle: React.CSSProperties | undefined = fontSize
    ? { fontSize }
    : undefined;
  const paddingStyle = atomPaddingStyle(atom);
  const layoutStyle = atomLayoutStyle(atom);
  const fontColorStyle = atomFontColorStyle(atom);
  const style =
    fontStyle || paddingStyle || layoutStyle || fontColorStyle
      ? { ...fontStyle, ...paddingStyle, ...layoutStyle, ...fontColorStyle }
      : undefined;

  switch (atom.type) {
    case "atom.heading":
      return (
        <Heading level={1} style={style}>
          {content}
        </Heading>
      );
    case "atom.subheading":
      return (
        <Text
          as="p"
          size="lg"
          color="muted"
          className="min-w-0 whitespace-normal break-words"
          style={style}
        >
          {content}
        </Text>
      );
    case "atom.paragraph":
      return (
        <Text
          as="p"
          size="base"
          color="muted"
          className="min-w-0 max-w-full whitespace-normal break-words leading-relaxed"
          style={style}
        >
          {content}
        </Text>
      );
    case "atom.button":
      return (
        <Button
          style={style}
          iconLeft={getTemplateIcon(atom.iconLeft)}
          iconRight={getTemplateIcon(atom.iconRight)}
        >
          {content || "Action"}
        </Button>
      );
    case "atom.link":
      return (
        <Link href={atom.href ?? "#"} style={style}>
          {content || "Learn more"}
        </Link>
      );
    case "atom.image":
      return (
        <Image
          src={atom.src ?? "https://placehold.co/960x720?text=Preview"}
          alt={atom.alt ?? (content || "Hero image")}
          width="100%"
          height="100%"
          objectFit="cover"
          rounded
          style={
            fontSize || paddingStyle || layoutStyle
              ? {
                  minHeight: fontSize,
                  width: "100%",
                  ...paddingStyle,
                  ...layoutStyle,
                }
              : undefined
          }
        />
      );
    default:
      return (
        <Text style={style} className="min-w-0 whitespace-normal break-words">
          {content}
        </Text>
      );
  }
}
