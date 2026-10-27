"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springSoft, stagger } from "@/registry/facet/lib/motion"
import { Switch } from "@/registry/facet/ui/switch"

/* ---------- shared settings-list primitives (used by every cell-* component) ---------- */

export interface CellGroupProps extends React.ComponentProps<typeof motion.div> {
  variant?: "default" | "secondary"
}

/** Rounded settings group. Rows fade/slide in with a light stagger on mount. */
function CellGroup({ className, variant = "default", ...props }: CellGroupProps) {
  return (
    <motion.div
      data-slot="cell-group"
      data-variant={variant}
      variants={stagger(0.04)}
      initial="hidden"
      animate="visible"
      className={cn(
        "@container flex flex-col overflow-hidden rounded-facet-lg",
        variant === "secondary" ? "bg-subtle" : "border border-border bg-card",
        className
      )}
      {...props}
    />
  )
}

function CellGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="cell-group-label"
      className={cn("px-4 pt-3 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase", className)}
      {...props}
    />
  )
}

const cellRow = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: springSoft },
}

const cellClass =
  "relative flex min-h-[52px] items-center gap-3 px-4 py-2 [[data-slot^=cell]+&]:border-t [[data-slot^=cell]+&]:border-border-subtle [[data-slot=cell-group-label]+&]:border-t-0"

export interface CellProps extends React.ComponentProps<typeof motion.div> {
  /** Hover surface + pointer cursor (set on rows that act as a single control). */
  interactive?: boolean
}

function Cell({ className, interactive, ...props }: CellProps) {
  return (
    <motion.div
      data-slot="cell"
      data-interactive={interactive || undefined}
      variants={cellRow}
      className={cn(cellClass, interactive && "cursor-pointer transition-colors hover:bg-subtle", className)}
      {...props}
    />
  )
}

export interface CellIconProps extends React.ComponentProps<"span"> {
  /** Tile colour — any CSS colour or token, e.g. "var(--chart-2)". Defaults to the primary colour. */
  tone?: string
}

function CellIcon({ className, tone, style, ...props }: CellIconProps) {
  return (
    <span
      data-slot="cell-icon"
      aria-hidden="true"
      className={cn("grid size-7 shrink-0 place-items-center rounded-facet-sm bg-primary text-white [&_svg:not([class*='size-'])]:size-[15px]", className)}
      style={{ ...(tone ? { background: tone } : null), ...style }}
      {...props}
    />
  )
}

function CellLabel({
  className,
  description,
  children,
  ...props
}: React.ComponentProps<"span"> & { description?: React.ReactNode }) {
  return (
    <span data-slot="cell-label" className={cn("min-w-0 flex-1 text-sm font-medium text-foreground", className)} {...props}>
      {children}
      {description != null && <small className="mt-px block text-xs font-normal text-muted-foreground">{description}</small>}
    </span>
  )
}

/* ---------- CellSwitch ---------- */

export interface CellSwitchProps extends Omit<React.ComponentProps<typeof motion.label>, "onChange" | "children"> {
  label: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  tone?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

/** Settings row with a trailing switch. The whole row is the hit target; the icon tile pops when switched on. */
function CellSwitch({
  className,
  label,
  description,
  icon,
  tone,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  ...props
}: CellSwitchProps) {
  const [inner, setInner] = React.useState(defaultChecked ?? false)
  const on = checked ?? inner
  const id = React.useId()
  return (
    <motion.label
      data-slot="cell-switch"
      htmlFor={id}
      variants={cellRow}
      className={cn(
        cellClass,
        "cursor-pointer transition-colors hover:bg-subtle",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {icon != null && (
        <motion.span className="inline-flex" animate={{ scale: on ? [1, 1.14, 1] : 1 }} transition={{ duration: 0.3 }}>
          <CellIcon tone={tone}>{icon}</CellIcon>
        </motion.span>
      )}
      <CellLabel description={description}>{label}</CellLabel>
      <Switch
        id={id}
        checked={on}
        disabled={disabled}
        onCheckedChange={(v) => {
          setInner(v)
          onCheckedChange?.(v)
        }}
        className="ml-auto"
      />
    </motion.label>
  )
}

/** Small cross-fading value text used by cell rows (e.g. the selected colour name). */
function CellValue({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="cell-value" className={cn("relative inline-flex text-[13px] text-muted-foreground tabular-nums", className)} {...props}>
      <motion.span key={String(children)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
        {children}
      </motion.span>
    </span>
  )
}

export { CellGroup, CellGroupLabel, Cell, CellIcon, CellLabel, CellValue, CellSwitch, cellRow }
