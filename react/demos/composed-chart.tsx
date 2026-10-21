import { ComposedChart } from "@/registry/facet/ui/composed-chart"

const rows = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"].map((w, i) => ({
  w,
  orders: [320, 410, 380, 520, 470, 610, 580, 690][i],
  aov: [41, 42, 40.5, 44, 45.2, 47, 46.8, 49.2][i],
  visits: [8200, 9100, 8800, 10400, 9900, 11800, 11200, 12600][i],
  conversion: [3.9, 4.5, 4.3, 5.0, 4.7, 5.2, 5.2, 5.5][i],
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

export default function ComposedChartDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Widget title="Orders and average order" desc="Orders (left axis) · average order value in $ (right axis)">
        <ComposedChart
          label="Orders and average order value"
          data={rows}
          labels="w"
          series={[
            { key: "orders", name: "Orders", type: "bar" },
            { key: "aov", name: "Avg. order", type: "line", axis: "right", color: "var(--chart-4)", dots: true },
          ]}
          formatRight={(v) => `$${v}`}
        />
      </Widget>
      <Widget title="Traffic and conversion" desc="Visits as an area · conversion rate in % as a line">
        <ComposedChart
          label="Traffic and conversion"
          data={rows}
          labels="w"
          format="compact"
          formatRight="percent"
          series={[
            { key: "visits", name: "Visits", type: "area", color: "var(--chart-1)" },
            { key: "conversion", name: "Conversion", type: "line", axis: "right", color: "var(--chart-3)", dashed: true },
          ]}
        />
      </Widget>
    </div>
  )
}
