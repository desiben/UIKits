"use client"

import * as React from "react"
import { motion } from "motion/react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springBouncy } from "@/registry/facet/lib/motion"

const STAR =
  "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"

const sizes = { sm: "size-3.5", md: "size-5", lg: "size-7" } as const

function StarSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-full fill-current stroke-current stroke-1", className)}>
      <path d={STAR} />
    </svg>
  )
}

interface RatingProps
  extends Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, "value" | "defaultValue" | "onValueChange" | "dir"> {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  max?: number
  size?: keyof typeof sizes
  /** Display-only rating; supports fractions (e.g. 4.5). */
  readOnly?: boolean
  /** Accessible name, e.g. "Rate your experience". */
  label?: string
  /** Show the numeric value after the stars. */
  showValue?: boolean
}

function Rating({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  max = 5,
  size = "md",
  readOnly = false,
  label = "Rating",
  showValue = false,
  className,
  ...props
}: RatingProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const [hover, setHover] = React.useState<number | null>(null)
  const [popAt, setPopAt] = React.useState(0) // bumps on each selection to replay the pop
  const shown = hover ?? value

  const valueLabel = showValue && (
    <span className="ml-1.5 text-[13px] font-medium tabular-nums text-foreground-secondary">{value.toFixed(readOnly && value % 1 ? 1 : 0)}</span>
  )

  if (readOnly) {
    return (
      <div
        data-slot="rating"
        data-readonly=""
        role="img"
        aria-label={`${value} out of ${max} stars`}
        className={cn("inline-flex items-center gap-0.5", className)}
      >
        {Array.from({ length: max }, (_, i) => {
          const fill = Math.max(0, Math.min(1, value - i))
          return (
            <span key={i} className={cn("relative text-border-strong", sizes[size])}>
              <StarSvg />
              {fill > 0 && (
                <span className="absolute inset-0 text-chart-3" style={{ clipPath: `inset(0 ${100 - fill * 100}% 0 0)` }}>
                  <StarSvg />
                </span>
              )}
            </span>
          )
        })}
        {valueLabel}
      </div>
    )
  }

  const select = (v: number) => {
    if (valueProp === undefined) setInner(v)
    onValueChange?.(v)
    setPopAt((n) => n + 1)
  }

  return (
    <RadioGroupPrimitive.Root
      data-slot="rating"
      aria-label={label}
      value={value ? String(value) : ""}
      onValueChange={(v) => select(Number(v))}
      orientation="horizontal"
      onPointerLeave={() => setHover(null)}
      className={cn("inline-flex items-center gap-0.5 rounded-sm outline-none", className)}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1
        const on = n <= shown
        return (
          <RadioGroupPrimitive.Item
            key={n}
            value={String(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onPointerEnter={() => setHover(n)}
            onFocus={() => setHover(null)}
            onClick={() => n === value && setPopAt((k) => k + 1)}
            className={cn(
              "relative grid cursor-pointer place-items-center rounded-sm outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              sizes[size],
              on ? "text-chart-3" : "text-border-strong"
            )}
            asChild
          >
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} transition={spring}>
              <motion.span
                key={on && popAt && n <= value ? `${n}-${popAt}` : `${n}`}
                className="size-full"
                initial={popAt && on && n <= value ? { scale: 0.4, rotate: -24 } : false}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ ...springBouncy, delay: i * 0.04 }}
              >
                <StarSvg />
              </motion.span>
            </motion.button>
          </RadioGroupPrimitive.Item>
        )
      })}
      {valueLabel}
    </RadioGroupPrimitive.Root>
  )
}

export { Rating }
export type { RatingProps }
