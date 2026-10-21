import { RadarChart } from "@/registry/facet/ui/radar-chart"

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

export default function RadarChartDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Widget title="Plan comparison" desc="Scores out of 100 — hover a shape or the legend">
        <RadarChart
          label="Plan comparison"
          max={100}
          labels={["Speed", "Security", "Support", "Integrations", "Analytics", "Price"]}
          series={[
            { name: "Growth", data: [72, 80, 64, 70, 58, 86] },
            { name: "Scale", data: [90, 96, 92, 88, 90, 60] },
          ]}
        />
      </Widget>
      <Widget title="Design skills" desc="Self-assessment, single series">
        <RadarChart
          label="Design skills"
          max={10}
          labels={["Research", "Systems", "Visual", "Motion", "Prototyping"]}
          series={[{ name: "Maya", data: [7, 9, 8, 6, 9], color: "var(--chart-4)" }]}
        />
      </Widget>
    </div>
  )
}
