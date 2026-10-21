"use client"

import * as React from "react"
import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { springBouncy, springSoft } from "@/registry/facet/lib/motion"

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: springSoft },
}
const iconVariant: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -8 },
  visible: { opacity: 1, scale: 1, rotate: 0, transition: springBouncy },
}

export interface EmptyStateProps extends Omit<HTMLMotionProps<"div">, "title" | "children"> {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** Buttons; keep one primary action. */
  action?: React.ReactNode
  /** Bordered card (default), dashed drop-zone style, or plain. */
  variant?: "card" | "dashed" | "plain"
  /** Heading level for the title (default h3). */
  headingLevel?: 2 | 3 | 4
  children?: React.ReactNode
}

/**
 * Explains why a view is empty and what to do next. Content staggers in when it enters the
 * viewport, the icon pops, and the icon tile floats gently while hovered.
 */
function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  variant = "card",
  headingLevel = 3,
  children,
  ...props
}: EmptyStateProps) {
  const reduce = useReducedMotion()
  const Heading = `h${headingLevel}` as "h3"
  return (
    <motion.div
      data-slot="empty-state"
      data-variant={variant}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover="hover"
      className={cn(
        "flex flex-col items-center gap-2 px-6 py-10 text-center",
        variant === "card" && "rounded-facet-lg border border-border bg-card shadow-xs",
        variant === "dashed" && "rounded-facet-lg border border-dashed border-border-strong bg-subtle/60",
        className
      )}
      {...props}
    >
      {icon && (
        <motion.span variants={iconVariant} className="mb-2 inline-flex">
          <motion.span
            data-slot="empty-state-icon"
            aria-hidden="true"
            variants={reduce ? undefined : { hover: { y: [0, -4, 0], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } } }}
            className="relative grid size-12 place-items-center rounded-facet-lg bg-primary-subtle text-brand [&_svg]:size-[22px]"
          >
            <span className="absolute inset-0 -z-0 rounded-[inherit] ring-1 ring-brand/10 ring-inset" />
            {icon}
          </motion.span>
        </motion.span>
      )}
      <motion.div variants={item}>
        <Heading className="text-[17px] leading-6 font-semibold text-foreground">{title}</Heading>
      </motion.div>
      {description && (
        <motion.p variants={item} className="max-w-[340px] text-sm text-muted-foreground">
          {description}
        </motion.p>
      )}
      {children && <motion.div variants={item}>{children}</motion.div>}
      {action && (
        <motion.div variants={item} className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {action}
        </motion.div>
      )}
    </motion.div>
  )
}

export { EmptyState }
