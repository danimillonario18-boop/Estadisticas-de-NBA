import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-accent text-background shadow-sm hover:bg-accent-hover",
        secondary:
          "border-transparent bg-card border border-card-border hover:bg-card-hover",
        destructive:
          "border-transparent bg-danger text-white shadow-sm hover:bg-danger-hover",
        outline: "text-foreground",
        success:
          "border-transparent bg-success text-background shadow-sm hover:bg-success/80",
        warning:
          "border-transparent bg-warning text-background shadow-sm hover:bg-warning/80",
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