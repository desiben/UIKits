"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { slideUp, spring, stagger } from "@/registry/facet/lib/motion"

type SelectionMode = "none" | "single" | "multiple"

interface ListViewContextValue {
  mode: SelectionMode
  selected: Set<string>
  toggle: (value: string) => void
  railId: string
}

const ListViewContext = React.createContext<ListViewContextValue | null>(null)

interface ListViewProps extends Omit<HTMLMotionProps<"div">, "defaultValue" | "onChange"> {
  selectionMode?: SelectionMode
  /** Selected value(s). A string for single mode, an array for multiple. */
  value?: string | string[] | null
  defaultValue?: string | string[] | null
  onValueChange?: (value: string[]) => void
  /** Accessible name of the list. */
  label?: string
}

function toArray(v: string | string[] | null | undefined) {
  return v == null ? [] : Array.isArray(v) ? v : [v]
}

function ListView({
  selectionMode = "none",
  value,
  defaultValue,
  onValueChange,
  label,
  className,
  children,
  onKeyDown,
  ...props
}: ListViewProps) {
  const [inner, setInner] = React.useState<string[]>(() => toArray(defaultValue))
  const selectedArr = value !== undefined ? toArray(value) : inner
  const selected = React.useMemo(() => new Set(selectedArr), [selectedArr.join("\u0000")]) // eslint-disable-line react-hooks/exhaustive-deps
  const railId = React.useId()

  const toggle = React.useCallback(
    (v: string) => {
      if (selectionMode === "none") return
      let next: string[]
      if (selectionMode === "single") next = [v]
      else next = selected.has(v) ? [...selected].filter((x) => x !== v) : [...selected, v]
      if (value === undefined) setInner(next)
      onValueChange?.(next)
    },
    [selectionMode, selected, value, onValueChange]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[data-slot=list-view-item]:not([aria-disabled=true])"))
    const i = items.indexOf(document.activeElement as HTMLElement)
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : e.key === "ArrowDown" ? Math.min(items.length - 1, i + 1) : Math.max(0, i - 1)
    items[next]?.focus()
    e.preventDefault()
  }

  return (
    <ListViewContext.Provider value={{ mode: selectionMode, selected, toggle, railId }}>
      <motion.div
        data-slot="list-view"
        role={selectionMode === "none" ? "list" : "listbox"}
        aria-label={label}
        aria-multiselectable={selectionMode === "multiple" || undefined}
        initial="hidden"
        animate="visible"
        variants={stagger(0.04)}
        onKeyDown={handleKeyDown}
        className={cn("@container flex w-full flex-col overflow-hidden rounded-facet-lg border border-border bg-card", className)}
        {...props}
      >
        {children}
      </motion.div>
    </ListViewContext.Provider>
  )
}

function ListViewHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-view-header"
      className={cn("flex items-center gap-2 border-b border-border px-4 py-3 text-sm font-medium [&_svg]:size-4 [&_svg]:text-muted-foreground", className)}
      {...props}
    />
  )
}

interface ListViewItemProps extends Omit<HTMLMotionProps<"div">, "onSelect" | "children"> {
  children?: React.ReactNode
  /** Value used for selection (required when the list is selectable). */
  value?: string
  disabled?: boolean
  onAction?: () => void
}

function ListViewItem({ value, disabled, onAction, className, children, onClick, onKeyDown, ...props }: ListViewItemProps) {
  const ctx = React.useContext(ListViewContext)
  const interactive = !!ctx && (ctx.mode !== "none" || !!onAction)
  const isSelected = !!value && !!ctx?.selected.has(value)

  const activate = () => {
    if (disabled) return
    if (value) ctx?.toggle(value)
    onAction?.()
  }

  return (
    <motion.div
      data-slot="list-view-item"
      role={ctx?.mode === "none" || !ctx ? "listitem" : "option"}
      aria-selected={ctx && ctx.mode !== "none" ? isSelected : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={interactive && !disabled ? (isSelected || ctx?.selected.size === 0 ? 0 : -1) : undefined}
      variants={slideUp}
      whileTap={interactive && !disabled ? { scale: 0.995 } : undefined}
      onClick={(e) => {
        onClick?.(e)
        if (interactive) activate()
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (interactive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          activate()
        }
      }}
      className={cn(
        "relative flex min-h-14 items-center gap-3 px-4 py-2 text-foreground outline-none transition-colors [&+[data-slot=list-view-item]]:border-t [&+[data-slot=list-view-item]]:border-border-subtle",
        interactive && "cursor-pointer hover:bg-subtle focus-visible:bg-subtle focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        isSelected && "bg-primary-subtle hover:bg-primary-subtle",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {isSelected && ctx && (
        <motion.span
          aria-hidden="true"
          layoutId={ctx.mode === "single" ? `${ctx.railId}-rail` : undefined}
          initial={ctx.mode === "multiple" ? { scaleY: 0 } : false}
          animate={{ scaleY: 1 }}
          transition={spring}
          className="absolute top-2.5 bottom-2.5 left-0 w-[3px] rounded-r-[3px] bg-primary"
        />
      )}
      {children}
    </motion.div>
  )
}

const avatarTones = {
  1: "bg-chart-1/15 text-[color-mix(in_srgb,var(--chart-1)_75%,var(--foreground))]",
  2: "bg-chart-2/20 text-[color-mix(in_srgb,var(--chart-2)_60%,var(--foreground))]",
  3: "bg-chart-3/20 text-[color-mix(in_srgb,var(--chart-3)_60%,var(--foreground))]",
  4: "bg-chart-4/15 text-[color-mix(in_srgb,var(--chart-4)_70%,var(--foreground))]",
  5: "bg-muted text-foreground-secondary",
} as const

/** Leading avatar (initials) or icon tile. */
function ListViewItemMedia({ className, tone = 1, ...props }: React.ComponentProps<"span"> & { tone?: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span
      data-slot="list-view-item-media"
      className={cn(
        "grid size-9 flex-none place-items-center rounded-full text-[13px] font-semibold [&_svg]:size-[18px]",
        avatarTones[tone],
        className
      )}
      {...props}
    />
  )
}

function ListViewItemContent({
  title,
  description,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & { title?: React.ReactNode; description?: React.ReactNode }) {
  return (
    <div data-slot="list-view-item-content" className={cn("min-w-0 flex-1", className)} {...props}>
      {title != null && <b className="block truncate text-sm font-medium">{title}</b>}
      {description != null && <span className="block truncate text-xs text-muted-foreground">{description}</span>}
      {children}
    </div>
  )
}

function ListViewItemMeta({ className, hideOnNarrow, ...props }: React.ComponentProps<"span"> & { hideOnNarrow?: boolean }) {
  return (
    <span
      data-slot="list-view-item-meta"
      className={cn("whitespace-nowrap text-xs tabular-nums text-muted-foreground", hideOnNarrow && "@max-[420px]:hidden", className)}
      {...props}
    />
  )
}

export { ListView, ListViewHeader, ListViewItem, ListViewItemMedia, ListViewItemContent, ListViewItemMeta }
export type { ListViewProps, ListViewItemProps, SelectionMode }
