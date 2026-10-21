"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Select as SelectPrimitive } from "radix-ui"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, popIn, spring } from "@/registry/facet/lib/motion"
import { CellIcon, CellLabel, cellRow } from "@/registry/facet/ui/cell-switch"

export type CellSelectItem = { value: string; label: React.ReactNode; textValue?: string }

export interface CellSelectProps extends Omit<React.ComponentProps<typeof motion.div>, "onChange" | "defaultValue"> {
  label: string
  description?: React.ReactNode
  icon?: React.ReactNode
  tone?: string
  items: CellSelectItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
}

/**
 * Settings row with a compact, borderless right-aligned select. The value rolls when it changes
 * and the menu pops in from the trigger.
 */
function CellSelect({
  className,
  label,
  description,
  icon,
  tone,
  items,
  value,
  defaultValue,
  onValueChange,
  disabled,
  ...props
}: CellSelectProps) {
  const [inner, setInner] = React.useState(defaultValue ?? items[0]?.value ?? "")
  const current = value ?? inner
  const selected = items.find((i) => i.value === current)

  return (
    <motion.div
      data-slot="cell-select"
      variants={cellRow}
      className={cn(
        "relative flex min-h-[52px] items-center gap-3 px-4 py-2 [[data-slot^=cell]+&]:border-t [[data-slot^=cell]+&]:border-border-subtle [[data-slot=cell-group-label]+&]:border-t-0",
        className
      )}
      {...props}
    >
      {icon != null && <CellIcon tone={tone}>{icon}</CellIcon>}
      <CellLabel description={description}>{label}</CellLabel>
      <SelectPrimitive.Root
        value={current}
        disabled={disabled}
        onValueChange={(v) => {
          setInner(v)
          onValueChange?.(v)
        }}
      >
        <SelectPrimitive.Trigger
          aria-label={label}
          className="inline-flex max-w-[55%] min-w-0 cursor-pointer items-center gap-1 rounded-facet-sm py-1 pr-1 pl-2 text-sm text-foreground-secondary outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-foreground"
        >
          <span className="relative min-w-0 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={current}
                className="block truncate"
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={spring}
              >
                {selected?.label}
              </motion.span>
            </AnimatePresence>
          </span>
          <SelectPrimitive.Icon className="shrink-0 text-placeholder">
            <ChevronsUpDown className="size-4" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content position="popper" align="end" sideOffset={6} className="z-50">
            <motion.div
              variants={popIn}
              initial="hidden"
              animate="visible"
              style={{ transformOrigin: "var(--radix-select-content-transform-origin)" }}
              className="max-h-[var(--radix-select-content-available-height)] min-w-[max(var(--radix-select-trigger-width),10rem)] overflow-hidden rounded-facet-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
            >
              <SelectPrimitive.Viewport>
                {items.map((item, i) => (
                  <SelectPrimitive.Item
                    key={item.value}
                    value={item.value}
                    textValue={item.textValue}
                    className="relative flex cursor-pointer items-center gap-2 rounded-facet-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none data-[highlighted]:bg-accent data-[state=checked]:font-medium"
                  >
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02, duration: durations.base, ease }}
                    >
                      <SelectPrimitive.ItemText>{item.label}</SelectPrimitive.ItemText>
                    </motion.span>
                    <SelectPrimitive.ItemIndicator asChild>
                      <motion.span
                        className="absolute right-2 text-brand"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={spring}
                      >
                        <Check className="size-4" />
                      </motion.span>
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </motion.div>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </motion.div>
  )
}

export { CellSelect }
