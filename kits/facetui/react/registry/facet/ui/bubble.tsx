"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springBouncy, springSoft } from "@/registry/facet/lib/motion"

type Align = "start" | "end"
const AlignContext = React.createContext<Align | null>(null)

/** Groups consecutive bubbles from one sender; `align="end"` puts them on the right. */
function BubbleGroup({ align = "start", className, ...props }: React.ComponentProps<typeof motion.div> & { align?: Align }) {
  return (
    <AlignContext.Provider value={align}>
      <motion.div
        data-slot="bubble-group"
        data-align={align}
        className={cn(
          "group/bubbles flex max-w-full flex-col gap-[3px] has-[[data-slot=bubble-reactions]]:mb-3",
          align === "end" ? "items-end" : "items-start",
          // grouped corners: following bubbles tighten the corner on the sender's side
          align === "end"
            ? "[&>[data-slot=bubble]+[data-slot=bubble]]:rounded-tr-[6px]"
            : "[&>[data-slot=bubble]+[data-slot=bubble]]:rounded-tl-[6px]",
          className
        )}
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        {...props}
      />
    </AlignContext.Provider>
  )
}

const bubbleVariants = cva("relative max-w-[min(78%,440px)] px-3.5 py-2 text-sm leading-[1.45] [overflow-wrap:anywhere] [&_p]:m-0 [&_p+p]:mt-1.5", {
  variants: {
    variant: {
      default: "bg-muted text-foreground",
      primary: "bg-primary text-primary-foreground [&_a:not([data-slot=bubble-link])]:text-inherit",
      outline: "border border-border bg-card text-foreground",
      tinted: "bg-primary-subtle text-foreground",
      ghost: "bg-transparent px-0 text-foreground",
    },
  },
  defaultVariants: { variant: "default" },
})

export interface BubbleProps extends React.ComponentProps<typeof motion.div>, VariantProps<typeof bubbleVariants> {
  /** Alignment when used outside a BubbleGroup. */
  align?: Align
}

/** A chat message surface. Springs in from its sender's side. */
function Bubble({ variant, align: alignProp, className, style, ...props }: BubbleProps) {
  const ctx = React.useContext(AlignContext)
  const align = alignProp ?? ctx ?? "start"
  const end = align === "end"
  return (
    <motion.div
      data-slot="bubble"
      data-variant={variant ?? "default"}
      className={cn(bubbleVariants({ variant }), end ? "rounded-[18px_18px_6px_18px]" : "rounded-[18px_18px_18px_6px]", className)}
      style={{ transformOrigin: end ? "100% 100%" : "0% 100%", ...style }}
      variants={{
        hidden: { opacity: 0, scale: 0.9, x: end ? 12 : -12 },
        visible: { opacity: 1, scale: 1, x: 0, transition: springSoft },
      }}
      // inside a BubbleGroup the group orchestrates (staggers) the entrance
      {...(ctx ? {} : { initial: "hidden", animate: "visible" })}
      {...props}
    />
  )
}

function BubbleMeta({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="bubble-meta" className={cn("px-1.5 text-xs text-muted-foreground", className)} {...props} />
}

/** Reaction pill pinned to the bubble's bottom edge; pops in. */
function BubbleReactions({ className, ...props }: React.ComponentProps<typeof motion.span>) {
  const align = React.useContext(AlignContext)
  return (
    <motion.span
      data-slot="bubble-reactions"
      className={cn(
        "absolute -bottom-3 inline-flex items-center gap-0.5 rounded-full border border-border bg-popover px-1.5 py-px text-[11px] font-medium text-foreground-secondary shadow-sm",
        align === "end" ? "left-2" : "right-2",
        className
      )}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...springBouncy, delay: 0.25 }}
      whileHover={{ scale: 1.08 }}
      {...props}
    />
  )
}

/** Link preview card inside a bubble. */
function BubbleLink({
  title,
  description,
  preview,
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.a>, "title"> & { title: React.ReactNode; description?: React.ReactNode; preview?: React.ReactNode }) {
  return (
    <motion.a
      data-slot="bubble-link"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={springSoft}
      className={cn(
        "mx-[-6px] mt-1.5 mb-[-2px] block overflow-hidden rounded-xl border border-border bg-card text-foreground no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {preview && <div className="aspect-[2/1] overflow-hidden">{preview}</div>}
      <div className="px-2.5 py-2">
        <b className="block text-[13px] font-semibold">{title}</b>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
    </motion.a>
  )
}

function BubbleActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="bubble-actions" className={cn("mt-2 flex flex-wrap gap-1.5", className)} {...props} />
}

/** Long content clamped to a few lines; "Show more" expands it with a height animation. */
function BubbleCollapsible({
  collapsedHeight = 70,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { collapsedHeight?: number }) {
  const [open, setOpen] = React.useState(false)
  const id = React.useId()
  return (
    <div data-slot="bubble-collapsible" className={className} {...props}>
      <motion.div
        id={id}
        className="overflow-hidden"
        initial={false}
        animate={{ height: open ? "auto" : collapsedHeight }}
        transition={springSoft}
        style={{
          maskImage: open ? "none" : "linear-gradient(#000 55%, transparent)",
          WebkitMaskImage: open ? "none" : "linear-gradient(#000 55%, transparent)",
        }}
      >
        {children}
      </motion.div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="mt-1 cursor-pointer rounded-sm border-0 bg-transparent p-0 text-xs font-medium text-inherit underline opacity-75 outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={String(open)} className="inline-block" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={spring}>
            {open ? "Show less" : "Show more"}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  )
}

export { BubbleGroup, Bubble, BubbleMeta, BubbleReactions, BubbleLink, BubbleActions, BubbleCollapsible, bubbleVariants }
