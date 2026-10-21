"use client"

import * as React from "react"
import { motion, useSpring, useTransform } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { cellRow } from "@/registry/facet/ui/cell-switch"
import { Slider } from "@/registry/facet/ui/slider"

export interface CellSliderProps extends Omit<React.ComponentProps<typeof motion.div>, "onChange" | "defaultValue"> {
  label: string
  description?: React.ReactNode
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Intl number format for the output. With style "percent" the value is read as 0–100. */
  formatOptions?: Intl.NumberFormatOptions
  /** Custom formatter (wins over formatOptions). */
  format?: (value: number) => string
  disabled?: boolean
}

/** Settings row with a live, spring-counting value and a full-width slider. */
function CellSlider({
  className,
  label,
  description,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  formatOptions,
  format,
  disabled,
  ...props
}: CellSliderProps) {
  const [inner, setInner] = React.useState(defaultValue ?? min)
  const current = value ?? inner
  const fmt = React.useMemo(() => {
    if (format) return format
    const nf = new Intl.NumberFormat(undefined, formatOptions)
    const pct = formatOptions?.style === "percent"
    return (v: number) => nf.format(pct ? v / 100 : v)
  }, [format, formatOptions])

  const spring = useSpring(current, { stiffness: 400, damping: 40, mass: 0.6 })
  React.useEffect(() => {
    spring.set(current)
  }, [current, spring])
  // round to the step so the tween never shows odd in-between decimals
  const text = useTransform(spring, (v) => fmt(Math.round(v / step) * step))

  return (
    <motion.div
      data-slot="cell-slider"
      variants={cellRow}
      className={cn(
        "relative flex flex-col gap-1 px-4 pt-3 pb-2.5 [[data-slot^=cell]+&]:border-t [[data-slot^=cell]+&]:border-border-subtle [[data-slot=cell-group-label]+&]:border-t-0",
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      <div className="flex items-baseline gap-3">
        <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
          {label}
          {description != null && <small className="mt-px block text-xs font-normal text-muted-foreground">{description}</small>}
        </span>
        <output aria-live="polite" className="ml-auto text-[13px] font-medium text-foreground-secondary tabular-nums">
          <motion.span>{text}</motion.span>
        </output>
      </div>
      <Slider
        aria-label={label}
        value={[current]}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        formatValue={fmt}
        onValueChange={([v]) => {
          setInner(v)
          onValueChange?.(v)
        }}
      />
    </motion.div>
  )
}

export { CellSlider }
