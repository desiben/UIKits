import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { SendHorizontal, Smile } from "lucide-react"
import { spring } from "@/registry/facet/lib/motion"
import { Button } from "@/registry/facet/ui/button"
import { EmojiPicker, EmojiPickerPopover } from "@/registry/facet/ui/emoji-picker"

export default function EmojiPickerDemo() {
  const [picked, setPicked] = React.useState<string[]>([])
  const [message, setMessage] = React.useState("Ship it ")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const insert = (emoji: string) => {
    const el = inputRef.current
    const start = el?.selectionStart ?? message.length
    const end = el?.selectionEnd ?? message.length
    const next = message.slice(0, start) + emoji + message.slice(end)
    setMessage(next)
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(start + emoji.length, start + emoji.length)
    })
  }

  return (
    <div className="flex flex-wrap items-start justify-center gap-10">
      <div className="flex flex-col items-center gap-3">
        <EmojiPicker defaultRecent={["👍", "🎉", "🚀", "❤️", "😂"]} onSelect={(e) => setPicked((p) => [...p, e.emoji].slice(-10))} />
        <div className="flex h-9 w-[320px] items-center gap-1 rounded-facet border border-input bg-background px-3 text-sm" aria-live="polite">
          {picked.length === 0 && <span className="text-placeholder">Picked emoji appear here</span>}
          <AnimatePresence initial={false}>
            {picked.map((e, i) => (
              <motion.span
                key={`${i}-${e}`}
                layout
                className="text-lg leading-none"
                initial={{ opacity: 0, scale: 0.3, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={spring}
              >
                {e}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex w-[360px] flex-col gap-2 pt-1">
        <span className="text-sm font-medium text-foreground">In a popover</span>
        <div className="flex items-center gap-1.5 rounded-facet-lg border border-border bg-card p-1.5 shadow-xs">
          <EmojiPickerPopover onSelect={(e) => insert(e.emoji)} side="bottom" align="start">
            <Button variant="ghost" size="icon-sm" aria-label="Insert emoji">
              <Smile />
            </Button>
          </EmojiPickerPopover>
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-label="Message"
            className="h-8 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-placeholder"
            placeholder="Write a message…"
          />
          <Button size="icon-sm" aria-label="Send">
            <SendHorizontal />
          </Button>
        </div>
        <p className="text-[13px] text-muted-foreground">Search filters by name, the tabs follow your scroll, and the hand in the footer picks a skin tone.</p>
      </div>
    </div>
  )
}
