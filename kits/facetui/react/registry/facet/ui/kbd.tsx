"use client"

import * as React from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"
import { Separator as SeparatorPrimitive } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { ease, spring } from "@/registry/facet/lib/motion"

/* ---------------------------------------------------------------- Kbd */

export interface KbdProps extends Omit<HTMLMotionProps<"kbd">, "children"> {
  children?: React.ReactNode
  /**
   * A `KeyboardEvent.key` value (case-insensitive, e.g. "k", "Meta", "Enter"). When that key is
   * held down anywhere on the page the cap presses in, so shortcuts feel physical.
   */
  listenKey?: string
  /** Force the pressed look (e.g. when you track the shortcut yourself). */
  pressed?: boolean
}

function Kbd({ className, listenKey, pressed, children, ...props }: KbdProps) {
  const [down, setDown] = React.useState(false)
  React.useEffect(() => {
    if (!listenKey) return
    const k = listenKey.toLowerCase()
    const on = (e: KeyboardEvent) => e.key.toLowerCase() === k && setDown(true)
    const off = (e: KeyboardEvent) => e.key.toLowerCase() === k && setDown(false)
    const blur = () => setDown(false)
    window.addEventListener("keydown", on)
    window.addEventListener("keyup", off)
    window.addEventListener("blur", blur)
    return () => {
      window.removeEventListener("keydown", on)
      window.removeEventListener("keyup", off)
      window.removeEventListener("blur", blur)
    }
  }, [listenKey])
  const isDown = pressed ?? down

  return (
    <motion.kbd
      data-slot="kbd"
      data-pressed={isDown || undefined}
      animate={isDown ? { y: 1, borderBottomWidth: 1 } : { y: 0, borderBottomWidth: 2 }}
      transition={spring}
      className={cn(
        "inline-flex h-5 min-w-5 shrink-0 select-none items-center justify-center gap-0.5 rounded-[calc(var(--radius)*0.75)] border border-b-2 border-border bg-subtle px-[5px] font-sans text-xs font-medium text-muted-foreground transition-colors data-[pressed]:bg-muted data-[pressed]:text-foreground [&_svg]:size-3",
        className
      )}
      {...props}
    >
      {children}
    </motion.kbd>
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="kbd-group" className={cn("inline-flex items-center gap-1", className)} {...props} />
}

/* ---------------------------------------------------------------- Spinner */

export interface SpinnerProps extends React.ComponentProps<"span"> {
  /** Accessible label (default "Loading"). */
  label?: string
  size?: "sm" | "md" | "lg"
}

const spinnerSizes = { sm: "size-3.5", md: "size-4", lg: "size-6" }

/** Indeterminate loader. The arc spins and breathes; with reduced motion it slows to a gentle pulse. */
function Spinner({ className, label = "Loading", size = "md", ...props }: SpinnerProps) {
  const reduce = useReducedMotion()
  return (
    <span role="status" aria-label={label} data-slot="spinner" className={cn("inline-flex shrink-0", spinnerSizes[size], className)} {...props}>
      <motion.svg
        viewBox="0 0 24 24"
        className="size-full"
        aria-hidden="true"
        animate={reduce ? { opacity: [1, 0.5, 1] } : { rotate: 360 }}
        transition={reduce ? { duration: 1.6, repeat: Infinity } : { duration: 0.75, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="3" />
        <motion.circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ rotate: -90, originX: "50%", originY: "50%" }}
          initial={{ pathLength: 0.3 }}
          animate={reduce ? { pathLength: 0.3 } : { pathLength: [0.15, 0.6, 0.15] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    </span>
  )
}

/* ---------------------------------------------------------------- Skeleton */

/** Placeholder block with a travelling shimmer (static with reduced motion). */
function Skeleton({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "rounded-[calc(var(--radius)-2px)] bg-[linear-gradient(90deg,var(--muted)_25%,var(--subtle)_50%,var(--muted)_75%)] bg-[length:200%_100%] motion-safe:animate-[facet-shimmer_1.4s_linear_infinite]",
        className
      )}
      style={style}
      {...props}
    />
  )
}

/* ---------------------------------------------------------------- Separator */

export interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  /** Draw the line in from the start edge when it mounts. */
  animated?: boolean
}

function Separator({ className, orientation = "horizontal", decorative = true, animated = false, ...props }: SeparatorProps) {
  const horizontal = orientation === "horizontal"
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      asChild={animated}
      className={cn("shrink-0 bg-border", horizontal ? "h-px w-full" : "w-px self-stretch", className)}
      {...props}
    >
      {animated ? (
        <motion.div
          initial={horizontal ? { scaleX: 0 } : { scaleY: 0 }}
          animate={horizontal ? { scaleX: 1 } : { scaleY: 1 }}
          transition={{ duration: 0.5, ease }}
          style={{ originX: 0, originY: 0 }}
        />
      ) : undefined}
    </SeparatorPrimitive.Root>
  )
}

export { Kbd, KbdGroup, Spinner, Skeleton, Separator }
