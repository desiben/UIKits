"use client"

import * as React from "react"
import { AnimatePresence, motion, useDragControls, type PanInfo } from "motion/react"
import { Dialog as SheetPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring } from "@/registry/facet/lib/motion"

type Side = "top" | "right" | "bottom" | "left"

type SheetCtx = { open: boolean; setOpen: (open: boolean) => void; modal: boolean }
const SheetContext = React.createContext<SheetCtx>({ open: false, setOpen: () => {}, modal: true })

/** Sheet state, for building custom parts (e.g. a close button that also saves). */
function useSheet() {
  return React.useContext(SheetContext)
}

function Sheet({ open: openProp, defaultOpen = false, onOpenChange, modal = true, ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  const [inner, setInner] = React.useState(defaultOpen)
  const open = openProp ?? inner
  const setOpen = React.useCallback(
    (o: boolean) => {
      if (openProp === undefined) setInner(o)
      onOpenChange?.(o)
    },
    [openProp, onOpenChange]
  )
  return (
    <SheetContext.Provider value={{ open, setOpen, modal }}>
      <SheetPrimitive.Root data-slot="sheet" open={open} onOpenChange={setOpen} modal={modal} {...props} />
    </SheetContext.Provider>
  )
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

const offscreen: Record<Side, { x?: string; y?: string }> = {
  right: { x: "100%" },
  left: { x: "-100%" },
  top: { y: "-100%" },
  bottom: { y: "100%" },
}

const sideClass: Record<Side, string> = {
  right: "inset-y-0 right-0 h-full w-[min(420px,100%)] border-l border-border",
  left: "inset-y-0 left-0 h-full w-[min(420px,100%)] border-r border-border",
  top: "inset-x-0 top-0 max-h-[85%] rounded-b-facet-2xl border-b border-border",
  bottom: "inset-x-0 bottom-0 max-h-[85%] rounded-t-[1.5rem] border-t border-border",
}

const NO_DRAG = "input, textarea, select, button, a, [contenteditable], [role=slider], [data-no-drag]"

function SheetContent({
  className,
  children,
  side = "right",
  container,
  draggable = true,
  showCloseButton = true,
  showHandle,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: Side
  /** Portal into this element and position inside it (for inline/contained sheets). */
  container?: HTMLElement | null
  /** Drag (or swipe) the panel towards its edge to dismiss it. */
  draggable?: boolean
  showCloseButton?: boolean
  /** Grab handle; shown by default on bottom drawers. */
  showHandle?: boolean
}) {
  const { open, setOpen, modal } = useSheet()
  const controls = useDragControls()
  const axis = side === "left" || side === "right" ? "x" : "y"
  const dir = side === "right" || side === "bottom" ? 1 : -1
  const handle = showHandle ?? side === "bottom"
  const pos = container ? "absolute" : "fixed"

  const onPointerDown = (e: React.PointerEvent) => {
    if (!draggable || (e.target as HTMLElement).closest(NO_DRAG)) return
    controls.start(e)
  }
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset[axis] * dir
    const velocity = info.velocity[axis] * dir
    if (offset > 120 || velocity > 600) setOpen(false)
  }

  const scrim = (
    <motion.div
      data-slot="sheet-overlay"
      className={cn(pos, "inset-0 z-50 bg-overlay")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: durations.base, ease } }}
      exit={{ opacity: 0, transition: { duration: durations.base, ease } }}
      onClick={modal ? undefined : () => setOpen(false)}
    />
  )

  return (
    <AnimatePresence>
      {open && (
        <SheetPrimitive.Portal forceMount container={container}>
          {modal ? (
            <SheetPrimitive.Overlay forceMount asChild>
              {scrim}
            </SheetPrimitive.Overlay>
          ) : (
            scrim
          )}
          <SheetPrimitive.Content forceMount asChild {...props}>
            <motion.div
              data-slot="sheet-content"
              data-side={side}
              className={cn(
                pos,
                "z-50 flex flex-col bg-popover text-popover-foreground shadow-2xl outline-none",
                sideClass[side],
                draggable && (axis === "x" ? "touch-pan-y" : "touch-pan-x"),
                className
              )}
              initial={offscreen[side]}
              animate={{ x: 0, y: 0, transition: { ...spring, stiffness: 380, damping: 38 } }}
              exit={{ ...offscreen[side], transition: { duration: durations.base, ease } }}
              drag={draggable ? axis : false}
              dragListener={false}
              dragControls={controls}
              dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
              dragElastic={{ [side]: 0.9, [opposite(side)]: 0.04 }}
              onDragEnd={onDragEnd}
              onPointerDown={onPointerDown}
            >
              {handle && (
                <div aria-hidden="true" className="flex shrink-0 cursor-grab justify-center pt-2.5 pb-1 active:cursor-grabbing">
                  <span className="h-1 w-10 rounded-full bg-border-strong" />
                </div>
              )}
              {children}
              {showCloseButton && (
                <SheetPrimitive.Close
                  data-slot="sheet-close"
                  aria-label="Close"
                  className={cn(
                    "absolute right-4 grid size-8 cursor-pointer place-items-center rounded-facet text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                    handle ? "top-5" : "top-4"
                  )}
                >
                  <motion.span className="grid place-items-center" whileHover={{ rotate: 90 }} transition={spring}>
                    <XIcon className="size-4" />
                  </motion.span>
                </SheetPrimitive.Close>
              )}
            </motion.div>
          </SheetPrimitive.Content>
        </SheetPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function opposite(side: Side): Side {
  return side === "left" ? "right" : side === "right" ? "left" : side === "top" ? "bottom" : "top"
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-1 px-6 pt-5 pb-1 pr-14", className)} {...props} />
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-body" className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col-reverse gap-2 border-t border-border-subtle px-6 py-4 sm:flex-row sm:justify-end", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn("text-lg leading-snug font-semibold tracking-tight", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description data-slot="sheet-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription, useSheet }
