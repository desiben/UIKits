import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { Kanban, KanbanCard, KanbanColumn, type KanbanTag } from "@/registry/facet/ui/kanban"

type Task = {
  id: string
  title: string
  tags?: KanbanTag[]
  progress?: number
  due?: string
  comments?: number
  assignees?: string[]
}
type Column = { id: string; title: string; color: string; items: Task[] }

const initial: Column[] = [
  {
    id: "todo",
    title: "To do",
    color: "var(--chart-3)",
    items: [
      { id: "t1", title: "Audit pricing page copy", tags: [{ label: "Content", tone: "warning" }], due: "Oct 28", assignees: ["MC"] },
      { id: "t2", title: "Billing webhooks retry", tags: [{ label: "Eng", tone: "info" }], comments: 4, assignees: ["AK"] },
      { id: "t3", title: "Customer interview synthesis", tags: [{ label: "Research" }], due: "Nov 2" },
    ],
  },
  {
    id: "doing",
    title: "In progress",
    color: "var(--chart-1)",
    items: [
      {
        id: "t4",
        title: "Redesign onboarding",
        tags: [{ label: "Design", tone: "brand" }, { label: "P1", tone: "danger" }],
        progress: 75,
        due: "Oct 24",
        assignees: ["MC", "JR"],
      },
      { id: "t5", title: "Usage-based billing API", tags: [{ label: "Eng", tone: "info" }], progress: 40, comments: 7, assignees: ["AK"] },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "var(--chart-2)",
    items: [{ id: "t6", title: "Launch brief v1", tags: [{ label: "Shipped", tone: "success" }], comments: 2, assignees: ["JR"] }],
  },
]

export default function KanbanDemo() {
  const [columns, setColumns] = React.useState(initial)
  const titles = React.useMemo(
    () => Object.fromEntries(columns.flatMap((c) => c.items.map((t) => [t.id, t.title]))),
    [columns]
  )
  const add = (colId: string) =>
    setColumns((cols) =>
      cols.map((c) =>
        c.id === colId
          ? { ...c, items: [...c.items, { id: `n${Date.now()}`, title: "New task", tags: [{ label: "Draft" }] }] }
          : c
      )
    )

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] text-muted-foreground">
        Drag cards between columns, or focus a card and press Space, then the arrow keys.
      </p>
      <Kanban value={columns} onValueChange={setColumns} getItemLabel={(id) => titles[id] ?? id} className="pb-2">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            footer={
              <Button variant="ghost" size="sm" className="justify-start text-muted-foreground" onClick={() => add(col.id)}>
                <Plus /> Add card
              </Button>
            }
          >
            {col.items.map((t) => (
              <KanbanCard key={t.id} {...t} />
            ))}
          </KanbanColumn>
        ))}
      </Kanban>
    </div>
  )
}
