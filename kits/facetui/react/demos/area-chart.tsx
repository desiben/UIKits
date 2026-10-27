import { AreaChart } from "@/registry/facet/ui/area-chart"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const mrr = [142000, 151000, 158000, 166000, 171000, 183000, 190000, 204000, 212000, 226000, 238000, 249000]
const fresh = [99400, 105700, 110600, 116200, 119700, 128100, 133000, 142800, 148400, 158200, 166600, 174300]
const expansion = [38000, 41000, 40000, 46000, 49000, 52000, 50000, 57000, 61000, 63000, 68000, 72000]
const rows = months.map((month, i) => ({ month, mrr: mrr[i], new: fresh[i], expansion: expansion[i] }))
const uptime = [99.2, 99.8, null, 98.9, 99.6, 99.9, 99.7].map((v, i) => ({ day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i], uptime: v }))

function Widget({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col rounded-facet-xl border border-border bg-subtle p-1">
      <header className="px-3 pt-3 pb-2.5">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{desc}</p>
      </header>
      <div className="rounded-facet-lg border border-border-subtle bg-card p-4 shadow-xs">{children}</div>
    </section>
  )
}

export default function AreaChartDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Widget title="Monthly recurring revenue" desc="Last 12 months">
        <AreaChart label="Monthly recurring revenue" data={rows} labels="month" format="$compact" series={[{ key: "mrr", name: "MRR" }]} />
      </Widget>
      <Widget title="Revenue by source" desc="New vs. expansion — hover the legend">
        <AreaChart
          label="Revenue by source"
          data={rows}
          labels="month"
          format="$compact"
          stacked
          series={[{ key: "new", name: "New" }, { key: "expansion", name: "Expansion" }]}
        />
      </Widget>
      <Widget title="Uptime checks" desc="Missing points are left as gaps">
        <AreaChart
          label="Uptime"
          data={uptime}
          labels="day"
          format="percent"
          curve={false}
          min={98}
          max={100}
          height={180}
          series={[{ key: "uptime", name: "Uptime", color: "var(--chart-2)" }]}
        />
      </Widget>
    </div>
  )
}
