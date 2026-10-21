import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { ChatAttachment, ChatAttachments } from "@/registry/facet/ui/chat-attachment"

type Item = { id: number; name: string; size?: string; progress?: number; preview?: string }

const initial: Item[] = [
  { id: 1, name: "Q4-pricing.pdf", size: "2.4 MB" },
  { id: 2, name: "pipeline.csv", size: "84 KB" },
  { id: 3, name: "dashboard.png", size: "640 KB", progress: 12 },
  { id: 4, name: "cover.png", preview: "linear-gradient(135deg, var(--brand-400), var(--chart-2))" },
]

export default function ChatAttachmentDemo() {
  const [items, setItems] = React.useState(initial)
  const next = React.useRef(10)

  React.useEffect(() => {
    const id = setInterval(() => {
      setItems((list) =>
        list.map((it) => (it.progress != null && it.progress < 100 ? { ...it, progress: Math.min(100, it.progress + 9) } : it))
      )
    }, 220)
    return () => clearInterval(id)
  }, [])

  const add = () => {
    const n = next.current++
    setItems((l) => [...l, { id: n, name: `notes-${n}.md`, size: "12 KB", progress: 0 }])
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start gap-4">
      <ChatAttachments>
        {items.map((it) => (
          <ChatAttachment
            key={it.id}
            name={it.name}
            size={it.size}
            progress={it.progress}
            preview={it.preview}
            onRemove={() => setItems((l) => l.filter((x) => x.id !== it.id))}
          />
        ))}
      </ChatAttachments>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={add}>
          <Plus /> Add file
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setItems(initial)}>
          Reset
        </Button>
      </div>
    </div>
  )
}
