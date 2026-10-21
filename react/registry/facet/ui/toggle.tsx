"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Toggle as TogglePrimitive, ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/facet/lib/utils"
import { spring } from "@/registry/facet/lib/motion"

const toggleVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-facet border border-transparent font-medium whitespace-nowrap text-foreground-secondary outline-none transition-colors duration-150 select-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[state=on]:text-brand [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-border bg-card",
      },
      size: {
        sm: "h-8 min-w-8 px-2 text-[13px]",
        md: "h-9 min-w-9 px-2.5 text-sm",
        lg: "h-11 min-w-11 px-3 text-[15px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
)

type ToggleProps = Omit<React.ComponentProps<typeof TogglePrimitive.Root>, "asChild"> & VariantProps<typeof toggleVariants>

/** Two-state button. The pressed surface fades/scales in and the button gives a spring press. */
function Toggle({ className, variant, size, pressed, defaultPressed, onPressedChange, children, ...props }: ToggleProps) {
  const [inner, setInner] = React.useState(defaultPressed ?? false)
  const on = pressed ?? inner
  return (
    <TogglePrimitive.Root
      asChild
      pressed={on}
      onPressedChange={(v) => {
        setInner(v)
        onPressedChange?.(v)
      }}
      {...props}
    >
      <motion.button
        data-slot="toggle"
        className={cn(toggleVariants({ variant, size }), "hover:bg-accent data-[state=on]:hover:bg-transparent", className)}
        whileTap={{ scale: 0.94 }}
        transition={spring}
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-[inherit] bg-primary-subtle"
          initial={false}
          animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.85 }}
          transition={spring}
        />
        <span className="relative inline-flex items-center gap-[inherit]">{children}</span>
      </motion.button>
    </TogglePrimitive.Root>
  )
}

type GroupCtx = { selected: string[]; layoutId: string; single: boolean } & VariantProps<typeof toggleVariants>
const ToggleGroupContext = React.createContext<GroupCtx>({ selected: [], layoutId: "", single: true })

type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>

/** Group of toggles. In single mode the selection pill slides between items (shared layout). */
function ToggleGroup({ className, variant, size, children, ...props }: ToggleGroupProps) {
  const p = props as { type: "single" | "multiple"; value?: string | string[]; defaultValue?: string | string[]; onValueChange?: (v: never) => void }
  const [inner, setInner] = React.useState<string | string[]>(p.defaultValue ?? (p.type === "multiple" ? [] : ""))
  const current = p.value ?? inner
  const selected = Array.isArray(current) ? current : current ? [current] : []
  const layoutId = React.useId()

  const rootProps = {
    ...props,
    value: current,
    defaultValue: undefined,
    onValueChange: (v: string | string[]) => {
      setInner(v)
      p.onValueChange?.(v as never)
    },
  } as React.ComponentProps<typeof ToggleGroupPrimitive.Root>

  return (
    <ToggleGroupContext.Provider value={{ selected, layoutId, single: p.type === "single", variant, size }}>
      <ToggleGroupPrimitive.Root
        data-slot="toggle-group"
        className={cn(
          "inline-flex items-center gap-0.5 rounded-facet border border-border bg-card p-0.5",
          "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
          className
        )}
        {...rootProps}
      >
        {children}
      </ToggleGroupPrimitive.Root>
    </ToggleGroupContext.Provider>
  )
}

function ToggleGroupItem({
  className,
  children,
  value,
  ...props
}: Omit<React.ComponentProps<typeof ToggleGroupPrimitive.Item>, "asChild">) {
  const ctx = React.useContext(ToggleGroupContext)
  const on = ctx.selected.includes(value)
  const sizeCls = ctx.size === "sm" ? "h-[26px] text-[13px]" : ctx.size === "lg" ? "h-[38px] text-[15px]" : "h-[30px] text-sm"
  return (
    <ToggleGroupPrimitive.Item asChild value={value} {...props}>
      <motion.button
        data-slot="toggle-group-item"
        className={cn(
          toggleVariants({ variant: "default", size: ctx.size }),
          "min-w-0 rounded-[6px] hover:bg-accent data-[state=on]:hover:bg-transparent",
          sizeCls,
          className
        )}
        whileTap={{ scale: 0.95 }}
        transition={spring}
      >
        {ctx.single ? (
          on && (
            <motion.span
              aria-hidden="true"
              layoutId={ctx.layoutId}
              className="absolute inset-0 rounded-[inherit] bg-primary-subtle"
              transition={spring}
            />
          )
        ) : (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-[inherit] bg-primary-subtle"
            initial={false}
            animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.85 }}
            transition={spring}
          />
        )}
        <span className="relative inline-flex items-center gap-[inherit]">{children}</span>
      </motion.button>
    </ToggleGroupPrimitive.Item>
  )
}

export { Toggle, ToggleGroup, ToggleGroupItem, toggleVariants }
