"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring } from "@/registry/facet/lib/motion"

/* We mirror Radix's open items so content can stay mounted and animate its height both ways. */
const OpenItemsContext = React.createContext<string[]>([])
const ItemValueContext = React.createContext("")

const toArray = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : v ? [v] : [])

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>

function Accordion({ className, ...props }: AccordionProps) {
  const [mirror, setMirror] = React.useState<string[]>(() => toArray(props.value ?? props.defaultValue))
  const open = props.value !== undefined ? toArray(props.value) : mirror
  const onValueChange = props.onValueChange as ((v: string | string[]) => void) | undefined
  const rootProps = {
    ...props,
    onValueChange: (v: string | string[]) => {
      setMirror(toArray(v))
      onValueChange?.(v)
    },
  } as AccordionProps
  return (
    <OpenItemsContext.Provider value={open}>
      <AccordionPrimitive.Root data-slot="accordion" className={cn("border-t border-border", className)} {...rootProps} />
    </OpenItemsContext.Provider>
  )
}

function AccordionItem({ className, value, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <ItemValueContext.Provider value={value}>
      <AccordionPrimitive.Item data-slot="accordion-item" value={value} className={cn("border-b border-border", className)} {...props} />
    </ItemValueContext.Provider>
  )
}

function useItemOpen() {
  const open = React.useContext(OpenItemsContext)
  const value = React.useContext(ItemValueContext)
  return open.includes(value)
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const open = useItemOpen()
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 cursor-pointer items-center justify-between gap-3 rounded-facet-sm px-1 py-4 text-left text-[15px] font-medium text-foreground outline-none transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <motion.span
          aria-hidden="true"
          className="grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors group-hover:bg-accent group-hover:text-foreground"
          initial={false}
          animate={{ rotate: open ? 180 : 0 }}
          transition={spring}
        >
          <ChevronDownIcon className="size-4" />
        </motion.span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const open = useItemOpen()
  return (
    <AccordionPrimitive.Content forceMount hidden={false} asChild {...props}>
      <motion.div
        data-slot="accordion-content"
        className="overflow-hidden"
        initial={false}
        animate={open ? { height: "auto" } : { height: 0 }}
        transition={open ? { ...spring, stiffness: 320, damping: 34 } : { duration: durations.base, ease }}
        inert={!open}
      >
        <motion.div
          className={cn("px-1 pb-4 text-sm text-foreground-secondary", className)}
          initial={false}
          animate={open ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: -6, filter: "blur(2px)" }}
          transition={{ duration: durations.base, ease }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
