import * as React from "react"
import { Eye, Mail, ShieldCheck } from "lucide-react"
import { CellGroup, CellGroupLabel, CellSwitch } from "@/registry/facet/ui/cell-switch"

export default function CellSwitchDemo() {
  const [receipts, setReceipts] = React.useState(false)
  return (
    <CellGroup className="mx-auto max-w-[440px]">
      <CellGroupLabel>Privacy</CellGroupLabel>
      <CellSwitch icon={<Eye />} tone="var(--brand-600)" label="Show activity status" description="Let teammates see when you're online" defaultChecked />
      <CellSwitch icon={<Mail />} tone="var(--chart-4)" label="Read receipts" checked={receipts} onCheckedChange={setReceipts} />
      <CellSwitch icon={<ShieldCheck />} tone="var(--success-solid)" label="Private mode" description="Hide your profile from search" />
    </CellGroup>
  )
}
