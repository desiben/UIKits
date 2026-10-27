import * as React from "react"
import { InlineSelect } from "@/registry/facet/ui/inline-select"

const metrics = [
  { value: "revenue", label: "revenue" },
  { value: "signups", label: "signups" },
  { value: "churn", label: "churn" },
]
const ranges = [
  { value: "30d", label: "the last 30 days" },
  { value: "q", label: "this quarter" },
  { value: "y", label: "this year" },
]
const groups = [
  { value: "plan", label: "plan" },
  { value: "region", label: "region" },
  { value: "channel", label: "acquisition channel" },
]

export default function InlineSelectDemo() {
  const [metric, setMetric] = React.useState("revenue")
  const [range, setRange] = React.useState("30d")
  const [group, setGroup] = React.useState("plan")
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <p className="text-center text-lg leading-relaxed text-foreground">
        Show <InlineSelect aria-label="Metric" options={metrics} value={metric} onValueChange={setMetric} /> for{" "}
        <InlineSelect aria-label="Range" options={ranges} value={range} onValueChange={setRange} /> grouped by{" "}
        <InlineSelect aria-label="Group" options={groups} value={group} onValueChange={setGroup} />.
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Email me a digest{" "}
        <InlineSelect
          aria-label="Frequency"
          options={[
            { value: "daily", label: "every morning" },
            { value: "weekly", label: "every Monday" },
            { value: "monthly", label: "once a month" },
          ]}
        />{" "}
        unless nothing changed.
      </p>
    </div>
  )
}
