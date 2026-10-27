import * as React from "react"
import { Button } from "@/registry/facet/ui/button"
import { Bubble, BubbleGroup, BubbleMeta } from "@/registry/facet/ui/bubble"
import { Marker } from "@/registry/facet/ui/marker"
import { MessageScroller, MessageScrollerJump, MessageScrollerViewport, useMessageScroller } from "@/registry/facet/ui/message-scroller"

type Msg = { id: string; from: "me" | "them"; text: string; kind?: "turn" | "prepend"; meta?: string }

const history: Msg[] = [
  { id: "h1", from: "them", text: "Morning! Is the Q3 export ready?", kind: "prepend" },
  { id: "h2", from: "me", text: "Yes — sent it to your inbox last night.", kind: "prepend" },
]
const start: Msg[] = [
  { id: "m1", from: "them", text: "Can you pull last quarter's churn numbers?" },
  { id: "m2", from: "me", text: "On it. Churn was 2.8%, down from 3.4%." },
  { id: "m3", from: "them", text: "Nice. Which segment improved most?" },
  { id: "m4", from: "me", text: "Mid-market — onboarding emails cut early churn by a third." },
  { id: "sep", from: "them", text: "" },
  { id: "m5", from: "them", text: "Great, let's add that to the board deck." },
  { id: "m6", from: "me", text: "Added as slide 7.", meta: "9:12" },
]
const reply = "Here's the plan: refresh the cohort chart, add a callout for the onboarding experiment, and move the pricing slide after the churn section so the story flows from retention to expansion."

function Controls({ onAsk, onStream, onLoad, loaded }: { onAsk: () => void; onStream: () => void; onLoad: () => void; loaded: boolean }) {
  const { scrollToMessage } = useMessageScroller()
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button size="sm" onClick={onAsk}>Ask a question</Button>
      <Button size="sm" variant="outline" onClick={onStream}>Stream a reply</Button>
      <Button size="sm" variant="outline" onClick={onLoad} disabled={loaded}>Load earlier</Button>
      <Button size="sm" variant="ghost" onClick={() => scrollToMessage("m1")}>Jump to first question</Button>
    </div>
  )
}

export default function MessageScrollerDemo() {
  const [msgs, setMsgs] = React.useState<Msg[]>(start)
  const [seen, setSeen] = React.useState<string[]>([])
  const n = React.useRef(0)

  const ask = () => setMsgs((m) => [...m, { id: `q${++n.current}`, from: "them", text: "And what about enterprise accounts?", kind: "turn" }])
  const stream = () => {
    const id = `r${++n.current}`
    const words = reply.split(" ")
    let i = 0
    setMsgs((m) => [...m, { id, from: "me", text: "" }])
    const t = setInterval(() => {
      i++
      setMsgs((m) => m.map((x) => (x.id === id ? { ...x, text: words.slice(0, i).join(" ") } : x)))
      if (i >= words.length) clearInterval(t)
    }, 60)
  }
  const loaded = msgs[0]?.id === "h1"
  const load = () => setMsgs((m) => [...history, ...m])

  return (
    <MessageScroller className="mx-auto h-auto max-w-[560px] gap-3" onSeen={(id) => setSeen((s) => (s.includes(id) ? s : [...s, id]))}>
      <div className="relative flex h-[380px] flex-col overflow-hidden rounded-facet-xl border border-border bg-card">
        <MessageScrollerViewport contentProps={{ role: "log", "aria-live": "polite" }}>
          {msgs.map((m) =>
            m.id === "sep" ? (
              <Marker key={m.id}>Today</Marker>
            ) : (
              <BubbleGroup
                key={m.id}
                id={m.id}
                align={m.from === "me" ? "end" : "start"}
                data-turn={m.kind === "turn" ? "" : undefined}
                data-prepend={m.kind === "prepend" ? "" : undefined}
                data-seen={m.meta ? (seen.includes(m.id) ? "true" : "false") : undefined}
              >
                <Bubble variant={m.from === "me" ? "primary" : "default"}>{m.text || "…"}</Bubble>
                {m.meta && <BubbleMeta>{m.meta} · {seen.includes(m.id) ? "Seen" : "Delivered"}</BubbleMeta>}
              </BubbleGroup>
            )
          )}
        </MessageScrollerViewport>
        <MessageScrollerJump />
      </div>
      <Controls onAsk={ask} onStream={stream} onLoad={load} loaded={loaded} />
    </MessageScroller>
  )
}
