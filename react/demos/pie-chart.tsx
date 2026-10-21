import { PieChart } from "@/registry/facet/ui/pie-chart"

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

export default function PieChartDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Widget title="Revenue by plan" desc="October 2026 — hover a slice or a row">
        <PieChart
          label="Revenue by plan"
          format="$compact"
          centerSub="MRR"
          data={[
            { name: "Scale", value: 114500 },
            { name: "Growth", value: 69700 },
            { name: "Starter", value: 39800 },
            { name: "Add-ons", value: 24900 },
          ]}
        />
      </Widget>
      <Widget title="Traffic sources" desc="Last 30 days">
        <PieChart
          label="Traffic sources"
          donut={false}
          size={180}
          format={(v) => `${v}k`}
          data={[
            { name: "Organic", value: 46 },
            { name: "Direct", value: 24 },
            { name: "Referral", value: 18 },
            { name: "Paid", value: 12 },
          ]}
        />
      </Widget>
    </div>
  )
}
