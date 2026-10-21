"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { popIn, spring, springSoft } from "@/registry/facet/lib/motion"

export interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  /** Show a value bubble above the thumb while it is dragged or keyboard-focused. */
  showValue?: boolean
  /** Formats the bubble value. */
  formatValue?: (value: number) => React.ReactNode
  /** aria-label for each thumb (defaults to the root aria-label). */
  thumbLabels?: string[]
}

/** Range slider. Thumbs grow on hover/drag and an optional value bubble pops up while sliding. */
function Slider({
  className,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  showValue = false,
  formatValue = (v) => v,
  thumbLabels,
  onPointerDown,
  "aria-label": ariaLabel,
  ...props
}: SliderProps) {
  const [inner, setInner] = React.useState<number[]>(defaultValue ?? [min])
  const values = value ?? inner
  const [dragging, setDragging] = React.useState(false)
  const [focused, setFocused] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (!dragging) return
    const up = () => setDragging(false)
    window.addEventListener("pointerup", up)
    window.addEventListener("pointercancel", up)
    return () => {
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", up)
    }
  }, [dragging])

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      data-dragging={dragging || undefined}
      value={values}
      min={min}
      max={max}
      onValueChange={(v) => {
        setInner(v)
        onValueChange?.(v)
      }}
      onPointerDown={(e) => {
        setDragging(true)
        onPointerDown?.(e)
      }}
      className={cn(
        "group/slider relative flex w-full touch-none items-center select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[orientation=horizontal]:h-5 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-5 data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      {values.map((v, i) => {
        const active = showValue && (dragging || focused === i)
        return (
          <SliderPrimitive.Thumb key={i} asChild aria-label={thumbLabels?.[i] ?? ariaLabel}>
            <motion.span
              data-slot="slider-thumb"
              className="relative block size-[18px] cursor-grab rounded-full border-2 border-primary bg-card shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:cursor-grabbing"
              whileHover={{ scale: 1.15 }}
              animate={{ scale: dragging ? 1.2 : 1 }}
              transition={spring}
              onFocus={() => setFocused(i)}
              onBlur={() => setFocused((f) => (f === i ? null : f))}
            >
              <AnimatePresence>
                {active && (
                  <motion.span
                    aria-hidden="true"
                    variants={popIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 rounded-facet-sm bg-inverse px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-inverse-foreground tabular-nums shadow-md"
                  >
                    {formatValue(v)}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
          </SliderPrimitive.Thumb>
        )
      })}
    </SliderPrimitive.Root>
  )
}

export interface ProgressProps extends React.ComponentProps<"div"> {
  value?: number
  max?: number
  size?: "sm" | "md"
}

/** Progress bar; the fill springs to the new value. */
function Progress({ className, value = 0, max = 100, size = "md", ...props }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("w-full overflow-hidden rounded-full bg-muted", size === "sm" ? "h-1" : "h-2", className)}
      {...props}
    >
      <motion.div
        data-slot="progress-indicator"
        className="h-full rounded-full bg-primary"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={springSoft}
      />
    </div>
  )
}

export { Slider, Progress }
