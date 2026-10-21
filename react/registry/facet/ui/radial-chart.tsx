"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Cell, PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease } from "@/registry/facet/lib/motion"
import { AnimatedNumber, ChartFrame, chartColor, formatChartValue, type ChartFormat } from "@/registry/facet/ui/chart-tooltip"

export type RadialDatum = { name: string; value: number; /** Per-ring maximum (default 100). */ max?: number; color?: string }

export type RadialChartProps = {
  data: RadialDatum[]
  /** Half-circle gauge instead of full rings. */
  half?: boolean
  /** Ring thickness in px. */
  thickness?: number
  /** Diameter in px. */
  size?: number
  format?: ChartFormat
  /** Caption under the center value. */
  centerSub?: React.ReactNode
  /** Legend with values next to the rings (default: when there are 2+ rings). */
  legend?: boolean
  label?: string
  className?: string
}

function RadialChart({
  data,
  half = false,
  thickness,
  size = 220,
  format = "number",
  centerSub,
  legend,
  label,
  className,
}: RadialChartProps) {
  const [active, setActive] = React.useState<number | null>(null)
  const t = thickness ?? (half ? 18 : 12)
  const gap = 6
  const rows = data.map((d, i) => ({
    ...d,
    index: i,
    pct: Math.max(0, Math.min(100, (d.value / (d.max ?? 100)) * 100)),
    fill: chartColor(i, d.color),
  }))
  const outer = size / 2 - 2
  const inner = Math.max(t, outer - rows.length * (t + gap) + gap)
  // recharts draws the first row innermost; Facet lists the first ring outermost.
  const ordered = [...rows].reverse()
  const height = half ? size / 2 + 6 : size
  const focus = rows[active ?? 0]
  const showLegend = legend ?? rows.length > 1

  return (
    <ChartFrame label={label} className={cn("flex flex-wrap items-center justify-center gap-x-8 gap-y-4", className)}>
      <div className="relative flex-none" style={{ width: size, height }}>
        <RadialBarChart
          width={size}
          height={height}
          cx={size / 2}
          cy={half ? size / 2 : size / 2}
          data={ordered}
          innerRadius={inner}
          outerRadius={outer}
          barSize={t}
          startAngle={half ? 180 : 90}
          endAngle={half ? 0 : -270}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
          <RadialBar
            dataKey="pct"
            cornerRadius={t / 2}
            background={{ fill: "var(--muted)" }}
            animationDuration={1000}
            animationEasing="ease-out"
            onMouseEnter={(_, i) => setActive(ordered[i]?.index ?? null)}
            onMouseLeave={() => setActive(null)}
          >
            {ordered.map((r) => (
              <Cell
                key={r.name}
                fill={r.fill}
                style={{ opacity: active !== null && active !== r.index ? 0.35 : 1, transition: "opacity 160ms ease-out" }}
              />
            ))}
          </RadialBar>
        </RadialBarChart>
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 flex flex-col items-center text-center",
            half ? "bottom-0" : "inset-y-0 justify-center"
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={focus?.name}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: durations.fast, ease }}
            >
              {focus && (
                <span className="text-[28px] leading-8 font-semibold tracking-tight text-foreground">
                  <AnimatedNumber value={focus.value} from={0} format={format} />
                </span>
              )}
              <span className="text-xs text-muted-foreground">{centerSub ?? focus?.name}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {showLegend && (
        <ul data-slot="chart-legend" className="flex min-w-[170px] flex-col gap-1" onMouseLeave={() => setActive(null)}>
          {rows.map((r, i) => (
            <motion.li
              key={r.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: durations.base, ease, delay: 0.15 + i * 0.05 }}
            >
              <button
                type="button"
                className={cn(
                  "flex w-full cursor-default items-center gap-2 rounded-facet-sm px-2 py-1.5 text-left text-[13px] outline-none transition-[opacity,background-color] duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                  active === i && "bg-accent",
                  active !== null && active !== i && "opacity-50"
                )}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <i aria-hidden="true" className="size-2.5 flex-none rounded-full" style={{ background: r.fill }} />
                <span className="font-medium text-foreground">{r.name}</span>
                <span className="ml-auto pl-4 font-semibold text-foreground tabular-nums">
                  {formatChartValue(r.value, format)}
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </ChartFrame>
  )
}

export { RadialChart }
