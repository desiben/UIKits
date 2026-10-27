import { LineChart } from "@/registry/facet/ui/line-chart"

const days = ["Oct 2", "Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7", "Oct 8", "Oct 9", "Oct 10", "Oct 11", "Oct 12", "Oct 13", "Oct 14", "Oct 15"]
const web = [3200, 3350, 3290, 3510, 3620, 3580, 3790, 3910, 3870, 4020, 4190, 4150, 4320, 4480]
const mobile = [2100, 2180, 2260, 2240, 2390, 2470, 2450, 2600, 2710, 2690, 2840, 2950, 3010, 3120]
const users = days.map((day, i) => ({ day, web: web[i], mobile: mobile[i] }))
const nrr = ["Q1 25", "Q2 25", "Q3 25", "Q4 25", "Q1 26", "Q2 26", "Q3 26"].map((q, i) => ({
  q,
  nrr: [104, 107, 106, 111, 114, 116, 118][i],
  target: [110, 110, 110, 110, 115, 115, 115][i],
}))

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

export default function LineChartDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Widget title="Active users" desc="Daily, last 14 days">
        <LineChart
          label="Active users"
          data={users}
          labels="day"
          format="compact"
          series={[{ key: "web", name: "Web" }, { key: "mobile", name: "Mobile" }]}
        />
      </Widget>
      <Widget title="Net revenue retention" desc="Quarterly, against target">
        <LineChart
          label="Net revenue retention"
          data={nrr}
          labels="q"
          format="percent"
          min={100}
          series={[
            { key: "nrr", name: "NRR", dots: true },
            { key: "target", name: "Target", dashed: true, color: "var(--muted-foreground)" },
          ]}
        />
      </Widget>
    </div>
  )
}
