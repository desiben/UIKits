"use client"

import * as React from "react"
import { AnimatePresence, motion, useInView } from "motion/react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring } from "@/registry/facet/lib/motion"

/* -------------------------------------------------------------------------------------------------
 * Config + context
 * Each series key maps to a label and a colour (default: the Facet chart palette, --chart-1..5).
 * The container exposes them as CSS variables --color-<key>, so series use fill="var(--color-mrr)".
 * -----------------------------------------------------------------------------------------------*/

export type ChartConfig = Record<
  string,
  { label?: React.ReactNode; color?: string; icon?: React.ComponentType<{ className?: string }> }
>

type ChartContextValue = {
  config: ChartConfig
  hidden: ReadonlySet<string>
  toggle: (key: string) => void
  isHidden: (key: string) => boolean
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

function useChart() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) throw new Error("useChart must be used inside <ChartContainer>")
  return ctx
}

function colorFor(config: ChartConfig, key: string, i: number) {
  return config[key]?.color ?? `var(--chart-${(i % 5) + 1})`
}

function useChartState(config: ChartConfig, defaultHidden?: string[]): ChartContextValue {
  const [hidden, setHidden] = React.useState<ReadonlySet<string>>(() => new Set(defaultHidden))
  return React.useMemo<ChartContextValue>(
    () => ({
      config,
      hidden,
      isHidden: (k) => hidden.has(k),
      toggle: (k) =>
        setHidden((prev) => {
          const next = new Set(prev)
          next.has(k) ? next.delete(k) : next.add(k)
          return next
        }),
    }),
    [config, hidden]
  )
}

export interface ChartProviderProps {
  config: ChartConfig
  /** Series keys hidden initially (toggle them with an interactive legend). */
  defaultHidden?: string[]
  children?: React.ReactNode
}

/**
 * Shares the config and series visibility between a legend placed outside the plot (e.g. in a
 * card header) and the <ChartContainer>. Optional: a container on its own creates its own state.
 */
function ChartProvider({ config, defaultHidden, children }: ChartProviderProps) {
  const ctx = useChartState(config, defaultHidden)
  return <ChartContext.Provider value={ctx}>{children}</ChartContext.Provider>
}

export interface ChartContainerProps extends React.ComponentProps<"div"> {
  /** Required unless the container sits inside a <ChartProvider>. */
  config?: ChartConfig
  defaultHidden?: string[]
}

/**
 * Responsive, themed wrapper for a Recharts chart (children render inside a ResponsiveContainer,
 * so a component that returns a chart works too). The chart mounts once it scrolls into view,
 * so the series draw-in animation plays when people actually see it.
 */
function ChartContainer({ id, config, defaultHidden, className, style, children, ...props }: ChartContainerProps) {
  const parent = React.useContext(ChartContext)
  const own = useChartState(config ?? parent?.config ?? {}, defaultHidden)
  const ctx = parent && !config ? parent : own
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const uid = React.useId()
  const chartId = `chart-${id ?? uid.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={ctx}>
      <div
        ref={ref}
        data-slot="chart"
        data-chart={chartId}
        style={{ ...chartVars(ctx.config), ...style }}
        className={cn(
          "relative flex aspect-video w-full justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border-subtle",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border-strong [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-accent",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-dot[stroke='#fff']]:stroke-card [&_.recharts-sector[stroke='#fff']]:stroke-card [&_.recharts-sector]:outline-none",
          "[&_.recharts-layer]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-wrapper]:outline-none",
          className
        )}
        {...props}
      >
        {inView ? (
          <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
            {children as React.ReactElement}
          </RechartsPrimitive.ResponsiveContainer>
        ) : null}
      </div>
    </ChartContext.Provider>
  )
}

/** CSS variables --color-<key> for a config (handy when a legend lives outside the container). */
function chartVars(config: ChartConfig) {
  return Object.fromEntries(Object.keys(config).map((k, i) => [`--color-${k}`, colorFor(config, k, i)])) as React.CSSProperties
}

/* -------------------------------------------------------------------------------------------------
 * Tooltip
 * -----------------------------------------------------------------------------------------------*/

const ChartTooltip = RechartsPrimitive.Tooltip

type TooltipItem = {
  name?: string | number
  value?: unknown
  dataKey?: unknown
  color?: string
  fill?: string
  payload?: Record<string, unknown>
}

export interface ChartTooltipContentProps {
  active?: boolean
  payload?: ReadonlyArray<TooltipItem>
  label?: React.ReactNode
  className?: string
  /** Swatch style next to each value. */
  indicator?: "dot" | "line"
  hideLabel?: boolean
  labelFormatter?: (label: React.ReactNode) => React.ReactNode
  valueFormatter?: (value: number, key: string) => React.ReactNode
}

/** Facet-styled tooltip body. Pops in, and rows re-flow smoothly as the hovered point changes. */
function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  indicator = "dot",
  hideLabel,
  labelFormatter,
  valueFormatter = (v) => v.toLocaleString("en-US"),
}: ChartTooltipContentProps) {
  const { config } = useChart()
  const items = (payload ?? []).filter((p) => p.value !== undefined && p.value !== null)
  return (
    <AnimatePresence>
      {active && items.length > 0 && (
        <motion.div
          data-slot="chart-tooltip"
          initial={{ opacity: 0, y: 4, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: durations.fast, ease } }}
          transition={spring}
          className={cn(
            "min-w-[140px] rounded-facet border border-border bg-popover px-3 py-2 text-[13px] text-popover-foreground shadow-lg",
            className
          )}
        >
          {!hideLabel && label !== undefined && (
            <div className="mb-1 text-xs font-medium text-muted-foreground">{labelFormatter ? labelFormatter(label) : label}</div>
          )}
          <div className="flex flex-col gap-1">
            {items.map((item, i) => {
              const key = String(item.dataKey ?? item.name ?? i)
              const color = item.color ?? item.fill ?? `var(--color-${key})`
              return (
                <div key={key} className="flex items-center gap-2">
                  <i
                    aria-hidden="true"
                    className={cn("shrink-0 rounded-[2px]", indicator === "dot" ? "size-2" : "h-3 w-1")}
                    style={{ background: color }}
                  />
                  <span className="text-foreground-secondary">{config[key]?.label ?? item.name}</span>
                  <span className="ml-auto pl-3 font-semibold tabular-nums">
                    {typeof item.value === "number" ? valueFormatter(item.value, key) : String(item.value)}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Legend
 * -----------------------------------------------------------------------------------------------*/

const ChartLegend = RechartsPrimitive.Legend

export interface ChartLegendContentProps {
  className?: string
  /** Needed only outside a ChartProvider / ChartContainer. */
  config?: ChartConfig
  /** Keys to show (defaults to every key in the config, or the Recharts payload when used as <ChartLegend content>). */
  keys?: string[]
  payload?: ReadonlyArray<{ dataKey?: unknown; value?: unknown; color?: string }>
  /** Clicking an item toggles that series (read it back with `useChart().isHidden(key)`). */
  interactive?: boolean
  verticalAlign?: "top" | "middle" | "bottom"
}

/** Legend chips. With `interactive`, each chip toggles its series and the swatch morphs on/off. */
function ChartLegendContent({ className, config: configProp, keys, payload, interactive, verticalAlign }: ChartLegendContentProps) {
  const ctx = React.useContext(ChartContext)
  const config = configProp ?? ctx?.config ?? {}
  const isHidden = (k: string) => ctx?.isHidden(k) ?? false
  const toggle = (k: string) => ctx?.toggle(k)
  interactive = interactive && !!ctx
  const list = keys ?? (payload?.length ? payload.map((p) => String(p.dataKey ?? p.value)) : Object.keys(config))
  const allKeys = Object.keys(config)
  return (
    <div
      data-slot="chart-legend"
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-foreground-secondary",
        verticalAlign === "top" ? "pb-3" : verticalAlign === "bottom" ? "pt-3" : "",
        className
      )}
    >
      {list.map((key) => {
        const off = isHidden(key)
        const color = config[key]?.color ?? `var(--chart-${(allKeys.indexOf(key) % 5) + 1})`
        const Icon = config[key]?.icon
        const content = (
          <>
            {Icon ? (
              <Icon className="size-3" />
            ) : (
              <motion.i
                aria-hidden="true"
                className="size-2 shrink-0 rounded-[2px]"
                animate={{ scale: off ? 0.75 : 1, opacity: off ? 0.35 : 1 }}
                transition={spring}
                style={{ background: color }}
              />
            )}
            <span className={cn("transition-opacity", off && "opacity-50 line-through decoration-1")}>
              {config[key]?.label ?? key}
            </span>
          </>
        )
        return interactive ? (
          <motion.button
            key={key}
            type="button"
            aria-pressed={!off}
            onClick={() => toggle(key)}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            className="-mx-1 inline-flex cursor-pointer items-center gap-1.5 rounded-facet-sm px-1 py-0.5 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          >
            {content}
          </motion.button>
        ) : (
          <span key={key} className="inline-flex items-center gap-1.5">
            {content}
          </span>
        )
      })}
    </div>
  )
}

export { ChartProvider, ChartContainer, chartVars, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, useChart }
