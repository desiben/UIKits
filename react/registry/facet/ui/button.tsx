"use client"

import * as React from "react"
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/facet/lib/utils"
import { spring } from "@/registry/facet/lib/motion"

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-facet font-medium select-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        outline: "border border-border-strong bg-card text-foreground hover:bg-accent",
        ghost: "text-foreground hover:bg-accent",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive",
        link: "h-auto px-0.5 text-brand underline decoration-transparent underline-offset-4 hover:decoration-current",
      },
      size: {
        sm: "h-8 px-2.5 text-[13px]",
        md: "h-9 px-3.5 text-sm",
        lg: "h-11 px-[18px] text-[15px]",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0.5" }],
    defaultVariants: { variant: "primary", size: "md" },
  }
)

type Ripple = { id: number; x: number; y: number; size: number }

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode
  /** Render the child element instead of a <button> (no motion on the slot). */
  asChild?: boolean
  /** Shows a spinner and morphs the label; the button is disabled while loading. */
  loading?: boolean
  /** Text shown next to the spinner while loading (defaults to the children). */
  loadingText?: React.ReactNode
  /** Material-style ink ripple from the press point. */
  ripple?: boolean
}

function Spinner() {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="size-4"
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </motion.svg>
  )
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingText,
  ripple = false,
  disabled,
  children,
  onPointerDown,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = React.useState<Ripple[]>([])

  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...(props as React.ComponentProps<typeof Slot.Root>)}
      >
        {children}
      </Slot.Root>
    )
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (ripple) {
      const r = e.currentTarget.getBoundingClientRect()
      const size = Math.max(r.width, r.height) * 2
      setRipples((prev) => [...prev, { id: Date.now(), x: e.clientX - r.left - size / 2, y: e.clientY - r.top - size / 2, size }])
    }
    onPointerDown?.(e)
  }

  return (
    <motion.button
      data-slot="button"
      data-loading={loading || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      whileTap={{ scale: 0.97 }}
      transition={spring}
      onPointerDown={handlePointerDown}
      {...props}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {loading && (
          <motion.span
            key="spinner"
            className="inline-flex"
            initial={{ opacity: 0, scale: 0.5, width: 0 }}
            animate={{ opacity: 1, scale: 1, width: "auto" }}
            exit={{ opacity: 0, scale: 0.5, width: 0 }}
            transition={spring}
          >
            <Spinner />
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span layout="position" transition={spring} className="inline-flex items-center gap-[inherit]">
        {loading && loadingText ? loadingText : children}
      </motion.span>
      <AnimatePresence>
        {ripples.map((rp) => (
          <motion.span
            key={rp.id}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-current"
            style={{ left: rp.x, top: rp.y, width: rp.size, height: rp.size }}
            initial={{ scale: 0, opacity: 0.22 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onAnimationComplete={() => setRipples((prev) => prev.filter((p) => p.id !== rp.id))}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  )
}

export { Button, buttonVariants }
