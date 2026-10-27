"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Pipette } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springBouncy } from "@/registry/facet/lib/motion"
import { CellLabel, cellRow } from "@/registry/facet/ui/cell-switch"

export type ColorSwatch = { name: string; value: string }

export interface CellColorPickerProps extends Omit<React.ComponentProps<typeof motion.div>, "onChange" | "defaultValue"> {
  label: React.ReactNode
  swatches: ColorSwatch[]
  /** Hex colour (#rrggbb). */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Show the custom colour input after the presets. */
  allowCustom?: boolean
  /** Hide swatches past this index on narrow containers. */
  collapseAfter?: number
}

/**
 * Settings row with preset swatches and a custom colour input. The selection ring glides between
 * swatches (shared layout) and the colour name rolls over.
 */
function CellColorPicker({
  className,
  label,
  swatches,
  value,
  defaultValue,
  onValueChange,
  allowCustom = true,
  collapseAfter = 3,
  ...props
}: CellColorPickerProps) {
  const [inner, setInner] = React.useState(defaultValue ?? swatches[0]?.value ?? "#000000")
  const current = (value ?? inner).toLowerCase()
  const match = swatches.find((s) => s.value.toLowerCase() === current)
  const layoutId = React.useId()
  const set = (v: string) => {
    setInner(v)
    onValueChange?.(v)
  }

  const ring = (
    <motion.span
      layoutId={layoutId}
      aria-hidden="true"
      className="pointer-events-none absolute -inset-[4px] rounded-full border-2"
      style={{ borderColor: current }}
      transition={spring}
    />
  )

  return (
    <motion.div
      data-slot="cell-color-picker"
      variants={cellRow}
      className={cn(
        "relative flex min-h-[52px] items-center gap-3 px-4 py-2 [[data-slot^=cell]+&]:border-t [[data-slot^=cell]+&]:border-border-subtle [[data-slot=cell-group-label]+&]:border-t-0",
        className
      )}
      {...props}
    >
      <CellLabel
        description={
          <span className="relative inline-flex overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={match?.name ?? current}
                className="tabular-nums"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={spring}
              >
                {match?.name ?? current.toUpperCase()}
              </motion.span>
            </AnimatePresence>
          </span>
        }
      >
        {label}
      </CellLabel>
      <div role="group" aria-label={typeof label === "string" ? label : undefined} className="flex items-center gap-2">
        {swatches.map((s, i) => {
          const on = s.value.toLowerCase() === current
          return (
            <motion.button
              key={s.value}
              type="button"
              aria-label={s.name}
              aria-pressed={on}
              onClick={() => set(s.value)}
              className={cn(
                "relative size-[22px] shrink-0 cursor-pointer rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                i >= collapseAfter && "hidden @sm:block"
              )}
              style={{ background: s.value }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              transition={springBouncy}
            >
              {on && ring}
            </motion.button>
          )
        })}
        {allowCustom && (
          <motion.label
            className="relative grid size-[22px] shrink-0 cursor-pointer place-items-center rounded-full has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-4 has-[input:focus-visible]:ring-offset-background"
            style={{
              background: match ? "conic-gradient(in hsl longer hue, hsl(0 85% 60%), hsl(0 85% 60%))" /* hue wheel */ : current,
            }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            transition={springBouncy}
            title="Custom colour"
          >
            {!match && ring}
            <Pipette aria-hidden="true" className="size-3 text-white drop-shadow-[0_1px_1px_rgb(0_0_0/0.5)]" />
            <input
              type="color"
              aria-label="Custom colour"
              value={current}
              onChange={(e) => set(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </motion.label>
        )}
      </div>
    </motion.div>
  )
}

export { CellColorPicker }
