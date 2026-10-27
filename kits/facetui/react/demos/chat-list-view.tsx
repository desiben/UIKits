import * as React from "react"
import { SquarePen } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { ChatListView, type ChatThreadGroup } from "@/registry/facet/ui/chat-list-view"

const data: ChatThreadGroup[] = [
  {
    label: "Today",
    threads: [
      { id: "1", title: "At-risk enterprise deals", preview: "Two deals need attention…", time: "9:41" },
      { id: "2", title: "Draft Globex email", preview: "Here's a friendly check-in…", unread: true },
    ],
  },
  {
    label: "Previous 7 days",
    threads: [
      { id: "3", title: "Q4 board deck outline", preview: "Slide 1: Highlights…", time: "Tue" },
      { id: "4", title: "SQL for churn cohort", preview: "SELECT account_id…", time: "Mon" },
      { id: "5", title: "Pricing page copy", preview: "Three plans, one table…", time: "Sun", unread: true },
    ],
  },
]

export default function ChatListViewDemo() {
  const [groups, setGroups] = React.useState(data)
  const [selected, setSelected] = React.useState("1")
  const [n, setN] = React.useState(1)

  const select = (id: string) => {
    setSelected(id)
    setGroups((gs) => gs.map((g) => ({ ...g, threads: g.threads.map((t) => (t.id === id ? { ...t, unread: false } : t)) })))
  }
  const create = () => {
    const id = `new-${n}`
    setN(n + 1)
    setGroups((gs) => gs.map((g, i) => (i === 0 ? { ...g, threads: [{ id, title: "New chat", preview: "Ask anything…", time: "now" }, ...g.threads] } : g)))
    setSelected(id)
  }

  return (
    <div className="mx-auto w-[300px] rounded-facet-xl border border-border bg-card p-2">
      <Button variant="outline" size="sm" className="mb-1.5 w-full" onClick={create}>
        <SquarePen /> New chat
      </Button>
      <ChatListView
        groups={groups}
        selectedId={selected}
        onSelect={select}
        onRename={() => {}}
        onDelete={(id) => setGroups((gs) => gs.map((g) => ({ ...g, threads: g.threads.filter((t) => t.id !== id) })))}
      />
    </div>
  )
}
