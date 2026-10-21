import * as React from "react"
import { FileText, Folder, Image as ImageIcon } from "lucide-react"
import {
  Conversation,
  Message,
  PromptComposer,
  StreamingText,
  ThinkingIndicator,
  type ContextChip,
} from "@/registry/facet/ui/ai"

type Msg = { id: number; from: "user" | "assistant"; text: string; status?: "thinking" | "streaming" | "done" }

const reply =
  "Done — I created 12 tasks across three phases. Prepare covers assets and docs (due Oct 24), Launch covers the email and in-app announcement, and Measure sets up the activation dashboard. Maya owns Prepare; want me to assign the rest?"

const models = [
  { id: "facet-pro", name: "Facet Pro", description: "Best for planning and writing" },
  { id: "facet-fast", name: "Facet Fast", description: "Quick answers, lower cost" },
]

export default function AiDemo() {
  const [messages, setMessages] = React.useState<Msg[]>([
    { id: 1, from: "user", text: "Draft a launch plan for the Q4 release." },
    {
      id: 2,
      from: "assistant",
      text: "Here's a 3-phase plan: Prepare (assets, docs), Launch (email + in-app), Measure (activation dashboard). Want me to create tasks?",
    },
  ])
  const [context, setContext] = React.useState<ContextChip[]>([
    { id: "brief", label: "Launch brief", icon: <FileText /> },
    { id: "project", label: "Q4 Launch", icon: <Folder /> },
  ])
  const [model, setModel] = React.useState("facet-pro")
  const [busy, setBusy] = React.useState<number | null>(null)
  const timers = React.useRef<number[]>([])

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }
  React.useEffect(() => clear, [])

  const patch = (id: number, p: Partial<Msg>) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...p } : m)))

  const stop = () => {
    if (busy === null) return
    clear()
    setMessages((ms) =>
      ms.map((m) => (m.id === busy ? { ...m, status: "done", text: m.status === "thinking" ? "Stopped." : m.text } : m))
    )
    setBusy(null)
  }

  const send = (text: string) => {
    const id = Date.now()
    setMessages((m) => [...m, { id: id - 1, from: "user", text }, { id, from: "assistant", text: "", status: "thinking" }])
    setBusy(id)
    const words = reply.split(" ")
    timers.current.push(
      window.setTimeout(() => {
        words.forEach((_, i) =>
          timers.current.push(
            window.setTimeout(() => {
              const last = i === words.length - 1
              patch(id, { text: words.slice(0, i + 1).join(" "), status: last ? "done" : "streaming" })
              if (last) setBusy(null)
            }, i * 45)
          )
        )
      }, 900)
    )
  }

  return (
    <div className="mx-auto flex max-w-[620px] flex-col gap-4">
      <Conversation>
        {messages.map((m) => (
          <Message key={m.id} from={m.from} streaming={m.status === "thinking" || m.status === "streaming"}>
            {m.status === "thinking" ? (
              <ThinkingIndicator />
            ) : m.status ? (
              <StreamingText text={m.text} streaming={m.status === "streaming"} />
            ) : (
              m.text
            )}
          </Message>
        ))}
      </Conversation>
      <PromptComposer
        defaultValue="Yes — create the tasks and assign owners"
        context={context}
        onRemoveContext={(id) => setContext((c) => c.filter((x) => x.id !== id))}
        onAttach={() =>
          setContext((c) =>
            c.some((x) => x.id === "shot") ? c : [...c, { id: "shot", label: "screenshot.png", icon: <ImageIcon /> }]
          )
        }
        models={models}
        model={model}
        onModelChange={setModel}
        generating={busy !== null}
        onStop={stop}
        onSubmit={send}
      />
      <p className="text-center text-xs text-muted-foreground">Enter to send · Shift+Enter for a new line · try Stop while it streams</p>
    </div>
  )
}
