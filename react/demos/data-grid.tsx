import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { DataGrid, type DataGridColumn } from "@/registry/facet/ui/data-grid"

type Account = { id: string; account: string; mrr: number; seats: number; owner: string; status: "Active" | "Renewal" | "At risk" }

const statusClass: Record<Account["status"], string> = {
  Active: "bg-success-subtle text-success",
  Renewal: "bg-warning-subtle text-warning",
  "At risk": "bg-danger-subtle text-danger",
}

const columns: DataGridColumn<Account>[] = [
  { key: "account", header: "Account", editable: true, width: 160 },
  { key: "mrr", header: "MRR", type: "number", editable: true, sum: true, prefix: "$" },
  { key: "seats", header: "Seats", type: "number", editable: true, sum: true },
  { key: "owner", header: "Owner", editable: true },
  {
    key: "status",
    header: "Status",
    render: (v) => (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[v as Account["status"]]}`}>
        <span className="size-1.5 rounded-full bg-current" />
        {String(v)}
      </span>
    ),
  },
]

const initial: Account[] = [
  { id: "a", account: "Northwind", mrr: 12400, seats: 120, owner: "Maya", status: "Active" },
  { id: "b", account: "Globex", mrr: 8950, seats: 85, owner: "Jonas", status: "Renewal" },
  { id: "c", account: "Initech", mrr: 6120, seats: 60, owner: "Aiko", status: "Active" },
  { id: "d", account: "Umbrella", mrr: 2115, seats: 20, owner: "Maya", status: "At risk" },
  { id: "e", account: "Hooli", mrr: 4300, seats: 41, owner: "Leo", status: "Active" },
]

export default function DataGridDemo() {
  const [rows, setRows] = React.useState(initial)
  const [selected, setSelected] = React.useState<string[]>(["b"])
  const n = React.useRef(0)
  return (
    <div className="flex flex-col gap-2">
      <DataGrid
        label="Accounts"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        selectable
        selectedRowIds={selected}
        onSelectedRowIdsChange={setSelected}
        maxHeight={300}
        onCellEdit={(ri, key, value) => setRows((rs) => rs.map((r, i) => (i === ri ? { ...r, [key]: value } : r)))}
        toolbar={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setRows((rs) => [...rs, { id: `new-${n.current++}`, account: "New account", mrr: 1000, seats: 10, owner: "—", status: "Active" }])
            }
          >
            <Plus /> Row
          </Button>
        }
      />
      <p className="text-xs text-muted-foreground">
        Click a cell, move with arrow keys, type or press Enter to edit · totals recalculate · {selected.length} row{selected.length === 1 ? "" : "s"} selected
      </p>
    </div>
  )
}
