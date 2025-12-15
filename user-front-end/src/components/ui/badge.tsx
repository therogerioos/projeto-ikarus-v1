import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // padrão (usar cor neutra escura)
        default: "border-transparent bg-slate-700 text-white hover:bg-slate-800",

        // status personalizados
        presente: "border-transparent bg-green-600 text-white hover:bg-green-700",
        falta: "border-transparent bg-red-600 text-white hover:bg-red-700",
        feriado: "border-transparent bg-amber-400 text-black hover:bg-amber-500",
        folga: "border-transparent bg-blue-600 text-white hover:bg-blue-700",

        // variantes genéricas (mantive para compatibilidade)
        secondary: "border-transparent bg-gray-200 text-gray-800 hover:bg-gray-300",
        destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-white text-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
