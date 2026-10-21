"use client"

import * as React from "react"
import { AnimatePresence, motion, useAnimate } from "motion/react"
import { OTPInput, OTPInputContext } from "input-otp"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springBouncy } from "@/registry/facet/lib/motion"

type Status = "idle" | "error" | "success"
const StatusContext = React.createContext<Status>("idle")

export type InputOTPProps = React.ComponentProps<typeof OTPInput> & {
  /** "error" shakes the code and tints the slots; "success" ripples a green wave across them. */
  status?: Status
}

/** One-time code input (auto-advance, backspace, paste). Digits pop into their slots. */
function InputOTP({ className, containerClassName, status = "idle", ...props }: InputOTPProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  React.useEffect(() => {
    if (status === "error" && scope.current) animate(scope.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.36 })
  }, [status, animate, scope])

  return (
    <StatusContext.Provider value={status}>
      <div ref={scope} data-slot="input-otp-wrapper" data-status={status} className="inline-flex">
        <OTPInput
          data-slot="input-otp"
          containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
          className={cn("disabled:cursor-not-allowed", className)}
          autoComplete="one-time-code"
          {...props}
        />
      </div>
    </StatusContext.Provider>
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-group" className={cn("flex items-center gap-2", className)} {...props} />
}

function InputOTPSlot({ index, className, ...props }: React.ComponentProps<"div"> & { index: number }) {
  const ctx = React.useContext(OTPInputContext)
  const status = React.useContext(StatusContext)
  const { char, hasFakeCaret, isActive } = ctx?.slots[index] ?? {}

  return (
    <motion.div
      data-slot="input-otp-slot"
      data-active={isActive || undefined}
      className={cn(
        "relative flex h-[52px] w-11 items-center justify-center rounded-facet border border-input bg-card text-xl font-semibold text-foreground tabular-nums transition-[border-color,box-shadow,background-color] duration-150",
        isActive && "z-10 border-ring ring-2 ring-ring ring-offset-2 ring-offset-background",
        status === "error" && "border-danger ring-danger/60",
        status === "success" && "border-success-solid bg-success-subtle text-success",
        className
      )}
      animate={status === "success" ? { y: [0, -6, 0] } : { y: 0, scale: isActive ? 1.04 : 1 }}
      transition={status === "success" ? { delay: index * 0.05, duration: 0.36 } : spring}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {char && (
          <motion.span
            key={char + index}
            initial={{ y: 10, scale: 0.6, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -6, scale: 0.6, opacity: 0, transition: { duration: 0.12 } }}
            transition={springBouncy}
          >
            {char}
          </motion.span>
        )}
      </AnimatePresence>
      {hasFakeCaret && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-6 w-px animate-[facet-caret-blink_1.2s_ease-out_infinite] bg-foreground motion-reduce:animate-none" />
        </span>
      )}
    </motion.div>
  )
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" className={cn("flex items-center px-0.5", className)} {...props}>
      <span className="h-0.5 w-2.5 rounded-full bg-border-strong" />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
