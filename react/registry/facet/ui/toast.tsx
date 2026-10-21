"use client"

import * as React from "react"
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react"
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springSoft } from "@/registry/facet/lib/motion"

/* -------------------------------------------------------------------------------------------------
 * Types + store
 * -----------------------------------------------------------------------------------------------*/

export type ToastTone = "default" | "success" | "warning" | "danger" | "info"

export interface ToastOptions {
  title: React.ReactNode
  description?: React.ReactNode
  tone?: ToastTone
  /** Replace the tone icon (or `null` for none). */
  icon?: React.ReactNode
  /** Auto-dismiss after ms (default 5000). `Infinity` keeps it until dismissed. */
  duration?: number
  action?: { label: React.ReactNode; onClick: () => void }
  /** Reuse an id to update a toast in place (e.g. "Saving…" → "Saved"). */
  id?: string
}

type ToastRecord = Required<Pick<ToastOptions, "id" | "tone" | "duration">> & Omit<ToastOptions, "id" | "tone" | "duration">

type ToastContextValue = {
  toast: (opts: ToastOptions | string) => string
  dismiss: (id?: string) => void
  toasts: ToastRecord[]
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

/** Fire and dismiss toasts from anywhere under <ToastProvider>. */
function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>")
  return { toast: ctx.toast, dismiss: ctx.dismiss }
}

let counter = 0

export interface ToastProviderProps {
  children?: React.ReactNode
  /** Max toasts kept in the stack (oldest drop off). Default 5. */
  limit?: number
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "bottom-center" | "top-center"
  /** Extra classes for the fixed viewport (e.g. to change the offset). */
  viewportClassName?: string
  /** Accessible name of the notifications region. */
  label?: string
}

/**
 * Lightweight toaster: wrap your app once, then call `useToast().toast({ title })`.
 * Toasts stack like a deck (newest in front), fan out on hover/focus, pause while you read,
 * and can be swiped sideways to dismiss.
 */
function ToastProvider({
  children,
  limit = 5,
  position = "bottom-right",
  viewportClassName,
  label = "Notifications",
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([])

  const dismiss = React.useCallback((id?: string) => {
    setToasts((prev) => (id ? prev.filter((t) => t.id !== id) : []))
  }, [])

  const toast = React.useCallback(
    (input: ToastOptions | string) => {
      const opts = typeof input === "string" ? { title: input } : input
      const id = opts.id ?? `toast-${++counter}`
      const rec: ToastRecord = { tone: "default", duration: 5000, ...opts, id }
      setToasts((prev) => {
        const exists = prev.some((t) => t.id === id)
        const next = exists ? prev.map((t) => (t.id === id ? rec : t)) : [rec, ...prev]
        return next.slice(0, limit)
      })
      return id
    },
    [limit]
  )

  const value = React.useMemo(() => ({ toast, dismiss, toasts }), [toast, dismiss, toasts])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport position={position} className={viewportClassName} label={label} />
    </ToastContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Viewport: positions the stack and handles expand-on-hover
 * -----------------------------------------------------------------------------------------------*/

const GAP = 8
const PEEK = 10
const VISIBLE = 3

const positionClass = {
  "bottom-right": "right-4 bottom-4 sm:right-6 sm:bottom-6",
  "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
  "top-right": "top-4 right-4 sm:top-6 sm:right-6",
  "top-left": "top-4 left-4 sm:top-6 sm:left-6",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6",
  "top-center": "top-4 left-1/2 -translate-x-1/2 sm:top-6",
}

function ToastViewport({
  position,
  className,
  label,
}: {
  position: NonNullable<ToastProviderProps["position"]>
  className?: string
  label: string
}) {
  const { toasts, dismiss } = React.useContext(ToastContext)!
  const [expanded, setExpanded] = React.useState(false)
  const [heights, setHeights] = React.useState<Record<string, number>>({})
  const fromTop = position.startsWith("top")

  React.useEffect(() => {
    if (toasts.length === 0) setExpanded(false)
  }, [toasts.length])

  const setHeight = React.useCallback((id: string, h: number) => {
    setHeights((prev) => (prev[id] === h ? prev : { ...prev, [id]: h }))
  }, [])

  const frontH = heights[toasts[0]?.id] ?? 64
  let acc = 0
  const offsets = toasts.map((t) => {
    const o = acc
    acc += (heights[t.id] ?? 64) + GAP
    return o
  })
  const stackH = toasts.length
    ? expanded
      ? acc - GAP
      : frontH + Math.min(toasts.length - 1, VISIBLE - 1) * PEEK
    : 0

  return (
    <section
      aria-label={label}
      aria-live="polite"
      aria-relevant="additions text"
      tabIndex={-1}
      className={cn("pointer-events-none fixed z-[100] w-[360px] max-w-[calc(100vw-32px)]", positionClass[position], className)}
    >
      <motion.ol
        className="pointer-events-auto relative"
        animate={{ height: stackH }}
        transition={springSoft}
        onPointerEnter={() => setExpanded(true)}
        onPointerLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setExpanded(false)
        }}
      >
        <AnimatePresence initial={false}>
          {toasts.map((t, i) => (
            <ToastItem
              key={t.id}
              toast={t}
              index={i}
              offset={offsets[i]}
              frontHeight={frontH}
              expanded={expanded}
              fromTop={fromTop}
              paused={expanded}
              onHeight={setHeight}
              onDismiss={() => dismiss(t.id)}
            />
          ))}
        </AnimatePresence>
      </motion.ol>
    </section>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Toast
 * -----------------------------------------------------------------------------------------------*/

const toneIcon = {
  default: null,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
}
const toneColor: Record<ToastTone, string> = {
  default: "[--toast-tone:var(--primary)]",
  info: "[--toast-tone:var(--info)]",
  success: "[--toast-tone:var(--success-solid)]",
  warning: "[--toast-tone:var(--warning-solid)]",
  danger: "[--toast-tone:var(--destructive)]",
}

const SWIPE = 90

function ToastItem({
  toast: t,
  index,
  offset,
  frontHeight,
  expanded,
  fromTop,
  paused,
  onHeight,
  onDismiss,
}: {
  toast: ToastRecord
  index: number
  offset: number
  frontHeight: number
  expanded: boolean
  fromTop: boolean
  paused: boolean
  onHeight: (id: string, h: number) => void
  onDismiss: () => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const dragOpacity = useTransform(x, [-220, -SWIPE, 0, SWIPE, 220], [0, 0.6, 1, 0.6, 0])

  /* measure natural height (of the unclipped inner body) */
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => onHeight(t.id, el.offsetHeight + 2 /* li border */)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [t.id, onHeight])

  /* auto-dismiss timer that pauses while the stack is expanded (hovered / focused) */
  const remaining = React.useRef(t.duration)
  React.useEffect(() => {
    remaining.current = t.duration
  }, [t.duration, t.title, t.description])
  React.useEffect(() => {
    if (paused || !Number.isFinite(remaining.current)) return
    const start = Date.now()
    const timer = window.setTimeout(onDismiss, remaining.current)
    return () => {
      window.clearTimeout(timer)
      remaining.current -= Date.now() - start
    }
  }, [paused, onDismiss, t.duration, t.title, t.description])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > SWIPE || Math.abs(info.velocity.x) > 600) {
      const dir = Math.sign(info.offset.x || info.velocity.x) || 1
      animate(x, dir * 420, { duration: durations.base, ease }).then(onDismiss)
    } else {
      animate(x, 0, spring)
    }
  }

  const hiddenBehind = !expanded && index >= VISIBLE
  const sign = fromTop ? 1 : -1
  const y = expanded ? sign * offset : sign * index * PEEK
  const scale = expanded ? 1 : 1 - index * 0.05

  const Icon = toneIcon[t.tone]
  const iconNode = t.icon !== undefined ? t.icon : Icon ? <Icon className="size-[18px]" aria-hidden="true" /> : null

  return (
    <motion.li
      role="status"
      aria-atomic="true"
      data-slot="toast"
      data-tone={t.tone}
      data-front={index === 0 || undefined}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: sign * -24, scale: 0.96 }}
      animate={{ opacity: hiddenBehind ? 0 : 1, y, scale }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, transition: { duration: durations.fast, ease } }}
      transition={springSoft}
      drag="x"
      dragMomentum={false}
      onDragEnd={onDragEnd}
      style={{
        x,
        zIndex: 100 - index,
        transformOrigin: fromTop ? "bottom center" : "top center",
        ...(fromTop ? { top: 0 } : { bottom: 0 }),
        height: !expanded && index > 0 ? frontHeight : undefined,
        pointerEvents: hiddenBehind ? "none" : undefined,
      }}
      className={cn(
        "absolute inset-x-0 cursor-grab touch-pan-y overflow-hidden rounded-facet-lg border border-border bg-popover text-popover-foreground shadow-lg select-none active:cursor-grabbing",
        toneColor[t.tone]
      )}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-[var(--toast-tone)]" />
      <motion.div ref={ref} style={{ opacity: dragOpacity }} className="flex items-start gap-3 py-3 pr-3 pl-4">
        {iconNode && <span className="mt-px inline-flex shrink-0 text-[var(--toast-tone)]">{iconNode}</span>}
        <div className="min-w-0 flex-1">
          <div className="text-sm leading-5 font-medium">{t.title}</div>
          {t.description && <div className="mt-0.5 text-[13px] leading-[18px] text-muted-foreground">{t.description}</div>}
        </div>
        {t.action && (
          <button
            type="button"
            onClick={() => {
              t.action!.onClick()
              onDismiss()
            }}
            className="h-7 shrink-0 cursor-pointer self-center rounded-facet-sm bg-secondary px-2.5 text-[13px] font-medium text-secondary-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t.action.label}
          </button>
        )}
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onDismiss}
          className="-mt-0.5 grid size-6 shrink-0 cursor-pointer place-items-center rounded-facet-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" />
        </button>
      </motion.div>
    </motion.li>
  )
}

export { ToastProvider, useToast }
