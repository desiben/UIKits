"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springBouncy } from "@/registry/facet/lib/motion"

export type ChatFeedback = "up" | "down" | null

export interface ChatMessageActionsProps extends Omit<React.ComponentProps<"div">, "onCopy"> {
  /** Text copied to the clipboard by the copy button. */
  copyText?: string
  onCopy?: () => void
  /** Controlled rating. Thumbs are mutually exclusive; clicking the active one clears it. */
  feedback?: ChatFeedback
  defaultFeedback?: ChatFeedback
  onFeedback?: (value: ChatFeedback) => void
  onRegenerate?: () => void
  /** Hide individual actions. */
  hide?: Array<"copy" | "feedback" | "regenerate">
}

const actionClass =
  "relative inline-flex size-7 cursor-pointer items-center justify-center rounded-facet-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-pressed:text-brand [&_svg]:size-4"

/** A ghost icon button used in message action rows. */
function ChatMessageAction({ className, ...props }: React.ComponentProps<typeof motion.button>) {
  return (
    <motion.button
      type="button"
      data-slot="chat-message-action"
      className={cn(actionClass, className)}
      whileTap={{ scale: 0.88 }}
      transition={spring}
      {...props}
    />
  )
}

/** Copy, rate and regenerate controls under an assistant reply. */
function ChatMessageActions({
  copyText,
  onCopy,
  feedback: feedbackProp,
  defaultFeedback = null,
  onFeedback,
  onRegenerate,
  hide = [],
  className,
  children,
  ...props
}: ChatMessageActionsProps) {
  const [copied, setCopied] = React.useState(false)
  const [inner, setInner] = React.useState<ChatFeedback>(defaultFeedback)
  const [spins, setSpins] = React.useState(0)
  const feedback = feedbackProp !== undefined ? feedbackProp : inner
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      if (copyText != null) await navigator.clipboard?.writeText(copyText)
    } catch {
      /* clipboard may be unavailable (insecure context) */
    }
    onCopy?.()
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1600)
  }
  const rate = (v: "up" | "down") => {
    const next = feedback === v ? null : v
    if (feedbackProp === undefined) setInner(next)
    onFeedback?.(next)
  }

  return (
    <div data-slot="chat-message-actions" role="group" aria-label="Message actions" className={cn("flex items-center gap-0.5", className)} {...props}>
      {!hide.includes("copy") && (
        <ChatMessageAction aria-label={copied ? "Copied" : "Copy"} title="Copy" onClick={copy}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={copied ? "check" : "copy"}
              className={cn("inline-flex", copied && "text-success")}
              initial={{ opacity: 0, scale: 0.4, rotate: copied ? -45 : 45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={springBouncy}
            >
              {copied ? <Check /> : <Copy />}
            </motion.span>
          </AnimatePresence>
        </ChatMessageAction>
      )}
      {!hide.includes("feedback") &&
        (["up", "down"] as const).map((v) => {
          const on = feedback === v
          const Icon = v === "up" ? ThumbsUp : ThumbsDown
          return (
            <ChatMessageAction
              key={v}
              aria-label={v === "up" ? "Good response" : "Bad response"}
              title={v === "up" ? "Good response" : "Bad response"}
              aria-pressed={on}
              onClick={() => rate(v)}
            >
              <motion.span
                className="inline-flex"
                animate={on ? { scale: [1, 1.35, 1], rotate: v === "up" ? [0, -14, 0] : [0, 14, 0] } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Icon fill={on ? "currentColor" : "none"} fillOpacity={0.18} />
              </motion.span>
            </ChatMessageAction>
          )
        })}
      {!hide.includes("regenerate") && (
        <ChatMessageAction
          aria-label="Regenerate"
          title="Regenerate"
          onClick={() => {
            setSpins((s) => s + 1)
            onRegenerate?.()
          }}
        >
          <motion.span className="inline-flex" animate={{ rotate: spins * -360 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <RotateCcw />
          </motion.span>
        </ChatMessageAction>
      )}
      {children}
    </div>
  )
}

export { ChatMessageActions, ChatMessageAction }
