"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart as RLineChart, Tooltip, XAxis, YAxis } from "recharts"

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

export type LineSeries = ChartSeries & {
  /** Dashed stroke for targets and forecasts. */
  dashed?: boolean
  /** Show a dot on every point. */
  dots?: boolean
}

export type LineChartProps = {
  data: Record<string, unknown>[]
  /** Key of the x-axis category in each row. */
  labels: string
  series: LineSeries[]
  format?: ChartFormat
  /** Smooth curves (default) or straight segments. */
  curve?: boolean
  connectNulls?: boolean
  min?: number
  max?: number
  height?: number
  legend?: boolean
  tooltip?: boolean
  yAxis?: boolean
  label?: string
  className?: string
}

function LineChart({
  data,
  labels,
  series,
  format = "number",
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
}: LineChartProps) {
  const [active, setActive] = React.useState<string | null>(null)
  const items = series.map((s, i) => ({ ...s, name: s.name ?? s.key, color: chartColor(i, s.color) }))
  const showLegend = legend ?? items.length > 1

  return (
    <ChartFrame label={label} className={className}>
      {showLegend && <ChartLegend className="mb-3" items={items} active={active} onActiveChange={setActive} />}
      <RLineChart
        data={data}
        responsive
        style={{ width: "100%", height }}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
      >
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
          <Line
            key={it.key}
            type={curve && !it.dashed ? "monotone" : "linear"}
            dataKey={it.key}
            name={it.name}
            stroke={it.color}
            strokeWidth={it.dashed ? 1.75 : 2}
            strokeDasharray={it.dashed ? "5 4" : undefined}
            strokeLinecap="round"
            connectNulls={connectNulls}
            dot={it.dots ? { r: 3.5, fill: it.color, stroke: "var(--card)", strokeWidth: 2 } : false}
            activeDot={it.dashed ? false : chartActiveDot(it.color)}
            animationDuration={1000}
            animationEasing="ease-out"
            className={cn("transition-opacity duration-200", active && active !== it.key && "opacity-20")}
          />
        ))}
      </RLineChart>
    </ChartFrame>
  )
}

export { LineChart }
