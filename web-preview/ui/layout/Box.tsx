import * as React from "react";
import { cn } from "@utils";

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function Box({
  as: Tag = "div",
  className,
  children,
  ...props
}: BoxProps) {
  return (
    <Tag className={cn(className)} {...props}>
      {children}
    </Tag>
  );
}
