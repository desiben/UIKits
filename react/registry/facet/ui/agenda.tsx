"use client"

import * as React from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { slideUp, springSoft, stagger } from "@/registry/facet/lib/motion"

type AgendaTone = "brand" | "lime" | "amber" | "rose" | "blue"

const toneVar: Record<AgendaTone, string> = {
  brand: "var(--primary)",
  lime: "var(--chart-2)",
  amber: "var(--chart-3)",
  rose: "var(--chart-4)",
  blue: "var(--chart-5)",
}

function Agenda({ className, children, ...props }: Omit<HTMLMotionProps<"div">, "children"> & { children?: React.ReactNode }) {
  return (
    <motion.div
      data-slot="agenda"
      initial="hidden"
      animate="visible"
      variants={stagger(0.06)}
      className={cn("@container flex w-full flex-col gap-4", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface AgendaDayProps extends Omit<React.ComponentProps<"section">, "children"> {
  /** Big day number, e.g. 18. */
  day: React.ReactNode
  /** Short label under the number, e.g. "Wed · Today". */
  label?: React.ReactNode
  /** ISO date for the <time> element. */
  dateTime?: string
  today?: boolean
  children?: React.ReactNode
}

function AgendaDay({ day, label, dateTime, today, className, children, ...props }: AgendaDayProps) {
  return (
    <section
      data-slot="agenda-day"
      aria-current={today ? "date" : undefined}
      className={cn("grid grid-cols-[64px_1fr] gap-3 @max-[460px]:grid-cols-1 @max-[460px]:gap-2", className)}
      {...props}
    >
      <motion.time
        variants={slideUp}
        dateTime={dateTime}
        className="flex flex-col items-start pt-1 @max-[460px]:flex-row @max-[460px]:items-baseline @max-[460px]:gap-2"
      >
        <b className={cn("text-2xl leading-none font-semibold tracking-tight tabular-nums", today && "text-brand")}>{day}</b>
        {label && (
          <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">{label}</span>
        )}
      </motion.time>
      <motion.div variants={stagger(0.05)} role="list" className="flex min-w-0 flex-col gap-2">
        {children}
      </motion.div>
    </section>
  )
}

interface AgendaEventProps extends Omit<HTMLMotionProps<"div">, "title" | "children"> {
  /** Display time, e.g. "9:00–9:30" or "All day". */
  time: React.ReactNode
  /** Machine-readable start time for <time datetime>. */
  dateTime?: string
  title: React.ReactNode
  description?: React.ReactNode
  tone?: AgendaTone
  /** Highlights the event happening now (glow ring + live dot). */
  now?: boolean
  /** Trailing content: avatars, a Join button… */
  children?: React.ReactNode
}

function LiveDot() {
  const reduce = useReducedMotion()
  return (
    <span aria-hidden="true" className="relative mr-1.5 inline-flex size-1.5 align-middle">
      {!reduce && (
        <motion.span
          className="absolute inset-0 rounded-full bg-primary"
          animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span className="relative size-1.5 rounded-full bg-primary" />
    </span>
  )
}

function AgendaEvent({
  time,
  dateTime,
  title,
  description,
  tone = "brand",
  now,
  className,
  style,
  children,
  ...props
}: AgendaEventProps) {
  return (
    <motion.div
      data-slot="agenda-event"
      data-tone={tone}
      data-now={now || undefined}
      role="listitem"
      variants={slideUp}
      whileHover={{ x: 2 }}
      transition={springSoft}
      style={{ ["--tone" as string]: toneVar[tone], ...style }}
      className={cn(
        "relative grid min-w-0 grid-cols-[76px_1fr_auto] items-center gap-3 rounded-facet border border-border bg-card py-2.5 pr-3 pl-4 transition-shadow hover:shadow-sm",
        "@max-[460px]:grid-cols-[1fr_auto]",
        now && "border-brand-500/60 shadow-[0_0_0_3px_color-mix(in_srgb,var(--brand-500)_14%,transparent)] hover:shadow-[0_0_0_3px_color-mix(in_srgb,var(--brand-500)_14%,transparent)]",
        className
      )}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-0 w-[3px] origin-center rounded-r-[3px] bg-(--tone)"
        variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1, transition: springSoft } }}
      />
      <time dateTime={dateTime} className="text-xs font-medium tabular-nums text-muted-foreground @max-[460px]:col-span-full">
        {time}
      </time>
      <div className="min-w-0">
        <b className="block truncate text-sm font-medium">{title}</b>
        {(description || now) && (
          <span className="block truncate text-xs text-muted-foreground">
            {now && <LiveDot />}
            {description}
          </span>
        )}
      </div>
      {children ? <div className="flex items-center gap-2">{children}</div> : <span />}
    </motion.div>
  )
}

export { Agenda, AgendaDay, AgendaEvent }
export type { AgendaTone, AgendaEventProps, AgendaDayProps }
