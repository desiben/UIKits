"use client"

import * as React from "react"
import { AnimatePresence, motion, useAnimate, useReducedMotion, type HTMLMotionProps } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, getDefaultClassNames, useDayPicker, type DayButtonProps } from "react-day-picker"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springBouncy, springSoft } from "@/registry/facet/lib/motion"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

/* Tracks the displayed month and which way the user navigated (+1 next, -1 previous). */
function useMonthDirection() {
  const { months } = useDayPicker()
  const t = months[0]?.date.getTime() ?? 0
  const prev = React.useRef(t)
  const dir = React.useRef(0)
  if (prev.current !== t) {
    dir.current = t > prev.current ? 1 : -1
    prev.current = t
  }
  return { t, dir: dir.current }
}

/** The day grid slides in from the side you navigated towards. */
function CalendarMonthGrid({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  const { t, dir } = useMonthDirection()
  const [scope, animate] = useAnimate<HTMLTableElement>()
  const reduce = useReducedMotion()
  const first = React.useRef(true)
  React.useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (reduce || !scope.current) return
    animate(scope.current, { x: [dir * 28, 0], opacity: [0, 1] }, springSoft)
  }, [t]) // eslint-disable-line react-hooks/exhaustive-deps
  return <table ref={scope} className={className} {...props} />
}

/** The month label rolls up/down in the navigation direction. */
function CalendarCaptionLabel({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  const { dir } = useMonthDirection()
  return (
    <span className={cn("relative inline-flex h-8 items-center overflow-hidden", className)} {...props}>
      <AnimatePresence initial={false} mode="popLayout" custom={dir}>
        <motion.span
          key={String(children)}
          custom={dir}
          variants={{
            enter: (d: number) => ({ opacity: 0, x: d * 16 }),
            center: { opacity: 1, x: 0 },
            exit: (d: number) => ({ opacity: 0, x: d * -16 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={spring}
          className="whitespace-nowrap"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** Day button: press feedback, and the selected fill pops in with a little overshoot. */
function CalendarDayButton({ day, modifiers, className, children, ...props }: DayButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const filled = modifiers.selected && !modifiers.range_middle
  return (
    <motion.button
      ref={ref}
      data-day={day.date.toLocaleDateString()}
      data-selected={filled || undefined}
      data-range-middle={modifiers.range_middle || undefined}
      data-today={modifiers.today || undefined}
      data-outside={modifiers.outside || undefined}
      whileTap={{ scale: 0.9 }}
      transition={spring}
      className={cn(
        "relative isolate grid size-[34px] cursor-pointer place-items-center rounded-facet text-sm tabular-nums text-foreground outline-none transition-colors",
        "hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card",
        "data-[today]:text-brand data-[today]:shadow-[inset_0_0_0_1px_var(--brand)]",
        "data-[outside]:text-placeholder",
        "data-[selected]:text-primary-foreground data-[selected]:shadow-none data-[selected]:hover:bg-transparent",
        "data-[range-middle]:rounded-none data-[range-middle]:hover:bg-transparent",
        "disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...(props as HTMLMotionProps<"button">)}
    >
      <AnimatePresence initial={false}>
        {filled && (
          <motion.span
            key="fill"
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-facet bg-primary"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={springBouncy}
          />
        )}
      </AnimatePresence>
      {children}
    </motion.button>
  )
}

function CalendarChevron({ orientation, className }: { orientation?: "up" | "down" | "left" | "right"; className?: string }) {
  const Icon = orientation === "left" ? ChevronLeft : ChevronRight
  return <Icon className={cn("size-4", className)} />
}

/**
 * Month grid date picker built on react-day-picker (roving tabindex + arrow-key navigation).
 * Months slide in the direction you navigate, the caption rolls, and selected days pop.
 */
function Calendar({ className, classNames, showOutsideDays = true, components, ...props }: CalendarProps) {
  const d = getDefaultClassNames()
  const navBtn =
    "inline-grid size-8 cursor-pointer place-items-center rounded-facet text-foreground outline-none transition-[background-color,scale] hover:bg-accent active:scale-95 focus-visible:ring-2 focus-visible:ring-ring aria-disabled:pointer-events-none aria-disabled:opacity-40"
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={1}
      className={cn(
        "w-fit overflow-hidden rounded-facet-lg border border-border bg-card p-3 text-card-foreground shadow-xs",
        className
      )}
      classNames={{
        root: cn(d.root),
        months: cn("relative flex flex-col gap-4 sm:flex-row", d.months),
        month: cn("flex flex-col gap-2", d.month),
        nav: cn("absolute inset-x-0 top-0 z-10 flex items-center justify-between", d.nav),
        button_previous: cn(navBtn, d.button_previous),
        button_next: cn(navBtn, d.button_next),
        month_caption: cn("flex h-8 items-center justify-center px-9 text-sm font-medium", d.month_caption),
        caption_label: d.caption_label,
        month_grid: cn("border-collapse", d.month_grid),
        weekdays: cn("flex", d.weekdays),
        weekday: cn("grid h-7 w-[36px] place-items-center text-xs font-medium text-muted-foreground", d.weekday),
        week: cn("mt-0.5 flex", d.week),
        day: cn("relative grid size-[36px] place-items-center p-0", d.day),
        range_start: cn("rounded-l-[var(--radius)] bg-primary-subtle", d.range_start),
        range_middle: cn("bg-primary-subtle", d.range_middle),
        range_end: cn("rounded-r-[var(--radius)] bg-primary-subtle", d.range_end),
        today: d.today,
        outside: d.outside,
        disabled: d.disabled,
        hidden: cn("invisible", d.hidden),
        ...classNames,
      }}
      components={{
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        MonthGrid: CalendarMonthGrid,
        CaptionLabel: CalendarCaptionLabel,
        ...components,
      }}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
