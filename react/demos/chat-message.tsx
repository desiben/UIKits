import * as React from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageFooter,
  ChatMessageMeta,
  ChatMessageStream,
} from "@/registry/facet/ui/chat-message"
import { ChatMessageActions } from "@/registry/facet/ui/chat-message-actions"

const reply = "MRR grew 4.6% to $248,920. Expansion drove most of it — Northwind added 40 seats and Globex upgraded to the Scale plan."

export default function ChatMessageDemo() {
  const [n, setN] = React.useState(0)
  const [run, setRun] = React.useState(0)
  React.useEffect(() => {
    setN(0)
    const words = reply.split(" ").length
    let i = 0
    const id = setInterval(() => {
      i++
      setN(i)
      if (i >= words) clearInterval(id)
    }, 70)
    return () => clearInterval(id)
  }, [run])
  const words = reply.split(" ")
  const streaming = n < words.length

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <ChatMessage role="user" avatar={<ChatMessageAvatar className="rounded-full from-rose-400 to-orange-400">MR</ChatMessageAvatar>}>
        <ChatMessageMeta name="Maya" time="9:41" />
        <ChatMessageContent>Summarize this week's revenue changes.</ChatMessageContent>
      </ChatMessage>
      <ChatMessage key={run}>
        <ChatMessageMeta name="Facet AI" time="9:41" />
        <ChatMessageContent>
          <ChatMessageStream text={words.slice(0, n).join(" ")} streaming={streaming} />
        </ChatMessageContent>
        <ChatMessageFooter>
          <ChatMessageActions copyText={reply} onRegenerate={() => setRun((r) => r + 1)} />
        </ChatMessageFooter>
      </ChatMessage>
      <ChatMessage variant="bubble">
        <ChatMessageContent>Bubble variant for compact assistant surfaces like a support widget.</ChatMessageContent>
      </ChatMessage>
      <Button variant="outline" size="sm" className="self-center" onClick={() => setRun((r) => r + 1)}>
        <RotateCcw /> Replay stream
      </Button>
    </div>
  )
}
