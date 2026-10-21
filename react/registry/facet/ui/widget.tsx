"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { slideUp, stagger } from "@/registry/facet/lib/motion"

const InGridContext = React.createContext(false)

export type WidgetProps = HTMLMotionProps<"section">

/**
 * Dashboard container: a soft outer shell (title, description, legend, actions) around an
 * elevated content area. Rises in when it enters the viewport — or staggers with its siblings
 * inside a <WidgetGrid>.
 */
function Widget({ className, ...props }: WidgetProps) {
  const inGrid = React.useContext(InGridContext)
  return (
    <motion.section
      data-slot="widget"
      variants={slideUp}
      {...(inGrid ? {} : { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.2 } })}
      className={cn("flex min-w-0 flex-col rounded-facet-xl border border-border bg-subtle p-1", className)}
      {...props}
    />
  )
}

function WidgetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="widget-header"
      className={cn("flex flex-wrap items-start gap-3 px-3 pt-3 pb-2.5", className)}
      {...props}
    />
  )
}

function WidgetTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="widget-title" className={cn("block text-sm font-medium text-foreground", className)} {...props} />
}

function WidgetDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="widget-description" className={cn("mt-0.5 block text-[13px] text-muted-foreground", className)} {...props} />
}

/** Trailing header slot for a legend or actions; pushed to the right. */
function WidgetAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="widget-action" className={cn("ml-auto flex items-center gap-2", className)} {...props} />
}

export interface WidgetContentProps extends React.ComponentProps<"div"> {
  /** Edge-to-edge content (tables). */
  flush?: boolean
}

function WidgetContent({ className, flush, ...props }: WidgetContentProps) {
  return (
    <div
      data-slot="widget-content"
      data-flush={flush || undefined}
      className={cn(
        "min-w-0 rounded-facet-lg border border-border-subtle bg-card shadow-xs dark:border-border",
        flush ? "overflow-hidden p-0" : "p-4",
        className
      )}
      {...props}
    />
  )
}

function WidgetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="widget-footer"
      className={cn("flex items-center gap-2 px-3 pt-2.5 pb-2 text-[13px] text-muted-foreground [&_svg]:size-3.5", className)}
      {...props}
    />
  )
}

export type WidgetGridProps = HTMLMotionProps<"div">

/** Responsive auto-fit grid of widgets; children stagger in on view. */
function WidgetGrid({ className, ...props }: WidgetGridProps) {
  return (
    <InGridContext.Provider value={true}>
    <motion.div
      data-slot="widget-grid"
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn("grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4", className)}
      {...props}
    />
    </InGridContext.Provider>
  )
}

export { Widget, WidgetHeader, WidgetTitle, WidgetDescription, WidgetAction, WidgetContent, WidgetFooter, WidgetGrid }
