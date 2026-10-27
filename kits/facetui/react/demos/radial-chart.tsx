import { RadialChart } from "@/registry/facet/ui/radial-chart"

function Widget({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col rounded-facet-xl border border-border bg-subtle p-1">
      <header className="px-3 pt-3 pb-2.5">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{desc}</p>
      </header>
      <div className="flex-1 rounded-facet-lg border border-border-subtle bg-card p-4 shadow-xs">{children}</div>
    </section>
  )
}

export default function RadialChartDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-[3fr_2fr]">
      <Widget title="Quarterly goals" desc="Progress toward target — hover a ring">
        <RadialChart
          label="Quarterly goals"
          format="percent"
          data={[
            { name: "Revenue", value: 82 },
            { name: "Pipeline", value: 64 },
            { name: "Retention", value: 91 },
          ]}
        />
      </Widget>
      <Widget title="Storage" desc="Half gauge">
        <div className="flex h-full flex-col items-center justify-center">
          <RadialChart label="Storage used" half size={240} format="percent" centerSub="Storage used" data={[{ name: "Storage", value: 68 }]} />
          <div className="mt-3 flex w-full items-center justify-between text-[13px]">
            <span className="text-muted-foreground">68 GB of 100 GB</span>
            <a href="#upgrade" className="font-medium text-brand hover:underline">Upgrade</a>
          </div>
        </div>
      </Widget>
    </div>
  )
}
