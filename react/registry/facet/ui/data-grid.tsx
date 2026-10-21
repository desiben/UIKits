"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { ease, spring } from "@/registry/facet/lib/motion"
import { NumberValue } from "@/registry/facet/ui/number-value"

type Row = Record<string, unknown>

interface DataGridColumn<R extends Row = Row> {
  key: keyof R & string
  header: React.ReactNode
  /** Number columns are right-aligned, formatted and parsed on edit. */
  type?: "text" | "number"
  editable?: boolean
  /** Show a live total for this column in the Σ row. */
  sum?: boolean
  /** Prefix for formatted numbers, e.g. "$". */
  prefix?: string
  /** Custom read-only rendering (badges…). */
  render?: (value: R[keyof R], row: R) => React.ReactNode
  /** Column width in px. */
  width?: number
}

interface DataGridProps<R extends Row> extends Omit<React.ComponentProps<"div">, "onChange"> {
  columns: DataGridColumn<R>[]
  rows: R[]
  /** Unique id per row (default: index). */
  getRowId?: (row: R, index: number) => string
  /** Called after a cell edit commits. */
  onCellEdit?: (rowIndex: number, key: keyof R & string, value: unknown) => void
  /** Row checkboxes in the leading column. */
  selectable?: boolean
  selectedRowIds?: string[]
  onSelectedRowIdsChange?: (ids: string[]) => void
  /** Keep the first data column pinned while scrolling sideways (default 1). */
  pinnedColumns?: 0 | 1
  /** Show the cell-reference + formula bar (default true). */
  formulaBar?: boolean
  /** Extra controls at the right of the formula bar (e.g. "+ Row"). */
  toolbar?: React.ReactNode
  /** Accessible name of the grid. */
  label?: string
  /** Scroll vertically past this height (the header stays pinned). */
  maxHeight?: number | string
}

const colLetter = (i: number) => String.fromCharCode(65 + (i % 26))
const fmt = (v: unknown, col: { type?: string; prefix?: string }) =>
  col.type === "number" && typeof v === "number" ? `${col.prefix ?? ""}${v.toLocaleString("en-US")}` : v == null ? "" : String(v)

/** Radix checkbox with a drawn checkmark / indeterminate bar. */
function GridCheckbox({ className, checked, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="data-grid-checkbox"
      checked={checked}
      className={cn(
        "peer grid size-4 shrink-0 cursor-pointer place-items-center rounded-[4px] border border-input bg-card text-primary-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
        className
      )}
      asChild
      {...props}
    >
      <motion.button whileTap={{ scale: 0.85 }} transition={spring}>
        <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <motion.path
            d="M3.5 8.5l3 3 6-7"
            initial={false}
            animate={{ pathLength: checked === true ? 1 : 0, opacity: checked === true ? 1 : 0 }}
            transition={{ duration: 0.2, ease }}
          />
          <motion.path
            d="M4 8h8"
            initial={false}
            animate={{ pathLength: checked === "indeterminate" ? 1 : 0, opacity: checked === "indeterminate" ? 1 : 0 }}
            transition={{ duration: 0.15, ease }}
          />
        </svg>
      </motion.button>
    </CheckboxPrimitive.Root>
  )
}

function DataGrid<R extends Row>({
  columns,
  rows,
  getRowId = (_r, i) => String(i),
  onCellEdit,
  selectable = false,
  selectedRowIds,
  onSelectedRowIdsChange,
  pinnedColumns = 1,
  formulaBar = true,
  toolbar,
  label = "Data grid",
  maxHeight,
  className,
  ...props
}: DataGridProps<R>) {
  const [active, setActive] = React.useState<{ r: number; c: number }>({ r: 0, c: Math.min(1, columns.length - 1) })
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const [innerSel, setInnerSel] = React.useState<string[]>([])
  const selected = new Set(selectedRowIds ?? innerSel)
  const gridRef = React.useRef<HTMLTableElement>(null)
  const id = React.useId()

  const setSelected = (ids: string[]) => {
    if (selectedRowIds === undefined) setInnerSel(ids)
    onSelectedRowIdsChange?.(ids)
  }

  const ids = rows.map(getRowId)
  const allChecked = rows.length > 0 && ids.every((i) => selected.has(i))
  const someChecked = ids.some((i) => selected.has(i))
  const hasSums = columns.some((c) => c.sum)

  const r = Math.min(active.r, rows.length - 1)
  const activeCol = columns[active.c]
  const activeVal = rows[r]?.[activeCol?.key]

  const beginEdit = (initial?: string) => {
    if (!activeCol?.editable || !rows[r]) return
    setDraft(initial ?? (activeVal == null ? "" : String(activeVal)))
    setEditing(true)
  }
  const commit = () => {
    if (!editing) return
    setEditing(false)
    const val = activeCol.type === "number" ? Number(draft.replace(/[^0-9.-]/g, "")) || 0 : draft
    if (val !== activeVal) onCellEdit?.(r, activeCol.key, val)
    gridRef.current?.focus()
  }
  const cancel = () => {
    setEditing(false)
    gridRef.current?.focus()
  }
  const move = (dr: number, dc: number) =>
    setActive((a) => ({
      r: Math.max(0, Math.min(rows.length - 1, a.r + dr)),
      c: Math.max(0, Math.min(columns.length - 1, a.c + dc)),
    }))

  const onGridKey = (e: React.KeyboardEvent) => {
    if (editing) return
    const k = e.key
    if (k === "ArrowDown") move(1, 0)
    else if (k === "ArrowUp") move(-1, 0)
    else if (k === "ArrowRight" || (k === "Tab" && !e.shiftKey && active.c < columns.length - 1)) move(0, 1)
    else if (k === "ArrowLeft" || (k === "Tab" && e.shiftKey && active.c > 0)) move(0, -1)
    else if (k === "Enter" || k === "F2") beginEdit()
    else if ((k === "Backspace" || k === "Delete") && activeCol?.editable) onCellEdit?.(r, activeCol.key, activeCol.type === "number" ? 0 : "")
    else if (k === " " && selectable && rows[r]) {
      const rid = ids[r]
      setSelected(selected.has(rid) ? [...selected].filter((x) => x !== rid) : [...selected, rid])
    } else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && activeCol?.editable) beginEdit(k)
    else return
    e.preventDefault()
  }

  const leadW = selectable ? 44 : 40
  const pinned = (ci: number) => pinnedColumns === 1 && ci === 0

  const cellBase = "h-[38px] border-r border-b border-border-subtle px-3 whitespace-nowrap text-left"

  return (
    <div
      data-slot="data-grid"
      className={cn("relative flex max-w-full flex-col overflow-hidden rounded-facet-lg border border-border bg-card", className)}
      {...props}
    >
      {formulaBar && (
        <div data-slot="data-grid-bar" className="flex flex-wrap items-center gap-2 border-b border-border bg-card p-2">
          <span className="inline-flex h-6 min-w-9 items-center justify-center rounded-full border border-border px-2 font-mono text-xs text-foreground-secondary">
            {rows.length ? `${colLetter(active.c)}${r + 2}` : "—"}
          </span>
          <span className="inline-flex h-[30px] min-w-40 flex-1 items-center gap-1.5 overflow-hidden rounded-facet-sm border border-border bg-subtle px-2.5 text-xs text-foreground-secondary">
            <i className="font-semibold text-muted-foreground">fx</i>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={`${r}-${active.c}-${editing ? draft : String(activeVal)}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.14, ease }}
                className="truncate"
              >
                {editing ? draft : activeCol ? fmt(activeVal, activeCol) : ""}
              </motion.span>
            </AnimatePresence>
          </span>
          {toolbar}
        </div>
      )}
      <div data-slot="data-grid-scroll" className="min-h-0 overflow-auto overscroll-contain" style={{ maxHeight }}>
      <table
        ref={gridRef}
        role="grid"
        aria-label={label}
        aria-rowcount={rows.length + 1 + (hasSums ? 1 : 0)}
        aria-colcount={columns.length + 1}
        aria-multiselectable={selectable || undefined}
        tabIndex={0}
        onKeyDown={onGridKey}
        className="w-full border-separate border-spacing-0 text-sm tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <thead>
          <tr aria-rowindex={1}>
            <th
              style={{ width: leadW, minWidth: leadW }}
              className={cn(cellBase, "sticky top-0 left-0 z-[3] bg-subtle px-0 text-center")}
            >
              {selectable ? (
                <span className="grid place-items-center">
                  <GridCheckbox
                    aria-label="Select all rows"
                    checked={allChecked ? true : someChecked ? "indeterminate" : false}
                    onCheckedChange={() => setSelected(allChecked ? [] : ids)}
                  />
                </span>
              ) : null}
            </th>
            {columns.map((col, ci) => (
              <th
                key={col.key}
                role="columnheader"
                aria-colindex={ci + 2}
                style={{ width: col.width, ...(pinned(ci) ? { left: leadW } : {}) }}
                className={cn(
                  cellBase,
                  "sticky top-0 z-[2] bg-subtle text-xs font-medium text-muted-foreground",
                  pinned(ci) && "z-[3]",
                  col.type === "number" && "text-right",
                  ci === active.c && "text-foreground"
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map((row, ri) => {
              const rid = ids[ri]
              const isSel = selected.has(rid)
              return (
                <motion.tr
                  key={rid}
                  aria-rowindex={ri + 2}
                  aria-selected={selectable ? isSel : undefined}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease }}
                  className={cn("group/row", isSel ? "[&>td]:bg-primary-subtle" : "[&>td]:bg-card")}
                >
                  <td
                    role="rowheader"
                    className={cn(cellBase, "sticky left-0 z-[1] px-0 text-center text-xs font-medium text-muted-foreground")}
                    style={{ width: leadW }}
                  >
                    {selectable ? (
                      <span className="grid place-items-center">
                        <GridCheckbox
                          aria-label={`Select row ${ri + 1}`}
                          checked={isSel}
                          onCheckedChange={() => setSelected(isSel ? [...selected].filter((x) => x !== rid) : [...selected, rid])}
                        />
                      </span>
                    ) : (
                      ri + 1
                    )}
                  </td>
                  {columns.map((col, ci) => {
                    const isActive = ri === r && ci === active.c
                    const v = row[col.key]
                    return (
                      <td
                        key={col.key}
                        role="gridcell"
                        aria-colindex={ci + 2}
                        aria-selected={isActive}
                        aria-readonly={!col.editable || undefined}
                        data-edit={col.editable || undefined}
                        style={pinned(ci) ? { left: leadW } : undefined}
                        onMouseDown={() => {
                          if (editing && !isActive) commit()
                          setActive({ r: ri, c: ci })
                        }}
                        onDoubleClick={() => beginEdit()}
                        className={cn(
                          cellBase,
                          "relative",
                          pinned(ci) && "sticky z-[1]",
                          col.editable && "cursor-cell hover:!bg-subtle",
                          col.type === "number" && "text-right",
                          isActive && editing && "!bg-primary-subtle p-0"
                        )}
                      >
                        {isActive && editing ? (
                          <input
                            autoFocus
                            aria-label={`Edit ${typeof col.header === "string" ? col.header : col.key}`}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onBlur={commit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") (commit(), move(1, 0), e.preventDefault())
                              else if (e.key === "Tab") (commit(), move(0, e.shiftKey ? -1 : 1), e.preventDefault())
                              else if (e.key === "Escape") (cancel(), e.preventDefault())
                            }}
                            className={cn(
                              "h-full w-full bg-transparent px-3 outline-none",
                              col.type === "number" && "text-right"
                            )}
                          />
                        ) : col.render ? (
                          col.render(v as R[keyof R], row)
                        ) : (
                          fmt(v, col)
                        )}
                        {isActive && (
                          <motion.span
                            aria-hidden="true"
                            layoutId={`${id}-cell`}
                            transition={spring}
                            className="pointer-events-none absolute inset-0 rounded-[2px] ring-2 ring-ring ring-inset"
                          />
                        )}
                      </td>
                    )
                  })}
                </motion.tr>
              )
            })}
          </AnimatePresence>
          {hasSums && (
            <tr aria-rowindex={rows.length + 2} className="[&>td]:bg-subtle">
              <td className={cn(cellBase, "sticky left-0 z-[1] px-0 text-center text-xs font-medium text-muted-foreground")}>Σ</td>
              {columns.map((col, ci) => {
                const total = col.sum ? rows.reduce((s, row) => s + (Number(row[col.key]) || 0), 0) : null
                return (
                  <td
                    key={col.key}
                    style={pinned(ci) ? { left: leadW } : undefined}
                    className={cn(cellBase, pinned(ci) && "sticky z-[1] font-semibold", col.type === "number" && "text-right", total != null && "text-brand")}
                  >
                    {total != null ? (
                      <>
                        {col.prefix}
                        <NumberValue value={total} digits={2} />
                      </>
                    ) : ci === 0 ? (
                      "Total"
                    ) : null}
                  </td>
                )
              })}
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export { DataGrid, GridCheckbox }
export type { DataGridProps, DataGridColumn }
