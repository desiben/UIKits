import * as React from "react"
import { motion } from "motion/react"
import { Archive, Download, Tag, Trash } from "lucide-react"
import { ActionBar, ActionBarButton } from "@/registry/facet/ui/action-bar"

const items = [
  { id: "1", title: "Q4 pricing proposal", from: "Maya Chen" },
  { id: "2", title: "Security review for Globex", from: "Jonas Richter" },
  { id: "3", title: "Design sync notes", from: "Aiko Kato" },
  { id: "4", title: "Invoice #4021", from: "Billing" },
  { id: "5", title: "Offsite agenda", from: "Leo Duarte" },
]

function Check({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-4 place-items-center rounded-[4px] border transition-colors ${checked ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card"}`}
    >
      <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M3.5 8.5l3 3 6-7" initial={false} animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }} transition={{ duration: 0.2 }} />
      </svg>
    </span>
  )
}

export default function ActionBarDemo() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set(["1", "3"]))
  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const clear = React.useCallback(() => setSelected(new Set()), [])

  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-4">
      <div className="overflow-hidden rounded-facet-lg border border-border bg-card">
        {items.map((it) => {
          const on = selected.has(it.id)
          return (
            <label
              key={it.id}
              className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition-colors [&+label]:border-t [&+label]:border-border-subtle ${on ? "bg-primary-subtle" : "hover:bg-subtle"}`}
            >
              <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(it.id)} />
              <Check checked={on} />
              <span className="flex-1 font-medium">{it.title}</span>
              <span className="text-xs text-muted-foreground">{it.from}</span>
            </label>
          )
        })}
      </div>
      <div className="min-h-12">
        <ActionBar open={selected.size > 0} count={selected.size} onClear={clear}>
          <ActionBarButton icon={<Archive />}>Archive</ActionBarButton>
          <ActionBarButton icon={<Tag />}>Label</ActionBarButton>
          <ActionBarButton icon={<Download />}>Export</ActionBarButton>
          <ActionBarButton icon={<Trash />} variant="destructive" onClick={clear}>Delete</ActionBarButton>
        </ActionBar>
      </div>
      <p className="text-center text-xs text-muted-foreground">Select rows to raise the bar · Esc clears</p>
    </div>
  )
}
