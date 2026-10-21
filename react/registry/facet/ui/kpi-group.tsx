"use client"
import { motion, type HTMLMotionProps } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { stagger } from "@/registry/facet/lib/motion"

export type KpiGroupProps = HTMLMotionProps<"div">

/**
 * Several <Kpi>s joined into one card with shared dividers. Wraps to two columns, then one.
 * The metrics stagger in as the group enters the viewport; each cell tints on hover.
 */
function KpiGroup({ className, ...props }: KpiGroupProps) {
  return (
    <motion.div
      data-slot="kpi-group"
      role="group"
      variants={stagger(0.06)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] overflow-hidden rounded-facet-lg border border-border bg-card shadow-xs",
        "[&>[data-slot=kpi]]:-mt-px [&>[data-slot=kpi]]:-ml-px [&>[data-slot=kpi]]:rounded-none [&>[data-slot=kpi]]:border-0 [&>[data-slot=kpi]]:border-t [&>[data-slot=kpi]]:border-l [&>[data-slot=kpi]]:border-border-subtle [&>[data-slot=kpi]]:bg-transparent [&>[data-slot=kpi]]:shadow-none",
        "[&>[data-slot=kpi]]:transition-colors [&>[data-slot=kpi]]:duration-200 [&>[data-slot=kpi]:hover]:bg-subtle",
        className
      )}
      {...props}
    />
  )
}

export { KpiGroup }
