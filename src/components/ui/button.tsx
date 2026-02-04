import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        neon: "border border-green-500 bg-black text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] hover:bg-green-500 hover:text-black hover:shadow-[0_0_20px_rgba(34,197,94,0.8)] transition-all duration-300",
        cyber: "border border-cyan-500/50 bg-black/80 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] hover:border-cyan-400 hover:text-cyan-300 backdrop-blur-sm transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100",
        cyberGreen: "border border-green-500/50 bg-black/80 text-green-400 shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] hover:border-green-400 hover:text-green-300 backdrop-blur-sm transition-all duration-300",
        cyberMagenta: "border border-pink-500/50 bg-black/80 text-pink-400 shadow-[0_0_15px_rgba(255,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,255,0.5)] hover:border-pink-400 hover:text-pink-300 backdrop-blur-sm transition-all duration-300",
        cyberPurple: "border border-purple-500/50 bg-black/80 text-purple-400 shadow-[0_0_15px_rgba(191,0,255,0.3)] hover:shadow-[0_0_30px_rgba(191,0,255,0.5)] hover:border-purple-400 hover:text-purple-300 backdrop-blur-sm transition-all duration-300",
        holographic: "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] animate-gradient-x border-0 transition-all duration-300",
        glitch: "border border-red-500/50 bg-black text-red-400 hover:animate-glitch-skew transition-all duration-300",
        matrix: "border border-green-500 bg-black text-green-500 font-mono tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.5),inset_0_0_20px_rgba(34,197,94,0.1)] hover:bg-green-500/10 transition-all duration-300",
        hud: "border-2 border-cyan-500/70 bg-transparent text-cyan-400 clip-path-hud hover:bg-cyan-500/10 transition-all duration-300 font-mono uppercase tracking-widest",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base",
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
