"use client"

import * as React from "react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springSoft } from "@/registry/facet/lib/motion"

const roll: Variants = {
  enter: (dir: number) => ({ y: dir >= 0 ? "60%" : "-60%", opacity: 0 }),
  center: { y: "0%", opacity: 1 },
  exit: (dir: number) => ({ y: dir >= 0 ? "-60%" : "60%", opacity: 0 }),
}

export interface InlineSelectOption {
  value: string
  label: string
}

export interface InlineSelectProps
  extends Omit<React.ComponentProps<"select">, "value" | "defaultValue" | "onChange" | "children"> {
  options: InlineSelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Required: the sentence around the select is not its label. */
  "aria-label": string
  wrapperClassName?: string
}

/**
 * A native <select> that reads as part of a sentence. The real select sits invisibly on top
 * (so the platform picker and keyboard work); the visible text rolls to the new choice and the
 * underline stretches to its width.
 */
function InlineSelect({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  wrapperClassName,
  disabled,
  ...props
}: InlineSelectProps) {
  const [inner, setInner] = React.useState(defaultValue ?? options[0]?.value ?? "")
  const value = valueProp ?? inner
  const index = Math.max(0, options.findIndex((o) => o.value === value))
  const label = options[index]?.label ?? ""
  const [state, setState] = React.useState({ index, dir: 0 })
  if (state.index !== index) setState({ index, dir: index > state.index ? 1 : -1 })

  const measure = React.useRef<HTMLSpanElement>(null)
  const [width, setWidth] = React.useState<number | "auto">("auto")
  React.useLayoutEffect(() => {
    if (measure.current) setWidth(measure.current.getBoundingClientRect().width)
  }, [label])

  return (
    <span
      data-slot="inline-select"
      data-disabled={disabled || undefined}
      className={cn(
        "group/is relative inline-flex items-baseline rounded-[3px] align-baseline font-semibold text-brand has-[select:focus-visible]:ring-2 has-[select:focus-visible]:ring-ring has-[select:focus-visible]:ring-offset-2 has-[select:focus-visible]:ring-offset-background",
        disabled && "opacity-55",
        wrapperClassName
      )}
    >
      <span ref={measure} aria-hidden="true" className="invisible absolute left-0 top-0 whitespace-pre">
        {label}
      </span>
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ width }}
        transition={springSoft}
        className="relative inline-flex overflow-hidden whitespace-pre border-b-[1.5px] border-dashed border-brand/50 transition-colors group-hover/is:border-solid group-hover/is:border-brand"
      >
        <AnimatePresence initial={false} mode="popLayout" custom={state.dir}>
          <motion.span
            key={label}
            custom={state.dir}
            variants={roll}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            className="inline-block"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="ml-0.5 inline-flex self-center"
        whileHover={{ y: 1 }}
        transition={spring}
      >
        <ChevronDown className="size-[0.85em]" strokeWidth={2.5} />
      </motion.span>
      <select
        data-slot="inline-select-native"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          if (valueProp === undefined) setInner(e.target.value)
          onValueChange?.(e.target.value)
        }}
        className={cn(
          "absolute inset-0 size-full cursor-pointer appearance-none opacity-0 outline-none disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </span>
  )
}

export { InlineSelect }
