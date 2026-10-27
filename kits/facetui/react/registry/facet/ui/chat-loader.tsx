"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { TextShimmer } from "@/registry/facet/ui/text-shimmer"

export interface ChatLoaderProps extends React.ComponentProps<"span"> {
  /** typing: bouncing dots · shimmer: spinner + shimmering label · pulse: pulsing dot + label · spinner: spinner + label */
  variant?: "typing" | "shimmer" | "pulse" | "spinner"
  /** Accessible status text (also the visible label for shimmer / pulse / spinner). */
  label?: string
}

function TypingDots() {
  const reduce = useReducedMotion()
  return (
    <span className="inline-flex items-center gap-1 rounded-[18px_18px_18px_6px] bg-muted px-3.5 py-2.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.i
          key={i}
          className="block size-1.5 rounded-full bg-muted-foreground"
          initial={{ opacity: 0.5, y: 0 }}
          animate={reduce ? { opacity: 0.7 } : { y: [0, -4, 0, 0], opacity: [0.5, 1, 0.5, 0.5] }}
          transition={reduce ? undefined : { duration: 1.2, times: [0, 0.25, 0.5, 1], ease: "easeInOut", repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}

function LoaderSpinner({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={cn("size-3.5 text-brand", className)}
      aria-hidden="true"
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </motion.svg>
  )
}

function PulseDot({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.span
      aria-hidden="true"
      className={cn("block size-2.5 shrink-0 rounded-full bg-primary", className)}
      animate={reduce ? undefined : { scale: [1, 0.6, 1], opacity: [1, 0.6, 1] }}
      transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
    />
  )
}

/** Waiting states while the assistant works: typing dots, a shimmering status or a pulsing dot. */
function ChatLoader({ variant = "typing", label, className, children, ...props }: ChatLoaderProps) {
  const text = label ?? (variant === "typing" ? "Assistant is typing" : variant === "pulse" ? "Working" : "Thinking…")
  return (
    <span
      data-slot="chat-loader"
      data-variant={variant}
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground", className)}
      {...props}
    >
      {variant === "typing" ? (
        <>
          <TypingDots />
          <span className="sr-only">{text}</span>
        </>
      ) : variant === "shimmer" ? (
        <>
          <LoaderSpinner />
          <TextShimmer>{children ?? text}</TextShimmer>
        </>
      ) : variant === "spinner" ? (
        <>
          <LoaderSpinner />
          <span>{children ?? text}</span>
        </>
      ) : (
        <>
          <PulseDot />
          <span>{children ?? text}</span>
        </>
      )}
    </span>
  )
}

export { ChatLoader, LoaderSpinner, PulseDot }
