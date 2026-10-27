import * as React from "react"
import { ChartTooltip } from "@/registry/facet/ui/chart-tooltip"
import { AreaChart } from "@/registry/facet/ui/area-chart"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const rows = months.map((month, i) => ({
  month,
  revenue: [142000, 151000, 158000, 166000, 171000, 183000, 190000, 204000, 212000, 226000, 238000, 249000][i],
  expansion: [38000, 41000, 40000, 46000, 49000, 52000, 50000, 57000, 61000, 63000, 68000, 72000][i],
}))
const snapshots = [
  { label: "September 2026", items: [{ name: "Revenue", value: 212000 }, { name: "Expansion", value: 61000 }, { name: "Churned", value: -3800 }] },
  { label: "October 2026", items: [{ name: "Revenue", value: 238400 }, { name: "Expansion", value: 68100 }, { name: "Churned", value: -4900 }] },
]
const colors = ["var(--chart-1)", "var(--chart-2)", "var(--muted-foreground)"]

export default function ChartTooltipDemo() {
  const [i, setI] = React.useState(1)
  const snap = snapshots[i]
  return (
    <div className="grid items-start gap-6 md:grid-cols-[240px_1fr]">
      <div className="flex flex-col gap-3">
        <p className="text-[13px] text-muted-foreground">Static markup — values spring when the data changes.</p>
        <ChartTooltip
          label={snap.label}
          format="currency"
          tickValues
          items={snap.items.map((it, k) => ({ ...it, color: colors[k] }))}
        />
        <div className="flex gap-1.5">
          {snapshots.map((s, k) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setI(k)}
              aria-pressed={i === k}
              className="h-8 rounded-facet border border-border-strong bg-card px-2.5 text-[13px] font-medium text-foreground transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-primary-subtle aria-pressed:text-brand"
            >
              {s.label.split(" ")[0].slice(0, 3)}
            </button>
          ))}
        </div>
      </div>
      <section className="flex min-w-0 flex-col rounded-facet-xl border border-border bg-subtle p-1">
        <header className="px-3 pt-3 pb-2.5">
          <h3 className="text-sm font-medium text-foreground">Hover the chart</h3>
          <p className="mt-0.5 text-[13px] text-muted-foreground">Crosshair, dots and tooltip follow the pointer</p>
        </header>
        <div className="rounded-facet-lg border border-border-subtle bg-card p-4 shadow-xs">
          <AreaChart
            label="Revenue and expansion"
            data={rows}
            labels="month"
            format="$compact"
            legend={false}
            series={[{ key: "revenue", name: "Revenue" }, { key: "expansion", name: "Expansion" }]}
          />
        </div>
      </section>
    </div>
  )
}
