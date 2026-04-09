import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 active:scale-95",
        outline:
          "border-2 border-purple-300 bg-white text-purple-700 hover:bg-purple-50 hover:border-purple-400 hover:scale-105 active:scale-95",
        secondary:
          "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:scale-95",
        ghost: "hover:bg-gray-100 hover:text-gray-900 active:scale-95",
        link: "text-purple-600 underline-offset-4 hover:underline hover:text-purple-700",
        glow: "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
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
