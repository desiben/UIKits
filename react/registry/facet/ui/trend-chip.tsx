"use client"

import * as React from "react"
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowDownRight, ArrowUpRight, Minus, TrendingDown, TrendingUp } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springBouncy } from "@/registry/facet/lib/motion"

const trendChipVariants = cva(
  "inline-flex shrink-0 items-center gap-[3px] whitespace-nowrap rounded-full text-xs font-medium tabular-nums transition-colors duration-200 [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      trend: {
        up: "text-success",
        down: "text-danger",
        neutral: "text-foreground-secondary",
      },
      plain: {
        false: "h-[22px] px-[7px]",
        true: "bg-transparent",
      },
    },
    compoundVariants: [
      { trend: "up", plain: false, className: "bg-success-subtle" },
      { trend: "down", plain: false, className: "bg-danger-subtle" },
      { trend: "neutral", plain: false, className: "bg-muted" },
    ],
    defaultVariants: { trend: "up", plain: false },
  }
)

type Trend = "up" | "down" | "neutral"

export interface TrendChipProps
  extends Omit<HTMLMotionProps<"span">, "children">,
    Omit<VariantProps<typeof trendChipVariants>, "trend"> {
  /** Direction. Defaults to the sign of `value` when given, otherwise "up". */
  trend?: Trend
  /** Numeric change; formats as a signed-free percentage and picks the trend from its sign. */
  value?: number
  /** Unit appended to `value` (default "%"). */
  unit?: string
  children?: React.ReactNode
}

const icons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
}
const plainIcons = { up: ArrowUpRight, down: ArrowDownRight, neutral: Minus }

/** A change indicator: arrow + sign + colour. The arrow swaps and the chip pops when the trend changes. */
function TrendChip({ className, trend, value, unit = "%", plain = false, children, ...props }: TrendChipProps) {
  const resolved: Trend = trend ?? (value === undefined ? "up" : value > 0 ? "up" : value < 0 ? "down" : "neutral")
  const Icon = (plain ? plainIcons : icons)[resolved]
  const label = children ?? (value !== undefined ? `${Math.abs(value).toFixed(1)}${unit}` : null)
  const srPrefix = resolved === "up" ? "Up " : resolved === "down" ? "Down " : "No change, "

  return (
    <motion.span
      data-slot="trend-chip"
      data-trend={resolved}
      layout
      transition={spring}
      className={cn(trendChipVariants({ trend: resolved, plain }), className)}
      {...props}
    >
      <span className="relative inline-flex size-3 overflow-hidden" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={resolved}
            className="inline-flex"
            initial={{ opacity: 0, y: resolved === "down" ? -8 : 8, rotate: resolved === "down" ? -30 : 30 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: resolved === "down" ? 8 : -8 }}
            transition={springBouncy}
          >
            <Icon />
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only">{srPrefix}</span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={typeof label === "string" || typeof label === "number" ? String(label) : "label"}
          layout="position"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={spring}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

export { TrendChip, trendChipVariants }
