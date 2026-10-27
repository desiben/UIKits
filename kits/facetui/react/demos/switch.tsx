import * as React from "react"
import { Switch } from "@/registry/facet/ui/switch"

export default function SwitchDemo() {
  const [sync, setSync] = React.useState(true)
  return (
    <div className="flex flex-col gap-4">
      <label className="inline-flex w-fit cursor-pointer items-center gap-2.5 text-sm font-medium">
        <Switch checked={sync} onCheckedChange={setSync} /> Auto-sync
        <span className="text-[13px] font-normal text-muted-foreground">{sync ? "On" : "Off"}</span>
      </label>
      <label className="inline-flex w-fit cursor-pointer items-center gap-2.5 text-sm font-medium"><Switch /> Notifications</label>
      <label className="inline-flex w-fit cursor-pointer items-center gap-2.5 text-sm font-medium"><Switch size="sm" defaultChecked /> Small</label>
      <label className="inline-flex w-fit items-center gap-2.5 text-sm font-medium text-muted-foreground"><Switch disabled /> Disabled</label>
    </div>
  )
}
