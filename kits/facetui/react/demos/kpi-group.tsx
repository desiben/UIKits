import * as React from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { Kpi, KpiLabel, KpiRow, KpiTrend, KpiValue } from "@/registry/facet/ui/kpi"
import { KpiGroup } from "@/registry/facet/ui/kpi-group"

type Metric = { id: string; label: string; value: number; delta: number; prefix?: string; suffix?: string; unit?: string; }
const base: Metric[] = [
  { id: "mrr", label: "MRR", value: 248.9, delta: 12.4, prefix: "$", suffix: "k" },
  { id: "cust", label: "Customers", value: 1284, delta: 3.1 },
  { id: "nrr", label: "Net retention", value: 118, delta: 2, suffix: "%", unit: " pt" },
  { id: "churn", label: "Churn", value: 2.4, delta: -0.3, suffix: "%", unit: " pt" },
]

export default function KpiGroupDemo() {
  const [metrics, setMetrics] = React.useState(base)
  const refresh = () =>
    setMetrics((ms) =>
      ms.map((m) => {
        const delta = Math.round((Math.random() * 16 - 5) * 10) / 10
        const value = Math.round(m.value * (1 + delta / 100) * 10) / 10
        return { ...m, delta, value }
      })
    )
  return (
    <div className="flex flex-col gap-4">
      <KpiGroup>
        {metrics.map((m) => (
          <Kpi key={m.id}>
            <KpiLabel>{m.label}</KpiLabel>
            <KpiRow className="mt-1">
              <KpiValue value={m.value} prefix={m.prefix} suffix={m.suffix} format={m.value >= 1000 ? { maximumFractionDigits: 0 } : { minimumFractionDigits: m.value < 10 || m.suffix === "k" ? 1 : 0, maximumFractionDigits: m.value < 10 || m.suffix === "k" ? 1 : 0 }} />
              <KpiTrend value={m.delta} unit={m.unit ?? "%"} />
            </KpiRow>
          </Kpi>
        ))}
      </KpiGroup>
      <div>
        <Button size="sm" variant="outline" onClick={refresh}><RefreshCw /> Refresh</Button>
      </div>
    </div>
  )
}
