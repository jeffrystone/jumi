import * as React from "react";
import { cn } from "@utils";
import { THEME_VARS, cssVar } from "@/ui/theme/themeVars";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: string;
}

export function Container({
  maxWidth,
  className,
  style,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full", className)}
      style={{ maxWidth: maxWidth ?? cssVar(THEME_VARS.containerWidth), ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
