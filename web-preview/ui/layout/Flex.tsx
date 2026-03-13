import * as React from "react";
import { cn } from "@utils";
import { THEME_VARS, cssVar } from "@/ui/theme/themeVars";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
  gap?: string;
  wrap?: boolean;
}

export function Flex({
  direction = "row",
  align,
  justify,
  gap,
  wrap = false,
  className,
  style,
  children,
  ...props
}: FlexProps) {
  return (
    <div
      className={cn("flex", className)}
      style={{
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : "nowrap",
        gap: gap ?? cssVar(THEME_VARS.gap),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
