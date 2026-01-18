import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-md hover:-translate-y-0.5 active:opacity-80 active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        brutal:
          "relative bg-foreground text-background font-semibold tracking-tight overflow-hidden hover:shadow-[0_10px_35px_rgba(0,0,0,0.28)] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 active:shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700",
        "brutal-outline":
          "relative border-2 border-foreground bg-transparent text-foreground font-semibold tracking-tight overflow-hidden hover:bg-foreground hover:text-background hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700",
        premium:
          "relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white font-semibold tracking-tight overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:opacity-70 before:animate-[shimmer_6s_linear_infinite]",
      },
      size: {
        default: "h-12 px-6 py-2 sm:h-10 sm:px-5",
        sm: "h-11 px-5 text-sm min-h-[44px] sm:h-9 sm:px-4 sm:text-xs sm:min-h-0",
        lg: "h-14 px-10 text-base sm:h-12 sm:px-8 sm:text-sm",
        xl: "h-16 px-14 text-lg font-semibold sm:h-14 sm:px-10 sm:text-base",
        icon: "h-12 w-12 sm:h-10 sm:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
