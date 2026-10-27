"use client"

import * as React from "react"
import { AnimatePresence, motion, type HTMLMotionProps, type Variants } from "motion/react"
import { X } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springBouncy } from "@/registry/facet/lib/motion"
import { NumberValue } from "@/registry/facet/ui/number-value"

const barVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.94, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { ...spring, staggerChildren: 0.035, delayChildren: 0.04 } },
  exit: { opacity: 0, y: 16, scale: 0.96, filter: "blur(2px)", transition: { duration: durations.fast, ease } },
}

interface ActionBarProps extends Omit<HTMLMotionProps<"div">, "children"> {
  /** Shows the bar (typically `selected.size > 0`). */
  open: boolean
  /** Number of selected items. */
  count: number
  /** Called by the clear button and by Escape. */
  onClear?: () => void
  /** Word after the count (default "selected"). */
  countLabel?: string
  /** Stick to the bottom of the scroll area. */
  floating?: boolean
  children?: React.ReactNode
}

function ActionBar({
  open,
  count,
  onClear,
  countLabel = "selected",
  floating = false,
  className,
  children,
  ...props
}: ActionBarProps) {
  React.useEffect(() => {
    if (!open || !onClear) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) onClear()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClear])

  return (
    <div data-slot="action-bar-region" className={cn("pointer-events-none flex justify-center", floating && "sticky bottom-4 z-20")}>
      <span className="sr-only" aria-live="polite">
        {open ? `${count} ${countLabel}` : ""}
      </span>
      <AnimatePresence>
        {open && (
          <motion.div
            data-slot="action-bar"
            role="toolbar"
            aria-label="Bulk actions"
            variants={barVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "pointer-events-auto flex w-max max-w-[calc(100%-16px)] items-center gap-2 rounded-full bg-inverse py-1.5 pr-1.5 pl-4 text-[13px] font-medium text-inverse-foreground shadow-xl",
              className
            )}
            {...props}
          >
            <span className="mr-0.5 inline-flex items-center gap-2 border-r border-current/20 pr-2 whitespace-nowrap">
              <motion.b
                key={count}
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                transition={springBouncy}
                className="inline-grid h-[22px] min-w-[22px] place-items-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground"
              >
                <NumberValue value={count} />
              </motion.b>
              {countLabel}
            </span>
            <div className="flex items-center gap-1">
              {children}
            </div>
            {onClear && <ActionBarButton icon={<X />} aria-label="Clear selection" onClick={onClear} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ActionBarButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  icon?: React.ReactNode
  variant?: "ghost" | "destructive"
  children?: React.ReactNode
}

/** A pill button for the bar. Its label collapses to the icon on narrow screens. */
function ActionBarButton({ icon, variant = "ghost", className, children, type = "button", ...props }: ActionBarButtonProps) {
  return (
    <motion.button
      data-slot="action-bar-button"
      type={type}
      variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0, transition: spring } }}
      whileTap={{ scale: 0.94 }}
      transition={spring}
      className={cn(
        "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0",
        variant === "ghost" && "text-inherit hover:bg-current/12",
        variant === "destructive" && "bg-destructive px-3 text-destructive-foreground hover:bg-destructive/90",
        !children && "w-8 px-0",
        className
      )}
      {...props}
    >
      {icon}
      {children && <span className="max-[560px]:sr-only">{children}</span>}
    </motion.button>
  )
}

export { ActionBar, ActionBarButton }
export type { ActionBarProps, ActionBarButtonProps }
