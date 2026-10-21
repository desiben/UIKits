"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Checkbox as CheckboxPrimitive, RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { ease, spring } from "@/registry/facet/lib/motion"

type CheckedState = boolean | "indeterminate"

/** Checkbox whose checkmark draws itself in; supports the indeterminate dash. */
function Checkbox({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const [inner, setInner] = React.useState<CheckedState>(defaultChecked ?? false)
  const state = checked ?? inner

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={state}
      onCheckedChange={(v) => {
        setInner(v)
        onCheckedChange?.(v)
      }}
      className={cn(
        "peer group/checkbox relative mt-px inline-grid size-[18px] shrink-0 cursor-pointer place-content-center rounded-facet-sm border-[1.5px] border-input bg-card text-primary-foreground outline-none transition-[background-color,border-color,transform] duration-150",
        "hover:border-primary active:scale-90",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:active:scale-100",
        "aria-invalid:border-danger",
        className
      )}
      {...props}
    >
      <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true" fill="none">
        <motion.path
          d="M2.25 6.25 4.75 8.75 9.75 3.5"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: state === true ? 1 : 0, opacity: state === true ? 1 : 0 }}
          transition={{ pathLength: { duration: 0.22, ease }, opacity: { duration: 0.05 } }}
        />
        <AnimatePresence initial={false}>
          {state === "indeterminate" && (
            <motion.path
              key="dash"
              d="M2.75 6h6.5"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={spring}
              style={{ originX: "50%" }}
            />
          )}
        </AnimatePresence>
      </svg>
    </CheckboxPrimitive.Root>
  )
}

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid content-start gap-3", className)} {...props} />
}

/** Radio button; the inner dot pops in with a small overshoot. */
function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer relative mt-px inline-grid size-[18px] shrink-0 cursor-pointer place-content-center rounded-full border-[1.5px] border-input bg-card outline-none transition-[border-color,transform] duration-150",
        "hover:border-primary active:scale-90 data-[state=checked]:border-primary",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-muted",
        className
      )}
      {...props}
    >
      {/* CSS-driven so it follows Radix's data-state for both controlled and uncontrolled groups. */}
      <RadioGroupPrimitive.Indicator
        forceMount
        data-slot="radio-group-indicator"
        className="block size-2 scale-0 rounded-full bg-primary opacity-0 transition-[scale,opacity] duration-300 ease-[cubic-bezier(.34,1.7,.5,1)] data-[state=checked]:scale-100 data-[state=checked]:opacity-100 motion-reduce:transition-none"
      />
    </RadioGroupPrimitive.Item>
  )
}

export { Checkbox, RadioGroup, RadioGroupItem }
