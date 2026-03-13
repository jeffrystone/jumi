import * as React from "react";
import { cn } from "@utils";
import { THEME_VARS, cssVar } from "@/ui/theme/themeVars";

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
      style={{ paddingBlock: cssVar(THEME_VARS.sectionPadding), ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
