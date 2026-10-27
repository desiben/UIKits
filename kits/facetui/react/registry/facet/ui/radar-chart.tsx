"use client"

import * as React from "react"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart as RRadarChart, Tooltip } from "recharts"

import { cn } from "@/registry/facet/lib/utils"
import {
  ChartFrame,
  ChartLegend,
  ChartTooltipContent,
  chartColor,
  chartTooltipProps,
  type ChartFormat,
} from "@/registry/facet/ui/chart-tooltip"

export type RadarSeries = { name: string; data: number[]; color?: string }

export type RadarChartProps = {
  /** Axis names, one per spoke. Keep them short. */
  labels: string[]
  series: RadarSeries[]
  /** Outer ring value (default: the largest value). */
  max?: number
  format?: ChartFormat
  height?: number
  legend?: boolean
  tooltip?: boolean
  label?: string
  className?: string
}

function RadarChart({
  labels,
  series,
  max,
  format = "number",
  height = 300,
  legend,
  tooltip = true,
  label,
  className,
}: RadarChartProps) {
  const [active, setActive] = React.useState<string | null>(null)
  const items = series.map((s, i) => ({ key: `s${i}`, name: s.name, color: chartColor(i, s.color) }))
  const rows = labels.map((axis, li) => {
    const row: Record<string, string | number> = { axis }
    series.forEach((s, si) => (row[`s${si}`] = s.data[li] ?? 0))
    return row
  })
  const top = max ?? Math.max(...series.flatMap((s) => s.data))
  const showLegend = legend ?? items.length > 1

  return (
    <ChartFrame label={label} className={className}>
      {showLegend && (
        <ChartLegend className="mb-1 justify-center" items={items} active={active} onActiveChange={setActive} />
      )}
      <RRadarChart data={rows} responsive style={{ width: "100%", height }} outerRadius="72%" margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
        <PolarRadiusAxis domain={[0, top]} tick={false} axisLine={false} />
        {tooltip && (
          <Tooltip {...chartTooltipProps("line")} cursor={false} content={<ChartTooltipContent format={format} />} />
        )}
        {items.map((it, i) => {
          const dim = active !== null && active !== it.key
          const focus = active === it.key
          return (
            <Radar
              key={it.key}
              dataKey={it.key}
              name={it.name}
              stroke={it.color}
              strokeWidth={focus ? 2.5 : 2}
              fill={it.color}
              fillOpacity={focus ? 0.32 : 0.16}
              dot={{ r: 3, fill: it.color, stroke: "var(--card)", strokeWidth: 1.5, fillOpacity: 1 }}
              activeDot={{ r: 5, stroke: "var(--card)", strokeWidth: 2 }}
              animationBegin={i * 120}
              animationDuration={800}
              animationEasing="ease-out"
              className={cn("transition-opacity duration-200 [&_path]:transition-[fill-opacity]", dim && "opacity-35")}
              onMouseEnter={() => setActive(it.key)}
              onMouseLeave={() => setActive(null)}
            />
          )
        })}
      </RRadarChart>
    </ChartFrame>
  )
}

export { RadarChart }
