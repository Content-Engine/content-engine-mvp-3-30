
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "glass-button-primary text-white hover:scale-110 hover-glow shadow-lg",
        destructive:
          "frosted-glass bg-gradient-to-r from-red-500/80 to-pink-600/80 text-white hover:from-red-400/90 hover:to-pink-500/90 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]",
        outline:
          "glass-button border-white/20 text-white hover:bg-white/15 hover:border-white/30 hover:scale-105",
        secondary:
          "glass-strong bg-white/10 text-white hover:bg-white/15 hover:scale-105 hover-glow",
        ghost: "glass-subtle hover:bg-white/10 hover:text-white text-white/90 hover:scale-105",
        link: "text-white/90 underline-offset-4 hover:underline hover:text-white hover:scale-105 transition-all duration-200",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base font-bold",
        icon: "h-11 w-11",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
