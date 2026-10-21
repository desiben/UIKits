"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/facet/lib/utils"
import { springSoft } from "@/registry/facet/lib/motion"

const cardVariants = cva("relative flex flex-col rounded-facet-lg border bg-card text-card-foreground", {
  variants: {
    variant: {
      default: "border-border shadow-xs",
      elevated: "border-border-subtle shadow-md dark:border-border",
      ghost: "border-transparent bg-subtle",
    },
    interactive: {
      true: "cursor-pointer transition-[border-color,box-shadow] duration-200 hover:border-border-strong hover:shadow-lg",
      false: "",
    },
  },
  defaultVariants: { variant: "default", interactive: false },
})

export interface CardProps extends HTMLMotionProps<"div">, VariantProps<typeof cardVariants> {}

/**
 * Groups related content. Carries the Facet cut (sharper top-right corner).
 * `interactive` cards lift on hover and settle on press.
 */
function Card({ className, variant, interactive, ...props }: CardProps) {
  return (
    <motion.div
      data-slot="card"
      data-variant={variant ?? "default"}
      className={cn(cardVariants({ variant, interactive }), className)}
      {...(interactive ? { whileHover: { y: -3 }, whileTap: { scale: 0.99 }, transition: springSoft } : {})}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-wrap items-start gap-3 px-6 pt-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("text-[15px] leading-[22px] font-semibold", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("mt-0.5 text-sm text-muted-foreground", className)} {...props} />
}

/** Trailing slot in the header (badge, menu button). */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("ml-auto flex shrink-0 items-center gap-2", className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("p-6 text-sm", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("mt-auto flex items-center justify-end gap-2 border-t border-border-subtle px-6 py-3", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter, cardVariants }
