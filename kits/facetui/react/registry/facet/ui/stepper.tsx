"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springBouncy, springSoft } from "@/registry/facet/lib/motion"

export type StepItem = string | { title: React.ReactNode; description?: React.ReactNode }
type StepState = "complete" | "current" | "upcoming"

const defaultDescription: Record<StepState, string> = { complete: "Done", current: "In progress", upcoming: "Next" }

type StepperProps = Omit<React.ComponentProps<"ol">, "children"> & {
  steps: StepItem[]
  /** Index of the current step; steps before it are complete. Use steps.length when everything is done. */
  current: number
  /** Make completed steps clickable (e.g. to go back). */
  onStepClick?: (index: number) => void
}

/** Progress through a multi-step flow: bars fill on a spring, completed steps draw a check. */
function Stepper({ className, steps, current, onStepClick, ...props }: StepperProps) {
  return (
    <ol data-slot="stepper" className={cn("m-0 flex list-none items-start gap-2 p-0", className)} {...props}>
      {steps.map((step, i) => {
        const state: StepState = i < current ? "complete" : i === current ? "current" : "upcoming"
        const title = typeof step === "string" ? step : step.title
        const description = typeof step === "string" ? defaultDescription[state] : (step.description ?? defaultDescription[state])
        const clickable = !!onStepClick && state === "complete"
        const label = (
          <>
            <span className="flex items-center gap-1.5">
              <StepMarker state={state} index={i} />
              <span className={cn("text-[13px] font-semibold transition-colors", state === "upcoming" ? "text-muted-foreground" : "text-foreground")}>
                {title}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </>
        )
        return (
          <li key={i} data-slot="step" data-state={state} aria-current={state === "current" ? "step" : undefined} className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="relative h-[3px] overflow-hidden rounded-full bg-muted">
              <motion.span
                className="absolute inset-0 origin-left rounded-full bg-primary"
                initial={false}
                animate={{ scaleX: state === "upcoming" ? 0 : 1 }}
                transition={{ ...springSoft, delay: state === "upcoming" ? 0 : 0.04 * i }}
              />
              {state === "current" && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "300%" }}
                  transition={{ duration: 0.9, ease, delay: 0.2 }}
                />
              )}
            </span>
            {clickable ? (
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                className="flex cursor-pointer flex-col gap-0.5 rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {label}
              </button>
            ) : (
              <div className="flex flex-col gap-0.5">{label}</div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function StepMarker({ state, index }: { state: StepState; index: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-full text-[10px] font-semibold tabular-nums transition-colors duration-200",
        state === "complete" && "bg-primary text-primary-foreground",
        state === "current" && "bg-primary-subtle text-brand ring-1 ring-primary",
        state === "upcoming" && "bg-muted text-muted-foreground"
      )}
      initial={false}
      animate={{ scale: state === "current" ? 1.08 : 1 }}
      transition={springBouncy}
    >
      {state === "complete" ? (
        <svg viewBox="0 0 24 24" className="size-2.5" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
          <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: durations.slow, ease }} />
        </svg>
      ) : (
        <motion.span key={state} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={spring}>
          {index + 1}
        </motion.span>
      )}
    </motion.span>
  )
}

export { Stepper }
