import * as React from "react"
import { Checkbox, RadioGroup, RadioGroupItem } from "@/registry/facet/ui/checkbox"

const items = ["Mentions", "Comments", "Deploys"]

export default function CheckboxDemo() {
  const [picked, setPicked] = React.useState<string[]>(["Mentions"])
  const all = picked.length === items.length ? true : picked.length ? "indeterminate" : false
  return (
    <div className="grid gap-10 sm:grid-cols-3">
      <div className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-start gap-2 text-sm font-medium">
          <Checkbox defaultChecked />
          <span>Email me weekly digests<small className="block text-xs font-normal text-muted-foreground">A summary of activity across your projects.</small></span>
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-sm font-medium"><Checkbox /> Product updates</label>
        <label className="flex items-start gap-2 text-sm font-medium text-muted-foreground"><Checkbox disabled /> Disabled</label>
      </div>
      <div className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-start gap-2 text-sm font-medium">
          <Checkbox checked={all} onCheckedChange={(v) => setPicked(v === true ? items : [])} /> All notifications
        </label>
        <div className="flex flex-col gap-2.5 pl-6">
          {items.map((i) => (
            <label key={i} className="flex cursor-pointer items-start gap-2 text-sm">
              <Checkbox checked={picked.includes(i)} onCheckedChange={(v) => setPicked((p) => (v ? [...p, i] : p.filter((x) => x !== i)))} /> {i}
            </label>
          ))}
        </div>
      </div>
      <RadioGroup defaultValue="monthly" aria-label="Plan">
        <label className="flex cursor-pointer items-start gap-2 text-sm font-medium"><RadioGroupItem value="monthly" /> Monthly</label>
        <label className="flex cursor-pointer items-start gap-2 text-sm font-medium">
          <RadioGroupItem value="yearly" /> Yearly
          <span className="rounded-full bg-success-subtle px-1.5 text-xs font-medium text-success">-20%</span>
        </label>
      </RadioGroup>
    </div>
  )
}
