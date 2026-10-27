"use client"

import * as React from "react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { HoverCard as HoverCardPrimitive, Popover as PopoverPrimitive, Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring } from "@/registry/facet/lib/motion"

/* Overlays scale out of their trigger: transform-origin comes from Radix's popper CSS variable. */
const pop: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: spring },
  exit: { opacity: 0, scale: 0.96, transition: { duration: durations.fast, ease } },
}

const surface = "z-50 rounded-facet-lg border border-border bg-popover text-popover-foreground shadow-lg outline-none"

function useControllableOpen(open: boolean | undefined, defaultOpen = false, onOpenChange?: (open: boolean) => void) {
  const [inner, setInner] = React.useState(defaultOpen)
  const controlled = open !== undefined
  const value = controlled ? open : inner
  const set = React.useCallback(
    (o: boolean) => {
      if (!controlled) setInner(o)
      onOpenChange?.(o)
    },
    [controlled, onOpenChange]
  )
  return [value, set] as const
}

/* ------------------------------------------------------------------------------------------------
 * Popover
 * ----------------------------------------------------------------------------------------------*/

const PopoverOpen = React.createContext(false)

function Popover({ open: openProp, defaultOpen, onOpenChange, ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const [open, setOpen] = useControllableOpen(openProp, defaultOpen, onOpenChange)
  return (
    <PopoverOpen.Provider value={open}>
      <PopoverPrimitive.Root data-slot="popover" open={open} onOpenChange={setOpen} {...props} />
    </PopoverOpen.Provider>
  )
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverClose(props: React.ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 8,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const open = React.useContext(PopoverOpen)
  return (
    <AnimatePresence>
      {open && (
        <PopoverPrimitive.Portal forceMount>
          <PopoverPrimitive.Content forceMount asChild align={align} sideOffset={sideOffset} {...props}>
            <motion.div
              data-slot="popover-content"
              className={cn(surface, "w-[300px] p-4 origin-(--radix-popover-content-transform-origin)", className)}
              variants={pop}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {children}
            </motion.div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Tooltip
 * ----------------------------------------------------------------------------------------------*/

const TooltipOpen = React.createContext(false)

function TooltipProvider({ delayDuration = 200, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
}

function Tooltip({ open: openProp, defaultOpen, onOpenChange, ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  const [open, setOpen] = useControllableOpen(openProp, defaultOpen, onOpenChange)
  return (
    <TooltipProvider>
      <TooltipOpen.Provider value={open}>
        <TooltipPrimitive.Root data-slot="tooltip" open={open} onOpenChange={setOpen} {...props} />
      </TooltipOpen.Provider>
    </TooltipProvider>
  )
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({ className, sideOffset = 6, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  const open = React.useContext(TooltipOpen)
  return (
    <AnimatePresence>
      {open && (
        <TooltipPrimitive.Portal forceMount>
          <TooltipPrimitive.Content forceMount asChild sideOffset={sideOffset} {...props}>
            <motion.div
              data-slot="tooltip-content"
              className={cn(
                "z-50 rounded-facet-sm bg-inverse px-2 py-1 text-xs font-medium text-inverse-foreground shadow-md origin-(--radix-tooltip-content-transform-origin)",
                className
              )}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1, transition: { ...spring, stiffness: 700 } }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
            >
              {children}
            </motion.div>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------------------------------------
 * HoverCard
 * ----------------------------------------------------------------------------------------------*/

const HoverCardOpen = React.createContext(false)

function HoverCard({ open: openProp, defaultOpen, onOpenChange, openDelay = 250, closeDelay = 150, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  const [open, setOpen] = useControllableOpen(openProp, defaultOpen, onOpenChange)
  return (
    <HoverCardOpen.Provider value={open}>
      <HoverCardPrimitive.Root data-slot="hover-card" open={open} onOpenChange={setOpen} openDelay={openDelay} closeDelay={closeDelay} {...props} />
    </HoverCardOpen.Provider>
  )
}

function HoverCardTrigger(props: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
}

function HoverCardContent({ className, align = "center", sideOffset = 8, children, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  const open = React.useContext(HoverCardOpen)
  return (
    <AnimatePresence>
      {open && (
        <HoverCardPrimitive.Portal forceMount>
          <HoverCardPrimitive.Content forceMount asChild align={align} sideOffset={sideOffset} {...props}>
            <motion.div
              data-slot="hover-card-content"
              className={cn(surface, "w-72 p-4 origin-(--radix-hover-card-content-transform-origin)", className)}
              variants={pop}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {children}
            </motion.div>
          </HoverCardPrimitive.Content>
        </HoverCardPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverClose,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
}
