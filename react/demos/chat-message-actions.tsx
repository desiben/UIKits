import * as React from "react"
import { ChatMessageActions, type ChatFeedback } from "@/registry/facet/ui/chat-message-actions"

export default function ChatMessageActionsDemo() {
  const [feedback, setFeedback] = React.useState<ChatFeedback>(null)
  const [regens, setRegens] = React.useState(0)
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="max-w-md rounded-facet-lg border border-border bg-card p-4 text-sm text-foreground-secondary">
        MRR grew <strong className="text-foreground">4.6%</strong> to $248,920. Expansion drove most of it — Northwind added 40 seats.
        <ChatMessageActions
          className="mt-3 -ml-1"
          copyText="MRR grew 4.6% to $248,920."
          feedback={feedback}
          onFeedback={setFeedback}
          onRegenerate={() => setRegens((n) => n + 1)}
        />
      </div>
      <p className="text-[13px] text-muted-foreground" aria-live="polite">
        Rating: {feedback ?? "none"} · Regenerated {regens}×
      </p>
    </div>
  )
}
