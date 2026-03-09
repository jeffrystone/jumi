import * as React from "react";
import { cn } from "@utils";

const sizeStyles = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
} as const;

const colorStyles = {
  default: "text-primary",
  muted: "text-muted-foreground",
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
      children,
      ...props
    },
    ref
  ) => (
    <Tag
      ref={ref as React.Ref<HTMLParagraphElement>}
      className={cn(sizeStyles[size], colorStyles[color], className)}
      {...props}
    >
      {children}
    </Tag>
  )
);
Text.displayName = "Text";

export { Text };
