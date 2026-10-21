"use client"

import * as React from "react"
import { AnimatePresence, LayoutGroup, motion, type PanInfo } from "motion/react"
import { Calendar, MessageSquare } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springBouncy, springSoft } from "@/registry/facet/lib/motion"

/* Types + helpers ------------------------------------------------------ */

export type KanbanItem = { id: string }
export type KanbanColumnData<T extends KanbanItem = KanbanItem> = { id: string; items: T[] }

/** Returns new columns with item `id` moved to `toColumn` at `toIndex` (index among the other items). */
export function moveKanbanItem<C extends KanbanColumnData>(columns: C[], id: string, toColumn: string, toIndex: number): C[] {
  let moving: KanbanItem | undefined
  const without = columns.map((c) => ({
    ...c,
    items: c.items.filter((it) => {
      if (it.id === id) moving = it
      return it.id !== id
    }),
  }))
  if (!moving) return columns
  const item = moving
  return without.map((c) =>
    c.id === toColumn
      ? { ...c, items: [...c.items.slice(0, toIndex), item, ...c.items.slice(Math.max(0, toIndex))] }
      : c
  )
}

type Target = { column: string; index: number }

type KanbanCtx = {
  columns: KanbanColumnData[]
  dragging: string | null
  target: Target | null
  lifted: string | null
  registerColumn: (id: string, el: HTMLElement | null) => void
  onDragStart: (id: string) => void
  onDrag: (id: string, info: PanInfo) => void
  onDragEnd: (id: string) => void
  onKey: (id: string, e: React.KeyboardEvent) => void
}

const KanbanContext = React.createContext<KanbanCtx | null>(null)

function useKanban() {
  const ctx = React.useContext(KanbanContext)
  if (!ctx) throw new Error("Kanban components must be used inside <Kanban>")
  return ctx
}

function locate(columns: KanbanColumnData[], id: string) {
  for (let c = 0; c < columns.length; c++) {
    const i = columns[c].items.findIndex((it) => it.id === id)
    if (i !== -1) return { c, i }
  }
  return null
}

/* Board ---------------------------------------------------------------- */

type KanbanProps<C extends KanbanColumnData> = Omit<React.ComponentProps<"div">, "onChange"> & {
  /** Columns with their items, in order. */
  value: C[]
  /** Called with the new columns after a drag or keyboard move. */
  onValueChange: (columns: C[]) => void
  /** Item label used in screen-reader announcements. */
  getItemLabel?: (id: string) => string
}

/**
 * Board with draggable cards. Drag with the pointer (cards lift and tilt, a line shows where they'll land,
 * the rest shift with layout animations), or focus a card and press Space to lift, arrows to move, Space to drop.
 */
function Kanban<C extends KanbanColumnData>({
  value,
  onValueChange,
  getItemLabel = (id) => id,
  className,
  children,
  ...props
}: KanbanProps<C>) {
  const columnsEl = React.useRef(new Map<string, HTMLElement>())
  const [dragging, setDragging] = React.useState<string | null>(null)
  const [target, setTarget] = React.useState<Target | null>(null)
  const [lifted, setLifted] = React.useState<string | null>(null)
  const [announcement, setAnnouncement] = React.useState("")
  const refocus = React.useRef<string | null>(null)
  const groupId = React.useId()
  const titleOf = (colId: string) =>
    columnsEl.current.get(colId)?.getAttribute("data-title") ?? colId

  React.useEffect(() => {
    if (!refocus.current) return
    const id = refocus.current
    refocus.current = null
    const el = document.querySelector<HTMLElement>(`[data-kanban-card="${CSS.escape(id)}"]`)
    el?.focus({ preventScroll: true })
  }, [value])

  const commit = (id: string, column: string, index: number) => {
    const from = locate(value, id)
    if (!from) return
    const sameSpot = value[from.c].id === column && from.i === index
    if (!sameSpot) onValueChange(moveKanbanItem(value, id, column, index))
    const col = value.find((c) => c.id === column)
    const total = (col?.items.length ?? 0) + (value[from.c].id === column ? 0 : 1)
    return `${titleOf(column)}, position ${index + 1} of ${total}`
  }

  const ctx: KanbanCtx = {
    columns: value,
    dragging,
    target,
    lifted,
    registerColumn: (id, el) => {
      if (el) columnsEl.current.set(id, el)
      else columnsEl.current.delete(id)
    },
    onDragStart: (id) => {
      setDragging(id)
      setLifted(null)
      const from = locate(value, id)
      if (from) setTarget({ column: value[from.c].id, index: from.i })
    },
    onDrag: (id, info) => {
      const x = info.point.x - window.scrollX
      const y = info.point.y - window.scrollY
      let best: { id: string; dist: number; el: HTMLElement } | null = null
      for (const [colId, el] of columnsEl.current) {
        const r = el.getBoundingClientRect()
        const dx = x < r.left ? r.left - x : x > r.right ? x - r.right : 0
        const dy = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0
        const dist = Math.hypot(dx, dy)
        if (dist < 80 && (!best || dist < best.dist)) best = { id: colId, dist, el }
      }
      if (!best) return setTarget(null)
      const cards = Array.from(best.el.querySelectorAll<HTMLElement>("[data-kanban-card]")).filter(
        (c) => c.dataset.kanbanCard !== id
      )
      let index = 0
      for (const c of cards) {
        const r = c.getBoundingClientRect()
        if (y > r.top + r.height / 2) index++
      }
      setTarget((t) => (t && t.column === best!.id && t.index === index ? t : { column: best!.id, index }))
    },
    onDragEnd: (id) => {
      if (target) {
        const where = commit(id, target.column, target.index)
        setAnnouncement(`Dropped ${getItemLabel(id)} in ${where}.`)
      }
      setDragging(null)
      setTarget(null)
    },
    onKey: (id, e) => {
      const from = locate(value, id)
      if (!from) return
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        if (lifted === id) {
          setLifted(null)
          setAnnouncement(`Dropped ${getItemLabel(id)}.`)
        } else {
          setLifted(id)
          setAnnouncement(`Lifted ${getItemLabel(id)}. Use arrow keys to move, Space to drop.`)
        }
        return
      }
      if (lifted !== id) return
      if (e.key === "Escape") {
        e.preventDefault()
        setLifted(null)
        setAnnouncement(`Dropped ${getItemLabel(id)}.`)
        return
      }
      let col = from.c
      let idx = from.i
      if (e.key === "ArrowUp") idx = Math.max(0, idx - 1)
      else if (e.key === "ArrowDown") idx = Math.min(value[col].items.length - 1, idx + 1)
      else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        col = Math.max(0, Math.min(value.length - 1, col + (e.key === "ArrowLeft" ? -1 : 1)))
        if (col === from.c) return
        idx = Math.min(idx, value[col].items.length)
      } else return
      e.preventDefault()
      if (col === from.c && idx === from.i) return
      refocus.current = id
      const where = commit(id, value[col].id, idx)
      setAnnouncement(`Moved ${getItemLabel(id)} to ${where}.`)
    },
  }

  return (
    <KanbanContext.Provider value={ctx}>
      <LayoutGroup id={groupId}>
        <div data-slot="kanban" className={cn("flex items-start gap-3", className)} {...props}>
          {children}
        </div>
      </LayoutGroup>
      <span aria-live="assertive" className="sr-only">
        {announcement}
      </span>
    </KanbanContext.Provider>
  )
}

/* Column --------------------------------------------------------------- */

type KanbanColumnProps = Omit<React.ComponentProps<"section">, "title"> & {
  id: string
  title: string
  /** Colour of the status dot (any CSS colour, e.g. var(--chart-1)). */
  color?: string
  /** Rendered under the cards (e.g. an "Add card" button). */
  footer?: React.ReactNode
}

function KanbanColumn({ id, title, color = "var(--chart-1)", footer, className, children, ...props }: KanbanColumnProps) {
  const ctx = useKanban()
  const { registerColumn } = ctx
  const ref = (el: HTMLElement | null) => registerColumn(id, el)
  const count = ctx.columns.find((c) => c.id === id)?.items.length ?? 0
  const isTarget = ctx.target?.column === id && ctx.dragging !== null
  const hasDragged = ctx.dragging !== null && ctx.columns.find((c) => c.id === id)?.items.some((it) => it.id === ctx.dragging)

  // Insert the drop line among the cards (indexes exclude the card being dragged).
  const cards = React.Children.toArray(children)
  const items: React.ReactNode[] = []
  let seen = 0
  const line = (
    <motion.div
      key="__drop-line"
      layout
      aria-hidden="true"
      className="mx-1 h-0.5 flex-none rounded-full bg-primary"
      initial={{ opacity: 0, scaleX: 0.6 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0 }}
      transition={spring}
    />
  )
  cards.forEach((child) => {
    const childId = React.isValidElement<{ id?: string }>(child) ? child.props.id : undefined
    const isDragged = childId !== undefined && childId === ctx.dragging
    if (!isDragged && isTarget && ctx.target!.index === seen) items.push(line)
    items.push(child)
    if (!isDragged) seen++
  })
  if (isTarget && ctx.target!.index >= seen) items.push(line)

  return (
    <section
      ref={ref}
      data-slot="kanban-column"
      data-title={title}
      data-over={isTarget || undefined}
      aria-label={`${title}, ${count} ${count === 1 ? "card" : "cards"}`}
      className={cn(
        "relative flex w-[280px] flex-none flex-col gap-2 rounded-facet-lg bg-subtle p-2 ring-1 ring-transparent transition-[box-shadow,background-color] duration-200",
        isTarget && "bg-primary-subtle/60 ring-primary/30",
        hasDragged && "z-10",
        className
      )}
      {...props}
    >
      <header className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-foreground">
        <span aria-hidden="true" className="size-2 rounded-full" style={{ background: color }} />
        {title}
        <span className="inline-flex h-[22px] min-w-[22px] items-center justify-center overflow-hidden rounded-facet-sm bg-muted px-1.5 text-xs font-medium text-foreground-secondary tabular-nums">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={count}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={spring}
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </span>
      </header>
      <motion.div
        className="flex min-h-14 flex-col gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSoft}
      >
        {items}
      </motion.div>
      {footer}
    </section>
  )
}

/* Card ----------------------------------------------------------------- */

const tagTones = {
  neutral: "bg-muted text-foreground-secondary",
  brand: "bg-primary-subtle text-brand",
  info: "bg-info-subtle text-info",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  danger: "bg-danger-subtle text-danger",
} as const

export type KanbanTag = { label: string; tone?: keyof typeof tagTones }

type KanbanCardProps = Omit<React.ComponentProps<typeof motion.article>, "title" | "children"> & {
  id: string
  title: React.ReactNode
  tags?: KanbanTag[]
  /** 0–100; shows a thin progress bar. */
  progress?: number
  due?: React.ReactNode
  comments?: number
  /** Initials of the assignees. */
  assignees?: string[]
  children?: React.ReactNode
}

const avatarTones = ["bg-brand-100 text-brand-800", "bg-success-subtle text-success", "bg-warning-subtle text-warning", "bg-danger-subtle text-danger"]

function KanbanCard({ id, title, tags, progress, due, comments, assignees, className, children, ...props }: KanbanCardProps) {
  const ctx = useKanban()
  const isDragging = ctx.dragging === id
  const isLifted = ctx.lifted === id

  return (
    <motion.article
      layoutId={`kanban-card-${id}`}
      layout
      data-slot="kanban-card"
      data-kanban-card={id}
      data-dragging={isDragging || undefined}
      data-lifted={isLifted || undefined}
      tabIndex={0}
      role="button"
      aria-roledescription="draggable card"
      aria-pressed={isLifted}
      drag
      dragSnapToOrigin
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => ctx.onDragStart(id)}
      onDrag={(_, info) => ctx.onDrag(id, info)}
      onDragEnd={() => ctx.onDragEnd(id)}
      onKeyDown={(e) => ctx.onKey(id, e)}
      whileHover={{ y: -1 }}
      whileDrag={{ scale: 1.03, rotate: 1.5, zIndex: 50, cursor: "grabbing" }}
      initial={false}
      animate={{ scale: isLifted ? 1.03 : 1, rotate: isLifted ? -1 : 0 }}
      transition={springSoft}
      className={cn(
        "relative flex cursor-grab touch-none flex-col gap-2.5 rounded-facet border border-border bg-card p-3 text-left shadow-xs outline-none transition-shadow duration-150 select-none hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-subtle",
        (isDragging || isLifted) && "shadow-xl ring-1 ring-primary/40",
        className
      )}
      {...props}
    >
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t.label}
              className={cn("inline-flex h-[22px] items-center rounded-facet-sm px-2 text-xs font-medium", tagTones[t.tone ?? "neutral"])}
            >
              {t.label}
            </span>
          ))}
        </div>
      )}
      <b className="text-sm leading-5 font-medium text-foreground">{title}</b>
      {progress !== undefined && (
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress"
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: durations.slow * 2, ease }}
          />
        </div>
      )}
      {children}
      {(due || comments !== undefined || assignees?.length) && (
        <footer className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-3">
            {due && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5" aria-hidden="true" /> {due}
              </span>
            )}
            {comments !== undefined && (
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="size-3.5" aria-hidden="true" /> {comments}
                <span className="sr-only">comments</span>
              </span>
            )}
          </span>
          {assignees && assignees.length > 0 && (
            <span className="inline-flex">
              {assignees.map((a, i) => (
                <span
                  key={a}
                  className={cn(
                    "grid size-6 place-items-center rounded-full text-[10px] font-semibold ring-2 ring-card",
                    i > 0 && "-ml-1.5",
                    avatarTones[(a.charCodeAt(0) + i) % avatarTones.length]
                  )}
                >
                  {a}
                </span>
              ))}
            </span>
          )}
        </footer>
      )}
      <AnimatePresence>
        {isLifted && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -top-2 -right-2 grid h-5 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={springBouncy}
          >
            ←↑↓→
          </motion.span>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

export { Kanban, KanbanColumn, KanbanCard }
