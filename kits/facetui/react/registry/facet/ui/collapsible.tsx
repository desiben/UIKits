"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { ChevronsUpDown } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springSoft } from "@/registry/facet/lib/motion"

const CollapsibleContext = React.createContext<{ open: boolean }>({ open: false })

function Collapsible({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  const [inner, setInner] = React.useState(defaultOpen)
  const open = openProp ?? inner
  return (
    <CollapsibleContext.Provider value={{ open }}>
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        open={open}
        onOpenChange={(o) => {
          if (openProp === undefined) setInner(o)
          onOpenChange?.(o)
        }}
        className={cn("w-full", className)}
        {...props}
      />
    </CollapsibleContext.Provider>
  )
}

function CollapsibleTrigger(props: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
}

/** A ghost icon button whose chevrons squeeze and flip as the region opens. */
function CollapsibleIconTrigger({
  className,
  children,
  "aria-label": ariaLabel = "Toggle",
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  const { open } = React.useContext(CollapsibleContext)
  return (
    <CollapsiblePrimitive.Trigger asChild {...props}>
      <motion.button
        type="button"
        aria-label={ariaLabel}
        data-slot="collapsible-trigger"
        whileTap={{ scale: 0.9 }}
        transition={spring}
        className={cn(
          "inline-grid size-8 shrink-0 cursor-pointer place-items-center rounded-facet text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        )}
      >
        {children ?? (
          <motion.span className="inline-flex" animate={{ rotate: open ? 180 : 0, scaleY: open ? 0.85 : 1 }} transition={springSoft}>
            <ChevronsUpDown className="size-4" />
          </motion.span>
        )}
      </motion.button>
    </CollapsiblePrimitive.Trigger>
  )
}

/** The hidden region. Height springs open, children fade and rise in sequence. */
function CollapsibleContent({ className, children, ...props }: Omit<React.ComponentProps<typeof CollapsiblePrimitive.Content>, "forceMount">) {
  const { open } = React.useContext(CollapsibleContext)
  return (
    <AnimatePresence initial={false}>
      {open && (
        <CollapsiblePrimitive.Content forceMount asChild {...props}>
          <motion.div
            data-slot="collapsible-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { height: springSoft, opacity: { duration: durations.base, ease } } }}
            exit={{ height: 0, opacity: 0, transition: { duration: durations.base, ease } }}
            className="overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } } }}
              className={className}
            >
              {children}
            </motion.div>
          </motion.div>
        </CollapsiblePrimitive.Content>
      )}
    </AnimatePresence>
  )
}

/** Optional child wrapper that joins the stagger inside CollapsibleContent. */
function CollapsibleItem({ className, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      data-slot="collapsible-item"
      variants={{ hidden: { opacity: 0, y: -6 }, visible: { opacity: 1, y: 0, transition: springSoft } }}
      className={className}
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleIconTrigger, CollapsibleContent, CollapsibleItem }
