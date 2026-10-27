"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/facet/lib/utils"
import { spring } from "@/registry/facet/lib/motion"

interface InputGroupProps extends React.ComponentProps<"div"> {
  invalid?: boolean
  disabled?: boolean
}

/**
 * One bordered control holding an input (or textarea) plus addons. Focus rings the whole group and
 * the leading icon lights up and nudges toward the text.
 */
function InputGroup({ className, invalid, disabled, ...props }: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      role="group"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "group/ig relative flex min-h-9 w-full items-center overflow-hidden rounded-facet border border-input bg-card text-foreground transition-[border-color,box-shadow] duration-150 hover:border-muted-foreground",
        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 focus-within:hover:border-ring",
        "data-[invalid]:border-danger data-[invalid]:focus-within:ring-danger/25",
        "data-[disabled]:pointer-events-none data-[disabled]:border-border data-[disabled]:bg-muted data-[disabled]:text-placeholder",
        "has-[[data-align=block-start]]:flex-wrap has-[[data-align=block-end]]:flex-wrap has-[[data-align^=block]]:items-stretch",
        className
      )}
      {...props}
    />
  )
}

const addonVariants = cva(
  "flex shrink-0 cursor-text items-center gap-1.5 text-sm text-muted-foreground select-none [&>svg:not([class*='size-'])]:size-4 [&>svg]:text-placeholder [&>svg]:transition-[color,transform] [&>svg]:duration-200 group-focus-within/ig:[&>svg]:text-brand",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-2.5 group-focus-within/ig:[&>svg]:translate-x-0.5",
        "inline-end": "order-last pl-0 pr-2.5 has-[button]:pr-1",
        "block-start": "order-first basis-full border-b border-border-subtle px-2.5 py-1.5",
        "block-end": "order-last basis-full py-1.5 pl-2.5 pr-1.5",
      },
      tone: {
        default: "",
        muted: "self-stretch bg-subtle px-3 text-foreground-secondary",
      },
    },
    compoundVariants: [
      { align: "inline-start", tone: "muted", className: "border-r border-border" },
      { align: "inline-end", tone: "muted", className: "border-l border-border pr-3 pl-3" },
    ],
    defaultVariants: { align: "inline-start", tone: "default" },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  tone,
  onMouseDown,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof addonVariants>) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      data-tone={tone ?? undefined}
      className={cn(addonVariants({ align, tone }), className)}
      onMouseDown={(e) => {
        onMouseDown?.(e)
        if ((e.target as HTMLElement).closest("button, a, input, select, textarea")) return
        const field = e.currentTarget.parentElement?.querySelector<HTMLElement>("input, textarea")
        if (field) {
          e.preventDefault()
          field.focus()
        }
      }}
      {...props}
    />
  )
}

function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-control"
      className={cn(
        "h-[34px] min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-placeholder disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input-group-control"
      className={cn(
        "min-h-[76px] min-w-0 flex-1 basis-full resize-none bg-transparent px-3 py-2.5 text-sm leading-5 text-foreground outline-none placeholder:text-placeholder",
        className
      )}
      {...props}
    />
  )
}

const groupButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-facet-sm text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
      },
      size: {
        xs: "h-6 px-2",
        sm: "h-[26px] px-2.5",
        "icon-xs": "size-6",
        "icon-sm": "size-[26px]",
      },
    },
    defaultVariants: { variant: "ghost", size: "sm" },
  }
)

function InputGroupButton({
  className,
  variant,
  size,
  type = "button",
  ...props
}: HTMLMotionProps<"button"> & VariantProps<typeof groupButtonVariants>) {
  return (
    <motion.button
      data-slot="input-group-button"
      type={type}
      whileTap={{ scale: 0.92 }}
      transition={spring}
      className={cn(groupButtonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="input-group-text" className={cn("flex items-center gap-1.5 text-xs text-muted-foreground [&_svg]:size-3.5", className)} {...props} />
}

export { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea, InputGroupButton, InputGroupText }
