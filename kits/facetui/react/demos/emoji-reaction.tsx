import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { EmojiReactionAdd, EmojiReactionButton, EmojiReactions } from "@/registry/facet/ui/emoji-reaction"

type Reaction = { emoji: string; label: string; count: number; mine: boolean }

const extra: Omit<Reaction, "count" | "mine">[] = [
  { emoji: "🔥", label: "fire" },
  { emoji: "❤️", label: "heart" },
  { emoji: "🚀", label: "rocket" },
]

export default function EmojiReactionDemo() {
  const [reactions, setReactions] = React.useState<Reaction[]>([
    { emoji: "👍", label: "thumbs-up", count: 12, mine: true },
    { emoji: "🎉", label: "party", count: 4, mine: false },
    { emoji: "👀", label: "eyes", count: 2, mine: false },
  ])

  const toggle = (emoji: string, on: boolean) =>
    setReactions((rs) => rs.map((r) => (r.emoji === emoji ? { ...r, mine: on, count: r.count + (on ? 1 : -1) } : r)).filter((r) => r.count > 0))

  const add = () => {
    const next = extra.find((e) => !reactions.some((r) => r.emoji === e.emoji))
    if (next) setReactions((rs) => [...rs, { ...next, count: 1, mine: true }])
  }

  return (
    <div className="flex max-w-[460px] flex-col gap-3 rounded-facet-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-full bg-chart-1/15 text-xs font-semibold text-brand">MC</span>
        <div className="text-sm">
          <b className="font-medium">Maya Chen</b> <span className="text-xs text-muted-foreground">9:41</span>
          <p className="text-foreground-secondary">Shipped the new pricing page 🎉 — thanks everyone!</p>
        </div>
      </div>
      <EmojiReactions aria-label="Reactions" className="pl-[42px]">
        <AnimatePresence initial={false} mode="popLayout">
          {reactions.map((r) => (
            <motion.div key={r.emoji} layout initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
              <EmojiReactionButton emoji={r.emoji} label={r.label} count={r.count} isSelected={r.mine} onPress={(on) => toggle(r.emoji, on)} />
            </motion.div>
          ))}
          <motion.div key="add" layout>
            <EmojiReactionAdd onClick={add} />
          </motion.div>
        </AnimatePresence>
      </EmojiReactions>
    </div>
  )
}
