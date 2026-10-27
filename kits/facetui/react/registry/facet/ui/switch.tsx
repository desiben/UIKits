"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { spring } from "@/registry/facet/lib/motion"

const sizes = {
  sm: { track: "h-4 w-7", thumb: 12, travel: 12, stretch: 3 },
  md: { track: "h-5 w-9", thumb: 16, travel: 16, stretch: 4 },
} as const

export interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  size?: keyof typeof sizes
}

/** On/off switch. The thumb springs across and stretches while pressed. */
function Switch({
  className,
  size = "md",
  checked,
  defaultChecked,
  onCheckedChange,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  ...props
}: SwitchProps) {
  const [inner, setInner] = React.useState(defaultChecked ?? false)
  const [pressed, setPressed] = React.useState(false)
  const on = checked ?? inner
  const s = sizes[size]
  const width = s.thumb + (pressed ? s.stretch : 0)

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      checked={on}
      onCheckedChange={(v) => {
        setInner(v)
        onCheckedChange?.(v)
      }}
      onPointerDown={(e) => {
        setPressed(true)
        onPointerDown?.(e)
      }}
      onPointerUp={(e) => {
        setPressed(false)
        onPointerUp?.(e)
      }}
      onPointerLeave={(e) => {
        setPressed(false)
        onPointerLeave?.(e)
      }}
      className={cn(
        "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full bg-control-off p-0.5 transition-colors duration-200 outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-50",
        s.track,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb asChild>
        <motion.span
          data-slot="switch-thumb"
          className="pointer-events-none block rounded-full bg-white shadow-sm ring-0"
          style={{ height: s.thumb }}
          initial={false}
          animate={{ width, x: on ? s.travel - (width - s.thumb) : 0 }}
          transition={spring}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
