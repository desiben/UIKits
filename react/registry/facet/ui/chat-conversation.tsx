"use client"

import * as React from "react"

import { cn } from "@/registry/facet/lib/utils"
import {
  MessageScroller,
  MessageScrollerJump,
  MessageScrollerViewport,
  useMessageScroller,
  type MessageScrollerProps,
  type MessageScrollerViewportProps,
} from "@/registry/facet/ui/message-scroller"

/**
 * The scrolling container for a chat. Built on MessageScroller: sticks to the bottom while a
 * reply streams and shows a jump-to-latest button when you scroll up.
 */
function ChatConversation({ className, ...props }: MessageScrollerProps) {
  return <MessageScroller data-slot="chat-conversation" className={cn("flex-1", className)} {...props} />
}

/** The message column (max 720px). It's a polite live log so new replies are announced. */
function ChatConversationContent({ className, contentClassName, contentProps, busy, ...props }: MessageScrollerViewportProps & { busy?: boolean }) {
  return (
    <MessageScrollerViewport
      data-slot="chat-conversation-content"
      className={className}
      contentClassName={cn("gap-5 px-4 py-5", contentClassName)}
      contentProps={{ role: "log", "aria-live": "polite", "aria-busy": busy || undefined, ...contentProps }}
      {...props}
    />
  )
}

function ChatConversationScrollButton(props: React.ComponentProps<typeof MessageScrollerJump>) {
  return <MessageScrollerJump data-slot="chat-conversation-scroll-button" {...props} />
}

export { ChatConversation, ChatConversationContent, ChatConversationScrollButton, useMessageScroller as useChatConversation }
