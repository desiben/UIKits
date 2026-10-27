"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring } from "@/registry/facet/lib/motion"

const OpenContext = React.createContext(false)

function Dialog({ open: openProp, defaultOpen = false, onOpenChange, ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const [inner, setInner] = React.useState(defaultOpen)
  const open = openProp ?? inner
  return (
    <OpenContext.Provider value={open}>
      <DialogPrimitive.Root
        data-slot="dialog"
        open={open}
        onOpenChange={(o) => {
          if (openProp === undefined) setInner(o)
          onOpenChange?.(o)
        }}
        {...props}
      />
    </OpenContext.Provider>
  )
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay forceMount asChild {...props}>
      <motion.div
        data-slot="dialog-overlay"
        className={cn("fixed inset-0 z-50 bg-overlay", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: durations.base, ease } }}
        exit={{ opacity: 0, transition: { duration: durations.base, ease } }}
      />
    </DialogPrimitive.Overlay>
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }) {
  const open = React.useContext(OpenContext)
  return (
    <AnimatePresence>
      {open && (
        <DialogPrimitive.Portal forceMount>
          <DialogOverlay />
          <DialogPrimitive.Content forceMount asChild {...props}>
            <motion.div
              data-slot="dialog-content"
              className={cn(
                "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[min(480px,calc(100vw-2rem))] flex-col overflow-hidden rounded-facet-xl border border-border-subtle bg-popover text-popover-foreground shadow-2xl outline-none",
                className
              )}
              initial={{ opacity: 0, scale: 0.94, x: "-50%", y: "-46%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%", transition: spring }}
              exit={{ opacity: 0, scale: 0.96, x: "-50%", y: "-48%", transition: { duration: durations.fast, ease } }}
            >
              {children}
              {showCloseButton && (
                <DialogPrimitive.Close
                  data-slot="dialog-close"
                  aria-label="Close"
                  className="absolute top-4 right-4 grid size-8 cursor-pointer place-items-center rounded-facet text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <motion.span className="grid place-items-center" whileHover={{ rotate: 90 }} transition={spring}>
                    <XIcon className="size-4" />
                  </motion.span>
                </DialogPrimitive.Close>
              )}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1 px-6 pt-6 pr-14", className)} {...props} />
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-body" className={cn("flex min-h-0 flex-col gap-4 overflow-y-auto px-6 py-5", className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 border-t border-border-subtle px-6 py-4 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-lg leading-snug font-semibold tracking-tight", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export { Dialog, DialogTrigger, DialogClose, DialogOverlay, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription }
