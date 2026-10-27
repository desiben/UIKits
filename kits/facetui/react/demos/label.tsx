import * as React from "react"
import { Label, LabelRow } from "@/registry/facet/ui/label"
import { Button } from "@/registry/facet/ui/button"

const input =
  "h-9 w-full rounded-facet border border-input bg-card px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-placeholder hover:border-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-placeholder"

export default function LabelDemo() {
  const [strict, setStrict] = React.useState(false)
  const [locked, setLocked] = React.useState(true)
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lb-email" required>Email</Label>
          <input id="lb-email" type="email" required placeholder="you@company.com" className={input} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lb-company" required={strict} optional>Company</Label>
          <input id="lb-company" required={strict} placeholder="Northwind" className={input} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lb-ws" disabled={locked}>Workspace ID</Label>
          <input id="lb-ws" defaultValue="ws_8f2a91" disabled={locked} className={input} />
        </div>
        <LabelRow>
          <input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
          Accept terms and conditions
        </LabelRow>
      </div>
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-muted-foreground">Markers animate as the form's rules change.</p>
        <Button size="sm" variant="outline" onClick={() => setStrict((s) => !s)}>
          {strict ? "Make company optional" : "Make company required"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setLocked((s) => !s)}>
          {locked ? "Unlock workspace ID" : "Lock workspace ID"}
        </Button>
      </div>
    </div>
  )
}
