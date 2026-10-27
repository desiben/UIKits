import * as React from "react"
import { Shuffle } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { NumberValue } from "@/registry/facet/ui/number-value"

export default function NumberValueDemo() {
  const [revenue, setRevenue] = React.useState(248920)
  const [users, setUsers] = React.useState(1284000)
  const [delta, setDelta] = React.useState(18.4)

  const shuffle = () => {
    setRevenue(Math.round(150000 + Math.random() * 900000))
    setUsers(Math.round(400000 + Math.random() * 4000000))
    setDelta(Math.round((Math.random() * 60 - 20) * 10) / 10)
  }

  const rows = [
    { label: "Currency", node: <NumberValue value={revenue} format="currency" /> },
    { label: "Compact", node: <NumberValue value={users} format="compact" /> },
    { label: "Percent, signed", node: <NumberValue value={delta} format="percent" sign className={delta < 0 ? "text-danger" : "text-success"} /> },
    { label: "EUR · de-DE", node: <NumberValue value={revenue} format="currency" currency="EUR" locale="de-DE" /> },
    { label: "With unit", node: <NumberValue value={Math.round(revenue / 1000)} unit="ms" /> },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-1 rounded-facet-lg border border-border bg-card p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{r.label}</span>
            <span className="text-2xl font-semibold tracking-tight">{r.node}</span>
          </div>
        ))}
      </div>
      <div>
        <Button variant="outline" size="sm" onClick={shuffle}>
          <Shuffle /> Change values
        </Button>
      </div>
    </div>
  )
}
