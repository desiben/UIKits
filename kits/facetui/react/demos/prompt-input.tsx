import * as React from "react"
import { ChevronDown, Mic, Paperclip, Sparkles } from "lucide-react"
import { ChatAttachment, ChatAttachments } from "@/registry/facet/ui/chat-attachment"
import { PromptInput, PromptInputAction, PromptInputSubmit, PromptInputTextarea, PromptInputToolbar } from "@/registry/facet/ui/prompt-input"

export default function PromptInputDemo() {
  const [files, setFiles] = React.useState([{ id: 1, name: "Q4-pricing.pdf", size: "2.4 MB" }])
  const [streaming, setStreaming] = React.useState(false)
  const [sent, setSent] = React.useState<string | null>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])

  const send = (text: string) => {
    setSent(text)
    setStreaming(true)
    timer.current = setTimeout(() => setStreaming(false), 3000)
  }
  const attach = () => setFiles((f) => [...f, { id: Date.now(), name: `pipeline-${f.length + 1}.csv`, size: "84 KB" }])

  return (
    <div className="mx-auto flex max-w-[640px] flex-col gap-3">
      <PromptInput onSubmit={send} streaming={streaming} onStop={() => { clearTimeout(timer.current); setStreaming(false) }}>
        {files.length > 0 && (
          <ChatAttachments>
            {files.map((f) => (
              <ChatAttachment key={f.id} name={f.name} size={f.size} onRemove={() => setFiles((l) => l.filter((x) => x.id !== f.id))} />
            ))}
          </ChatAttachments>
        )}
        <PromptInputTextarea placeholder="Ask Facet AI anything…" />
        <PromptInputToolbar>
          <PromptInputAction aria-label="Attach file" onClick={attach}>
            <Paperclip />
          </PromptInputAction>
          <PromptInputAction className="text-xs">
            <Sparkles className="text-brand" /> Facet Pro <ChevronDown className="size-3.5!" />
          </PromptInputAction>
          <span className="flex-1" />
          <PromptInputAction aria-label="Voice input">
            <Mic />
          </PromptInputAction>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
      <p className="text-center text-xs text-muted-foreground" aria-live="polite">
        {streaming ? `Replying to “${sent}”… press stop to cancel` : sent ? `Sent “${sent}”` : "Enter to send · Shift+Enter for a new line"}
      </p>
    </div>
  )
}
