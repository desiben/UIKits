"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform } from "motion/react"
import type { TooltipPayload } from "recharts"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springBouncy } from "@/registry/facet/lib/motion"

/* ------------------------------------------------------------------ */
/* Shared chart helpers (used by every Facet chart)                    */
/* ------------------------------------------------------------------ */

export type ChartFormat =
  | "number"
  | "currency"
  | "$compact"
  | "compact"
  | "percent"
  | ((value: number) => string)

export type ChartSeries = {
  /** Key of the value in each data row. */
  key: string
  /** Display name (tooltip + legend). Defaults to the key. */
  name?: string
  /** Any CSS colour; defaults to var(--chart-N). */
  color?: string
}

/** Facet categorical palette — resolves to the theme's chart tokens (light + dark). */
export const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"] as const

export function chartColor(index: number, override?: string) {
  return override ?? chartColors[index % chartColors.length]
}

function decimalsOf(n: number) {
  if (!Number.isFinite(n) || Number.isInteger(n)) return 0
  const s = String(n)
  const i = s.indexOf(".")
  return i === -1 ? 0 : Math.min(2, s.length - i - 1)
}

const compactFmt = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
const numberFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 })
const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

/** Formats a chart value: currency · $compact · compact · percent · number, or a custom function. */
export function formatChartValue(value: unknown, format: ChartFormat = "number", decimals?: number): string {
  if (value === null || value === undefined || value === "") return "—"
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n)) return String(value)
  if (typeof format === "function") return format(n)
  const sign = n < 0 ? "−" : ""
  const abs = Math.abs(n)
  switch (format) {
    case "currency":
      return sign + currencyFmt.format(abs)
    case "$compact":
      return sign + "$" + compactFmt.format(abs)
    case "compact":
      return sign + compactFmt.format(abs)
    case "percent":
      return sign + abs.toFixed(decimals ?? decimalsOf(abs)) + "%"
    default:
      return sign + (decimals !== undefined ? abs.toFixed(decimals) : numberFmt.format(abs))
  }
}

/** Axis + grid props that match Facet's chart look. Spread onto recharts XAxis / YAxis / CartesianGrid. */
export const chartAxisProps = {
  tickLine: false,
  axisLine: false,
  tickMargin: 8,
  tick: { fill: "var(--muted-foreground)", fontSize: 12 },
} as const

export const chartGridProps = {
  vertical: false,
  stroke: "var(--border)",
  strokeOpacity: 0.7,
} as const

/** A number that springs to its new value (counts up on mount when `from` is set). */
export function AnimatedNumber({
  value,
  format = "number",
  from,
  className,
}: {
  value: number
  format?: ChartFormat
  from?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const decimals = decimalsOf(value)
  const mv = useSpring(reduce ? value : (from ?? value), { stiffness: 220, damping: 30, mass: 0.8 })
  React.useEffect(() => {
    if (reduce) mv.jump(value)
    else mv.set(value)
  }, [value, reduce, mv])
  const text = useTransform(mv, (v) =>
    formatChartValue(decimals ? Number(v.toFixed(decimals)) : Math.round(v), format, format === "percent" ? decimals : undefined)
  )
  return (
    <motion.span data-slot="animated-number" className={cn("tabular-nums", className)}>
      {text}
    </motion.span>
  )
}

/* ------------------------------------------------------------------ */
/* Tooltip                                                             */
/* ------------------------------------------------------------------ */

export type ChartTooltipItem = {
  name: React.ReactNode
  value: number | string | null | undefined
  color?: string
  /** Per-item format (overrides the panel's). */
  format?: ChartFormat
}

type ChartTooltipPanelProps = {
  label?: React.ReactNode
  items: ChartTooltipItem[]
  format?: ChartFormat
  /** Spring the values between hovered points instead of swapping them. */
  tickValues?: boolean
  className?: string
}

function TooltipRows({ label, items, format = "number", tickValues = false }: Omit<ChartTooltipPanelProps, "className">) {
  return (
    <>
      {label !== undefined && label !== null && label !== "" && (
        <div className="relative mb-1 h-4 overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.b
              key={String(label)}
              className="block text-xs font-medium whitespace-nowrap text-muted-foreground"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: durations.fast, ease }}
            >
              {label}
            </motion.b>
          </AnimatePresence>
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2 whitespace-nowrap">
            <i
              aria-hidden="true"
              className="size-2 flex-none rounded-[2px]"
              style={{ background: it.color ?? chartColor(i) }}
            />
            <span className="text-foreground-secondary">{it.name}</span>
            <span className="ml-auto pl-3 font-semibold text-foreground tabular-nums">
              {tickValues && typeof it.value === "number" ? (
                <AnimatedNumber value={it.value} format={it.format ?? format} />
              ) : (
                formatChartValue(it.value, it.format ?? format)
              )}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

const panelClass =
  "min-w-[140px] rounded-facet border border-border bg-popover px-3 py-2 text-[13px] leading-[18px] text-popover-foreground shadow-lg"

/**
 * The floating panel that shows exact values. Use it as plain markup for custom charts;
 * Facet charts render it through `ChartTooltipContent`.
 */
function ChartTooltip({
  label,
  items,
  format,
  tickValues,
  className,
  ...props
}: ChartTooltipPanelProps & Omit<React.ComponentProps<typeof motion.div>, "children">) {
  return (
    <motion.div
      data-slot="chart-tooltip"
      role="status"
      className={cn(panelClass, className)}
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring}
      {...props}
    >
      <TooltipRows label={label} items={items} format={format} tickValues={tickValues} />
    </motion.div>
  )
}

type ChartTooltipContentProps = {
  /* Injected by recharts */
  active?: boolean
  payload?: TooltipPayload
  label?: string | number
  /* Facet options */
  format?: ChartFormat
  /** Per-series formats keyed by dataKey (e.g. a second axis in another unit). */
  formats?: Record<string, ChartFormat>
  /** Override the heading; receives the category label. Return null to hide it. */
  labelFormatter?: (label: string | number | undefined, payload: TooltipPayload) => React.ReactNode
  hideLabel?: boolean
  className?: string
}

/**
 * Recharts adapter: `<Tooltip content={<ChartTooltipContent format="$compact" />} />`.
 * Pops in, slides the heading between points and springs the values.
 */
function ChartTooltipContent({
  active,
  payload,
  label,
  format = "number",
  formats,
  labelFormatter,
  hideLabel,
  className,
}: ChartTooltipContentProps) {
  const items: ChartTooltipItem[] = (payload ?? [])
    .filter((p) => p.type !== "none" && p.value !== undefined && p.value !== null)
    .map((p) => {
      const row = (p.payload ?? {}) as { fill?: string; color?: string }
      return {
        name: p.name ?? String(p.dataKey ?? ""),
        value: p.value as number,
        color: p.color ?? row.fill ?? p.fill ?? p.stroke,
        format: formats?.[String(p.dataKey)],
      }
    })
  const heading = hideLabel ? undefined : labelFormatter ? labelFormatter(label, payload ?? []) : label
  return (
    <AnimatePresence>
      {active && items.length > 0 && (
        <motion.div
          key="chart-tooltip"
          data-slot="chart-tooltip"
          className={cn(panelClass, className)}
          initial={{ opacity: 0, y: 6, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.97, transition: { duration: durations.fast, ease } }}
          transition={spring}
        >
          <TooltipRows label={heading} items={items} format={format} tickValues />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Props for recharts' <Tooltip> that give Facet's cursor and a smooth follow. */
export function chartTooltipProps(kind: "line" | "bar" = "line") {
  return {
    animationDuration: 220,
    animationEasing: "ease-out" as const,
    wrapperStyle: { outline: "none", zIndex: 10 },
    cursor:
      kind === "bar"
        ? { fill: "var(--accent)", fillOpacity: 0.6, radius: 4 }
        : { stroke: "var(--border-strong)", strokeDasharray: "3 3", strokeWidth: 1 },
  }
}

/** Active dot that pops in under the cursor. Pass as `activeDot={chartActiveDot(color)}`. */
export function chartActiveDot(color: string) {
  return function ActiveDot(props: { cx?: number; cy?: number; index?: number }) {
    if (props.cx == null || props.cy == null) return null
    return (
      <motion.circle
        key={props.index}
        cx={props.cx}
        cy={props.cy}
        fill={color}
        stroke="var(--card)"
        strokeWidth={2}
        initial={{ r: 0 }}
        animate={{ r: 5 }}
        transition={springBouncy}
      />
    )
  }
}

/* ------------------------------------------------------------------ */
/* Legend with hover-to-highlight                                      */
/* ------------------------------------------------------------------ */

export type ChartLegendItem = { key: string; name: React.ReactNode; color: string; detail?: React.ReactNode }

function ChartLegend({
  items,
  active,
  onActiveChange,
  className,
  ...props
}: {
  items: ChartLegendItem[]
  active?: string | null
  onActiveChange?: (key: string | null) => void
} & Omit<React.ComponentProps<"div">, "children">) {
  return (
    <div
      data-slot="chart-legend"
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-foreground-secondary", className)}
      onMouseLeave={() => onActiveChange?.(null)}
      {...props}
    >
      {items.map((it) => {
        const dim = active != null && active !== it.key
        return (
          <motion.button
            key={it.key}
            type="button"
            className="inline-flex cursor-default items-center gap-1.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            animate={{ opacity: dim ? 0.45 : 1 }}
            transition={{ duration: durations.fast }}
            onMouseEnter={() => onActiveChange?.(it.key)}
            onFocus={() => onActiveChange?.(it.key)}
            onBlur={() => onActiveChange?.(null)}
          >
            <motion.i
              aria-hidden="true"
              className="size-2 rounded-[2px]"
              style={{ background: it.color }}
              animate={{ scale: active === it.key ? 1.35 : 1 }}
              transition={spring}
            />
            {it.name}
            {it.detail !== undefined && <span className="text-muted-foreground tabular-nums">{it.detail}</span>}
          </motion.button>
        )
      })}
    </div>
  )
}

/** Wrapper every Facet chart renders: figure semantics + a soft entrance. */
function ChartFrame({
  label,
  className,
  children,
  ...props
}: { label?: string } & React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      data-slot="chart"
      role="figure"
      aria-label={label}
      className={cn(
        "relative w-full min-w-0 text-xs text-muted-foreground [&_.recharts-surface]:overflow-visible [&_.recharts-wrapper]:outline-none [&_svg]:outline-none",
        className
      )}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.slow, ease }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export { ChartTooltip, ChartTooltipContent, ChartLegend, ChartFrame }
