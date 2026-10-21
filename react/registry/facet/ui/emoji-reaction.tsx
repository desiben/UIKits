"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion, type HTMLMotionProps } from "motion/react"
import { SmilePlus } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springBouncy } from "@/registry/facet/lib/motion"
import { NumberValue } from "@/registry/facet/ui/number-value"

function EmojiReactions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="emoji-reactions" role="group" className={cn("flex flex-wrap items-center gap-1.5", className)} {...props} />
}

interface EmojiReactionButtonProps extends Omit<HTMLMotionProps<"button">, "children" | "onChange"> {
  emoji: string
  count: number
  /** Whether you reacted (aria-pressed). */
  isSelected?: boolean
  /** Called with the next selected state. */
  onPress?: (selected: boolean) => void
  /** Name of the reaction for screen readers, e.g. "thumbs-up". */
  label?: string
}

type Burst = { id: number }

const PARTICLES = 7

function EmojiReactionButton({
  emoji,
  count,
  isSelected = false,
  onPress,
  label,
  className,
  onClick,
  ...props
}: EmojiReactionButtonProps) {
  const reduce = useReducedMotion()
  const [bursts, setBursts] = React.useState<Burst[]>([])
  const name = label ?? emoji

  return (
    <motion.button
      data-slot="emoji-reaction"
      type="button"
      aria-pressed={isSelected}
      aria-label={`${count} ${name} reaction${count === 1 ? "" : "s"}${isSelected ? ", including yours" : ""}`}
      onClick={(e) => {
        onClick?.(e)
        if (!isSelected && !reduce) setBursts((b) => [...b, { id: Date.now() }])
        onPress?.(!isSelected)
      }}
      whileTap={{ scale: 0.92 }}
      transition={spring}
      className={cn(
        "relative inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isSelected
          ? "border-brand-500/60 bg-primary-subtle text-brand"
          : "border-border bg-card text-foreground-secondary hover:bg-accent",
        className
      )}
      {...props}
    >
      <span className="relative inline-grid place-items-center">
        <motion.span
          key={isSelected ? "on" : "off"}
          initial={isSelected ? { scale: 0.4, rotate: -20 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={springBouncy}
          className="text-sm leading-none"
          aria-hidden="true"
        >
          {emoji}
        </motion.span>
        <AnimatePresence>
          {bursts.map((b) => (
            <span key={b.id} aria-hidden="true" className="pointer-events-none absolute inset-0">
              {Array.from({ length: PARTICLES }, (_, i) => {
                const a = (i / PARTICLES) * Math.PI * 2 - Math.PI / 2
                const dist = 18 + (i % 2) * 6
                return (
                  <motion.span
                    key={i}
                    className={cn(
                      "absolute top-1/2 left-1/2 -mt-[3px] -ml-[3px] size-1.5 rounded-full",
                      ["bg-chart-1", "bg-chart-3", "bg-chart-4", "bg-chart-2"][i % 4]
                    )}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{ x: Math.cos(a) * dist, y: Math.sin(a) * dist, scale: 0.2, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    onAnimationComplete={i === 0 ? () => setBursts((bs) => bs.filter((x) => x.id !== b.id)) : undefined}
                  />
                )
              })}
              <motion.span
                className="absolute top-1/2 left-1/2 -mt-3 -ml-3 size-6 rounded-full border-2 border-primary"
                initial={{ scale: 0.3, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </span>
          ))}
        </AnimatePresence>
      </span>
      <NumberValue value={count} aria-hidden="true" />
    </motion.button>
  )
}

/** The trailing "add reaction" button. */
function EmojiReactionAdd({ className, "aria-label": ariaLabel = "Add reaction", ...props }: HTMLMotionProps<"button">) {
  return (
    <motion.button
      data-slot="emoji-reaction-add"
      type="button"
      aria-label={ariaLabel}
      whileTap={{ scale: 0.9 }}
      whileHover={{ rotate: -8 }}
      transition={spring}
      className={cn(
        "grid size-7 cursor-pointer place-items-center rounded-full border border-border bg-card text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:size-3.5",
        className
      )}
      {...props}
    >
      <SmilePlus />
    </motion.button>
  )
}

export { EmojiReactions, EmojiReactionButton, EmojiReactionAdd }
export type { EmojiReactionButtonProps }
