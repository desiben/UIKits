"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowDown } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { ease, spring, springBouncy } from "@/registry/facet/lib/motion"

type ScrollerContextValue = {
  viewportRef: React.RefObject<HTMLDivElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  atBottom: boolean
  unread: number
  /** Scroll to the newest message (and resume sticking to the bottom). */
  scrollToBottom: (behavior?: ScrollBehavior) => void
  /** Scroll a message (by element id or data-message-id) into view and flash it. */
  scrollToMessage: (id: string) => void
  /** Internal: called by the viewport once it has mounted. */
  register: () => () => void
}
const ScrollerContext = React.createContext<ScrollerContextValue | null>(null)

/** Access the nearest MessageScroller: `{ atBottom, unread, scrollToBottom, scrollToMessage }`. */
function useMessageScroller() {
  const ctx = React.useContext(ScrollerContext)
  if (!ctx) throw new Error("useMessageScroller must be used inside <MessageScroller>")
  return ctx
}

export interface MessageScrollerProps extends React.ComponentProps<"div"> {
  /** Distance (px) from the bottom that still counts as "at the bottom". */
  threshold?: number
  /** Fires once per message marked `data-seen="false"` when it becomes half visible. */
  onSeen?: (id: string, el: HTMLElement) => void
}

/**
 * Scroll container for a conversation. Sticks to the bottom while replies stream, anchors
 * `data-turn` messages to the top, keeps position when `data-prepend` history is restored,
 * counts unread messages and reports `data-seen` messages.
 */
function MessageScroller({ threshold = 60, onSeen, className, children, ...props }: MessageScrollerProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [atBottom, setAtBottom] = React.useState(true)
  const [unread, setUnread] = React.useState(0)
  const stick = React.useRef(true)
  const anchored = React.useRef(false)
  const lastHeight = React.useRef(0)
  const onSeenRef = React.useRef(onSeen)
  onSeenRef.current = onSeen

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior = "smooth") => {
    const vp = viewportRef.current
    if (!vp) return
    anchored.current = false
    stick.current = true
    vp.scrollTo({ top: vp.scrollHeight, behavior })
  }, [])

  const scrollToMessage = React.useCallback((id: string) => {
    const vp = viewportRef.current
    const content = contentRef.current
    if (!vp || !content) return
    const el = (content.querySelector(`#${CSS.escape(id)}`) ?? content.querySelector(`[data-message-id="${CSS.escape(id)}"]`)) as HTMLElement | null
    if (!el) return
    anchored.current = true
    stick.current = false
    vp.scrollTo({ top: el.offsetTop - (vp.clientHeight - el.offsetHeight) / 2, behavior: "smooth" })
    el.setAttribute("data-highlight", "")
    el.animate?.(
      [
        { backgroundColor: "color-mix(in srgb, var(--primary) 16%, transparent)", borderRadius: "18px" },
        { backgroundColor: "transparent", borderRadius: "18px" },
      ],
      { duration: 1400, easing: "cubic-bezier(0.22, 1, 0.36, 1)", delay: 250 }
    ).finished.then(() => el.removeAttribute("data-highlight"), () => {})
  }, [])

  const register = React.useCallback(() => {
    const vp = viewportRef.current
    const content = contentRef.current
    if (!vp || !content) return () => {}

    const measure = () => {
      const dist = vp.scrollHeight - vp.scrollTop - vp.clientHeight
      const bottom = dist <= threshold
      setAtBottom(bottom)
      if (bottom) setUnread(0)
      return bottom
    }
    const onScroll = () => {
      stick.current = measure()
      lastHeight.current = vp.scrollHeight
    }
    const release = () => {
      anchored.current = false
    }

    // seen tracking
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                if (!e.isIntersecting) continue
                const el = e.target as HTMLElement
                el.setAttribute("data-seen", "true")
                io?.unobserve(el)
                onSeenRef.current?.(el.id || el.dataset.messageId || "", el)
              }
            },
            { root: vp, threshold: 0.5 }
          )
        : null
    const observeSeen = () => content.querySelectorAll<HTMLElement>('[data-seen="false"]').forEach((el) => io?.observe(el))

    // stick to bottom while content grows (streaming)
    const ro = new ResizeObserver(() => {
      if (stick.current && !anchored.current) vp.scrollTop = vp.scrollHeight
      lastHeight.current = vp.scrollHeight
      measure()
    })
    ro.observe(content)
    ro.observe(vp)

    // react to new messages
    const mo = new MutationObserver((records) => {
      let prepended = false
      let turn: HTMLElement | null = null
      let added = 0
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return
          if (n.hasAttribute("data-prepend")) prepended = true
          else if (n.hasAttribute("data-turn")) turn = n
          else if (n.getAttribute("role") !== "separator" && !n.hasAttribute("data-scroller-ignore")) added++
        })
      }
      if (prepended) {
        // restored history: keep the visible message where it was
        const delta = vp.scrollHeight - lastHeight.current
        if (delta > 0) vp.scrollTop += delta
      } else if (turn) {
        const el = turn as HTMLElement
        anchored.current = true
        stick.current = false
        requestAnimationFrame(() => vp.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" }))
      } else if (added && !stick.current) {
        setUnread((u) => u + added)
      }
      lastHeight.current = vp.scrollHeight
      observeSeen()
    })
    mo.observe(content, { childList: true })

    vp.addEventListener("scroll", onScroll, { passive: true })
    vp.addEventListener("wheel", release, { passive: true })
    vp.addEventListener("touchstart", release, { passive: true })
    vp.addEventListener("keydown", release)
    vp.scrollTop = vp.scrollHeight
    lastHeight.current = vp.scrollHeight
    observeSeen()
    measure()

    return () => {
      ro.disconnect()
      mo.disconnect()
      io?.disconnect()
      vp.removeEventListener("scroll", onScroll)
      vp.removeEventListener("wheel", release)
      vp.removeEventListener("touchstart", release)
      vp.removeEventListener("keydown", release)
    }
  }, [threshold])

  return (
    <ScrollerContext.Provider value={{ viewportRef, contentRef, atBottom, unread, scrollToBottom, scrollToMessage, register }}>
      <div data-slot="message-scroller" className={cn("relative flex h-full min-h-0 flex-col", className)} {...props}>
        {children}
      </div>
    </ScrollerContext.Provider>
  )
}

export interface MessageScrollerViewportProps extends React.ComponentProps<"div"> {
  /** Classes for the inner centred column. */
  contentClassName?: string
  /** Props for the inner content element (e.g. role="log"). */
  contentProps?: React.ComponentProps<"div">
}

function MessageScrollerViewport({ className, contentClassName, contentProps, children, ...props }: MessageScrollerViewportProps) {
  const { viewportRef, contentRef, register } = useMessageScroller()
  React.useLayoutEffect(() => register(), [register])
  return (
    <div
      ref={viewportRef}
      data-slot="message-scroller-viewport"
      tabIndex={0}
      className={cn(
        "relative min-h-0 flex-1 overflow-y-auto overscroll-contain outline-none [overflow-anchor:none] [scrollbar-color:var(--border-strong)_transparent] [scrollbar-width:thin] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        className
      )}
      {...props}
    >
      <div
        ref={contentRef}
        data-slot="message-scroller-content"
        {...contentProps}
        className={cn("mx-auto flex max-w-[720px] flex-col gap-3 p-4", contentClassName, contentProps?.className)}
      >
        {children}
      </div>
    </div>
  )
}

/** "Jump to latest" pill that floats in when you scroll up, with an unread count. */
function MessageScrollerJump({ className, children, ...props }: Omit<React.ComponentProps<typeof motion.button>, "children"> & { children?: React.ReactNode }) {
  const { atBottom, unread, scrollToBottom } = useMessageScroller()
  return (
    <AnimatePresence>
      {!atBottom && (
        <motion.button
          type="button"
          data-slot="message-scroller-jump"
          onClick={() => scrollToBottom()}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95, transition: { duration: 0.15, ease } }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          className={cn(
            "absolute bottom-3 left-1/2 z-10 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-border-strong bg-card px-3 text-[13px] font-medium text-foreground shadow-lg outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5",
            className
          )}
          style={{ x: "-50%" }}
          {...props}
        >
          <motion.span className="inline-flex" animate={{ y: [0, 2, 0] }} transition={{ duration: 1.4, repeat: 2, ease: "easeInOut" }}>
            <ArrowDown />
          </motion.span>
          {children ?? "Latest"}
          <AnimatePresence mode="popLayout" initial={false}>
            {unread > 0 && (
              <motion.span
                key={unread}
                className="inline-grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground tabular-nums"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={springBouncy}
                aria-label={`${unread} new`}
              >
                {unread}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export { MessageScroller, MessageScrollerViewport, MessageScrollerJump, useMessageScroller }
