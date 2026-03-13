import * as React from "react";
import { cn } from "@utils";
import { THEME_VARS, cssVar } from "@/ui/theme/themeVars";

const headingStyles: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "text-4xl font-bold leading-tight tracking-tight text-foreground",
  2: "text-3xl font-semibold leading-tight text-foreground",
  3: "text-2xl font-semibold leading-snug text-foreground",
  4: "text-xl font-medium leading-snug text-foreground",
  5: "text-lg font-medium leading-normal text-foreground",
  6: "text-base font-medium leading-normal text-foreground",
};

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const headingThemeStyleMap: Partial<Record<1 | 2 | 3 | 4 | 5 | 6, React.CSSProperties>> = {
  1: { fontSize: cssVar(THEME_VARS.h1FontSize), fontWeight: cssVar(THEME_VARS.h1FontWeight) },
  2: { fontSize: cssVar(THEME_VARS.h2FontSize), fontWeight: cssVar(THEME_VARS.h2FontWeight) },
  3: { fontSize: cssVar(THEME_VARS.h3FontSize), fontWeight: cssVar(THEME_VARS.h3FontWeight) },
};

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, className, style, children, ...props }, ref) => {
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
      <Tag
        ref={ref}
        className={cn(headingStyles[level], className)}
        style={{ ...headingThemeStyleMap[level], ...style }}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
Heading.displayName = "Heading";

export { Heading };
