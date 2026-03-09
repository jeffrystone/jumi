import * as React from "react";
import { cn } from "@utils";
import type { LucideIcon } from "lucide-react";

export interface IconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "name"> {
  name: LucideIcon;
  size?: number | "sm" | "md" | "lg";
  color?: string;
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name: IconComponent, size = "md", color, className, ...props }, ref) => {
    const pixelSize =
      typeof size === "number" ? size : sizeMap[size] ?? sizeMap.md;

    return (
      <IconComponent
        ref={ref}
        size={pixelSize}
        className={cn(color ? "" : "text-current", className)}
        style={color ? { color } : undefined}
        {...props}
      />
    );
  }
);
Icon.displayName = "Icon";

export { Icon };
