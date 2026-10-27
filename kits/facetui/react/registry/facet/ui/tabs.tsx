"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring } from "@/registry/facet/lib/motion"

type Variant = "underline" | "pill"
const TabsContext = React.createContext<{ value: string; id: string }>({ value: "", id: "" })
const VariantContext = React.createContext<Variant>("underline")

function Tabs({ className, value: valueProp, defaultValue = "", onValueChange, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const id = React.useId()
  return (
    <TabsContext.Provider value={{ value, id }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        value={value}
        onValueChange={(v) => {
          if (valueProp === undefined) setInner(v)
          onValueChange?.(v)
        }}
        className={cn("flex flex-col", className)}
        {...props}
      />
    </TabsContext.Provider>
  )
}

const listClass: Record<Variant, string> = {
  underline: "flex gap-5 border-b border-border",
  pill: "inline-flex w-fit gap-0.5 rounded-facet bg-muted p-[3px]",
}

function TabsList({ className, variant = "underline", ...props }: React.ComponentProps<typeof TabsPrimitive.List> & { variant?: Variant }) {
  return (
    <VariantContext.Provider value={variant}>
      <TabsPrimitive.List data-slot="tabs-list" data-variant={variant} className={cn(listClass[variant], className)} {...props} />
    </VariantContext.Provider>
  )
}

function TabsTrigger({ className, value, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const tabs = React.useContext(TabsContext)
  const variant = React.useContext(VariantContext)
  const selected = tabs.value === value
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        "relative inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors duration-150 select-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground [&_svg]:size-4 [&_svg]:shrink-0",
        variant === "underline" ? "h-10 rounded-t-sm px-0.5" : "h-[30px] rounded-[6px] px-3",
        className
      )}
      {...props}
    >
      {selected && (
        <motion.span
          aria-hidden="true"
          layoutId={`${tabs.id}-indicator`}
          transition={spring}
          className={
            variant === "underline"
              ? "absolute inset-x-0 -bottom-px h-0.5 rounded-t-[2px] bg-primary"
              : "absolute inset-0 rounded-[6px] bg-card shadow-sm ring-1 ring-border-subtle"
          }
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({ className, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content data-slot="tabs-content" asChild {...props}>
      <motion.div
        className={cn("outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.base, ease }}
      >
        {children}
      </motion.div>
    </TabsPrimitive.Content>
  )
}

/** Small count badge for tab labels. */
function TabsBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tabs-badge"
      className={cn("inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-semibold text-muted-foreground tabular-nums", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsBadge }
