import * as React from "react";
import { cn } from "@utils";
import { THEME_VARS, cssVar } from "@/ui/theme/themeVars";

const sizeStyles = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
} as const;

const colorStyles = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  faint: "text-faint-foreground",
  accent: "text-accent",
} as const;

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: keyof typeof sizeStyles;
  color?: keyof typeof colorStyles;
  as?: "p" | "span";
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      size = "base",
      color = "default",
      as: Tag = "p",
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const accentWeightStyle =
      color === "accent" ? { fontWeight: cssVar(THEME_VARS.accentTextFontWeight) } : undefined;
    return (
      <Tag
        ref={ref as React.Ref<HTMLParagraphElement>}
        className={cn(sizeStyles[size], colorStyles[color], className)}
        style={{
          fontSize: cssVar(THEME_VARS.bodyFontSize),
          fontWeight: cssVar(THEME_VARS.bodyFontWeight),
          ...accentWeightStyle,
          ...style,
        }}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
Text.displayName = "Text";

export { Text };
