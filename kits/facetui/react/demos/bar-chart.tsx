import { BarChart } from "@/registry/facet/ui/bar-chart"

const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"].map((w, i) => ({ w, signups: [420, 510, 470, 640, 590, 720, 680, 810][i] }))
const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => ({
  m,
  revenue: [171000, 183000, 190000, 204000, 212000, 226000, 238000, 249000][i],
  expenses: [120000, 131000, 128000, 140000, 151000, 149000, 160000, 158000][i],
}))
const tickets = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
  d,
  email: [42, 51, 46, 58, 49, 22, 18][i],
  chat: [31, 36, 40, 44, 39, 17, 14][i],
  phone: [12, 15, 11, 16, 13, 4, 3][i],
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

export default function BarChartDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Widget title="Weekly signups" desc="Hover a bar — the others dim">
        <BarChart label="Weekly signups" data={weeks} labels="w" series={[{ key: "signups", name: "Signups" }]} />
      </Widget>
      <Widget title="Revenue vs. expenses" desc="2026, in USD">
        <BarChart
          label="Revenue vs. expenses"
          data={months}
          labels="m"
          format="$compact"
          series={[{ key: "revenue", name: "Revenue" }, { key: "expenses", name: "Expenses", color: "var(--muted-foreground)" }]}
        />
      </Widget>
      <Widget title="Tickets by channel" desc="This week, stacked">
        <BarChart
          label="Tickets by channel"
          data={tickets}
          labels="d"
          stacked
          barWidth={0.5}
          series={[{ key: "email", name: "Email" }, { key: "chat", name: "Chat" }, { key: "phone", name: "Phone" }]}
        />
      </Widget>
    </div>
  )
}
