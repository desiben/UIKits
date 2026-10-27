"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { ease, springSoft } from "@/registry/facet/lib/motion"

export interface MarkerProps extends React.ComponentProps<"div"> {
  /** default: date break · status: centred note · unread: "New messages" line · pill: label in a pill */
  variant?: "default" | "status" | "unread" | "pill"
  icon?: React.ReactNode
}

function Line({ side, tone }: { side: "left" | "right"; tone: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn("h-px flex-1", tone)}
      style={{ transformOrigin: side === "left" ? "100% 50%" : "0% 50%" }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5, ease }}
    />
  )
}

/** Conversation separators and status notes: date breaks, joins, "New messages", summaries. */
function Marker({ variant = "default", icon, className, children, ...props }: MarkerProps) {
  const label = (
    <motion.span
      className={cn("inline-flex items-center gap-1.5 [&_b]:font-semibold [&_b]:text-foreground-secondary [&_svg]:size-3.5 [&_svg]:shrink-0", variant === "status" && "[&_svg]:text-muted-foreground")}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springSoft, delay: 0.1 }}
    >
      {icon}
      {children}
    </motion.span>
  )

  if (variant === "status") {
    return (
      <div data-slot="marker" data-variant="status" className={cn("flex w-full items-center justify-center text-xs text-muted-foreground", className)} {...props}>
        {label}
      </div>
    )
  }

  const tone = variant === "unread" ? "bg-danger/60" : variant === "pill" ? "bg-border-subtle" : "bg-border"
  return (
    <div
      data-slot="marker"
      data-variant={variant}
      role="separator"
      aria-label={typeof children === "string" ? children : undefined}
      className={cn(
        "flex w-full items-center gap-3 text-[11px] font-medium text-muted-foreground",
        variant === "unread" && "text-danger",
        className
      )}
      {...props}
    >
      <Line side="left" tone={tone} />
      {variant === "pill" ? (
        <motion.span
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5 text-foreground-secondary [&_svg]:size-3.5 [&_svg]:text-brand"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springSoft, delay: 0.1 }}
        >
          {icon}
          {children}
        </motion.span>
      ) : (
        label
      )}
      {variant !== "unread" && <Line side="right" tone={tone} />}
    </div>
  )
}

export { Marker }
