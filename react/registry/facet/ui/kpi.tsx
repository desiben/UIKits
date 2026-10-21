"use client"

import * as React from "react"
import {
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

import { cn } from "@/registry/facet/lib/utils"
import { slideUp, springBouncy, springSoft } from "@/registry/facet/lib/motion"
import { TrendChip, type TrendChipProps } from "@/registry/facet/ui/trend-chip"

/* ---------------------------------------------------------------- AnimatedNumber */

export interface AnimatedNumberProps extends Omit<React.ComponentProps<"span">, "children" | "prefix"> {
  value: number
  /** Intl.NumberFormat options, e.g. { style: "currency", currency: "USD", maximumFractionDigits: 0 }. */
  format?: Intl.NumberFormatOptions
  locale?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

/**
 * A number that counts up with a spring when it scrolls into view, and springs to each new value.
 * Screen readers get the final value only; reduced motion jumps straight to it.
 */
function AnimatedNumber({ value, format, locale = "en-US", prefix, suffix, className, ...props }: AnimatedNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const mv = useSpring(0, { stiffness: 70, damping: 20, mass: 1 })
  // Default precision = the precision of `value`, so intermediate frames don't show stray decimals.
  const decimals = Number.isInteger(value) ? 0 : Math.min(String(value).split(".")[1]?.length ?? 0, 4)
  const formatKey = JSON.stringify(format ?? {}) + decimals
  const fmt = React.useMemo(() => {
    const max = format?.maximumFractionDigits ?? Math.max(decimals, format?.minimumFractionDigits ?? 0)
    const min = format?.minimumFractionDigits ?? Math.min(decimals, max)
    return new Intl.NumberFormat(locale, { ...format, minimumFractionDigits: min, maximumFractionDigits: max })
  }, [locale, formatKey]) // eslint-disable-line react-hooks/exhaustive-deps
  const text = useTransform(mv, (v) => fmt.format(v))

  React.useEffect(() => {
    if (!inView) return
    if (reduce) mv.jump(value)
    else mv.set(value)
  }, [inView, value, reduce, mv])

  return (
    <span ref={ref} data-slot="animated-number" className={cn("tabular-nums", className)} {...props}>
      <span className="sr-only">
        {typeof prefix === "string" ? prefix : null}
        {fmt.format(value)}
        {typeof suffix === "string" ? suffix : null}
      </span>
      <span aria-hidden="true">
        {prefix}
        <motion.span>{text}</motion.span>
        {suffix}
      </span>
    </span>
  )
}

/* ---------------------------------------------------------------- KPI parts */

export type KpiProps = HTMLMotionProps<"div">

/** Metric card. Inside a <KpiGroup> it drops its own border and joins the shared grid. */
function Kpi({ className, ...props }: KpiProps) {
  return (
    <motion.div
      data-slot="kpi"
      variants={slideUp}
      className={cn(
        "flex min-w-0 flex-col gap-1 rounded-facet-lg border border-border bg-card p-5 text-card-foreground shadow-xs",
        className
      )}
      {...props}
    />
  )
}

function KpiHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="kpi-header" className={cn("flex min-h-8 items-center gap-2", className)} {...props} />
}

function KpiLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="kpi-label"
      className={cn("flex flex-1 items-center gap-1.5 text-[13px] leading-4 font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

const iconTone = {
  brand: "bg-primary-subtle text-brand",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  danger: "bg-danger-subtle text-danger",
}

function KpiIcon({ className, status = "brand", ...props }: React.ComponentProps<"span"> & { status?: keyof typeof iconTone }) {
  return (
    <span
      data-slot="kpi-icon"
      data-status={status}
      className={cn("grid size-8 shrink-0 place-items-center rounded-facet [&_svg]:size-4", iconTone[status], className)}
      {...props}
    />
  )
}

function KpiActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="kpi-actions" className={cn("-my-1 -mr-2 ml-auto flex items-center", className)} {...props} />
}

function KpiRow({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="kpi-row" className={cn("flex flex-wrap items-baseline gap-2", className)} {...props} />
}

function KpiValue({ className, ...props }: AnimatedNumberProps) {
  return (
    <AnimatedNumber
      data-slot="kpi-value"
      className={cn("text-[28px] leading-8 font-semibold tracking-[-0.02em]", className)}
      {...props}
    />
  )
}

/** Trend chip that pops in just after the number starts counting. */
function KpiTrend({ className, ...props }: TrendChipProps) {
  return (
    <TrendChip
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ ...springBouncy, delay: 0.25 }}
      className={cn("self-center", className)}
      {...props}
    />
  )
}

export interface KpiSparkProps extends React.ComponentProps<"div"> {
  data: number[]
  /** Stroke/fill colour (default the first chart colour). */
  color?: string
}

/** Axis-free sparkline; draws in left-to-right when it enters the viewport. */
function KpiSpark({ data, color = "var(--chart-1)", className, ...props }: KpiSparkProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()
  const id = React.useId().replace(/:/g, "")
  const rows = React.useMemo(() => data.map((v, i) => ({ i, v })), [data])
  return (
    <div ref={ref} data-slot="kpi-spark" aria-hidden="true" className={cn("mt-2 h-12 w-full", className)} {...props}>
      {inView && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
            <defs>
              <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              dataKey="v"
              type="monotone"
              stroke={color}
              strokeWidth={2}
              fill={`url(#spark-${id})`}
              dot={false}
              activeDot={false}
              isAnimationActive={!reduce}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

function KpiFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kpi-footer"
      className={cn("mt-3 flex justify-between border-t border-border-subtle pt-3 text-[13px] text-muted-foreground", className)}
      {...props}
    />
  )
}

export interface KpiProgressProps extends React.ComponentProps<"div"> {
  /** 0–100 */
  value: number
  label?: string
}

/** Thin progress bar that springs to its value when it enters the viewport. */
function KpiProgress({ value, label = "Progress", className, ...props }: KpiProgressProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      ref={ref}
      data-slot="kpi-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      className={cn("mt-3 h-1 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: inView ? `${v}%` : 0 }}
        transition={{ ...springSoft, delay: 0.1 }}
      />
    </div>
  )
}

export {
  AnimatedNumber,
  Kpi,
  KpiHeader,
  KpiLabel,
  KpiIcon,
  KpiActions,
  KpiRow,
  KpiValue,
  KpiTrend,
  KpiSpark,
  KpiFooter,
  KpiProgress,
}
