// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@utils"
import { THEME_VARS, cssVar } from "@/ui/theme/themeVars"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-background hover:bg-primary-hover disabled:bg-primary-disabled disabled:text-background/80",
        destructive:
          "bg-primary text-background hover:bg-primary-hover disabled:bg-primary-disabled disabled:text-background/80",
        outline: "border border-secondary bg-background text-foreground hover:bg-secondary/70",
        blank: "bg-secondary text-foreground hover:bg-secondary/80",
        secondary:
          "border border-primary bg-secondary text-foreground hover:bg-secondary-hover disabled:border-secondary-disabled disabled:bg-secondary-disabled disabled:text-foreground/70",
        ghost: "text-foreground hover:bg-secondary/70",
        link: "text-link hover:text-link-hover visited:text-link-visited underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{
          fontSize: cssVar(THEME_VARS.buttonFontSize),
          fontWeight: cssVar(THEME_VARS.buttonFontWeight),
          ...style,
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }