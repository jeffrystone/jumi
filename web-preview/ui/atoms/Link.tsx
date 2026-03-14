import * as React from "react";
import NextLink from "next/link";
import { cn } from "@utils";

const variantStyles = {
  default: "text-link visited:text-link-visited hover:text-link-hover underline-offset-4 hover:underline",
  button:
    "inline-flex items-center justify-center rounded-md bg-primary text-background px-4 py-2 text-sm font-medium hover:bg-primary-hover",
} as const;

export interface LinkProps
  extends Omit<React.ComponentProps<typeof NextLink>, "href"> {
  href: string;
  variant?: keyof typeof variantStyles;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, variant = "default", className, children, ...props }, ref) => (
    <NextLink
      ref={ref}
      href={href}
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </NextLink>
  )
);
Link.displayName = "Link";

export { Link };
