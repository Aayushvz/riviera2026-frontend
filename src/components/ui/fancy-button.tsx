import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const fancyButtonVariants = cva(
  "relative inline-flex items-center justify-center font-bold uppercase transition-all duration-150 ease-out border-2 border-black disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        pink: "bg-[#FE54F8] text-black hover:bg-[#e600e6] active:bg-[#d000d0]",
        blue: "bg-[#4FFFF0] text-black hover:bg-[#3de6d7] active:bg-[#2bccc0]",
        yellow:
          "bg-[#FFD401] text-black hover:bg-[#e6be00] active:bg-[#cca800]",
        green: "bg-[#AAF039] text-black hover:bg-[#98d630] active:bg-[#86bc28]",
        purple:
          "bg-[#A6BFFF] text-black hover:bg-[#8da9ff] active:bg-[#7493ff]",
        orange:
          "bg-[#D27441] text-white hover:bg-[#b86337] active:bg-[#9f522d]",
        red: "bg-[#D24C41] text-white hover:bg-[#b84338] active:bg-[#9f392f]",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        default: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
        xl: "px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "pink",
      size: "default",
    },
  },
)

interface FancyButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fancyButtonVariants> {
  asChild?: boolean
}

const FancyButton = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div className="relative inline-block">
        {/* Shadow box - white with black outline */}
        <div
          className="absolute inset-0 border-2 border-black bg-white transition-all duration-150 ease-out"
          style={{
            transform: "translate(6px, 6px)",
          }}
        />

        {/* Main button */}
        <button
          ref={ref}
          className={cn(
            fancyButtonVariants({ variant, size }),
            "relative z-10",
            // 3D click animation
            "translate-x-0 translate-y-0",
            "hover:translate-x-[2px] hover:translate-y-[2px]",
            "active:translate-x-[6px] active:translate-y-[6px]",
            className,
          )}
          {...props}
        >
          {children}
        </button>
      </div>
    )
  },
)

FancyButton.displayName = "FancyButton"

export { FancyButton, fancyButtonVariants }
