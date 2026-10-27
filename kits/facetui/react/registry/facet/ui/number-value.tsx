"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { spring } from "@/registry/facet/lib/motion"

type NumberFormatPreset = "decimal" | "currency" | "compact" | "percent"

interface NumberValueProps extends Omit<React.ComponentProps<"span">, "children"> {
  value: number
  /** A preset or raw Intl.NumberFormat options. The "percent" preset takes percentage points (18.4 → 18.4%). */
  format?: NumberFormatPreset | Intl.NumberFormatOptions
  locale?: string
  /** Currency for the "currency" preset (default USD). */
  currency?: string
  /** Maximum fraction digits for presets. */
  digits?: number
  /** Show a + sign for positive values. */
  sign?: boolean
  /** Small trailing unit (e.g. "ms", "/mo"). */
  unit?: React.ReactNode
  /** Roll digits when the value changes (default true). */
  animated?: boolean
}

function resolveFormat(
  value: number,
  format: NumberValueProps["format"] = "decimal",
  { currency = "USD", digits, sign }: Pick<NumberValueProps, "currency" | "digits" | "sign">
): [number, Intl.NumberFormatOptions] {
  if (typeof format === "object") return [value, { ...format, ...(sign ? { signDisplay: "exceptZero" } : {}) }]
  const o: Intl.NumberFormatOptions = { maximumFractionDigits: digits ?? 1 }
  if (format === "currency") Object.assign(o, { style: "currency", currency, maximumFractionDigits: digits ?? 0 })
  if (format === "compact") o.notation = "compact"
  if (format === "percent") o.style = "percent"
  if (sign) o.signDisplay = "exceptZero"
  return [format === "percent" ? value / 100 : value, o]
}

function formatNumber(
  value: number,
  format?: NumberValueProps["format"],
  opts: Pick<NumberValueProps, "currency" | "digits" | "sign" | "locale"> = {}
) {
  const [v, o] = resolveFormat(value, format, opts)
  return new Intl.NumberFormat(opts.locale || "en-US", o).format(v)
}

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

/** One odometer wheel: a 0–9 column that springs to the current digit. */
function Digit({ digit, animated }: { digit: number; animated: boolean }) {
  return (
    <span className="relative inline-block [clip-path:inset(0)]">
      <span className="invisible">0</span>
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        initial={false}
        animate={{ y: `${-digit * 10}%` }}
        transition={animated ? spring : { duration: 0 }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="block text-center">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

/** Renders a pre-formatted numeric string with rolling digits (keys counted from the right). */
function RollingText({ text, animated = true }: { text: string; animated?: boolean }) {
  const chars = text.split("")
  return (
    <span aria-hidden="true" className="inline-flex whitespace-pre">
      <AnimatePresence initial={false} mode="popLayout">
        {chars.map((ch, i) => {
          const key = chars.length - i
          const isDigit = ch >= "0" && ch <= "9"
          return (
            <motion.span
              key={`${key}-${isDigit ? "d" : ch}`}
              layout={animated ? "position" : false}
              className="inline-block"
              initial={animated ? { opacity: 0, y: "-40%" } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "40%" }}
              transition={spring}
            >
              {isDigit ? <Digit digit={+ch} animated={animated} /> : ch}
            </motion.span>
          )
        })}
      </AnimatePresence>
    </span>
  )
}

function NumberValue({
  value,
  format = "decimal",
  locale,
  currency,
  digits,
  sign,
  unit,
  animated = true,
  className,
  ...props
}: NumberValueProps) {
  const text = formatNumber(value, format, { locale, currency, digits, sign })
  return (
    <span
      data-slot="number-value"
      data-value={value}
      className={cn("inline-flex items-baseline tabular-nums", className)}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <RollingText text={text} animated={animated} />
      {unit != null && (
        <span data-slot="number-value-unit" className="ml-0.5 text-[0.6em] font-medium text-muted-foreground">
          {unit}
        </span>
      )}
    </span>
  )
}

export { NumberValue, RollingText, formatNumber }
export type { NumberValueProps, NumberFormatPreset }
