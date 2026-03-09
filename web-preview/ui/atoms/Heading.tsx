import * as React from "react";
import { cn } from "@utils";

const headingStyles: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "text-4xl font-bold leading-tight tracking-tight text-primary",
  2: "text-3xl font-semibold leading-tight text-primary",
  3: "text-2xl font-semibold leading-snug text-primary",
  4: "text-xl font-medium leading-snug text-primary",
  5: "text-lg font-medium leading-normal text-primary",
  6: "text-base font-medium leading-normal text-primary",
};

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, className, children, ...props }, ref) => {
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
      <Tag
        ref={ref}
        className={cn(headingStyles[level], className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
Heading.displayName = "Heading";

export { Heading };
