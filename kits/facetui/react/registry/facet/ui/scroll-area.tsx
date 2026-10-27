"use client"

import * as React from "react"
import { motion, useMotionValue, animate } from "motion/react"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease } from "@/registry/facet/lib/motion"

type Orientation = "vertical" | "horizontal" | "both"

interface ScrollAreaProps extends Omit<React.ComponentProps<typeof ScrollAreaPrimitive.Root>, "dir"> {
  orientation?: Orientation
  /** Fade the edges that still have content to scroll to. The fades come and go as you scroll. */
  fade?: boolean
  /** No border or background. */
  bare?: boolean
  /** Accessible name; the viewport is focusable so keyboard users can scroll it. */
  label?: string
  viewportClassName?: string
}

const FADE = 20

/**
 * A bounded scroll region with slim themed scrollbars that fade in on hover and thicken under the
 * pointer. Optional edge fades track the scroll position.
 */
function ScrollArea({
  className,
  viewportClassName,
  children,
  orientation = "vertical",
  fade = false,
  bare = false,
  label,
  type = "hover",
  ...props
}: ScrollAreaProps) {
  const viewport = React.useRef<HTMLDivElement>(null)
  const start = useMotionValue("0px")
  const end = useMotionValue("0px")
  const horizontal = orientation === "horizontal"

  const update = React.useCallback(() => {
    const el = viewport.current
    if (!el || !fade) return
    const pos = horizontal ? el.scrollLeft : el.scrollTop
    const max = horizontal ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight
    const t = { duration: durations.base, ease }
    animate(start, pos > 2 ? `${FADE}px` : "0px", t)
    animate(end, pos < max - 2 ? `${FADE}px` : "0px", t)
  }, [fade, horizontal, start, end])

  React.useEffect(() => {
    update()
    const el = viewport.current
    if (!el || !fade) return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    return () => ro.disconnect()
  }, [update, fade])

  const dir = horizontal ? "to right" : "to bottom"
  const mask = fade
    ? `linear-gradient(${dir}, transparent 0, #000 var(--fade-start), #000 calc(100% - var(--fade-end)), transparent 100%)`
    : undefined

  return (
    <ScrollAreaPrimitive.Root data-slot="scroll-area" type={type} asChild {...props}>
      <motion.div
        style={{ "--fade-start": start, "--fade-end": end } as React.CSSProperties & Record<string, unknown>}
        className={cn(
          "relative overflow-hidden",
          !bare && "rounded-facet-lg border border-border bg-card",
          className
        )}
      >
        <ScrollAreaPrimitive.Viewport
          ref={viewport}
          data-slot="scroll-area-viewport"
          tabIndex={0}
          aria-label={label}
          role={label ? "region" : undefined}
          onScroll={update}
          style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
          className={cn(
            "size-full rounded-[inherit] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            viewportClassName
          )}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        {orientation !== "horizontal" && <ScrollBar orientation="vertical" />}
        {orientation !== "vertical" && <ScrollBar orientation="horizontal" />}
        <ScrollAreaPrimitive.Corner />
      </motion.div>
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({ className, orientation = "vertical", ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      forceMount
      className={cn(
        "group/sb z-10 flex touch-none p-[3px] select-none transition-[opacity,width,height] duration-200 ease-out data-[state=hidden]:pointer-events-none data-[state=hidden]:opacity-0",
        orientation === "vertical" && "h-full w-2.5 hover:w-3.5",
        orientation === "horizontal" && "h-2.5 flex-col hover:h-3.5",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border-strong transition-colors group-hover/sb:bg-muted-foreground"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
