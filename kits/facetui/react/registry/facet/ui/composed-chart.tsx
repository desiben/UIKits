"use client"

import * as React from "react"
import { Area, Bar, CartesianGrid, Cell, ComposedChart as RComposedChart, Line, Tooltip, XAxis, YAxis } from "recharts"

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

export type ComposedSeries = ChartSeries & {
  /** Mark type for this series. */
  type?: "bar" | "line" | "area"
  /** Plot against a second y-axis on the right (for different units). */
  axis?: "left" | "right"
  dashed?: boolean
  dots?: boolean
}

export type ComposedChartProps = {
  data: Record<string, unknown>[]
  labels: string
  series: ComposedSeries[]
  format?: ChartFormat
  /** Format for the right axis (defaults to `format`). */
  formatRight?: ChartFormat
  height?: number
  legend?: boolean
  tooltip?: boolean
  yAxis?: boolean
  label?: string
  className?: string
}

function ComposedChart({
  data,
  labels,
  series,
  format = "number",
  formatRight,
  height = 260,
  legend = true,
  tooltip = true,
  yAxis = true,
  label,
  className,
}: ComposedChartProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "")
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)
  const [active, setActive] = React.useState<string | null>(null)
  const items = series.map((s, i) => ({
    ...s,
    type: s.type ?? "bar",
    name: s.name ?? s.key,
    color: chartColor(i, s.color),
  }))
  const hasRight = items.some((s) => s.axis === "right")
  const rightFormats = Object.fromEntries(
    items.filter((s) => s.axis === "right").map((s) => [s.key, formatRight ?? format] as const)
  )
  const dim = (key: string) => active !== null && active !== key

  return (
    <ChartFrame label={label} className={className}>
      {legend && <ChartLegend className="mb-3" items={items} active={active} onActiveChange={setActive} />}
      <RComposedChart
        data={data}
        responsive
        style={{ width: "100%", height }}
        margin={{ top: 8, right: hasRight ? 0 : 8, bottom: 0, left: 0 }}
        barCategoryGap="22%"
        onMouseMove={(state) => {
          const i = state?.activeTooltipIndex
          setHoverIndex(i === undefined || i === null ? null : Number(i))
        }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          {items
            .filter((s) => s.type === "area")
            .map((s) => (
              <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
        </defs>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey={labels} {...chartAxisProps} />
        <YAxis
          yAxisId="left"
          hide={!yAxis}
          {...chartAxisProps}
          width={52}
          tickFormatter={(v: number) => formatChartValue(v, format === "currency" ? "$compact" : format)}
        />
        {hasRight && (
          <YAxis
            yAxisId="right"
            orientation="right"
            hide={!yAxis}
            {...chartAxisProps}
            width={52}
            tickFormatter={(v: number) => formatChartValue(v, formatRight ?? format)}
          />
        )}
        {tooltip && (
          <Tooltip
            {...chartTooltipProps("bar")}
            cursor={false}
            content={<ChartTooltipContent format={format} formats={rightFormats} />}
          />
        )}
        {items.map((s, si) => {
          const axis = s.axis ?? "left"
          const cls = cn("transition-opacity duration-200", dim(s.key) && "opacity-20")
          if (s.type === "line")
            return (
              <Line
                key={s.key}
                yAxisId={axis}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                strokeDasharray={s.dashed ? "5 4" : undefined}
                dot={s.dots ? { r: 3.5, fill: s.color, stroke: "var(--card)", strokeWidth: 2 } : false}
                activeDot={chartActiveDot(s.color)}
                animationBegin={300}
                animationDuration={900}
                className={cls}
              />
            )
          if (s.type === "area")
            return (
              <Area
                key={s.key}
                yAxisId={axis}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#${uid}-${s.key})`}
                activeDot={chartActiveDot(s.color)}
                animationDuration={900}
                className={cls}
              />
            )
          return (
            <Bar
              key={s.key}
              yAxisId={axis}
              dataKey={s.key}
              name={s.name}
              fill={s.color}
              radius={[5, 2, 0, 0]}
              animationDuration={700}
              animationBegin={si * 90}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fillOpacity={dim(s.key) ? 0.2 : hoverIndex !== null && hoverIndex !== i ? 0.45 : 1}
                  style={{ transition: "fill-opacity 160ms ease-out" }}
                />
              ))}
            </Bar>
          )
        })}
      </RComposedChart>
    </ChartFrame>
  )
}

export { ComposedChart }
