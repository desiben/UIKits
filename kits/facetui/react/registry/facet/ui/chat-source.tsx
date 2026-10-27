"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { HoverCard as HoverCardPrimitive } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { popIn, slideUp, spring, stagger } from "@/registry/facet/lib/motion"

/** Row of source chips; chips stagger in. */
function ChatSources({ className, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      data-slot="chat-sources"
      className={cn("flex flex-wrap gap-1.5", className)}
      variants={stagger(0.05)}
      initial="hidden"
      animate="visible"
      {...props}
    />
  )
}

export interface ChatSourceProps extends Omit<React.ComponentProps<typeof motion.a>, "title"> {
  title: React.ReactNode
  /** Number (or "+3") shown in the favicon circle. */
  index?: React.ReactNode
  /** Custom favicon node (e.g. an initial or an <img>). */
  favicon?: React.ReactNode
}

/** A source chip linking to where an answer came from. */
function ChatSource({ title, index, favicon, className, ...props }: ChatSourceProps) {
  return (
    <motion.a
      data-slot="chat-source"
      variants={slideUp}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "inline-flex h-7 max-w-60 items-center gap-1.5 rounded-full border border-border bg-subtle pr-2.5 pl-1 text-xs font-medium text-foreground-secondary no-underline outline-none transition-colors hover:border-border-strong hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      {...props}
    >
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-card text-[10px] font-semibold text-brand shadow-[inset_0_0_0_1px_var(--border)]">
        {favicon ?? index}
      </span>
      <span className="truncate">{title}</span>
    </motion.a>
  )
}

export interface ChatCitationProps extends Omit<React.ComponentProps<"a">, "title"> {
  index: number
  /** When given, hovering/focusing the citation previews the source. */
  title?: React.ReactNode
  description?: React.ReactNode
}

/** Inline numbered citation with an optional hover preview. */
function ChatCitation({ index, title, description, className, ...props }: ChatCitationProps) {
  const [open, setOpen] = React.useState(false)
  const anchor = (
    <motion.a
      data-slot="chat-citation"
      aria-label={`Source ${index}`}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      transition={spring}
      className={cn(
        "mx-px inline-grid h-[17px] min-w-[17px] place-items-center rounded px-1 align-[2px] text-[10px] leading-none font-semibold text-foreground-secondary no-underline outline-none transition-colors bg-muted hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...(props as React.ComponentProps<typeof motion.a>)}
    >
      {index}
    </motion.a>
  )
  if (!title) return anchor
  return (
    <HoverCardPrimitive.Root open={open} onOpenChange={setOpen} openDelay={150} closeDelay={80}>
      <HoverCardPrimitive.Trigger asChild>{anchor}</HoverCardPrimitive.Trigger>
      <AnimatePresence>
        {open && (
          <HoverCardPrimitive.Portal forceMount>
            <HoverCardPrimitive.Content forceMount asChild side="top" sideOffset={6} align="center">
              <motion.div
                variants={popIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ transformOrigin: "var(--radix-hover-card-content-transform-origin)" }}
                className="z-50 w-64 rounded-facet-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg"
              >
                <div className="flex items-center gap-2 text-[13px] font-medium">
                  <span className="grid size-5 place-items-center rounded-full bg-primary-subtle text-[10px] font-semibold text-brand">{index}</span>
                  <span className="truncate">{title}</span>
                </div>
                {description && <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{description}</p>}
              </motion.div>
            </HoverCardPrimitive.Content>
          </HoverCardPrimitive.Portal>
        )}
      </AnimatePresence>
    </HoverCardPrimitive.Root>
  )
}

export { ChatSources, ChatSource, ChatCitation }
