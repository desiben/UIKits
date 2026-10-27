import * as React from "react"
import { LayoutGrid, List, Map, Monitor, Moon, Sun } from "lucide-react"
import { Segment, SegmentItem } from "@/registry/facet/ui/segment"

export default function SegmentDemo() {
  const [range, setRange] = React.useState("week")
  const [billing, setBilling] = React.useState("monthly")
  return (
    <div className="flex flex-col items-center gap-4">
      <Segment value={range} onValueChange={setRange} aria-label="Range">
        <SegmentItem value="day">Day</SegmentItem>
        <SegmentItem value="week">Week</SegmentItem>
        <SegmentItem value="month">Month</SegmentItem>
        <SegmentItem value="year">Year</SegmentItem>
      </Segment>
      <Segment defaultValue="list" iconOnly aria-label="View">
        <SegmentItem value="list" aria-label="List"><List /></SegmentItem>
        <SegmentItem value="grid" aria-label="Grid"><LayoutGrid /></SegmentItem>
        <SegmentItem value="map" aria-label="Map"><Map /></SegmentItem>
      </Segment>
      <Segment value={billing} onValueChange={setBilling} tone="primary" size="sm" aria-label="Billing">
        <SegmentItem value="monthly">Monthly</SegmentItem>
        <SegmentItem value="yearly">Yearly · save 20%</SegmentItem>
      </Segment>
      <Segment defaultValue="dark" block size="lg" aria-label="Theme" className="max-w-[360px]">
        <SegmentItem value="light"><Sun className="size-3.5" /> Light</SegmentItem>
        <SegmentItem value="dark"><Moon className="size-3.5" /> Dark</SegmentItem>
        <SegmentItem value="auto"><Monitor className="size-3.5" /> Auto</SegmentItem>
      </Segment>
    </div>
  )
}
