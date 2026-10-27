"use client"

import * as React from "react"
import { Bar, BarChart as RBarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from "recharts"

import {
  ChartFrame,
  ChartLegend,
  ChartTooltipContent,
  chartAxisProps,
  chartColor,
  chartGridProps,
  chartTooltipProps,
  formatChartValue,
  type ChartFormat,
  type ChartSeries,
} from "@/registry/facet/ui/chart-tooltip"

export type BarChartProps = {
  data: Record<string, unknown>[]
  /** Key of the x-axis category in each row. */
  labels: string
  series: ChartSeries[]
  format?: ChartFormat
  /** Stack series per category. */
  stacked?: boolean
  /** Share of each category band used by bars, 0–1 (default 0.62). */
  barWidth?: number
  height?: number
  legend?: boolean
  tooltip?: boolean
  yAxis?: boolean
  label?: string
  className?: string
}

/** Facet's signature corner on the top of each bar: rounded, with a tighter top-right. */
const TOP_RADIUS: [number, number, number, number] = [5, 2, 0, 0]

function BarChart({
  data,
  labels,
  series,
  format = "number",
  stacked = false,
  barWidth = 0.62,
  height = 240,
  legend,
  tooltip = true,
  yAxis = true,
  label,
  className,
}: BarChartProps) {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)
  const [active, setActive] = React.useState<string | null>(null)
  const items = series.map((s, i) => ({ key: s.key, name: s.name ?? s.key, color: chartColor(i, s.color) }))
  const showLegend = legend ?? items.length > 1
  const gap = `${Math.round(((1 - Math.min(1, Math.max(0.1, barWidth))) / 2) * 100)}%`

  return (
    <ChartFrame label={label} className={className}>
      {showLegend && <ChartLegend className="mb-3" items={items} active={active} onActiveChange={setActive} />}
      <RBarChart
        data={data}
        responsive
        style={{ width: "100%", height }}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        barCategoryGap={gap}
        barGap={3}
        onMouseMove={(state) => {
          const i = state?.activeTooltipIndex
          setHoverIndex(i === undefined || i === null ? null : Number(i))
        }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey={labels} {...chartAxisProps} />
        {yAxis && (
          <YAxis
            {...chartAxisProps}
            width={52}
            tickFormatter={(v: number) => formatChartValue(v, format === "currency" ? "$compact" : format)}
          />
        )}
        {tooltip && <Tooltip {...chartTooltipProps("bar")} content={<ChartTooltipContent format={format} />} />}
        {items.map((it, si) => (
          <Bar
            key={it.key}
            dataKey={it.key}
            name={it.name}
            fill={it.color}
            stackId={stacked ? "stack" : undefined}
            radius={!stacked || si === items.length - 1 ? TOP_RADIUS : 0}
            animationDuration={700}
            animationBegin={si * 90}
            animationEasing="ease-out"
          >
            {data.map((_, i) => {
              const dimByIndex = hoverIndex !== null && hoverIndex !== i
              const dimBySeries = active !== null && active !== it.key
              return (
                <Cell
                  key={i}
                  fillOpacity={dimBySeries ? 0.2 : dimByIndex ? 0.45 : 1}
                  style={{ transition: "fill-opacity 160ms ease-out" }}
                />
              )
            })}
          </Bar>
        ))}
      </RBarChart>
    </ChartFrame>
  )
}

export { BarChart }
