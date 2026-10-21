import * as React from "react"
import { Paperclip } from "lucide-react"
import { ChainOfThought, ChainOfThoughtStep, type StepStatus } from "@/registry/facet/ui/chain-of-thought"
import { ChatConversation, ChatConversationContent, ChatConversationScrollButton } from "@/registry/facet/ui/chat-conversation"
import { ChatLoader } from "@/registry/facet/ui/chat-loader"
import { ChatMessage, ChatMessageContent, ChatMessageFooter } from "@/registry/facet/ui/chat-message"
import { ChatMessageActions } from "@/registry/facet/ui/chat-message-actions"
import { ChatSource, ChatSources } from "@/registry/facet/ui/chat-source"
import { Markdown } from "@/registry/facet/ui/markdown"
import { PromptInput, PromptInputAction, PromptInputSubmit, PromptInputTextarea, PromptInputToolbar } from "@/registry/facet/ui/prompt-input"
import { PromptSuggestion, PromptSuggestions } from "@/registry/facet/ui/prompt-suggestion"

type Turn = {
  id: number
  question: string
  answer: string
  shown: number // characters revealed
  step: number // reasoning progress
  phase: "thinking" | "reasoning" | "streaming" | "done"
}

const STEPS = ["Searched CRM", "Checked seat usage", "Reviewed open invoices"]
const ANSWER = `**Two deals need attention** this quarter:

- **Globex** — $12,950, seat usage down 31%.
- **Umbrella** — $8,400, invoice 38 days overdue.

I'd book an exec check-in with Globex first and send Umbrella a friendly reminder with the \`INV-2041\` link.`

const first: Turn = { id: 0, question: "Which enterprise deals are at risk this quarter?", answer: ANSWER, shown: ANSWER.length, step: 3, phase: "done" }

export default function ChatConversationDemo() {
  const [turns, setTurns] = React.useState<Turn[]>([first])
  const timer = React.useRef<ReturnType<typeof setInterval>>(undefined)
  React.useEffect(() => () => clearInterval(timer.current), [])
  const live = turns[turns.length - 1]
  const busy = live.phase !== "done"

  const update = (fn: (t: Turn) => Turn) => setTurns((ts) => ts.map((t, i) => (i === ts.length - 1 ? fn(t) : t)))

  const ask = (q: string) => {
    clearInterval(timer.current)
    const answer = `Here's a quick take on **${q.replace(/[.?!]+$/, "")}**:\n\n- Pipeline is up **6%** week over week.\n- Two renewals moved to *Commit*.\n- Nothing new is at risk since Monday.\n\nWant me to draft a summary for the team channel?`
    setTurns((ts) => [...ts, { id: ts.length, question: q, answer, shown: 0, step: 0, phase: "thinking" }])
    let tick = 0
    timer.current = setInterval(() => {
      tick++
      if (tick < 4) return
      if (tick < 4 + STEPS.length * 5) {
        update((t) => ({ ...t, phase: "reasoning", step: Math.floor((tick - 4) / 5) }))
        return
      }
      update((t) => {
        const shown = Math.min(t.answer.length, t.shown + 6)
        if (shown >= t.answer.length) clearInterval(timer.current)
        return { ...t, step: STEPS.length, phase: shown >= t.answer.length ? "done" : "streaming", shown }
      })
    }, 120)
  }
  const stop = () => {
    clearInterval(timer.current)
    update((t) => ({ ...t, phase: "done", step: STEPS.length, answer: t.answer.slice(0, t.shown) }))
  }

  const status = (t: Turn, i: number): StepStatus => (i < t.step ? "done" : i === t.step && t.phase === "reasoning" ? "active" : "pending")

  return (
    <div className="mx-auto flex h-[560px] max-w-[720px] flex-col overflow-hidden rounded-facet-xl border border-border bg-card">
      <ChatConversation>
        <ChatConversationContent busy={busy}>
          {turns.map((t) => (
            <React.Fragment key={t.id}>
              <ChatMessage role="user">
                <ChatMessageContent>{t.question}</ChatMessageContent>
              </ChatMessage>
              <ChatMessage>
                {t.phase === "thinking" ? (
                  <ChatLoader variant="shimmer" className="h-7">Thinking…</ChatLoader>
                ) : (
                  <>
                    <ChainOfThought
                      defaultOpen={t.phase !== "done"}
                      loading={t.phase === "reasoning"}
                      title={t.phase === "reasoning" ? "Researching your pipeline…" : "Thought for 4 seconds"}
                    >
                      {STEPS.map((s, i) => (
                        <ChainOfThoughtStep key={s} status={status(t, i)} title={s} />
                      ))}
                    </ChainOfThought>
                    {t.shown > 0 && <Markdown>{t.answer.slice(0, t.shown)}</Markdown>}
                    {t.phase === "done" && (
                      <>
                        <ChatSources>
                          <ChatSource href="#" index={1} title="Salesforce · Q4 pipeline" />
                          <ChatSource href="#" index={2} title="Mixpanel · seat usage" />
                        </ChatSources>
                        <ChatMessageFooter>
                          <ChatMessageActions copyText={t.answer} />
                        </ChatMessageFooter>
                      </>
                    )}
                  </>
                )}
              </ChatMessage>
            </React.Fragment>
          ))}
        </ChatConversationContent>
        <ChatConversationScrollButton />
      </ChatConversation>
      <div className="flex flex-col gap-2 border-t border-border-subtle bg-background/40 p-3">
        {!busy && turns.length < 3 && (
          <PromptSuggestions>
            {["Summarize this week", "Forecast Q4 revenue", "Draft a follow-up"].map((s) => (
              <PromptSuggestion key={s} onClick={() => ask(s)}>
                {s}
              </PromptSuggestion>
            ))}
          </PromptSuggestions>
        )}
        <PromptInput onSubmit={ask} streaming={busy} onStop={stop}>
          <PromptInputTextarea placeholder="Ask Facet AI anything…" className="min-h-6" />
          <PromptInputToolbar>
            <PromptInputAction aria-label="Attach file">
              <Paperclip />
            </PromptInputAction>
            <span className="flex-1" />
            <PromptInputSubmit />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  )
}
