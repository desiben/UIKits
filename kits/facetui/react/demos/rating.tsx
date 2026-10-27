import * as React from "react"
import { Rating } from "@/registry/facet/ui/rating"

const words = ["Tap a star", "Poor", "Fair", "Good", "Great", "Excellent"]

export default function RatingDemo() {
  const [value, setValue] = React.useState(4)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Rating size="lg" label="Rate your experience" value={value} onValueChange={setValue} />
        <span className="text-sm font-medium text-foreground-secondary">{words[value]}</span>
      </div>
      <div className="flex flex-wrap items-center gap-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Read-only · 4.5</span>
          <Rating readOnly value={4.5} showValue />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Small · 3.2</span>
          <Rating readOnly size="sm" value={3.2} showValue />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Medium, interactive</span>
          <Rating defaultValue={2} label="Rate the docs" />
        </div>
      </div>
    </div>
  )
}
