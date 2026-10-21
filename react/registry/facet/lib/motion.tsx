"use client"

import * as React from "react"
import { MotionConfig, type Transition, type Variants } from "motion/react"

/* Facet UI motion presets — one place to tune how the whole kit feels. */

/** Snappy spring for presses, toggles, indicators and thumbs. */
export const spring = { type: "spring", stiffness: 520, damping: 34, mass: 0.7 } satisfies Transition
/** Softer spring for panels, cards and layout shifts. */
export const springSoft = { type: "spring", stiffness: 280, damping: 28, mass: 0.9 } satisfies Transition
/** Playful spring with a little overshoot, for success states and badges. */
export const springBouncy = { type: "spring", stiffness: 600, damping: 16, mass: 0.6 } satisfies Transition
/** Facet's default easing curve (ease-out-quint-ish). */
export const ease = [0.22, 1, 0.36, 1] as const
export const durations = { fast: 0.15, base: 0.24, slow: 0.4 } as const

/** Spread onto motion elements that should react to pointer presses. */
export const press = { whileTap: { scale: 0.97 }, transition: spring } as const
/** Spread onto cards and tiles that lift on hover. */
export const hoverLift = { whileHover: { y: -3 }, whileTap: { scale: 0.99 }, transition: springSoft } as const

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.base, ease } },
  exit: { opacity: 0, transition: { duration: durations.fast, ease } },
}

/** Overlays (popover, dropdown, tooltip, dialog): scale + fade from the trigger side. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: spring },
  exit: { opacity: 0, scale: 0.97, y: 2, transition: { duration: durations.fast, ease } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: springSoft },
  exit: { opacity: 0, y: 8, transition: { duration: durations.fast, ease } },
}

/** Parent variant that staggers its children (use with slideUp / fade on the children). */
export const stagger = (step = 0.05, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
  exit: { transition: { staggerChildren: step / 2, staggerDirection: -1 } },
})

/** Wrap your app once: honours the OS "reduce motion" setting for every Facet component. */
export function FacetMotion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
