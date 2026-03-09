import * as React from "react";
import { cn } from "@utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
}

export function Section({
  as: Tag = "section",
  className,
  style,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(className)}
      style={{ paddingBlock: "var(--section-padding)", ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
