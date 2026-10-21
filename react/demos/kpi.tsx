import * as React from "react"
import { Gauge, MoreHorizontal, RefreshCw, Users } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import {
  Kpi, KpiActions, KpiFooter, KpiHeader, KpiIcon, KpiLabel, KpiProgress, KpiRow, KpiSpark, KpiTrend, KpiValue,
} from "@/registry/facet/ui/kpi"

const rnd = (min: number, max: number) => Math.round(min + Math.random() * (max - min))

export default function KpiDemo() {
  const [m, setM] = React.useState({ mrr: 248920, mrrDelta: 12.4, customers: 1284, custDelta: 3.1, quota: 72, quotaDelta: 0 })
  const refresh = () =>
    setM({
      mrr: rnd(210000, 290000),
      mrrDelta: rnd(-60, 180) / 10,
      customers: rnd(1150, 1400),
      custDelta: rnd(-40, 60) / 10,
      quota: rnd(40, 98),
      quotaDelta: rnd(-30, 30) / 10,
    })
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start gap-4">
        <Kpi className="w-[260px]">
          <KpiHeader>
            <KpiLabel>Monthly recurring revenue</KpiLabel>
            <KpiActions>
              <Button variant="ghost" size="icon-sm" aria-label="More"><MoreHorizontal /></Button>
            </KpiActions>
          </KpiHeader>
          <KpiRow>
            <KpiValue value={m.mrr} format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} />
            <KpiTrend value={m.mrrDelta} />
          </KpiRow>
          <KpiSpark data={[142, 151, 158, 166, 171, 183, 190, 204, 212, 226, 238, m.mrr / 1000]} />
        </Kpi>
        <Kpi className="w-[260px]">
          <KpiHeader>
            <KpiIcon status="success"><Users /></KpiIcon>
            <KpiLabel>Active customers</KpiLabel>
          </KpiHeader>
          <KpiRow className="mt-2">
            <KpiValue value={m.customers} />
            <KpiTrend value={m.custDelta} />
          </KpiRow>
          <KpiFooter>
            <span>vs. last month</span>
            <span className="tabular-nums">{m.custDelta >= 0 ? "+" : "−"}{Math.round(Math.abs(m.custDelta) * 12.6)}</span>
          </KpiFooter>
        </Kpi>
        <Kpi className="w-[260px]">
          <KpiHeader>
            <KpiIcon status="warning"><Gauge /></KpiIcon>
            <KpiLabel>Quota attainment</KpiLabel>
          </KpiHeader>
          <KpiRow className="mt-2">
            <KpiValue value={m.quota} suffix="%" />
            <KpiTrend value={m.quotaDelta} />
          </KpiRow>
          <KpiProgress value={m.quota} label="Quota attainment" />
        </Kpi>
      </div>
      <div>
        <Button size="sm" variant="outline" onClick={refresh}><RefreshCw /> Refresh data</Button>
      </div>
    </div>
  )
}
