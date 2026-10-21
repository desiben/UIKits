"use client"

import * as React from "react"
import { motion, useAnimate } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/facet/lib/utils"
import { spring } from "@/registry/facet/lib/motion"

const inputShellVariants = cva(
  "group/input relative flex w-full items-center rounded-facet border border-input bg-card text-foreground transition-[border-color,box-shadow] duration-150 hover:border-placeholder has-[input:focus-visible]:border-ring has-[input:disabled]:cursor-not-allowed has-[input:disabled]:border-border has-[input:disabled]:bg-muted has-[input:disabled]:text-muted-foreground has-[input[aria-invalid=true]]:border-danger",
  {
    variants: {
      size: {
        sm: "h-8 text-[13px]",
        md: "h-9 text-sm",
        lg: "h-11 text-[15px]",
      },
    },
    defaultVariants: { size: "md" },
  }
)

export interface InputProps extends Omit<React.ComponentProps<"input">, "size">, VariantProps<typeof inputShellVariants> {
  /** Icon or addon rendered before the text (decorative icons should be aria-hidden). */
  leading?: React.ReactNode
  /** Icon, kbd hint or button rendered after the text. */
  trailing?: React.ReactNode
  /** Classes for the inner <input>; `className` styles the outer shell. */
  inputClassName?: string
}

/**
 * Single-line text input with Facet's control corner. On focus a 2-layer ring fades in and a brand
 * underline sweeps out from the caret side; the leading icon tints; invalid values give a short shake.
 */
function Input({ className, inputClassName, size, leading, trailing, onFocus, onBlur, ...props }: InputProps) {
  const [focused, setFocused] = React.useState(false)
  const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true"
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const wasInvalid = React.useRef(invalid)

  React.useEffect(() => {
    if (invalid && !wasInvalid.current && scope.current) {
      animate(scope.current, { x: [0, -5, 5, -3, 3, 0] }, { duration: 0.32 })
    }
    wasInvalid.current = invalid
  }, [invalid, animate, scope])

  return (
    <div ref={scope} data-slot="input-shell" data-focused={focused || undefined} className={cn(inputShellVariants({ size }), className)}>
      {/* focus ring: fades + settles in instead of snapping */}
      <motion.span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-[1px] rounded-[inherit] ring-2 ring-offset-2 ring-offset-background",
          invalid ? "ring-danger/60" : "ring-ring"
        )}
        initial={false}
        animate={{ opacity: focused ? 1 : 0, scale: focused ? 1 : 0.98 }}
        transition={spring}
      />
      {/* brand underline sweep */}
      <motion.span
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-x-2 -bottom-px h-0.5 rounded-full", invalid ? "bg-danger" : "bg-primary")}
        style={{ originX: 0 }}
        initial={false}
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
        transition={spring}
      />
      {leading != null && (
        <motion.span
          data-slot="input-leading"
          className="flex shrink-0 items-center gap-1.5 pl-2.5 text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
          animate={{ color: focused ? "var(--brand)" : "var(--muted-foreground)", scale: focused ? 1.06 : 1 }}
          transition={spring}
        >
          {leading}
        </motion.span>
      )}
      <input
        data-slot="input"
        className={cn(
          "h-full w-full min-w-0 flex-1 bg-transparent px-3 outline-none placeholder:text-placeholder disabled:cursor-not-allowed",
          "file:mr-2 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          leading != null && "pl-2",
          trailing != null && "pr-2",
          inputClassName
        )}
        onFocus={(e) => {
          setFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          onBlur?.(e)
        }}
        {...props}
      />
      {trailing != null && (
        <span
          data-slot="input-trailing"
          className="flex shrink-0 items-center gap-1.5 pr-2 text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
        >
          {trailing}
        </span>
      )}
    </div>
  )
}

/** Small keyboard hint to use as an Input `trailing` addon. */
function InputKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="input-kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-facet-sm border border-b-2 border-border bg-subtle px-1.5 font-sans text-[11px] font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input, InputKbd, inputShellVariants }
