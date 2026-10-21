"use client"

import * as React from "react"
import { AnimatePresence, motion, type HTMLMotionProps, type Variants } from "motion/react"
import { ArrowUp, ChevronsUpDown } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springSoft } from "@/registry/facet/lib/motion"

/** Scroll container with border and the Facet cut, wrapping a real <table>. */
function Table({ className, containerClassName, ...props }: React.ComponentProps<"table"> & { containerClassName?: string }) {
  return (
    <div
      data-slot="table-container"
      className={cn("relative w-full overflow-x-auto rounded-facet-lg border border-border bg-card", containerClassName)}
    >
      <table data-slot="table" className={cn("w-full caption-bottom border-collapse text-sm", className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b [&_tr]:border-border", className)} {...props} />
}

const bodyVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
}

export interface TableBodyProps extends Omit<HTMLMotionProps<"tbody">, "children"> {
  children?: React.ReactNode
  /** Stagger rows in on mount (default true). Rows added later slide in; removed rows fade out. */
  animateRows?: boolean
}

function TableBody({ className, animateRows = true, children, ...props }: TableBodyProps) {
  return (
    <motion.tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      variants={bodyVariants}
      initial={animateRows ? "hidden" : false}
      animate="visible"
      {...props}
    >
      <AnimatePresence initial={animateRows}>
        {children}
      </AnimatePresence>
    </motion.tbody>
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t border-border bg-subtle font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  )
}

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: springSoft },
  exit: { opacity: 0, x: -12, transition: { duration: durations.fast, ease } },
}

export type TableRowProps = HTMLMotionProps<"tr">

/**
 * Body/footer row: staggers in, highlights on hover, uses the selected tint when
 * `aria-selected` / `data-state="selected"` is set, and glides to its new place when re-sorted.
 */
function TableRow({ className, ...props }: TableRowProps) {
  return (
    <motion.tr
      data-slot="table-row"
      layout="position"
      variants={rowVariants}
      exit="exit"
      transition={springSoft}
      className={cn(
        "border-b border-border-subtle transition-colors duration-150 hover:bg-subtle aria-selected:bg-primary-subtle data-[state=selected]:bg-primary-subtle",
        className
      )}
      {...props}
    />
  )
}

/** Header row (no stagger / hover). */
function TableHeadRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-head-row" className={cn("border-b border-border", className)} {...props} />
}

function TableHead({ className, numeric, ...props }: React.ComponentProps<"th"> & { numeric?: boolean }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 bg-subtle px-4 text-left align-middle text-xs font-medium whitespace-nowrap text-muted-foreground [&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pr-0",
        numeric && "text-right",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, numeric, ...props }: React.ComponentProps<"td"> & { numeric?: boolean }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "h-[52px] px-4 align-middle whitespace-nowrap [&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pr-0",
        numeric && "text-right tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("mt-3 text-[13px] text-muted-foreground", className)} {...props} />
}

export type SortDirection = "asc" | "desc" | false

export interface TableSortHeadProps extends Omit<React.ComponentProps<"th">, "onClick"> {
  direction: SortDirection
  onSort: () => void
  numeric?: boolean
}

/**
 * Sortable header: a real <button> inside a <th aria-sort>. The arrow morphs in from the
 * neutral chevrons and flips between ascending and descending.
 */
function TableSortHead({ className, direction, onSort, numeric, children, ...props }: TableSortHeadProps) {
  return (
    <TableHead
      numeric={numeric}
      aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"}
      className={className}
      {...props}
    >
      <motion.button
        type="button"
        onClick={onSort}
        whileTap={{ scale: 0.97 }}
        transition={spring}
        className={cn(
          "-mx-1.5 inline-flex cursor-pointer items-center gap-1 rounded-facet-sm px-1.5 py-1 outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
          direction && "text-foreground",
          numeric && "flex-row-reverse"
        )}
      >
        {children}
        <span className="relative inline-grid size-3.5 place-items-center" aria-hidden="true">
          <AnimatePresence initial={false} mode="popLayout">
            {direction ? (
              <motion.span
                key="arrow"
                className="inline-flex"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, rotate: direction === "desc" ? 180 : 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={spring}
              >
                <ArrowUp className="size-3.5" />
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                className="inline-flex opacity-60"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={spring}
              >
                <ChevronsUpDown className="size-3.5" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    </TableHead>
  )
}

export {
  Table,
  TableHeader,
  TableHeadRow,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableSortHead,
  TableCell,
  TableCaption,
}
