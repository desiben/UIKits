"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springBouncy, springSoft, stagger } from "@/registry/facet/lib/motion"
import { Checkbox } from "@/registry/facet/ui/checkbox"

type GroupCtx = { value: string[]; toggle: (v: string, on: boolean) => void; disabled?: boolean }
const GroupContext = React.createContext<GroupCtx | null>(null)

export interface CheckboxButtonGroupProps extends Omit<React.ComponentProps<"fieldset">, "onChange" | "defaultValue"> {
  /** Visible legend for the group. */
  label?: React.ReactNode
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** "grid" auto-fits cards ≥180px wide; "list" stacks them. Use `columns` for a fixed count. */
  layout?: "grid" | "list"
  columns?: number
}

/** Card-style multi-select. Cards stagger in, lift on hover and glow + check-draw when selected. */
function CheckboxButtonGroup({
  className,
  label,
  value,
  defaultValue,
  onValueChange,
  layout = "grid",
  columns,
  disabled,
  children,
  style,
  ...props
}: CheckboxButtonGroupProps) {
  const [inner, setInner] = React.useState<string[]>(defaultValue ?? [])
  const current = value ?? inner
  const toggle = (v: string, on: boolean) => {
    const next = on ? [...current.filter((x) => x !== v), v] : current.filter((x) => x !== v)
    setInner(next)
    onValueChange?.(next)
  }
  return (
    <GroupContext.Provider value={{ value: current, toggle, disabled }}>
      <fieldset
        data-slot="checkbox-button-group"
        disabled={disabled}
        className={cn("m-0 w-full min-w-0 border-0 p-0", className)}
        {...props}
      >
        {label != null && <legend className="mb-2 text-[13px] font-medium text-foreground">{label}</legend>}
        <motion.div
          variants={stagger(0.05)}
          initial="hidden"
          animate="visible"
          className={cn(
            "grid gap-2",
            columns ? "grid-cols-[repeat(var(--cols),minmax(0,1fr))]" : layout === "grid" ? "grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))]" : "grid-cols-1"
          )}
          style={{ ...(columns ? ({ "--cols": columns } as React.CSSProperties) : null), ...style }}
        >
          {children}
        </motion.div>
      </fieldset>
    </GroupContext.Provider>
  )
}

export interface CheckboxButtonProps extends Omit<React.ComponentProps<typeof motion.label>, "children" | "title"> {
  value: string
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  /** Extra trailing content (e.g. a price). */
  addon?: React.ReactNode
  disabled?: boolean
}

function CheckboxButton({ className, value, title, description, icon, addon, disabled, ...props }: CheckboxButtonProps) {
  const ctx = React.useContext(GroupContext)
  if (!ctx) throw new Error("CheckboxButton must be used inside <CheckboxButtonGroup>")
  const on = ctx.value.includes(value)
  const isDisabled = disabled || ctx.disabled
  const id = React.useId()

  return (
    <motion.label
      data-slot="checkbox-button"
      data-state={on ? "checked" : "unchecked"}
      data-disabled={isDisabled || undefined}
      htmlFor={id}
      variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: springSoft } }}
      whileHover={isDisabled ? undefined : { y: -2 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={springSoft}
      className={cn(
        "relative flex cursor-pointer items-start gap-3 rounded-facet-lg border border-border bg-card px-4 py-3 transition-[border-color,background-color,box-shadow] duration-200",
        "hover:border-border-strong has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-ring has-[button:focus-visible]:ring-offset-2 has-[button:focus-visible]:ring-offset-background",
        on && "border-primary bg-primary-subtle shadow-[0_0_0_1px_var(--primary)] hover:border-primary",
        isDisabled && "cursor-not-allowed opacity-55",
        className
      )}
      {...props}
    >
      <Checkbox
        id={id}
        checked={on}
        disabled={isDisabled}
        onCheckedChange={(v) => ctx.toggle(value, v === true)}
        className="mt-0.5 [&:focus-visible]:ring-0 [&:focus-visible]:ring-offset-0"
      />
      <span className="min-w-0 flex-1">
        <b className="block text-sm font-medium text-foreground">{title}</b>
        {description != null && <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>}
      </span>
      {addon}
      {icon != null && (
        <motion.span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-facet bg-primary-subtle text-brand [&_svg:not([class*='size-'])]:size-[18px]"
          animate={on ? { scale: 1, rotate: [0, -8, 8, 0], backgroundColor: "var(--card)" } : { scale: 1, rotate: 0, backgroundColor: "var(--primary-subtle)" }}
          transition={on ? { ...springBouncy, rotate: { duration: 0.4 } } : spring}
        >
          {icon}
        </motion.span>
      )}
    </motion.label>
  )
}

export { CheckboxButtonGroup, CheckboxButton }
