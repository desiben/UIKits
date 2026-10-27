"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion, type HTMLMotionProps } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springBouncy, springSoft, stagger } from "@/registry/facet/lib/motion"

/* Activity timeline ---------------------------------------------------- */

type TimelineProps = Omit<HTMLMotionProps<"ol">, "children"> & {
  children?: React.ReactNode
  /** Seconds between items as they reveal. */
  staggerStep?: number
}

/**
 * Chronological list of events. Items reveal one after another and the connector between
 * nodes draws downward; the `current` step's node pulses (stops with reduced motion).
 */
function Timeline({ className, staggerStep = 0.09, children, ...props }: TimelineProps) {
  return (
    <motion.ol
      data-slot="timeline"
      className={cn("m-0 list-none p-0", className)}
      variants={stagger(staggerStep)}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </motion.ol>
  )
}

const nodeVariants = cva(
  "relative z-[1] grid size-7 flex-none place-items-center rounded-full transition-colors duration-300 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      tone: {
        neutral: "bg-muted text-muted-foreground",
        brand: "bg-primary-subtle text-brand",
        success: "bg-success-subtle text-success",
        warning: "bg-warning-subtle text-warning",
        danger: "bg-danger-subtle text-danger",
        info: "bg-info-subtle text-info",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
)

type TimelineStatus = "complete" | "current" | "upcoming"

type TimelineItemProps = Omit<HTMLMotionProps<"li">, "title" | "children"> &
  VariantProps<typeof nodeVariants> & {
    /** Icon inside the node (defaults to a small dot). */
    icon?: React.ReactNode
    title: React.ReactNode
    description?: React.ReactNode
    /** Human-readable time, e.g. "2 min ago". */
    time?: React.ReactNode
    /** Machine-readable value for the <time> element. */
    dateTime?: string
    /** `current` pulses the node; `upcoming` mutes the item and dashes the connector. */
    status?: TimelineStatus
    children?: React.ReactNode
  }

function TimelineItem({
  className,
  tone,
  icon,
  title,
  description,
  time,
  dateTime,
  status = "complete",
  children,
  ...props
}: TimelineItemProps) {
  const reduce = useReducedMotion()
  const current = status === "current"
  const upcoming = status === "upcoming"
  return (
    <motion.li
      data-slot="timeline-item"
      data-status={status}
      aria-current={current ? "step" : undefined}
      className={cn("group/tl relative flex gap-3 pb-5 last:pb-0", className)}
      variants={{
        hidden: { opacity: 0, x: -8 },
        visible: { opacity: 1, x: 0, transition: springSoft },
      }}
      {...props}
    >
      {/* Connector: draws from the node downward once the item has revealed. */}
      <motion.span
        aria-hidden="true"
        data-slot="timeline-connector"
        className={cn(
          "absolute top-[30px] bottom-1 left-[13px] w-[1.5px] origin-top rounded-full group-last/tl:hidden",
          upcoming ? "bg-[repeating-linear-gradient(to_bottom,var(--border)_0_3px,transparent_3px_6px)]" : "bg-border"
        )}
        variants={{
          hidden: { scaleY: 0 },
          visible: { scaleY: 1, transition: { duration: durations.slow, ease, delay: 0.08 } },
        }}
      />
      <motion.span
        data-slot="timeline-node"
        className={cn(nodeVariants({ tone: tone ?? (current ? "brand" : "neutral") }), upcoming && "opacity-60")}
        variants={{
          hidden: { scale: 0.4, opacity: 0 },
          visible: { scale: 1, opacity: 1, transition: springBouncy },
        }}
      >
        {current && !reduce && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {current && <span aria-hidden="true" className="absolute inset-0 rounded-full ring-2 ring-primary/50" />}
        {icon ?? <span aria-hidden="true" className="size-2 rounded-full bg-current" />}
      </motion.span>
      <div className={cn("min-w-0 flex-1 pt-1", upcoming && "opacity-60")}>
        <b className="block text-sm leading-5 font-medium text-foreground">{title}</b>
        {description && <p className="mt-0.5 text-[13px] leading-5 text-foreground-secondary">{description}</p>}
        {children}
        {time && (
          <time dateTime={dateTime} className="mt-0.5 block text-xs text-muted-foreground">
            {time}
          </time>
        )}
      </div>
    </motion.li>
  )
}

/* Notifications -------------------------------------------------------- */

type NotificationListProps = React.ComponentProps<"div">

/** Inbox container: items stagger in, dismissed items collapse. Wrap children in <AnimatePresence> via this list. */
function NotificationList({ className, children, ...props }: NotificationListProps) {
  return (
    <div data-slot="notification-list" role="list" className={cn("flex flex-col", className)} {...props}>
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </div>
  )
}

type NotificationProps = Omit<HTMLMotionProps<"div">, "title" | "children"> & {
  /** Leading avatar or icon tile. */
  avatar?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  time?: React.ReactNode
  dateTime?: string
  /** Shows the brand dot; it pops out when the item is marked read. */
  unread?: boolean
  /** Trailing actions (e.g. a dismiss button). */
  action?: React.ReactNode
  /** Makes the row a button (e.g. to mark as read / open). */
  onSelect?: () => void
  children?: React.ReactNode
}

function Notification({
  className,
  avatar,
  title,
  description,
  time,
  dateTime,
  unread = false,
  action,
  onSelect,
  children,
  ...props
}: NotificationProps) {
  const interactive = !!onSelect
  return (
    <motion.div
      data-slot="notification"
      data-unread={unread || undefined}
      role="listitem"
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto", transition: springSoft }}
      exit={{ opacity: 0, height: 0, transition: { duration: durations.base, ease } }}
      className={cn("overflow-hidden border-b border-border-subtle last:border-b-0", className)}
      {...props}
    >
      <div className="relative flex gap-3 px-4 py-3 transition-colors duration-150 has-[[data-slot=notification-trigger]:hover]:bg-accent/60">
        <AnimatePresence initial={false}>
          {unread && (
            <motion.span
              key="dot"
              aria-hidden="true"
              className="absolute top-[22px] left-1.5 size-1.5 rounded-full bg-primary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={springBouncy}
            />
          )}
        </AnimatePresence>
        {avatar && <div className="flex-none">{avatar}</div>}
        <div className="min-w-0 flex-1">
          {interactive ? (
            <motion.button
              type="button"
              data-slot="notification-trigger"
              onClick={onSelect}
              whileTap={{ scale: 0.99 }}
              transition={spring}
              className="block w-full cursor-pointer rounded-facet-sm text-left outline-none after:absolute after:inset-0 after:rounded-facet-sm focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset"
            >
              <span className={cn("block text-sm leading-5 text-foreground", unread ? "font-semibold" : "font-medium")}>
                {title}
                {unread && <span className="sr-only"> (unread)</span>}
              </span>
            </motion.button>
          ) : (
            <b className={cn("block text-sm leading-5 text-foreground", unread ? "font-semibold" : "font-medium")}>
              {title}
              {unread && <span className="sr-only"> (unread)</span>}
            </b>
          )}
          {description && <p className="mt-0.5 text-[13px] leading-5 text-foreground-secondary">{description}</p>}
          {children}
          {time && (
            <time dateTime={dateTime} className="mt-0.5 block text-xs text-muted-foreground">
              {time}
            </time>
          )}
        </div>
        {action && <div className="relative flex-none self-start">{action}</div>}
      </div>
    </motion.div>
  )
}

export { Timeline, TimelineItem, NotificationList, Notification, nodeVariants as timelineNodeVariants }
export type { TimelineStatus }
