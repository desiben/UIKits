"use client"

import * as React from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"
import { Sparkles } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { springSoft } from "@/registry/facet/lib/motion"

type ChatRole = "user" | "assistant"
const ChatMessageContext = React.createContext<{ role: ChatRole; variant?: "bubble" }>({ role: "assistant" })

export interface ChatMessageProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode
  role?: ChatRole
  /** Bubble surface for assistant messages (user messages are always bubbles). */
  variant?: "plain" | "bubble"
  /** Avatar node. Assistant messages default to the AI mark; pass `null` to hide it. */
  avatar?: React.ReactNode
}

/** The AI mark: a gradient tile with sparkles, used as the assistant avatar. */
function ChatMessageAvatar({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="chat-message-avatar"
      aria-hidden="true"
      className={cn(
        "grid size-7 shrink-0 place-items-center overflow-hidden rounded-[6px_2px_6px_6px] bg-gradient-to-br from-brand-500 to-brand-700 text-[11px] font-semibold text-primary-foreground [&_svg]:size-3.5",
        className
      )}
      {...props}
    >
      {children ?? <Sparkles />}
    </span>
  )
}

/** One message from the user or the assistant. Rises in when it mounts. */
function ChatMessage({ role = "assistant", variant = "plain", avatar, className, children, ...props }: ChatMessageProps) {
  const isUser = role === "user"
  const av = avatar === undefined ? (isUser ? null : <ChatMessageAvatar />) : avatar
  return (
    <ChatMessageContext.Provider value={{ role, variant: variant === "bubble" ? "bubble" : undefined }}>
      <motion.div
        data-slot="chat-message"
        data-role={role}
        data-variant={variant}
        className={cn("group/msg flex min-w-0 items-start gap-3", isUser && "flex-row-reverse", className)}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={springSoft}
        style={{ transformOrigin: isUser ? "100% 100%" : "0% 100%" }}
        {...props}
      >
        {av}
        <div data-slot="chat-message-body" className={cn("flex min-w-0 flex-1 flex-col gap-2", isUser && "items-end")}>
          {children}
        </div>
      </motion.div>
    </ChatMessageContext.Provider>
  )
}

/** Sender name + time. */
function ChatMessageMeta({ name, time, className, children, ...props }: React.ComponentProps<"div"> & { name?: React.ReactNode; time?: string }) {
  return (
    <div data-slot="chat-message-meta" className={cn("flex items-center gap-2 text-[13px] font-medium text-foreground", className)} {...props}>
      {name && <b className="font-semibold">{name}</b>}
      {time && <time className="text-xs font-normal text-muted-foreground">{time}</time>}
      {children}
    </div>
  )
}

/** The message text surface — a bubble for the user (and for assistant `variant="bubble"`). */
function ChatMessageContent({ className, ...props }: React.ComponentProps<"div">) {
  const { role, variant } = React.useContext(ChatMessageContext)
  return (
    <div
      data-slot="chat-message-content"
      className={cn(
        "min-w-0 text-sm leading-6 text-foreground",
        role === "user" && "max-w-[min(85%,560px)] rounded-[16px_6px_16px_16px] bg-muted px-4 py-2.5",
        role === "assistant" && variant === "bubble" && "rounded-[6px_16px_16px_16px] border border-border bg-card px-4 py-3",
        className
      )}
      {...props}
    />
  )
}

/** Hover-revealed footer (put ChatMessageActions in here). */
function ChatMessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-message-footer"
      className={cn("-ml-1 flex items-center gap-1 opacity-80 transition-opacity group-hover/msg:opacity-100 focus-within:opacity-100", className)}
      {...props}
    />
  )
}

export interface ChatMessageStreamProps extends React.ComponentProps<"span"> {
  /** The text so far — grow it as tokens arrive; new words fade in smoothly. */
  text: string
  /** Shows a blinking caret after the last word while streaming. */
  streaming?: boolean
}

/** Streaming plain text: each newly arrived word fades and un-blurs into place. */
function ChatMessageStream({ text, streaming = false, className, ...props }: ChatMessageStreamProps) {
  const reduce = useReducedMotion()
  const words = React.useMemo(() => text.split(/(\s+)/), [text])
  return (
    <span data-slot="chat-message-stream" className={cn("whitespace-pre-wrap", className)} {...props}>
      {words.map((w, i) =>
        /^\s+$/.test(w) || reduce ? (
          <React.Fragment key={i}>{w}</React.Fragment>
        ) : (
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {w}
          </motion.span>
        )
      )}
      {streaming && (
        <motion.span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] rounded-full bg-brand"
          animate={reduce ? undefined : { opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </span>
  )
}

export { ChatMessage, ChatMessageAvatar, ChatMessageMeta, ChatMessageContent, ChatMessageFooter, ChatMessageStream }
