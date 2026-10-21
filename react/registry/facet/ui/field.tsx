"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Label as LabelPrimitive, Slot } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, springSoft } from "@/registry/facet/lib/motion"

type FieldCtx = { id: string; descriptionId: string; errorId: string; invalid: boolean; required: boolean; disabled: boolean }
const FieldContext = React.createContext<FieldCtx | null>(null)

function useField() {
  const ctx = React.useContext(FieldContext)
  if (!ctx) throw new Error("Field parts must be used inside <Field>")
  return ctx
}

export interface FieldProps extends React.ComponentProps<"div"> {
  /** Turns the help text red, marks the control aria-invalid and reveals <FieldError>. */
  invalid?: boolean
  required?: boolean
  disabled?: boolean
  /** id given to the control (generated when omitted). */
  controlId?: string
}

/** Label + control + help/error text, wired together with ids and aria-describedby. */
function Field({ className, invalid = false, required = false, disabled = false, controlId, ...props }: FieldProps) {
  const auto = React.useId()
  const id = controlId ?? `field-${auto}`
  return (
    <FieldContext.Provider value={{ id, descriptionId: `${id}-description`, errorId: `${id}-error`, invalid, required, disabled }}>
      <div
        data-slot="field"
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        className={cn("flex flex-col gap-1.5", className)}
        {...props}
      />
    </FieldContext.Provider>
  )
}

function FieldLabel({ className, children, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { id, required, disabled } = useField()
  return (
    <LabelPrimitive.Root
      data-slot="field-label"
      htmlFor={id}
      className={cn("inline-flex items-center gap-1 text-[13px] leading-5 font-medium text-foreground", disabled && "opacity-50", className)}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="text-danger">
          *
        </span>
      )}
      {required && <span className="sr-only">(required)</span>}
    </LabelPrimitive.Root>
  )
}

/** Wraps the control and injects id, aria-describedby, aria-invalid, required and disabled. */
function FieldControl(props: React.ComponentProps<typeof Slot.Root>) {
  const { id, descriptionId, errorId, invalid, required, disabled } = useField()
  return (
    <Slot.Root
      data-slot="field-control"
      id={id}
      aria-describedby={invalid ? `${errorId} ${descriptionId}` : descriptionId}
      aria-invalid={invalid || undefined}
      aria-required={required || undefined}
      {...({ disabled: disabled || undefined } as React.HTMLAttributes<HTMLElement>)}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { descriptionId, invalid } = useField()
  return (
    <p
      data-slot="field-description"
      id={descriptionId}
      className={cn("text-xs leading-[18px] text-muted-foreground transition-colors", invalid && "text-danger", className)}
      {...props}
    />
  )
}

/** Error message: slides + fades in when the field turns invalid and collapses away when fixed. */
function FieldError({ className, children, ...props }: React.ComponentProps<typeof motion.p>) {
  const { errorId, invalid } = useField()
  const show = invalid && children != null && children !== false && children !== ""
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          key="error"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1, transition: springSoft }}
          exit={{ height: 0, opacity: 0, transition: { duration: durations.fast, ease } }}
          className="-mt-1.5 overflow-hidden"
        >
          <motion.p
            data-slot="field-error"
            id={errorId}
            role="alert"
            initial={{ y: -4 }}
            animate={{ y: 0 }}
            exit={{ y: -4 }}
            transition={springSoft}
            className={cn("flex items-center gap-1 pt-1.5 text-xs leading-[18px] font-medium text-danger", className)}
            {...props}
          >
            {children}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { Field, FieldLabel, FieldControl, FieldDescription, FieldError, useField }
