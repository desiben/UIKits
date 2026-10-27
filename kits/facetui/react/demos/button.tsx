import * as React from "react"
import { ArrowRight, Plus, Trash2 } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"

export default function ButtonDemo() {
  const [saving, setSaving] = React.useState(false)
  const save = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1800)
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive"><Trash2 /> Delete</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">Small</Button>
        <Button>Medium</Button>
        <Button size="lg" ripple>Large with ripple <ArrowRight /></Button>
        <Button size="icon" variant="outline" aria-label="Add"><Plus /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button loading={saving} loadingText="Saving…" onClick={save}>Save changes</Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  )
}
