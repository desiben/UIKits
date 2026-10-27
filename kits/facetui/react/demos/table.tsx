import * as React from "react"
import { motion } from "motion/react"
import { Check, Minus, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { Badge } from "@/registry/facet/ui/badge"
import { Avatar, AvatarFallback } from "@/registry/facet/ui/avatar"
import {
  Table, TableBody, TableCell, TableHead, TableHeadRow, TableHeader, TableRow, TableSortHead, type SortDirection,
} from "@/registry/facet/ui/table"

type Row = { id: string; name: string; email: string; status: "Active" | "Trial" | "Past due"; mrr: number }
const initial: Row[] = [
  { id: "nw", name: "Northwind", email: "ops@northwind.io", status: "Active", mrr: 12400 },
  { id: "gl", name: "Globex", email: "finance@globex.com", status: "Trial", mrr: 3150 },
  { id: "in", name: "Initech", email: "it@initech.co", status: "Past due", mrr: 890 },
  { id: "um", name: "Umbrella", email: "billing@umbrella.org", status: "Active", mrr: 8950 },
  { id: "hk", name: "Hooli", email: "ap@hooli.xyz", status: "Active", mrr: 6120 },
]
const tone = { Active: "success", Trial: "warning", "Past due": "danger" } as const

function Check2({ state, onChange, label }: { state: boolean | "mixed"; onChange: () => void; label: string }) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={state}
      aria-label={label}
      onClick={onChange}
      whileTap={{ scale: 0.88 }}
      className="grid size-4 cursor-pointer place-items-center rounded-[4px] border border-input bg-card text-primary-foreground outline-none transition-colors aria-checked:border-primary aria-checked:bg-primary aria-[checked=mixed]:border-primary aria-[checked=mixed]:bg-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {state === "mixed" ? <Minus className="size-3" strokeWidth={3} /> : state ? <Check className="size-3" strokeWidth={3} /> : null}
    </motion.button>
  )
}

export default function TableDemo() {
  const [rows, setRows] = React.useState(initial)
  const [sort, setSort] = React.useState<{ key: "name" | "mrr"; dir: SortDirection }>({ key: "mrr", dir: false })
  const [selected, setSelected] = React.useState<Set<string>>(new Set(["nw"]))

  const sorted = React.useMemo(() => {
    if (!sort.dir) return rows
    const m = sort.dir === "asc" ? 1 : -1
    return [...rows].sort((a, b) => (sort.key === "name" ? a.name.localeCompare(b.name) : a.mrr - b.mrr) * m)
  }, [rows, sort])

  const cycle = (key: "name" | "mrr") =>
    setSort((s) => ({ key, dir: s.key !== key ? "asc" : s.dir === "asc" ? "desc" : s.dir === "desc" ? false : "asc" }))
  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  const all = selected.size === rows.length && rows.length > 0 ? true : selected.size ? "mixed" : false

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-8 items-center gap-2 text-[13px] text-muted-foreground">
        <span>{selected.size} of {rows.length} selected</span>
        {selected.size > 0 && (
          <Button size="sm" variant="ghost" className="text-danger" onClick={() => { setRows((r) => r.filter((x) => !selected.has(x.id))); setSelected(new Set()) }}>
            <Trash2 /> Remove
          </Button>
        )}
        <Button size="sm" variant="outline" className="ml-auto" onClick={() => { setRows(initial); setSelected(new Set()) }}>Reset</Button>
      </div>
      <Table>
        <TableHeader>
          <TableHeadRow>
            <TableHead>
              <Check2 state={all} label="Select all" onChange={() => setSelected(all === true ? new Set() : new Set(rows.map((r) => r.id)))} />
            </TableHead>
            <TableSortHead direction={sort.key === "name" && sort.dir} onSort={() => cycle("name")}>Customer</TableSortHead>
            <TableHead>Status</TableHead>
            <TableSortHead numeric direction={sort.key === "mrr" && sort.dir} onSort={() => cycle("mrr")}>MRR</TableSortHead>
            <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
          </TableHeadRow>
        </TableHeader>
        <TableBody>
          {sorted.map((r, i) => (
            <TableRow key={r.id} data-state={selected.has(r.id) ? "selected" : undefined}>
              <TableCell><Check2 state={selected.has(r.id)} label={`Select ${r.name}`} onChange={() => toggle(r.id)} /></TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar size="sm"><AvatarFallback tint={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>{r.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                  <div className="flex flex-col">
                    <b className="text-sm font-medium">{r.name}</b>
                    <span className="text-[13px] text-muted-foreground">{r.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell><Badge variant={tone[r.status]} dot={r.status === "Active"}>{r.status}</Badge></TableCell>
              <TableCell numeric>${r.mrr.toLocaleString("en-US")}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${r.name}`}><MoreHorizontal /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
