"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Cell, Pie, PieChart as RPieChart, Tooltip } from "recharts"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease } from "@/registry/facet/lib/motion"
import {
  AnimatedNumber,
  ChartFrame,
  ChartTooltipContent,
  chartColor,
  chartTooltipProps,
  formatChartValue,
  type ChartFormat,
} from "@/registry/facet/ui/chart-tooltip"

export type PieSlice = { name: string; value: number; color?: string }

export type PieChartProps = {
  data: PieSlice[]
  /** Donut (default) or full pie. */
  donut?: boolean
  format?: ChartFormat
  /** Big text in the middle of the donut (defaults to the formatted total). */
  centerLabel?: React.ReactNode
  /** Small caption under the center label. */
  centerSub?: React.ReactNode
  /** Diameter in px. */
  size?: number
  /** Show the legend with percentages (default true). */
  legend?: boolean
  /** Tooltip on hover (default: only for the full pie; the donut uses its center). */
  tooltip?: boolean
  label?: string
  className?: string
}

function PieChart({
  data,
  donut = true,
  format = "number",
  centerLabel,
  centerSub,
  size = 200,
  legend = true,
  tooltip,
  label,
  className,
}: PieChartProps) {
  const [active, setActive] = React.useState<number | null>(null)
  const rows = data.map((d, i) => ({ ...d, fill: chartColor(i, d.color) }))
  const total = rows.reduce((a, r) => a + (r.value || 0), 0)
  const pct = (v: number) => (total ? Math.round((v / total) * 1000) / 10 : 0)
  const outer = size / 2 - 8
  const showTooltip = tooltip ?? !donut
  const hovered = active !== null ? rows[active] : null

  return (
    <ChartFrame label={label} className={cn("flex flex-wrap items-center gap-x-8 gap-y-4", className)}>
      <div className="relative mx-auto flex-none sm:mx-0" style={{ width: size, height: size }}>
        <RPieChart width={size} height={size} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          {showTooltip && <Tooltip {...chartTooltipProps("line")} cursor={false} content={<ChartTooltipContent format={format} />} />}
          <Pie
            data={rows}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={donut ? outer * 0.64 : 0}
            outerRadius={outer}
            startAngle={90}
            endAngle={-270}
            paddingAngle={donut ? 1.5 : 0}
            cornerRadius={donut ? 3 : 0}
            stroke="var(--card)"
            strokeWidth={2}
            animationDuration={900}
            animationEasing="ease-out"
            onMouseEnter={(_, i) => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            {rows.map((r, i) => (
              <Cell
                key={r.name}
                fill={r.fill}
                style={{
                  transformOrigin: "center",
                  transformBox: "view-box",
                  transform: active === i ? "scale(1.045)" : "scale(1)",
                  opacity: active !== null && active !== i ? 0.5 : 1,
                  transition: "transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 160ms ease-out",
                  outline: "none",
                }}
              />
            ))}
          </Pie>
        </RPieChart>
        {donut && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={hovered ? hovered.name : "total"}
                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: durations.fast, ease }}
                className="flex flex-col items-center"
              >
                <span className="text-[28px] leading-8 font-semibold tracking-tight text-foreground">
                  {hovered ? (
                    formatChartValue(hovered.value, format)
                  ) : centerLabel !== undefined ? (
                    centerLabel
                  ) : (
                    <AnimatedNumber value={total} from={0} format={format} />
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {hovered ? `${hovered.name} · ${pct(hovered.value)}%` : (centerSub ?? "Total")}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
      {legend && (
        <ul
          data-slot="chart-legend"
          className="flex min-w-[180px] flex-1 flex-col gap-1"
          onMouseLeave={() => setActive(null)}
        >
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
                <i aria-hidden="true" className="size-2.5 flex-none rounded-[3px]" style={{ background: r.fill }} />
                <span className="font-medium text-foreground">{r.name}</span>
                <span className="ml-auto text-muted-foreground tabular-nums">{formatChartValue(r.value, format)}</span>
                <span className="w-12 text-right font-semibold text-foreground tabular-nums">{pct(r.value)}%</span>
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </ChartFrame>
  )
}

export { PieChart }
