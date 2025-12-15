/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 active:scale-[0.97] transition-all duration-150 shadow-md active:shadow-inner",
        warning: "bg-[#E08625] text-white hover:bg-[#f3983a] active:bg-[#c66f1e] active:scale-[0.97] transition-all duration-150 shadow-md active:shadow-inner",
        destructive: "bg-[#D64545] text-white hover:bg-[#E05656] active:bg-[#B83030] active:scale-[0.97] transition-all duration-150 shadow-md active:shadow-inner",
        success: "bg-[#3CA77B] text-white hover:bg-[#45b986] active:bg-[#2f8e69] active:scale-[0.97] transition-all duration-150 shadow-md active:shadow-inner",
        outline: "bg-[#FFFFFF] text-[#1e1e1e] hover:bg-[#f5f5f5] active:bg-[#ebebeb] active:scale-[0.97] transition-all duration-150 shadow-md active:shadow-inner border border-gray-200",
        primary: "bg-[#E08625] text-white hover:bg-[#f3983a] active:bg-[#c66f1e] active:scale-[0.97] transition-all duration-150 shadow-md active:shadow-inner",
        secondary: "bg-[#1e1e1e] text-white hover:bg-gray-600 active:bg-[#141414] active:scale-[0.97] transition-all duration-150 shadow-md active:shadow-inner",
        ghost: "bg-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
        link: "text-blue-600 underline hover:text-blue-500 focus:outline-none focus:ring-0",
        padrao: "bg-[#1e1e1e] text-[#E08625] hover:bg-gray-700 hover:shadow-lg active:bg-[#E08625] active:border-white active:text-white"
      },
      size: {
        default: "h-10 px-4 py-2",
        mx: "h-7 rounded-md px-2",
        sm: "h-9 rounded-md px-3",
        base: "h-10 rounded-md px-4",
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
