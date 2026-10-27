"use client"

import * as React from "react"
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springBouncy, springSoft } from "@/registry/facet/lib/motion"

const alertVariants = cva(
  "relative flex gap-3 overflow-hidden rounded-facet-lg border py-4 pr-4 pl-5 text-sm text-foreground [&>svg]:mt-0.5 [&>svg]:size-[18px] [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-border bg-card [--alert-tone:var(--primary)]",
        info: "border-transparent bg-info-subtle [--alert-tone:var(--info)]",
        success: "border-transparent bg-success-subtle [--alert-tone:var(--success-solid)]",
        warning: "border-transparent bg-warning-subtle [--alert-tone:var(--warning-solid)]",
        danger: "border-transparent bg-danger-subtle [--alert-tone:var(--destructive)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const defaultIcons = {
  default: Info,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
}

export interface AlertProps
  extends Omit<HTMLMotionProps<"div">, "children" | "title">,
    VariantProps<typeof alertVariants> {
  children?: React.ReactNode
  /** Leading icon. Defaults to the tone's icon; pass `null` for none. */
  icon?: React.ReactNode
  /** Controlled visibility. Leave undefined to let the alert manage itself (with `dismissible`). */
  open?: boolean
  /** Shows a close button; the alert collapses away when pressed. */
  dismissible?: boolean
  onDismiss?: () => void
}

/**
 * Inline, persistent message with a signal rail carrying the tone. It slides in (the rail draws
 * down, the icon pops) and collapses its height when dismissed, so content below glides up.
 * role="alert" for danger, role="status" otherwise.
 */
function Alert({ className, variant, icon, open, dismissible, onDismiss, role, children, ...props }: AlertProps) {
  const [selfOpen, setSelfOpen] = React.useState(true)
  const visible = open ?? selfOpen
  const v = variant ?? "default"
  const Icon = defaultIcons[v]
  const iconNode = icon === undefined ? <Icon aria-hidden="true" /> : icon

  const dismiss = () => {
    if (open === undefined) setSelfOpen(false)
    onDismiss?.()
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="alert"
          data-slot="alert-presence"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0, transition: { duration: durations.base, ease } }}
          transition={springSoft}
          className="overflow-hidden"
        >
          <motion.div
            data-slot="alert"
            data-variant={v}
            role={role ?? (v === "danger" ? "alert" : "status")}
            initial={{ y: -6, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ scale: 0.98 }}
            transition={springSoft}
            className={cn(alertVariants({ variant }), className)}
            {...props}
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-[3px] origin-top bg-[var(--alert-tone)]"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.35, ease, delay: 0.05 }}
            />
            {iconNode && (
              <motion.span
                className="mt-0.5 inline-flex shrink-0 text-[var(--alert-tone)] [&_svg]:size-[18px]"
                initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ ...springBouncy, delay: 0.08 }}
              >
                {iconNode}
              </motion.span>
            )}
            <div className="min-w-0 flex-1">{children}</div>
            {dismissible && (
              <motion.button
                type="button"
                aria-label="Dismiss"
                onClick={dismiss}
                whileTap={{ scale: 0.9 }}
                whileHover={{ rotate: 90 }}
                transition={spring}
                className="-mt-1 -mr-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded-facet-sm text-muted-foreground outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" />
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-title" className={cn("text-sm leading-5 font-medium", className)} {...props} />
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("mt-0.5 text-sm text-foreground-secondary", className)} {...props} />
}

/** Optional row of buttons under the description. */
function AlertActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-actions" className={cn("mt-3 flex flex-wrap gap-2", className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription, AlertActions, alertVariants }
