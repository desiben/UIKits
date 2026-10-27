import * as React from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer, ChartLegendContent, ChartProvider, ChartTooltip, ChartTooltipContent, useChart, type ChartConfig,
} from "@/registry/facet/ui/charts"

const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"]
const revenue = weeks.map((w, i) => ({
  week: w,
  new: [46, 58, 52, 70, 64, 82, 76, 94][i] * 1000,
  expansion: [18, 22, 30, 26, 34, 31, 40, 44][i] * 1000,
}))
const traffic = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
  day: d,
  visits: [3200, 4100, 3900, 4600, 5200, 2800, 2400][i],
  returning: [1400, 1900, 2100, 2300, 2600, 1300, 1100][i],
}))

const revenueConfig = {
  new: { label: "New" },
  expansion: { label: "Expansion" },
} satisfies ChartConfig
const trafficConfig = {
  visits: { label: "Visits" },
  returning: { label: "Returning", color: "var(--chart-3)" },
} satisfies ChartConfig

const money = (v: number) => `$${(v / 1000).toFixed(0)}k`

function RevenueBars() {
  const { isHidden } = useChart()
  return (
    <BarChart data={revenue} margin={{ top: 4, right: 0, left: 0, bottom: 0 }} barGap={4}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
      <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={money} />
      <ChartTooltip cursor={{ radius: 6 }} content={<ChartTooltipContent valueFormatter={(v) => `$${v.toLocaleString("en-US")}`} />} />
      <Bar dataKey="new" fill="var(--color-new)" radius={[4, 2, 0, 0]} hide={isHidden("new")} animationDuration={700} animationEasing="ease-out" />
      <Bar dataKey="expansion" fill="var(--color-expansion)" radius={[4, 2, 0, 0]} hide={isHidden("expansion")} animationDuration={700} animationBegin={120} animationEasing="ease-out" />
    </BarChart>
  )
}

function TrafficArea() {
  const { isHidden } = useChart()
  return (
    <AreaChart data={traffic} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="fill-visits" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-visits)" stopOpacity={0.28} />
          <stop offset="100%" stopColor="var(--color-visits)" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="fill-returning" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-returning)" stopOpacity={0.28} />
          <stop offset="100%" stopColor="var(--color-returning)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
      <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v: number) => (v ? `${v / 1000}k` : "0")} />
      <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent indicator="line" />} />
      <Area dataKey="visits" type="monotone" stroke="var(--color-visits)" strokeWidth={2} fill="url(#fill-visits)" hide={isHidden("visits")} animationDuration={900} activeDot={{ r: 4 }} />
      <Area dataKey="returning" type="monotone" stroke="var(--color-returning)" strokeWidth={2} fill="url(#fill-returning)" hide={isHidden("returning")} animationDuration={900} animationBegin={150} activeDot={{ r: 4 }} />
    </AreaChart>
  )
}

function ChartCard({ title, desc, config, children }: { title: string; desc: string; config: ChartConfig; children: React.ReactNode }) {
  return (
    <ChartProvider config={config}>
      <section className="flex min-w-0 flex-col gap-4 rounded-facet-lg border border-border bg-card p-5 shadow-xs">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] leading-[22px] font-semibold">{title}</h3>
            <p className="text-[13px] text-muted-foreground">{desc}</p>
          </div>
          <ChartLegendContent interactive />
        </header>
        <ChartContainer className="aspect-auto h-[220px]">{children}</ChartContainer>
      </section>
    </ChartProvider>
  )
}

export default function ChartsDemo() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <ChartCard title="Revenue" desc="Last 8 weeks · click the legend to toggle" config={revenueConfig}>
        <RevenueBars />
      </ChartCard>
      <ChartCard title="Traffic" desc="This week" config={trafficConfig}>
        <TrafficArea />
      </ChartCard>
    </div>
  )
}
