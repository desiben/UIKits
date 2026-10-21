"use client"

import * as React from "react"
import { Area, AreaChart as RAreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"

import { cn } from "@/registry/facet/lib/utils"
import {
  ChartFrame,
  ChartLegend,
  ChartTooltipContent,
  chartActiveDot,
  chartAxisProps,
  chartColor,
  chartGridProps,
  chartTooltipProps,
  formatChartValue,
  type ChartFormat,
  type ChartSeries,
} from "@/registry/facet/ui/chart-tooltip"

export type AreaChartProps = {
  /** Rows of data, one per x-axis category. */
  data: Record<string, unknown>[]
  /** Key of the x-axis category in each row. */
  labels: string
  series: ChartSeries[]
  format?: ChartFormat
  /** Stack series on top of each other. */
  stacked?: boolean
  /** Smooth curves (default) or straight segments. */
  curve?: boolean
  /** Bridge gaps (null) instead of breaking the line. */
  connectNulls?: boolean
  min?: number
  max?: number
  height?: number
  /** Show the hover-to-highlight legend (default: when there are 2+ series). */
  legend?: boolean
  tooltip?: boolean
  yAxis?: boolean
  /** Accessible name for the chart. */
  label?: string
  className?: string
}

function AreaChart({
  data,
  labels,
  series,
  format = "number",
  stacked = false,
  curve = true,
  connectNulls = false,
  min,
  max,
  height = 240,
  legend,
  tooltip = true,
  yAxis = true,
  label,
  className,
}: AreaChartProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "")
  const [active, setActive] = React.useState<string | null>(null)
  const items = series.map((s, i) => ({ key: s.key, name: s.name ?? s.key, color: chartColor(i, s.color) }))
  const showLegend = legend ?? items.length > 1

  return (
    <ChartFrame label={label} className={className}>
      {showLegend && <ChartLegend className="mb-3" items={items} active={active} onActiveChange={setActive} />}
      <RAreaChart
        data={data}
        responsive
        style={{ width: "100%", height }}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        onMouseLeave={() => setActive(null)}
      >
        <defs>
          {items.map((it) => (
            <linearGradient key={it.key} id={`${uid}-${it.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={it.color} stopOpacity={stacked ? 0.45 : 0.3} />
              <stop offset="100%" stopColor={it.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey={labels} {...chartAxisProps} minTickGap={12} />
        {yAxis && (
          <YAxis
            {...chartAxisProps}
            width={52}
            domain={[min ?? "auto", max ?? "auto"]}
            tickFormatter={(v: number) => formatChartValue(v, format === "currency" ? "$compact" : format)}
          />
        )}
        {tooltip && <Tooltip {...chartTooltipProps("line")} content={<ChartTooltipContent format={format} />} />}
        {items.map((it) => (
          <Area
            key={it.key}
            type={curve ? "monotone" : "linear"}
            dataKey={it.key}
            name={it.name}
            stroke={it.color}
            strokeWidth={2}
            fill={`url(#${uid}-${it.key})`}
            stackId={stacked ? "stack" : undefined}
            connectNulls={connectNulls}
            dot={false}
            activeDot={chartActiveDot(it.color)}
            animationDuration={900}
            animationEasing="ease-out"
            className={cn("transition-opacity duration-200", active && active !== it.key && "opacity-25")}
          />
        ))}
      </RAreaChart>
    </ChartFrame>
  )
}

export { AreaChart }
