"use client"

import * as React from "react"
import { motion } from "motion/react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/facet/lib/utils"
import { spring } from "@/registry/facet/lib/motion"

const segmentVariants = cva("relative isolate inline-flex max-w-full gap-0.5 rounded-facet bg-muted p-[3px]", {
  variants: {
    size: { sm: "", md: "", lg: "" },
    block: { true: "flex w-full", false: "" },
  },
  defaultVariants: { size: "md", block: false },
})

const itemSize = {
  sm: "h-[26px] px-2.5 text-xs",
  md: "h-[30px] px-3 text-[13px]",
  lg: "h-[38px] px-3 text-sm",
}

type SegmentCtx = { value: string; id: string; size: "sm" | "md" | "lg"; tone: "neutral" | "primary"; block: boolean; iconOnly: boolean }
const SegmentContext = React.createContext<SegmentCtx>({ value: "", id: "", size: "md", tone: "neutral", block: false, iconOnly: false })

type SegmentProps = Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, "orientation"> &
  VariantProps<typeof segmentVariants> & {
    /** "primary" fills the thumb with the brand colour. */
    tone?: "neutral" | "primary"
    /** Square icon-only buttons (give each item an aria-label). */
    iconOnly?: boolean
  }

/** Segmented control: radiogroup semantics, arrow keys move the selection, the thumb slides. */
function Segment({
  className,
  size = "md",
  block = false,
  tone = "neutral",
  iconOnly = false,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  ...props
}: SegmentProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const id = React.useId()
  return (
    <SegmentContext.Provider value={{ value, id, size: size ?? "md", tone, block: !!block, iconOnly }}>
      <RadioGroupPrimitive.Root
        data-slot="segment"
        orientation="horizontal"
        loop
        value={value}
        onValueChange={(v) => {
          if (valueProp === undefined) setInner(v)
          onValueChange?.(v)
        }}
        className={cn(segmentVariants({ size, block }), className)}
        {...props}
      />
    </SegmentContext.Provider>
  )
}

function SegmentItem({ className, value, children, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const ctx = React.useContext(SegmentContext)
  const checked = ctx.value === value
  return (
    <RadioGroupPrimitive.Item
      data-slot="segment-item"
      value={value}
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[6px] font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors duration-150 select-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        itemSize[ctx.size],
        ctx.iconOnly && "aspect-square px-0",
        ctx.iconOnly && ctx.size === "md" && "w-[34px] aspect-auto",
        ctx.block && "flex-1",
        checked && (ctx.tone === "primary" ? "text-primary-foreground hover:text-primary-foreground" : "text-foreground"),
        className
      )}
      {...props}
    >
      {checked && (
        <motion.span
          aria-hidden="true"
          layoutId={`${ctx.id}-thumb`}
          transition={spring}
          className={cn(
            "absolute inset-0 -z-10 rounded-[6px] shadow-sm",
            ctx.tone === "primary" ? "bg-primary" : "bg-card ring-1 ring-border-subtle"
          )}
        />
      )}
      <motion.span className="relative inline-flex items-center gap-1.5" whileTap={{ scale: 0.94 }} transition={spring}>
        {children}
      </motion.span>
    </RadioGroupPrimitive.Item>
  )
}

export { Segment, SegmentItem, segmentVariants }
