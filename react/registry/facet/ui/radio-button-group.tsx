"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springSoft } from "@/registry/facet/lib/motion"

type GroupStyle = "cards" | "buttons"

const GroupContext = React.createContext<{ value?: string; style: GroupStyle; id: string }>({
  style: "cards",
  id: "rbg",
})

interface RadioButtonGroupProps extends React.ComponentProps<typeof RadioGroupPrimitive.Root> {
  /** "cards" for rich options (plans), "buttons" for short compact options (sizes). */
  variant?: GroupStyle
  /** Number of columns for the card layout. */
  columns?: number
}

function RadioButtonGroup({
  className,
  variant = "cards",
  columns = 1,
  value: valueProp,
  defaultValue,
  onValueChange,
  style,
  ...props
}: RadioButtonGroupProps) {
  const id = React.useId()
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  return (
    <GroupContext.Provider value={{ value, style: variant, id }}>
      <RadioGroupPrimitive.Root
        data-slot="radio-button-group"
        data-variant={variant}
        value={value}
        onValueChange={(v) => {
          if (valueProp === undefined) setInner(v)
          onValueChange?.(v)
        }}
        className={cn(
          "grid gap-2",
          variant === "buttons" && "grid-cols-[repeat(auto-fit,minmax(56px,1fr))] gap-1.5",
          className
        )}
        style={variant === "cards" ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, ...style } : style}
        {...props}
      />
    </GroupContext.Provider>
  )
}

interface RadioButtonProps extends Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, "title"> {
  /** Main label. */
  title?: React.ReactNode
  /** Secondary line under the title (cards only). */
  description?: React.ReactNode
  /** Right-aligned extra, e.g. a price (cards only). */
  aside?: React.ReactNode
  /** Leading icon tile (cards only). */
  icon?: React.ReactNode
}

function RadioButton({ className, title, description, aside, icon, children, value, disabled, ...props }: RadioButtonProps) {
  const ctx = React.useContext(GroupContext)
  const checked = ctx.value === value

  if (ctx.style === "buttons") {
    return (
      <RadioGroupPrimitive.Item asChild value={value} disabled={disabled} {...props}>
        <motion.button
          data-slot="radio-button"
          whileTap={{ scale: 0.95 }}
          transition={spring}
          className={cn(
            "relative isolate inline-flex h-9 cursor-pointer items-center justify-center rounded-facet border border-border bg-card px-3 text-sm font-medium text-foreground outline-none transition-colors hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-55 data-[state=checked]:border-transparent data-[state=checked]:text-brand",
            className
          )}
        >
          {checked && (
            <motion.span
              layoutId={`${ctx.id}-pill`}
              transition={springSoft}
              aria-hidden="true"
              className="absolute -inset-px -z-10 rounded-facet bg-primary-subtle ring-2 ring-primary ring-inset"
            />
          )}
          {title ?? children}
        </motion.button>
      </RadioGroupPrimitive.Item>
    )
  }

  return (
    <RadioGroupPrimitive.Item asChild value={value} disabled={disabled} {...props}>
      <motion.button
        data-slot="radio-button"
        whileTap={{ scale: 0.985 }}
        transition={spring}
        className={cn(
          "group relative isolate flex w-full cursor-pointer items-start gap-3 rounded-facet-lg border border-border bg-card px-4 py-3 text-left outline-none transition-colors hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-55 data-[state=checked]:border-transparent",
          className
        )}
      >
        {checked && (
          <motion.span
            layoutId={`${ctx.id}-card`}
            transition={springSoft}
            aria-hidden="true"
            className="absolute -inset-px -z-10 rounded-facet-lg bg-primary-subtle ring-2 ring-primary ring-inset"
          />
        )}
        <span
          aria-hidden="true"
          className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border-[1.5px] border-input bg-card transition-colors group-data-[state=checked]:border-primary"
        >
          <AnimatePresence initial={false}>
            {checked && (
              <motion.span
                className="size-2 rounded-full bg-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 600, damping: 18 }}
              />
            )}
          </AnimatePresence>
        </span>
        {icon && (
          <span className="grid size-9 shrink-0 place-items-center rounded-facet bg-primary-subtle text-brand [&_svg]:size-[18px]">
            {icon}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">{title}</span>
          {description && <span className="mt-0.5 block text-[13px] text-muted-foreground">{description}</span>}
          {children}
        </span>
        {aside && <span className="text-sm font-medium tabular-nums text-foreground">{aside}</span>}
      </motion.button>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioButtonGroup, RadioButton }
