"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { Brain, ChevronDown, X } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { ease, spring, springBouncy, springSoft } from "@/registry/facet/lib/motion"
import { TextShimmer } from "@/registry/facet/ui/text-shimmer"

export type StepStatus = "pending" | "active" | "done" | "error"

/* ---------- morphing status glyph (shared with trace) ---------- */

function DrawnCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.32, ease, delay: 0.05 }} />
    </svg>
  )
}

function Spinner({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
    >
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="3.2" />
      <path d="M20.5 12a8.5 8.5 0 0 0-8.5-8.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </motion.svg>
  )
}

const statusTone: Record<StepStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  active: "bg-primary-subtle text-brand",
  done: "bg-success-subtle text-success",
  error: "bg-danger-subtle text-danger",
}

/** A round status node that morphs between pending → spinner → drawn check (or ×). */
function StepStatusIcon({
  status,
  icon,
  className,
}: {
  status: StepStatus
  /** Optional glyph shown for pending (and done/error when `keepIcon`). */
  icon?: React.ReactNode
  className?: string
}) {
  return (
    <motion.span
      data-slot="step-status-icon"
      data-status={status}
      className={cn("relative grid size-[19px] shrink-0 place-items-center rounded-full transition-colors duration-300", statusTone[status], className)}
      animate={status === "done" ? { scale: [0.8, 1.12, 1] } : { scale: 1 }}
      transition={springBouncy}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={status}
          className="grid place-items-center [&_svg]:size-[11px]"
          initial={{ opacity: 0, scale: 0.4, rotate: -60 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.4 }}
          transition={spring}
        >
          {status === "done" ? (
            <DrawnCheck />
          ) : status === "error" ? (
            <X strokeWidth={3} />
          ) : status === "active" ? (
            <Spinner />
          ) : (
            icon ?? <span className="block size-[5px] rounded-full bg-current opacity-70" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

/* ---------- chain of thought ---------- */

export interface ChainOfThoughtProps extends Omit<React.ComponentProps<typeof CollapsiblePrimitive.Root>, "title"> {
  /** Summary text, e.g. "Thought for 4 seconds". */
  title?: React.ReactNode
  /** While true the title shimmers and a brain pulses. */
  loading?: boolean
  icon?: React.ReactNode
}

function ChainOfThought({
  title = "Reasoning",
  loading = false,
  icon,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...props
}: ChainOfThoughtProps) {
  const [inner, setInner] = React.useState(defaultOpen)
  const open = openProp ?? inner
  const setOpen = (v: boolean) => {
    if (openProp === undefined) setInner(v)
    onOpenChange?.(v)
  }
  return (
    <CollapsiblePrimitive.Root
      data-slot="chain-of-thought"
      open={open}
      onOpenChange={setOpen}
      className={cn("overflow-hidden rounded-facet-lg border border-border bg-card", className)}
      {...props}
    >
      <CollapsiblePrimitive.Trigger
        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-[13px] font-medium text-foreground-secondary outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset [&_svg]:size-3.5"
      >
        <span className="inline-flex text-brand">{icon ?? <Brain />}</span>
        {loading ? <TextShimmer>{title}</TextShimmer> : <span>{title}</span>}
        <motion.span className="ml-auto inline-flex text-muted-foreground" animate={{ rotate: open ? 180 : 0 }} transition={spring}>
          <ChevronDown />
        </motion.span>
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
              <ol className="m-0 list-none px-3 pb-3">{children}</ol>
            </motion.div>
          </CollapsiblePrimitive.Content>
        )}
      </AnimatePresence>
    </CollapsiblePrimitive.Root>
  )
}

export interface ChainOfThoughtStepProps extends Omit<React.ComponentProps<typeof motion.li>, "title" | "children"> {
  children?: React.ReactNode
  status?: StepStatus
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
}

function ChainOfThoughtStep({ status = "pending", title, description, icon, className, children, ...props }: ChainOfThoughtStepProps) {
  return (
    <motion.li
      data-slot="chain-of-thought-step"
      data-state={status}
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springSoft}
      className={cn("group/step relative flex gap-2.5 py-1.5 text-[13px] text-foreground-secondary", className)}
      {...props}
    >
      <span aria-hidden="true" className="absolute top-7 -bottom-1 left-[9px] w-px bg-border group-last/step:hidden" />
      <StepStatusIcon status={status} icon={icon} className="mt-px" />
      <div className="min-w-0">
        <b className={cn("block text-[13px] font-medium text-foreground transition-colors", status === "pending" && "text-muted-foreground")}>{title}</b>
        {description && <small className="mt-0.5 block text-xs text-muted-foreground">{description}</small>}
        {children && <div className="mt-1.5 flex flex-wrap gap-1.5">{children}</div>}
        <span className="sr-only">{` (${status === "active" ? "in progress" : status})`}</span>
      </div>
    </motion.li>
  )
}

/** A small source chip under a step. */
function ChainOfThoughtChip({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="chain-of-thought-chip"
      className={cn("inline-flex h-[22px] items-center gap-1 rounded-full border border-border bg-subtle px-2 text-[11px] font-medium text-foreground-secondary [&_svg]:size-3 [&_svg]:text-brand", className)}
      {...props}
    />
  )
}

export { ChainOfThought, ChainOfThoughtStep, ChainOfThoughtChip, StepStatusIcon }
