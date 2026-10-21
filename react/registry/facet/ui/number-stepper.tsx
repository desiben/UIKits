"use client"

import * as React from "react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { spring } from "@/registry/facet/lib/motion"

/* ---------------------------------------------------------------------------
 * AnimatedNumber — every character rolls like an odometer when the value changes.
 * Rolls up when the value grows and down when it shrinks.
 * ------------------------------------------------------------------------- */

const roll: Variants = {
  enter: (dir: number) => ({ y: dir >= 0 ? "70%" : "-70%", opacity: 0, filter: "blur(2px)" }),
  center: { y: "0%", opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ y: dir >= 0 ? "-70%" : "70%", opacity: 0, filter: "blur(2px)" }),
}

interface AnimatedNumberProps extends Omit<React.ComponentProps<"span">, "children"> {
  value: number
  /** Turns the number into display text (defaults to `String(value)`). */
  format?: (value: number) => string
}

function AnimatedNumber({ value, format, className, ...props }: AnimatedNumberProps) {
  const [state, setState] = React.useState({ value, dir: 0 })
  if (state.value !== value) setState({ value, dir: value > state.value ? 1 : -1 })
  const text = format ? format(value) : String(value)
  const chars = text.split("")

  return (
    <span data-slot="animated-number" className={cn("inline-flex tabular-nums", className)} {...props}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex">
        {chars.map((char, i) => (
          <span key={chars.length - i} className="relative inline-flex overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout" custom={state.dir}>
              <motion.span
                key={char}
                custom={state.dir}
                variants={roll}
                initial="enter"
                animate="center"
                exit="exit"
                transition={spring}
                className="inline-block whitespace-pre"
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
      </span>
    </span>
  )
}

/* ---------------------------------------------------------------------------
 * NumberStepper
 * ------------------------------------------------------------------------- */

const stepperVariants = cva(
  "inline-flex items-stretch overflow-hidden border text-foreground transition-[border-color,box-shadow] duration-150 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
  {
    variants: {
      variant: {
        default: "rounded-facet border-input bg-card hover:border-muted-foreground focus-within:hover:border-ring",
        pill: "rounded-full border-input bg-card hover:border-muted-foreground focus-within:hover:border-ring",
        ghost: "rounded-facet border-transparent bg-muted",
      },
      size: {
        sm: "h-8 text-[13px]",
        md: "h-9 text-sm",
        lg: "h-11 text-[15px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
)

const btnSize = { sm: "w-8", md: "w-9", lg: "w-11" } as const
const inputWidth = { sm: "w-10", md: "w-14", lg: "w-16" } as const

function decimals(n: number) {
  const s = String(n)
  const i = s.indexOf(".")
  return i === -1 ? 0 : s.length - i - 1
}

export interface NumberStepperProps
  extends Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "size" | "type" | "min" | "max" | "step">,
    VariantProps<typeof stepperVariants> {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Formats the rolling display (the input itself always holds the raw number). */
  format?: (value: number) => string
  /** Hold a button to keep stepping. Defaults to true. */
  holdToRepeat?: boolean
  wrapperClassName?: string
}

function NumberStepper({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  format,
  holdToRepeat = true,
  variant,
  size,
  disabled,
  className,
  wrapperClassName,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: NumberStepperProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const valueRef = React.useRef(value)
  valueRef.current = value
  const [focused, setFocused] = React.useState(false)
  const [draft, setDraft] = React.useState(String(value))
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const precision = Math.max(decimals(step), decimals(Number.isFinite(min) ? min : 0))
  const s = size ?? "md"

  const commit = React.useCallback(
    (next: number) => {
      const clamped = Math.min(max, Math.max(min, Number(next.toFixed(precision))))
      if (clamped === valueRef.current) return
      valueRef.current = clamped
      if (valueProp === undefined) setInner(clamped)
      onValueChange?.(clamped)
      setDraft(String(clamped))
    },
    [max, min, precision, valueProp, onValueChange]
  )

  const stopRepeat = React.useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }, [])
  React.useEffect(() => stopRepeat, [stopRepeat])

  const startRepeat = (dir: 1 | -1) => {
    commit(valueRef.current + dir * step)
    if (!holdToRepeat) return
    let delay = 380
    const tick = () => {
      const before = valueRef.current
      commit(before + dir * step)
      if (valueRef.current === before) return stopRepeat()
      delay = Math.max(50, delay * 0.8)
      timer.current = setTimeout(tick, delay)
    }
    timer.current = setTimeout(tick, delay)
  }

  const stepButton = (dir: 1 | -1) => {
    const atLimit = dir === 1 ? value >= max : value <= min
    return (
      <motion.button
        type="button"
        tabIndex={-1}
        aria-label={dir === 1 ? "Increase" : "Decrease"}
        disabled={disabled || atLimit}
        whileTap={{ scale: 0.86 }}
        transition={spring}
        onPointerDown={(e) => {
          if (e.button !== 0) return
          e.preventDefault()
          startRepeat(dir)
        }}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={stopRepeat}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            commit(valueRef.current + dir * step)
          }
        }}
        className={cn(
          "grid shrink-0 cursor-pointer place-items-center text-foreground outline-none transition-colors hover:bg-accent active:bg-secondary disabled:cursor-not-allowed disabled:text-placeholder disabled:hover:bg-transparent [&_svg]:size-4",
          btnSize[s],
          s === "sm" && "[&_svg]:size-3.5"
        )}
      >
        {dir === 1 ? <Plus /> : <Minus />}
      </motion.button>
    )
  }

  return (
    <div
      data-slot="number-stepper"
      data-disabled={disabled || undefined}
      className={cn(stepperVariants({ variant, size }), disabled && "pointer-events-none opacity-55", wrapperClassName)}
    >
      {stepButton(-1)}
      <div
        className={cn(
          "relative grid place-items-center border-x font-medium",
          variant === "ghost" ? "border-transparent" : "border-border-subtle",
          inputWidth[s]
        )}
      >
        <input
          data-slot="number-stepper-input"
          type="number"
          inputMode="decimal"
          min={Number.isFinite(min) ? min : undefined}
          max={Number.isFinite(max) ? max : undefined}
          step={step}
          disabled={disabled}
          value={focused ? draft : String(value)}
          onChange={(e) => {
            setDraft(e.target.value)
            const n = e.target.valueAsNumber
            if (!Number.isNaN(n) && n >= min && n <= max) commit(n)
          }}
          onFocus={(e) => {
            setDraft(String(value))
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            const n = Number(draft)
            if (draft.trim() !== "" && !Number.isNaN(n)) commit(n)
            setDraft(String(valueRef.current))
            onBlur?.(e)
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault()
              commit(valueRef.current + (e.key === "ArrowUp" ? step : -step))
            }
            onKeyDown?.(e)
          }}
          className={cn(
            "absolute inset-0 size-full bg-transparent text-center font-medium tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            focused ? "text-foreground" : "text-transparent caret-transparent",
            className
          )}
          {...props}
        />
        {!focused && (
          <AnimatedNumber
            aria-hidden="true"
            value={value}
            format={format}
            className="pointer-events-none relative"
          />
        )}
      </div>
      {stepButton(1)}
    </div>
  )
}

export { NumberStepper, AnimatedNumber, stepperVariants }
