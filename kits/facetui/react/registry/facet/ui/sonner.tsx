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
import { Info, TriangleAlert, X, CircleX } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springBouncy, springSoft } from "@/registry/facet/lib/motion"
import { Button } from "@/registry/facet/ui/button"

/* -------------------------------------------------------------------------------------------------
 * Store: a tiny module-level pub/sub so `toast()` works from anywhere (no provider needed)
 * -----------------------------------------------------------------------------------------------*/

export type ToastType = "default" | "success" | "error" | "info" | "warning" | "loading"
export type ToastId = string | number

export interface ToastAction {
  label: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export interface ExternalToast {
  /** Reuse an id to update a toast in place. */
  id?: ToastId
  description?: React.ReactNode
  /** Auto-dismiss after ms (Toaster default 4000). `Infinity` keeps it until dismissed. */
  duration?: number
  action?: ToastAction
  /** Replace the type icon (`null` hides it). */
  icon?: React.ReactNode
  /** Show the close button / allow swipe (default true). */
  dismissible?: boolean
  onDismiss?: (toast: ToastT) => void
  onAutoClose?: (toast: ToastT) => void
  className?: string
}

export interface ToastT extends ExternalToast {
  id: ToastId
  title: React.ReactNode
  type: ToastType
  /** Bumped on every update so timers restart. */
  version: number
}

type Listener = () => void

let toasts: ToastT[] = []
const listeners = new Set<Listener>()
let counter = 0

const emit = () => listeners.forEach((l) => l())
const subscribe = (l: Listener) => {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
const getSnapshot = () => toasts

function upsert(title: React.ReactNode, type: ToastType, data: ExternalToast = {}): ToastId {
  const id = data.id ?? ++counter
  const existing = toasts.find((t) => t.id === id)
  if (existing) {
    const next: ToastT = { ...existing, ...data, id, title, type, version: existing.version + 1 }
    toasts = toasts.map((t) => (t.id === id ? next : t))
  } else {
    toasts = [{ ...data, id, title, type, version: 0 }, ...toasts]
  }
  emit()
  return id
}

function dismiss(id?: ToastId) {
  const gone = id === undefined ? toasts : toasts.filter((t) => t.id === id)
  if (!gone.length) return id
  toasts = id === undefined ? [] : toasts.filter((t) => t.id !== id)
  emit()
  gone.forEach((t) => t.onDismiss?.(t))
  return id
}

type PromiseMessage<D> = React.ReactNode | ((data: D) => React.ReactNode)
export interface PromiseOptions<D> extends Omit<ExternalToast, "duration"> {
  loading: React.ReactNode
  success: PromiseMessage<D>
  error: PromiseMessage<unknown>
  /** Duration of the settled toast. */
  duration?: number
}

const resolveMsg = <D,>(m: PromiseMessage<D>, d: D) =>
  typeof m === "function" ? (m as (d: D) => React.ReactNode)(d) : m

/**
 * Fire a toast from anywhere: `toast("Event created", { description, action })`.
 * Render one `<Toaster />` somewhere in your app to show them.
 */
const toast = Object.assign(
  (message: React.ReactNode, data?: ExternalToast) => upsert(message, "default", data),
  {
    success: (message: React.ReactNode, data?: ExternalToast) => upsert(message, "success", data),
    error: (message: React.ReactNode, data?: ExternalToast) => upsert(message, "error", data),
    info: (message: React.ReactNode, data?: ExternalToast) => upsert(message, "info", data),
    warning: (message: React.ReactNode, data?: ExternalToast) => upsert(message, "warning", data),
    /** Stays until updated or dismissed. */
    loading: (message: React.ReactNode, data?: ExternalToast) =>
      upsert(message, "loading", { duration: Infinity, ...data }),
    /** Shows `loading`, then morphs into `success` or `error` when the promise settles. */
    promise: <D,>(promise: Promise<D> | (() => Promise<D>), opts: PromiseOptions<D>): ToastId => {
      const { loading, success, error, duration, ...rest } = opts
      const id = upsert(loading, "loading", { ...rest, duration: Infinity })
      const p = typeof promise === "function" ? promise() : promise
      p.then(
        (d) => {
          if (toasts.some((t) => t.id === id)) upsert(resolveMsg(success, d), "success", { ...rest, id, duration })
        },
        (e) => {
          if (toasts.some((t) => t.id === id)) upsert(resolveMsg(error, e), "error", { ...rest, id, duration })
        }
      )
      return id
    },
    /** Dismiss one toast by id, or all of them. */
    dismiss,
    /** Current toasts (read-only snapshot). */
    getToasts: () => toasts,
  }
)

/* -------------------------------------------------------------------------------------------------
 * Toaster
 * -----------------------------------------------------------------------------------------------*/

export type ToasterPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

export interface ToasterProps extends Omit<React.ComponentProps<"section">, "children"> {
  position?: ToasterPosition
  /** Keep the stack fanned out instead of expanding on hover. */
  expand?: boolean
  /** Tinted backgrounds for success / error / warning / info. */
  richColors?: boolean
  /** Show the corner close button on hover (default true). */
  closeButton?: boolean
  /** Default auto-dismiss in ms. */
  duration?: number
  /** How many toasts are visible in the stack. */
  visibleToasts?: number
  /** Space between fanned-out toasts. */
  gap?: number
  /** Render in the document flow (e.g. inside a demo card) instead of fixed to the viewport. */
  inline?: boolean
  /** Keyboard shortcut that moves focus into the region (default Alt+T). */
  hotkey?: string[]
  label?: string
}

const PEEK = 10
const SWIPE = 80

const fixedPos: Record<ToasterPosition, string> = {
  "top-left": "top-4 left-4 sm:top-6 sm:left-6",
  "top-center": "top-4 left-1/2 -translate-x-1/2 sm:top-6",
  "top-right": "top-4 right-4 sm:top-6 sm:right-6",
  "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6",
  "bottom-right": "right-4 bottom-4 sm:right-6 sm:bottom-6",
}
const inlineAlign: Record<string, string> = { left: "mr-auto", center: "mx-auto", right: "ml-auto" }

function Toaster({
  position = "bottom-right",
  expand = false,
  richColors = false,
  closeButton = true,
  duration = 4000,
  visibleToasts = 3,
  gap = 14,
  inline = false,
  hotkey = ["altKey", "KeyT"],
  label = "Notifications",
  className,
  ...props
}: ToasterProps) {
  const list = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const [hovered, setHovered] = React.useState(false)
  const [interacting, setInteracting] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)
  const [heights, setHeights] = React.useState<Record<string, number>>({})
  const listRef = React.useRef<HTMLOListElement>(null)
  const [vertical, horizontal] = position.split("-") as ["top" | "bottom", string]
  const fromTop = vertical === "top"
  const expanded = expand || hovered || interacting

  React.useEffect(() => {
    if (list.length === 0) {
      setHovered(false)
      setInteracting(false)
    }
  }, [list.length])

  /* pause everything while the tab is hidden */
  React.useEffect(() => {
    const onVis = () => setHidden(document.hidden)
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  /* hotkey focuses the region */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const hit = hotkey.every((k) => (e as unknown as Record<string, unknown>)[k] === true || e.code === k)
      if (hit) {
        listRef.current?.focus()
        setInteracting(true)
      }
      if (e.key === "Escape" && listRef.current?.contains(document.activeElement)) {
        ;(document.activeElement as HTMLElement | null)?.blur()
        setInteracting(false)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotkey.join("+")])

  const hotkeyLabel = hotkey
    .map((k) => k.replace(/Key$/, "").replace(/^Key/, "").replace(/^alt$/, "Alt").replace(/^ctrl$/, "Ctrl").replace(/^meta$/, "Meta").replace(/^shift$/, "Shift"))
    .join("+")

  const setHeight = React.useCallback((id: ToastId, h: number) => {
    setHeights((prev) => (prev[String(id)] === h ? prev : { ...prev, [String(id)]: h }))
  }, [])

  const visible = list.slice(0, visibleToasts)
  const h = (t: ToastT) => heights[String(t.id)] ?? 62
  const frontH = visible[0] ? h(visible[0]) : 0
  let acc = 0
  const offsets = visible.map((t) => {
    const o = acc
    acc += h(t) + gap
    return o
  })
  const stackH = visible.length
    ? expanded
      ? acc - gap
      : frontH + (visible.length - 1) * PEEK
    : 0

  return (
    <section
      data-slot="toaster"
      data-position={position}
      aria-label={`${label} (${hotkeyLabel})`}
      tabIndex={-1}
      className={cn(
        "pointer-events-none z-[110] w-[360px] max-w-[calc(100vw-32px)]",
        inline ? cn("relative", inlineAlign[horizontal]) : cn("fixed", fixedPos[position]),
        className
      )}
      {...props}
    >
      <motion.ol
        ref={listRef}
        tabIndex={-1}
        aria-live="polite"
        aria-relevant="additions text"
        className="pointer-events-auto relative outline-none"
        initial={false}
        animate={{ height: stackH }}
        transition={springSoft}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={() => setInteracting(true)}
        onFocus={() => setInteracting(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setInteracting(false)
        }}
      >
        <AnimatePresence initial={false}>
          {list.map((t, i) => (
            <SonnerToast
              key={t.id}
              toast={t}
              index={i}
              offset={offsets[i] ?? 0}
              frontHeight={frontH}
              expanded={expanded}
              fromTop={fromTop}
              hidden={i >= visibleToasts}
              paused={expanded || hidden || i >= visibleToasts}
              richColors={richColors}
              closeButton={closeButton}
              defaultDuration={duration}
              onHeight={setHeight}
            />
          ))}
        </AnimatePresence>
      </motion.ol>
    </section>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Icons — the type icon morphs when a toast changes type (loading → success)
 * -----------------------------------------------------------------------------------------------*/

const iconColor: Record<ToastType, string> = {
  default: "text-foreground",
  success: "text-success",
  error: "text-danger",
  info: "text-info",
  warning: "text-warning",
  loading: "text-brand",
}

function Spinner() {
  const reduce = useReducedMotion()
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ repeat: Infinity, ease: "linear", duration: 0.9 }}
    >
      <circle cx="12" cy="12" r="9" opacity={0.2} />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </motion.svg>
  )
}

function DrawnCheck() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        initial={{ pathLength: 0, rotate: -90 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: durations.slow, ease }}
        style={{ originX: "50%", originY: "50%" }}
      />
      <motion.path
        d="m8.5 12.5 2.5 2.5 4.5-5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: durations.base, ease, delay: 0.18 }}
      />
    </svg>
  )
}

function TypeIcon({ type }: { type: ToastType }) {
  switch (type) {
    case "loading":
      return <Spinner />
    case "success":
      return <DrawnCheck />
    case "error":
      return <CircleX className="size-[18px]" />
    case "warning":
      return <TriangleAlert className="size-[18px]" />
    case "info":
      return <Info className="size-[18px]" />
    default:
      return null
  }
}

/* -------------------------------------------------------------------------------------------------
 * Toast
 * -----------------------------------------------------------------------------------------------*/

const richClass: Partial<Record<ToastType, string>> = {
  success: "bg-success-subtle border-success/30",
  error: "bg-danger-subtle border-danger/30",
  warning: "bg-warning-subtle border-warning/30",
  info: "bg-info-subtle border-info/30",
}

function SonnerToast({
  toast: t,
  index,
  offset,
  frontHeight,
  expanded,
  fromTop,
  hidden,
  paused,
  richColors,
  closeButton,
  defaultDuration,
  onHeight,
}: {
  toast: ToastT
  index: number
  offset: number
  frontHeight: number
  expanded: boolean
  fromTop: boolean
  hidden: boolean
  paused: boolean
  richColors: boolean
  closeButton: boolean
  defaultDuration: number
  onHeight: (id: ToastId, h: number) => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const dragOpacity = useTransform(x, [-200, -SWIPE, 0, SWIPE, 200], [0, 0.55, 1, 0.55, 0])
  const dismissible = t.dismissible !== false
  const front = index === 0

  /* measure natural height of the content */
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => onHeight(t.id, el.offsetHeight + 2 /* border */)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [t.id, onHeight])

  /* auto-dismiss, paused while the stack is hovered/focused or the tab is hidden; restarts on update */
  const total = t.type === "loading" ? Infinity : (t.duration ?? defaultDuration)
  const remaining = React.useRef(total)
  React.useEffect(() => {
    remaining.current = total
  }, [total, t.version])
  React.useEffect(() => {
    if (paused || !Number.isFinite(remaining.current)) return
    const start = Date.now()
    const timer = window.setTimeout(() => {
      t.onAutoClose?.(t)
      toast.dismiss(t.id)
    }, remaining.current)
    return () => {
      window.clearTimeout(timer)
      remaining.current -= Date.now() - start
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, total, t.version, t.id])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > SWIPE || Math.abs(info.velocity.x) > 500) {
      const dir = Math.sign(info.offset.x || info.velocity.x) || 1
      animate(x, dir * 400, { duration: durations.base, ease }).then(() => toast.dismiss(t.id))
    } else {
      animate(x, 0, spring)
    }
  }

  const sign = fromTop ? 1 : -1
  const collapsedBehind = !expanded && !front
  const y = expanded ? sign * offset : sign * index * PEEK
  const scale = expanded ? 1 : 1 - index * 0.05
  const iconNode = t.icon !== undefined ? t.icon : <TypeIcon type={t.type} />
  const showIcon = t.icon !== null && (t.icon !== undefined || t.type !== "default")

  return (
    <motion.li
      role={t.type === "error" ? "alert" : "status"}
      aria-atomic="true"
      data-slot="sonner-toast"
      data-type={t.type}
      data-front={front || undefined}
      data-expanded={expanded || undefined}
      tabIndex={0}
      layout={false}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: sign * -28, scale: 0.96 }}
      animate={{ opacity: hidden ? 0 : 1, y, scale, height: collapsedBehind ? frontHeight : "auto" }}
      exit={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y: y + sign * -12, scale: scale * 0.96, transition: { duration: durations.fast, ease } }
      }
      transition={springSoft}
      drag={dismissible ? "x" : false}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      style={{
        x,
        zIndex: 100 - index,
        transformOrigin: fromTop ? "bottom center" : "top center",
        ...(fromTop ? { top: 0 } : { bottom: 0 }),
        pointerEvents: hidden ? "none" : undefined,
      }}
      className={cn(
        "group/toast absolute inset-x-0 rounded-facet-lg border border-border bg-popover text-popover-foreground shadow-lg outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        dismissible && "cursor-grab touch-pan-y active:cursor-grabbing",
        richColors && richClass[t.type],
        t.className
      )}
    >
      <motion.div
        ref={ref}
        className="flex items-start gap-3 py-3 pr-3 pl-4"
        style={{ opacity: dragOpacity }}
      >
        <motion.div
          className="flex min-w-0 flex-1 items-start gap-3"
          initial={false}
          animate={{ opacity: collapsedBehind ? 0 : 1 }}
          transition={{ duration: durations.fast, ease }}
        >
          {showIcon && (
            <span className={cn("relative mt-px grid size-[18px] shrink-0 place-items-center", iconColor[t.type])}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={t.type}
                  className="inline-flex"
                  initial={{ opacity: 0, scale: 0.4, filter: "blur(2px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.4, filter: "blur(2px)", transition: { duration: durations.fast } }}
                  transition={springBouncy}
                >
                  {iconNode}
                </motion.span>
              </AnimatePresence>
            </span>
          )}
          <div className="min-w-0 flex-1">
            <motion.div
              key={`title-${t.version}`}
              initial={t.version ? { opacity: 0, y: 4 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.base, ease }}
              className="text-sm leading-5 font-medium"
            >
              {t.title}
            </motion.div>
            {t.description && (
              <div className="mt-0.5 text-[13px] leading-[18px] text-muted-foreground">{t.description}</div>
            )}
          </div>
          {t.action && (
            <Button
              size="sm"
              className="h-7 self-center px-2.5 text-[13px]"
              onClick={(e) => {
                t.action!.onClick(e)
                if (!e.defaultPrevented) toast.dismiss(t.id)
              }}
            >
              {t.action.label}
            </Button>
          )}
        </motion.div>
      </motion.div>
      {closeButton && dismissible && (
        <button
          type="button"
          aria-label="Close notification"
          onClick={() => toast.dismiss(t.id)}
          className={cn(
            "absolute -top-[7px] -left-[7px] grid size-5 cursor-pointer place-items-center rounded-full border border-border bg-popover text-muted-foreground opacity-0 outline-none transition-[opacity,color,background-color] hover:bg-accent hover:text-foreground focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring",
            !collapsedBehind && "group-hover/toast:opacity-100 group-focus-within/toast:opacity-100",
            collapsedBehind && "pointer-events-none"
          )}
        >
          <X className="size-3" />
        </button>
      )}
    </motion.li>
  )
}

export { Toaster, toast }
