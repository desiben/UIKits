"use client"

import * as React from "react"
import { motion, type Variants } from "motion/react"
import { Select as SelectPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring } from "@/registry/facet/lib/motion"

/* Shared state: the current value (so the trigger can animate changes) and the highlighted
   option (so a single highlight can glide between options). */
const SelectContext = React.createContext<{ value?: string }>({})
const HighlightContext = React.createContext<{
  id: string
  highlighted: string | null
  setHighlighted: (v: string | null) => void
}>({ id: "", highlighted: null, setHighlighted: () => {} })

function Select({ value: valueProp, defaultValue, onValueChange, ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  return (
    <SelectContext.Provider value={{ value }}>
      <SelectPrimitive.Root
        data-slot="select"
        value={value}
        onValueChange={(v) => {
          if (valueProp === undefined) setInner(v)
          onValueChange?.(v)
        }}
        {...props}
      />
    </SelectContext.Provider>
  )
}

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  const { value } = React.useContext(SelectContext)
  return (
    <span className="relative flex min-w-0 flex-1 overflow-hidden">
      <motion.span
        key={value ?? "__placeholder"}
        initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={spring}
        className={cn(
          "flex min-w-0 items-center gap-2 truncate [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
          !value && "text-placeholder",
          className
        )}
      >
        <SelectPrimitive.Value data-slot="select-value" {...props} />
      </motion.span>
    </span>
  )
}

const triggerVariants = cva(
  "group/trigger flex w-full cursor-pointer items-center gap-2 rounded-facet border border-input bg-card px-3 text-left text-foreground outline-none transition-[border-color,box-shadow] duration-150 hover:border-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 data-[state=open]:border-ring data-[state=open]:ring-2 data-[state=open]:ring-ring/30 aria-invalid:border-danger disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-placeholder",
  {
    variants: {
      size: { sm: "h-8 text-[13px]", md: "h-9 text-sm", lg: "h-11 text-[15px]" },
    },
    defaultVariants: { size: "md" },
  }
)

function SelectTrigger({
  className,
  size,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & VariantProps<typeof triggerVariants>) {
  return (
    <SelectPrimitive.Trigger data-slot="select-trigger" className={cn(triggerVariants({ size }), className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-data-[state=open]/trigger:rotate-180"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

const panel: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...spring, staggerChildren: 0.022, delayChildren: 0.02 },
  },
}

const row: Variants = {
  hidden: { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.base, ease } },
}

function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const id = React.useId()
  const [highlighted, setHighlighted] = React.useState<string | null>(null)
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={position === "popper" ? sideOffset : undefined}
        className={cn(
          "relative z-50 min-w-[8rem] outline-none",
          position === "popper" && "max-h-(--radix-select-content-available-height) w-full min-w-(--radix-select-trigger-width)",
          className
        )}
        {...props}
      >
        <motion.div
          variants={panel}
          initial="hidden"
          animate="visible"
          style={{ transformOrigin: "var(--radix-select-content-transform-origin)" }}
          className="flex max-h-[inherit] flex-col overflow-hidden rounded-facet-lg border border-border bg-popover text-popover-foreground shadow-[0_2px_4px_-1px_rgb(10_10_31/0.06),0_12px_24px_-4px_rgb(10_10_31/0.12)]"
        >
          <SelectPrimitive.ScrollUpButton className="flex h-6 cursor-default items-center justify-center text-muted-foreground">
            <ChevronUp className="size-4" />
          </SelectPrimitive.ScrollUpButton>
          <HighlightContext.Provider value={{ id, highlighted, setHighlighted }}>
            <SelectPrimitive.Viewport
              data-slot="select-viewport"
              className="max-h-80 scroll-my-1 p-1"
              onPointerLeave={() => setHighlighted(null)}
            >
              {children}
            </SelectPrimitive.Viewport>
          </HighlightContext.Provider>
          <SelectPrimitive.ScrollDownButton className="flex h-6 cursor-default items-center justify-center text-muted-foreground">
            <ChevronDown className="size-4" />
          </SelectPrimitive.ScrollDownButton>
        </motion.div>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label asChild {...props}>
      <motion.div
        data-slot="select-label"
        variants={row}
        className={cn("px-2.5 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground", className)}
      >
        {props.children}
      </motion.div>
    </SelectPrimitive.Label>
  )
}

function SelectItem({ className, children, value, onFocus, onBlur, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const { id, highlighted, setHighlighted } = React.useContext(HighlightContext)
  const active = highlighted === value
  return (
    <SelectPrimitive.Item
      asChild
      value={value}
      onFocus={(e) => {
        setHighlighted(value)
        onFocus?.(e)
      }}
      onBlur={(e) => {
        const next = e.relatedTarget as HTMLElement | null
        if (!next?.closest?.("[data-slot=select-item]")) setHighlighted(null)
        onBlur?.(e)
      }}
      {...props}
    >
      <motion.div
        data-slot="select-item"
        variants={row}
        className={cn(
          "relative isolate flex h-8 w-full cursor-pointer items-center gap-2 rounded-facet-sm pr-2 pl-2.5 text-sm text-foreground outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:text-placeholder data-[state=checked]:font-medium [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
          className
        )}
      >
        {active && (
          <motion.span
            layoutId={`${id}-highlight`}
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-facet-sm bg-accent"
            transition={{ type: "spring", stiffness: 700, damping: 45 }}
          >
            <span className="absolute top-[7px] bottom-[7px] left-0 w-0.5 rounded-full bg-primary" />
          </motion.span>
        )}
        <SelectPrimitive.ItemText asChild>
          <span className="flex min-w-0 flex-1 items-center gap-2 truncate">{children}</span>
        </SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator className="ml-auto inline-flex">
          <svg viewBox="0 0 24 24" className="size-3.5 text-brand" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, ease, delay: 0.08 }} />
          </svg>
        </SelectPrimitive.ItemIndicator>
      </motion.div>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator data-slot="select-separator" className={cn("-mx-1 my-1 h-px bg-border-subtle", className)} {...props} />
}

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, triggerVariants as selectTriggerVariants }
