"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"
import { Toggle as TogglePrimitive } from "radix-ui"
import { XIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springBouncy } from "@/registry/facet/lib/motion"

const chipBase =
  "inline-flex h-[30px] shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium whitespace-nowrap outline-none transition-colors duration-150 select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5"
const chipOff = "border-border bg-card text-foreground-secondary hover:bg-accent hover:text-foreground"
const chipOn = "border-primary/40 bg-primary-subtle text-brand hover:bg-primary-subtle"

/** Removed chips should collapse: render them in <AnimatePresence mode="popLayout"> — chips animate layout and exit by default. */
const presence = {
  layout: "position",
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8, transition: { duration: durations.fast, ease } },
} as const

function Check({ on }: { on: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      className="-ml-0.5 inline-flex overflow-hidden"
      initial={false}
      animate={{ width: on ? 14 : 0, marginRight: on ? 0 : -6 }}
      transition={spring}
    >
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: durations.base, ease, delay: on ? 0.05 : 0 }} />
      </svg>
    </motion.span>
  )
}

type ChipProps = Omit<HTMLMotionProps<"button">, "children" | "onChange"> & {
  children?: React.ReactNode
  /** Selected (pressed) state. */
  selected?: boolean
  defaultSelected?: boolean
  onSelectedChange?: (selected: boolean) => void
  /** Show the drawn check when selected (default true). */
  showCheck?: boolean
  /** Leading icon. */
  icon?: React.ReactNode
}

/** A selectable filter chip (toggle button with aria-pressed). */
function Chip({ className, selected, defaultSelected, onSelectedChange, showCheck = true, icon, children, ...props }: ChipProps) {
  const [inner, setInner] = React.useState(defaultSelected ?? false)
  const on = selected ?? inner
  return (
    <TogglePrimitive.Root
      asChild
      pressed={on}
      onPressedChange={(p) => {
        if (selected === undefined) setInner(p)
        onSelectedChange?.(p)
      }}
    >
      <motion.button
        type="button"
        data-slot="chip"
        className={cn(chipBase, on ? chipOn : chipOff, className)}
        whileTap={{ scale: 0.94 }}
        transition={springBouncy}
        {...presence}
        {...props}
      >
        {showCheck && <Check on={on} />}
        {icon}
        {children}
      </motion.button>
    </TogglePrimitive.Root>
  )
}

type ChipRemovableProps = Omit<HTMLMotionProps<"span">, "children"> & {
  children?: React.ReactNode
  icon?: React.ReactNode
  onRemove: () => void
  /** Accessible label for the remove button (defaults to "Remove"). */
  removeLabel?: string
}

/** A static chip (e.g. an applied filter or a tag) with a remove button. */
function ChipRemovable({ className, icon, children, onRemove, removeLabel = "Remove", ...props }: ChipRemovableProps) {
  return (
    <motion.span data-slot="chip" className={cn(chipBase, chipOff, "cursor-default pr-1 hover:bg-card", className)} transition={spring} {...presence} {...props}>
      {icon}
      {children}
      <motion.button
        type="button"
        aria-label={removeLabel}
        onClick={onRemove}
        className="grid size-5 cursor-pointer place-items-center rounded-full text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        whileHover={{ rotate: 90 }}
        whileTap={{ scale: 0.85 }}
        transition={spring}
      >
        <XIcon className="size-3" />
      </motion.button>
    </motion.span>
  )
}

/** Underlined text link whose underline thickens and darkens on hover. */
function TextLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="text-link"
      className={cn(
        "rounded-sm text-sm font-medium text-brand underline decoration-current/35 decoration-1 underline-offset-[3px] outline-none transition-[text-decoration-color,text-underline-offset] duration-200 hover:decoration-current hover:underline-offset-[5px] focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  )
}

export { Chip, ChipRemovable, TextLink }
