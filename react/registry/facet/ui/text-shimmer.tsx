"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"

const gradients = {
  neutral:
    "linear-gradient(90deg, var(--muted-foreground) 0%, var(--muted-foreground) 35%, var(--foreground) 50%, var(--muted-foreground) 65%, var(--muted-foreground) 100%)",
  brand:
    "linear-gradient(90deg, var(--brand-400) 0%, var(--brand-700) 35%, var(--brand-300) 50%, var(--brand-700) 65%, var(--brand-400) 100%)",
} as const

export interface TextShimmerProps extends Omit<React.ComponentProps<"span">, "ref"> {
  /** Neutral grey sweep (default) or a brand-coloured sweep. */
  variant?: keyof typeof gradients
  /** Seconds for one sweep. */
  duration?: number
  /** Pause the sweep (text stays readable). */
  paused?: boolean
}

/** Text with a light sweeping across it — for "Thinking…" states and loading labels. */
function TextShimmer({ variant = "neutral", duration = 2, paused = false, className, style, children, ...props }: TextShimmerProps) {
  const reduce = useReducedMotion()
  const still = reduce || paused
  return (
    <motion.span
      data-slot="text-shimmer"
      data-variant={variant}
      className={cn(
        "inline-block bg-clip-text text-transparent [-webkit-background-clip:text] [background-size:250%_100%]",
        className
      )}
      style={{ backgroundImage: gradients[variant], backgroundPosition: still ? "50% 0" : undefined, ...style }}
      initial={false}
      animate={still ? undefined : { backgroundPosition: ["100% 0", "-150% 0"] }}
      transition={still ? undefined : { duration, ease: "linear", repeat: Infinity }}
      {...(props as React.ComponentProps<typeof motion.span>)}
    >
      {children}
    </motion.span>
  )
}

export { TextShimmer }
