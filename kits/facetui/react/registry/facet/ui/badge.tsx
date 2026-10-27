"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion, type HTMLMotionProps } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/facet/lib/utils"
import { spring } from "@/registry/facet/lib/motion"

const badgeVariants = cva(
  "inline-flex h-[22px] shrink-0 items-center gap-1 overflow-hidden whitespace-nowrap rounded-facet-sm px-2 text-xs font-medium transition-colors duration-200 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-foreground-secondary",
        brand: "bg-primary-subtle text-brand",
        solid: "bg-primary text-primary-foreground",
        success: "bg-success-subtle text-success",
        warning: "bg-warning-subtle text-warning",
        danger: "bg-danger-subtle text-danger",
        info: "bg-info-subtle text-info",
        accent: "bg-highlight text-highlight-foreground",
        outline: "bg-transparent text-foreground-secondary shadow-[inset_0_0_0_1px_var(--border)]",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
)

export interface BadgeProps
  extends Omit<HTMLMotionProps<"span">, "children">,
    VariantProps<typeof badgeVariants> {
  children?: React.ReactNode
  /** Leading status dot in the current colour. */
  dot?: boolean
  /** Adds a soft ping around the dot (live / in-progress states). Stops with reduced motion. */
  pulse?: boolean
}

/**
 * Short status or metadata label. When the text changes (e.g. Pending → Active) the label
 * rolls over and the badge width springs to fit; the tone cross-fades.
 */
function Badge({ className, variant, dot, pulse, children, ...props }: BadgeProps) {
  const reduce = useReducedMotion()
  const key = typeof children === "string" || typeof children === "number" ? String(children) : "content"
  return (
    <motion.span
      data-slot="badge"
      data-variant={variant ?? "neutral"}
      layout
      transition={spring}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot && (
        <span className="relative inline-flex size-1.5 shrink-0" aria-hidden="true">
          {pulse && !reduce && (
            <motion.span
              className="absolute inset-0 rounded-full bg-current"
              animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span className="relative size-1.5 rounded-full bg-current" />
        </span>
      )}
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={key}
          className="inline-flex items-center gap-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={spring}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

export { Badge, badgeVariants }
