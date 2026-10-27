"use client"

import * as React from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react"

import { cn } from "@/registry/facet/lib/utils"

interface HoloCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  /** Card background (any CSS background). Defaults to a deep brand gradient. */
  gradient?: string
  /** Max tilt in degrees (default 14). */
  tilt?: number
  /** Turn off tilt and glare. */
  static?: boolean
  children?: React.ReactNode
}

const tiltSpring = { stiffness: 220, damping: 20, mass: 0.6 }

/* The holographic foil: a rainbow band that slides with the pointer (colour-dodge blended). */
const FOIL =
  "repeating-linear-gradient(115deg, hsl(320 100% 74%) 0%, hsl(188 100% 74%) 8%, hsl(95 100% 74%) 16%, hsl(40 100% 74%) 24%, hsl(320 100% 74%) 32%)"

function HoloCard({ gradient, tilt = 14, static: isStatic = false, className, style, children, ...props }: HoloCardProps) {
  const reduce = useReducedMotion()
  const flat = isStatic || !!reduce

  // Pointer position, 0..1 across the card.
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, tiltSpring)
  const sy = useSpring(py, tiltSpring)
  const hover = useSpring(0, { stiffness: 200, damping: 24 })

  const rotateX = useTransform(sy, [0, 1], [tilt, -tilt])
  const rotateY = useTransform(sx, [0, 1], [-tilt, tilt])
  const mx = useTransform(sx, (v) => `${v * 100}%`)
  const my = useTransform(sy, (v) => `${v * 100}%`)
  const foilOpacity = useTransform(hover, [0, 1], [0.14, 0.32])
  const foilPos = useMotionTemplate`${mx} ${my}`
  const glare = useMotionTemplate`radial-gradient(260px circle at ${mx} ${my}, rgb(255 255 255 / 0.5), transparent 55%)`
  const shadowX = useTransform(sx, [0, 1], [14, -14])
  const shadowY = useTransform(sy, [0, 1], [14, -6])
  const shadow = useMotionTemplate`${shadowX}px ${shadowY}px 40px -12px rgb(0 0 0 / 0.45)`

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (flat) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
    hover.set(0)
  }

  return (
    <motion.div
      data-slot="holo-card"
      data-static={flat || undefined}
      onPointerMove={onMove}
      onPointerEnter={() => !flat && hover.set(1)}
      onPointerLeave={reset}
      className={cn("aspect-[1.586] w-80 max-w-full [perspective:900px]", className)}
      style={style}
      {...props}
    >
      <motion.div
        data-slot="holo-surface"
        style={{
          rotateX: flat ? 0 : rotateX,
          rotateY: flat ? 0 : rotateY,
          boxShadow: flat ? "0 18px 40px -16px rgb(0 0 0 / 0.45)" : shadow,
          background: gradient ?? "linear-gradient(135deg, var(--brand-950), var(--brand-700) 45%, var(--brand-900))",
          transformStyle: "preserve-3d",
        }}
        className="relative flex size-full flex-col justify-between overflow-hidden rounded-facet-2xl p-5 text-white"
      >
        {!flat && (
          <>
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mix-blend-color-dodge saturate-[1.2]"
              style={{ backgroundImage: FOIL, backgroundSize: "220% 220%", backgroundPosition: foilPos, opacity: foilOpacity }}
            />
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mix-blend-overlay"
              style={{ backgroundImage: glare, opacity: hover }}
            />
          </>
        )}
        <span aria-hidden="true" className="pointer-events-none absolute inset-1.5 z-[1] rounded-[inherit] border border-white/20" />
        {children}
      </motion.div>
    </motion.div>
  )
}

/** A layer that floats above the foil (translateZ) — wrap each row of card content. */
function HoloCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="holo-card-content" className={cn("relative z-[2] [transform:translateZ(24px)]", className)} {...props} />
}

/** EMV-style chip. */
function HoloCardChip({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="holo-card-chip"
      aria-hidden="true"
      className={cn(
        "block h-[30px] w-10 rounded-md bg-linear-135 from-chart-3 to-warning-solid shadow-[inset_0_0_0_1px_rgb(0_0_0/0.2)]",
        className
      )}
      {...props}
    />
  )
}

/** Large tracked number / name line. */
function HoloCardNumber({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="holo-card-number" className={cn("text-lg leading-none font-medium tracking-[0.16em] tabular-nums", className)} {...props} />
}

export { HoloCard, HoloCardContent, HoloCardChip, HoloCardNumber }
export type { HoloCardProps }
