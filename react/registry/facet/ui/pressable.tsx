"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springSoft } from "@/registry/facet/lib/motion"

type PressFeedback = "scale" | "highlight" | "lift"

interface PressableProps extends Omit<HTMLMotionProps<"div">, "children"> {
  /** scale (default): shrink on press · highlight: press tint · lift: rise on hover, settle on press. */
  feedback?: PressFeedback
  /** Scale while pressed (default 0.97). */
  pressScale?: number
  disabled?: boolean
  children?: React.ReactNode
}

/**
 * Wraps anything clickable with tactile press feedback. Renders a focusable role="button"
 * that activates on Enter/Space; motion's whileTap also plays for keyboard presses.
 */
function Pressable({
  feedback = "scale",
  pressScale = 0.97,
  disabled = false,
  role = "button",
  tabIndex,
  className,
  children,
  onClick,
  onKeyDown,
  ...props
}: PressableProps) {
  const [pressed, setPressed] = React.useState(false)

  return (
    <motion.div
      data-slot="pressable"
      data-feedback={feedback}
      data-pressed={pressed || undefined}
      role={role}
      tabIndex={disabled ? -1 : (tabIndex ?? 0)}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (disabled || e.defaultPrevented) return
        if (role === "button" && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          e.currentTarget.click()
        }
      }}
      onTapStart={() => setPressed(true)}
      onTap={() => setPressed(false)}
      onTapCancel={() => setPressed(false)}
      whileTap={disabled ? undefined : feedback === "lift" ? { y: 0, scale: 0.99 } : feedback === "scale" ? { scale: pressScale } : { scale: 0.995 }}
      whileHover={disabled || feedback !== "lift" ? undefined : { y: -3 }}
      transition={feedback === "lift" ? springSoft : spring}
      className={cn(
        "group/pressable relative cursor-pointer overflow-hidden outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        feedback === "lift" && "transition-shadow duration-300 hover:shadow-lg",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {feedback === "highlight" && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-foreground"
          initial={false}
          animate={{ opacity: pressed ? 0.07 : 0 }}
          transition={{ duration: pressed ? 0.05 : 0.3 }}
        />
      )}
    </motion.div>
  )
}

export { Pressable }
export type { PressableProps, PressFeedback }
