import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  asChild?: boolean
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ asChild = false, label, error, className, disabled, readOnly, ...props }, ref) => {
    const Comp = asChild ? Slot : "textarea"

    return (
      <div className="flex flex-col space-y-1.5">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}

        <Comp
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground resize-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground",
            "read-only:cursor-default read-only:bg-muted/30 read-only:text-muted-foreground",
            error && "border-destructive focus-visible:ring-destructive/50",
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
