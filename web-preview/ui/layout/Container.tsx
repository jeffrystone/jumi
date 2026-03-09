import * as React from "react";
import { cn } from "@utils";

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
      style={{ maxWidth: maxWidth ?? "var(--container-width)", ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
