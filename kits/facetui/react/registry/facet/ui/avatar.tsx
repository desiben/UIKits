"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Avatar as AvatarPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springBouncy, stagger } from "@/registry/facet/lib/motion"

const avatarVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center bg-primary-subtle font-medium text-brand",
  {
    variants: {
      size: {
        xs: "size-[22px] text-[9px] font-semibold",
        sm: "size-7 text-xs",
        md: "size-9 text-[13px]",
        lg: "size-12 text-[15px]",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-facet",
      },
    },
    defaultVariants: { size: "md", shape: "circle" },
  }
)

type Status = "online" | "away" | "busy" | "offline"
const statusColor: Record<Status, string> = {
  online: "bg-success-solid",
  away: "bg-warning-solid",
  busy: "bg-destructive",
  offline: "bg-control-off",
}

export interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  /** Presence dot in the bottom-right corner; springs in and changes colour smoothly. */
  status?: Status
}

function Avatar({ className, size, shape, status, children, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-status={status}
      className={cn(avatarVariants({ size, shape }), className)}
      {...props}
    >
      <span className={cn("absolute inset-0 overflow-hidden", shape === "square" ? "rounded-facet" : "rounded-full")}>
        {children}
      </span>
      <AnimatePresence>
        {status && (
          <motion.span
            key="status"
            data-slot="avatar-status"
            role="img"
            aria-label={status}
            className={cn(
              "absolute right-0 bottom-0 size-[28%] min-h-2 min-w-2 rounded-full ring-2 ring-card transition-colors duration-300",
              statusColor[status]
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={springBouncy}
          />
        )}
      </AnimatePresence>
    </AvatarPrimitive.Root>
  )
}

/** The image fades in once it has loaded (Radix keeps the fallback until then). */
function AvatarImage({ className, onLoadingStatusChange, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  const [loaded, setLoaded] = React.useState(false)
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "size-full object-cover transition-[opacity,scale] duration-300 ease-out",
        loaded ? "scale-100 opacity-100" : "scale-105 opacity-0",
        className
      )}
      onLoadingStatusChange={(s) => {
        setLoaded(s === "loaded")
        onLoadingStatusChange?.(s)
      }}
      {...props}
    />
  )
}

/* Written out in full so Tailwind can see the class names. */
const tints = [
  "bg-[color-mix(in_oklab,var(--chart-1)_20%,var(--card))] text-[color-mix(in_oklab,var(--chart-1)_72%,var(--foreground))]",
  "bg-[color-mix(in_oklab,var(--chart-2)_24%,var(--card))] text-[color-mix(in_oklab,var(--chart-2)_60%,var(--foreground))]",
  "bg-[color-mix(in_oklab,var(--chart-3)_22%,var(--card))] text-[color-mix(in_oklab,var(--chart-3)_60%,var(--foreground))]",
  "bg-[color-mix(in_oklab,var(--chart-4)_20%,var(--card))] text-[color-mix(in_oklab,var(--chart-4)_72%,var(--foreground))]",
  "bg-[color-mix(in_oklab,var(--success-solid)_20%,var(--card))] text-[color-mix(in_oklab,var(--success-solid)_72%,var(--foreground))]",
] as const

export interface AvatarFallbackProps extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {
  /** 1–5 picks a Facet tint; "auto" derives one from the text so each person keeps their colour. */
  tint?: 1 | 2 | 3 | 4 | 5 | "auto"
}

function hashTint(text: string) {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0
  return h % tints.length
}

function AvatarFallback({ className, tint = 1, children, ...props }: AvatarFallbackProps) {
  const idx = tint === "auto" ? hashTint(typeof children === "string" ? children : "") : tint - 1
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("flex size-full items-center justify-center", tints[idx], className)}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  )
}

export interface AvatarGroupProps extends React.ComponentProps<"div"> {
  /** Show at most this many avatars, then a "+N" counter. */
  max?: number
  size?: VariantProps<typeof avatarVariants>["size"]
}

/**
 * Overlapping stack. Avatars stagger in, the stack fans out on hover and the hovered
 * avatar lifts above its neighbours.
 */
function AvatarGroup({ className, max, size = "md", children, ...props }: AvatarGroupProps) {
  const items = React.Children.toArray(children).filter(React.isValidElement)
  const shown = max ? items.slice(0, max) : items
  const extra = items.length - shown.length
  const [hover, setHover] = React.useState(false)
  const overlap = size === "lg" ? -12 : size === "md" ? -8 : -6

  return (
    <div
      data-slot="avatar-group"
      role="group"
      className={cn("inline-flex items-center", className)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      {...props}
    >
      <motion.div className="inline-flex items-center" variants={stagger(0.04)} initial="hidden" animate="visible">
        {[...shown, ...(extra > 0 ? ["__extra"] : [])].map((child, i) => (
          <motion.span
            key={React.isValidElement(child) && child.key != null ? child.key : `a-${i}`}
            className="relative inline-flex rounded-full ring-2 ring-card transition-[margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10"
            style={{ marginLeft: i === 0 ? 0 : hover ? overlap / 2 : overlap }}
            variants={{
              hidden: { opacity: 0, x: -6, scale: 0.8 },
              visible: { opacity: 1, x: 0, scale: 1, transition: spring },
            }}
            whileHover={{ y: -3, transition: spring }}
          >
            {child === "__extra" ? (
              <Avatar size={size}>
                <AvatarFallback className="bg-muted text-foreground-secondary">+{extra}</AvatarFallback>
              </Avatar>
            ) : (
              child
            )}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, avatarVariants }
