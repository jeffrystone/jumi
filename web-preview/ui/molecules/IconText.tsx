import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@utils";
import { Icon } from "@/ui/atoms";

export interface IconTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: LucideIcon;
  text: React.ReactNode;
  iconPosition?: "left" | "right";
  variant?: "default" | "interactive" | "interactive-bordered";
  iconSize?: number | "sm" | "md" | "lg";
  iconClassName?: string;
  textClassName?: string;
}

export function IconText({
  icon,
  text,
  iconPosition = "left",
  variant = "default",
  iconSize = "md",
  className,
  iconClassName,
  textClassName,
  ...props
}: IconTextProps) {
  const iconNode = <Icon name={icon} size={iconSize} className={iconClassName} />;
  const textNode = <span className={cn("text-sm", textClassName)}>{text}</span>;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 hover:cursor-pointer",
        variant === "interactive" &&
          "rounded-md px-2 py-1 transition-[background-color,box-shadow,transform] duration-150 hover:bg-secondary-hover hover:shadow-sm active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        variant === "interactive-bordered" &&
          "rounded-md border border-transparent px-2 py-1 transition-[background-color,border-color,box-shadow,transform] duration-150 hover:bg-secondary-hover/50 hover:border-primary hover:shadow-sm active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
      {...props}
    >
      {iconPosition === "left" ? iconNode : textNode}
      {iconPosition === "left" ? textNode : iconNode}
    </span>
  );
}
