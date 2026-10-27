"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/facet/lib/utils"
import { slideUp, spring, stagger } from "@/registry/facet/lib/motion"

const MotionSlot = motion.create(Slot.Root)

const itemCardVariants = cva(
  "group/item-card flex min-w-0 items-center gap-3 rounded-facet-lg border px-4 py-3 text-left text-foreground no-underline",
  {
    variants: {
      variant: {
        default: "border-border bg-card",
        secondary: "border-transparent bg-subtle",
        tertiary: "border-transparent bg-muted",
        outline: "border-border bg-transparent",
        transparent: "border-transparent bg-transparent",
      },
      pressable: {
        true: "w-full cursor-pointer outline-none transition-colors duration-150 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        false: "",
      },
    },
    defaultVariants: { variant: "default", pressable: false },
  }
)

export interface ItemCardProps extends HTMLMotionProps<"div">, Omit<VariantProps<typeof itemCardVariants>, "pressable"> {
  /** Hover tint + press scale. Set automatically when `asChild` renders a link/button. */
  pressable?: boolean
  /** Render your own <a> / <button> as the card (styles and motion merge onto it; pressable by default). */
  asChild?: boolean
}

/**
 * A horizontal row card: icon, title, description and a trailing action. Pressable cards tint on
 * hover, settle on press and nudge their trailing chevron. Cards in an <ItemCardGroup> stagger in.
 */
function ItemCard({ className, variant, pressable, asChild, ...props }: ItemCardProps) {
  const isPressable = pressable ?? !!asChild
  const Comp = asChild ? MotionSlot : motion.div
  return (
    <Comp
      data-slot="item-card"
      data-variant={variant ?? "default"}
      data-pressable={isPressable || undefined}
      variants={slideUp}
      {...(isPressable ? { whileTap: { scale: 0.99 }, transition: spring } : {})}
      className={cn(itemCardVariants({ variant, pressable: isPressable }), className)}
      {...props}
    />
  )
}

function ItemCardIcon({ className, tone = "neutral", ...props }: React.ComponentProps<"span"> & { tone?: "neutral" | "brand" }) {
  return (
    <span
      data-slot="item-card-icon"
      aria-hidden="true"
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-facet transition-transform duration-200 group-hover/item-card:scale-105 [&_svg]:size-[18px]",
        tone === "brand" ? "bg-primary-subtle text-brand" : "bg-muted text-foreground",
        className
      )}
      {...props}
    />
  )
}

function ItemCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-card-content" className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)} {...props} />
}

function ItemCardTitle({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="item-card-title" className={cn("truncate text-sm font-medium", className)} {...props} />
}

function ItemCardDescription({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="item-card-description" className={cn("text-[13px] text-muted-foreground", className)} {...props} />
}

/** Trailing slot. A lone svg (chevron) slides right on hover of a pressable card. */
function ItemCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-card-action"
      className={cn(
        "flex shrink-0 items-center gap-2 text-muted-foreground [&>svg]:size-4 [&>svg]:transition-transform [&>svg]:duration-200 group-hover/item-card:[&>svg]:translate-x-0.5",
        className
      )}
      {...props}
    />
  )
}

export interface ItemCardGroupProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode
  /** Uppercase overline above the cards. */
  label?: React.ReactNode
  /** Joins the cards into one bordered list with dividers. */
  joined?: boolean
}

function ItemCardGroup({ className, label, joined, children, ...props }: ItemCardGroupProps) {
  return (
    <motion.div
      data-slot="item-card-group"
      data-joined={joined || undefined}
      role="group"
      variants={stagger(0.05)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn(
        "flex flex-col",
        joined
          ? "overflow-hidden rounded-facet-lg border border-border bg-card [&>[data-slot=item-card]]:rounded-none [&>[data-slot=item-card]]:border-0 [&>[data-slot=item-card]]:bg-transparent [&>[data-slot=item-card]+[data-slot=item-card]]:border-t [&>[data-slot=item-card]+[data-slot=item-card]]:border-border-subtle"
          : "gap-2",
        className
      )}
      {...props}
    >
      {label && (
        <div className={cn("text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase", joined ? "px-4 pt-3 pb-1" : "px-1")}>
          {label}
        </div>
      )}
      {children}
    </motion.div>
  )
}

export {
  ItemCard,
  ItemCardIcon,
  ItemCardContent,
  ItemCardTitle,
  ItemCardDescription,
  ItemCardAction,
  ItemCardGroup,
  itemCardVariants,
}
