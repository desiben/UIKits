import * as React from "react"
import { Sparkles } from "lucide-react"
import { Badge } from "@/registry/facet/ui/badge"
import { Button } from "@/registry/facet/ui/button"

const steps = [
  { variant: "warning", label: "Pending" },
  { variant: "info", label: "Syncing" },
  { variant: "success", label: "Active" },
  { variant: "danger", label: "Overdue" },
] as const

export default function BadgeDemo() {
  const [i, setI] = React.useState(0)
  const s = steps[i]
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="brand">Brand</Badge>
        <Badge>Neutral</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="success" dot>Active</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="danger">Overdue</Badge>
        <Badge variant="info">Beta</Badge>
        <Badge variant="accent"><Sparkles /> New</Badge>
        <Badge variant="solid">Solid</Badge>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={s.variant} dot pulse={s.variant === "info"}>{s.label}</Badge>
        <Button size="sm" variant="outline" onClick={() => setI((i + 1) % steps.length)}>
          Next status
        </Button>
        <span className="text-[13px] text-muted-foreground">Label rolls, width springs, tone cross-fades.</span>
      </div>
    </div>
  )
}
