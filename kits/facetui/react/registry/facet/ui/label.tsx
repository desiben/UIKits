"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease } from "@/registry/facet/lib/motion"

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  /** Shows a red asterisk (visual only — also set `required` on the control). */
  required?: boolean
  /** Shows a muted "(optional)" marker; pass a node to change the text. */
  optional?: boolean | React.ReactNode
  /** Dims the label to match a disabled control. */
  disabled?: boolean
}

/**
 * Accessible text for a control. Required and optional markers animate in and out, and the label
 * fades when its control is disabled.
 */
function Label({ className, children, required, optional, disabled, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      data-disabled={disabled || undefined}
      className={cn(
        "inline-flex items-baseline gap-1 text-[13px] leading-5 font-medium text-foreground transition-opacity duration-200 select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <AnimatePresence initial={false} mode="popLayout">
        {required && (
          <motion.span
            key="req"
            aria-hidden="true"
            className="inline-block text-danger"
            initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ type: "spring", stiffness: 600, damping: 16, mass: 0.6 }}
          >
            *
          </motion.span>
        )}
        {!required && optional && (
          <motion.span
            key="opt"
            className="inline-block text-xs font-normal text-muted-foreground"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: durations.base, ease }}
          >
            {optional === true ? "(optional)" : optional}
          </motion.span>
        )}
      </AnimatePresence>
    </LabelPrimitive.Root>
  )
}

/** Inline label that wraps a checkbox, radio or switch together with its text. */
function LabelRow({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label-row"
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-sm text-foreground select-none has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label, LabelRow }
