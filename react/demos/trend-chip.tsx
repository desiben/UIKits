import * as React from "react"
import { Shuffle } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { TrendChip } from "@/registry/facet/ui/trend-chip"

export default function TrendChipDemo() {
  const [value, setValue] = React.useState(12.4)
  const shuffle = () => setValue(Math.round((Math.random() * 30 - 12) * 10) / 10)
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <TrendChip trend="up">12.4%</TrendChip>
        <TrendChip trend="down">3.1%</TrendChip>
        <TrendChip trend="neutral">0.0%</TrendChip>
        <TrendChip plain trend="up">+$4,280</TrendChip>
        <TrendChip plain trend="down">−$310</TrendChip>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Live value</span>
        <TrendChip value={value} />
        <TrendChip value={value} plain unit=" pt" />
        <Button size="sm" variant="outline" onClick={shuffle}>
          <Shuffle /> Shuffle
        </Button>
      </div>
    </div>
  )
}
