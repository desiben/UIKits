"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { ChevronRight, X } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { ease, spring, springBouncy, springSoft, stagger } from "@/registry/facet/lib/motion"

export type TraceStatus = "pending" | "running" | "done" | "error"
const TraceItemContext = React.createContext<TraceStatus>("done")

/** Ordered list of agent steps; items stagger in. */
function Trace({ className, ...props }: React.ComponentProps<typeof motion.ol>) {
  return (
    <motion.ol
      data-slot="trace"
      aria-label="Agent steps"
      className={cn("m-0 w-full max-w-[560px] list-none p-0", className)}
      variants={stagger(0.06)}
      initial="hidden"
      animate="visible"
      {...props}
    />
  )
}

function TraceItem({
  status = "done",
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof motion.li>, "children"> & { status?: TraceStatus; children?: React.ReactNode }) {
  return (
    <TraceItemContext.Provider value={status}>
      <motion.li
        data-slot="trace-item"
        data-status={status}
        layout="position"
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: springSoft } }}
        className={cn(
          "group/trace relative grid grid-cols-[24px_1fr] gap-x-3 pb-3 transition-opacity duration-300 data-[status=pending]:opacity-60",
          className
        )}
        {...props}
      >
        <span aria-hidden="true" className="absolute top-[26px] bottom-0.5 left-[11.5px] w-px overflow-hidden bg-border group-last/trace:hidden">
          <motion.span
            className="absolute inset-0 origin-top bg-success/50"
            initial={false}
            animate={{ scaleY: status === "done" ? 1 : 0 }}
            transition={{ duration: 0.4, ease }}
          />
        </span>
        {children}
        <span className="sr-only">{` — ${status === "running" ? "in progress" : status}`}</span>
      </motion.li>
    </TraceItemContext.Provider>
  )
}

function TraceSpinner() {
  const reduce = useReducedMotion()
  return (
    <motion.svg viewBox="0 0 24 24" aria-hidden="true" animate={reduce ? undefined : { rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}>
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M20.5 12a8.5 8.5 0 0 0-8.5-8.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </motion.svg>
  )
}

function TraceCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.32, ease }} />
    </svg>
  )
}

const iconTone: Record<TraceStatus, string> = {
  pending: "border-border bg-muted text-muted-foreground",
  running: "border-transparent bg-primary-subtle text-brand",
  done: "border-transparent bg-success-subtle text-success",
  error: "border-transparent bg-danger-subtle text-danger",
}

/**
 * Status node. Shows your icon while pending, a spinner while running, then morphs to
 * a drawn check (done) or × (error). Set `keepIcon` to keep your icon after it finishes.
 */
function TraceIcon({ keepIcon = false, className, children, ...props }: React.ComponentProps<"span"> & { keepIcon?: boolean }) {
  const status = React.useContext(TraceItemContext)
  const glyph =
    status === "running" ? <TraceSpinner /> : status === "pending" || (keepIcon && children) ? children : status === "done" ? <TraceCheck /> : <X />
  return (
    <span
      data-slot="trace-icon"
      className={cn("relative grid size-6 place-items-center rounded-full border transition-colors duration-300", iconTone[status], className)}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={status === "pending" || (keepIcon && status !== "running") ? "icon" : status}
          className="grid place-items-center [&_svg]:size-[13px]"
          initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.3 }}
          transition={status === "done" ? springBouncy : spring}
        >
          {glyph}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function TraceTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="trace-title"
      className={cn("flex min-h-6 min-w-0 items-center gap-2 text-[13px] font-medium text-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs", className)}
      {...props}
    />
  )
}

function TraceMeta({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="trace-meta" className={cn("ml-auto shrink-0 text-xs font-normal text-muted-foreground tabular-nums", className)} {...props} />
}

function TraceDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="trace-description" className={cn("col-start-2 mt-0.5 text-xs text-muted-foreground", className)} {...props} />
}

/** Collapsible input/output for a step; the panel animates its height. */
function TraceCollapsible({
  label = "Input & output",
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof CollapsiblePrimitive.Root>, "children"> & { label?: React.ReactNode; children?: React.ReactNode }) {
  const [inner, setInner] = React.useState(defaultOpen)
  const open = openProp ?? inner
  return (
    <CollapsiblePrimitive.Root
      data-slot="trace-collapsible"
      open={open}
      onOpenChange={(v) => {
        if (openProp === undefined) setInner(v)
        onOpenChange?.(v)
      }}
      className={cn("col-start-2 mt-1.5", className)}
      {...props}
    >
      <CollapsiblePrimitive.Trigger className="inline-flex cursor-pointer items-center gap-1 rounded-sm text-xs font-medium text-foreground-secondary outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
        <motion.span className="inline-flex" animate={{ rotate: open ? 90 : 0 }} transition={spring}>
          <ChevronRight className="size-3" />
        </motion.span>
        {label}
      </CollapsiblePrimitive.Trigger>
      <AnimatePresence initial={false}>
        {open && (
          <CollapsiblePrimitive.Content forceMount asChild>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ height: springSoft, opacity: { duration: 0.2 } }}
              className="overflow-hidden"
            >
              <pre className="mt-1.5 overflow-auto rounded-facet-sm border border-border-subtle bg-subtle px-3 py-2 font-mono text-xs leading-5 whitespace-pre-wrap text-foreground-secondary">
                {children}
              </pre>
            </motion.div>
          </CollapsiblePrimitive.Content>
        )}
      </AnimatePresence>
    </CollapsiblePrimitive.Root>
  )
}

export { Trace, TraceItem, TraceIcon, TraceTitle, TraceMeta, TraceDescription, TraceCollapsible }
