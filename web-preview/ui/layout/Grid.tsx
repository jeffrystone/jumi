import * as React from "react";
import { cn } from "@utils";
import { THEME_VARS, cssVar } from "@/ui/theme/themeVars";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols: number;
  rows?: number;
  gap?: string;
}

export function Grid({
  cols,
  rows,
  gap,
  className,
  style,
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={cn("grid", className)}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: rows ? `repeat(${rows}, minmax(0, 1fr))` : undefined,
        gap: gap ?? cssVar(THEME_VARS.gap),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
