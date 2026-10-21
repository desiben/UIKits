"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"
import { Slot } from "radix-ui"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring } from "@/registry/facet/lib/motion"

/* ------------------------------------------------------------------------------------------------
 * Breadcrumb — crumbs fade/slide in as the path grows and collapse out when it shrinks
 * (wrap items in <AnimatePresence mode="popLayout">).
 * ----------------------------------------------------------------------------------------------*/

function Breadcrumb({ "aria-label": label = "Breadcrumb", ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="breadcrumb" aria-label={label} {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn("m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-[13px] font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: HTMLMotionProps<"li">) {
  return (
    <motion.li
      data-slot="breadcrumb-item"
      layout="position"
      className={cn("inline-flex items-center gap-1.5", className)}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -6, transition: { duration: durations.fast, ease } }}
      transition={spring}
      {...props}
    />
  )
}

function BreadcrumbLink({ asChild, className, ...props }: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "rounded-sm text-inherit no-underline outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" className={cn("text-foreground", className)} {...props} />
}

function BreadcrumbSeparator({ children, className, ...props }: HTMLMotionProps<"li">) {
  return (
    <motion.li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      layout="position"
      className={cn("inline-flex text-muted-foreground [&>svg]:size-3.5", className)}
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, transition: { duration: durations.fast, ease } }}
      transition={spring}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </motion.li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="breadcrumb-ellipsis" role="presentation" aria-hidden="true" className={cn("flex size-6 items-center justify-center", className)} {...props}>
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Pagination — the current-page box slides between pages.
 * ----------------------------------------------------------------------------------------------*/

const PaginationContext = React.createContext("")

function Pagination({ className, "aria-label": label = "Pagination", ...props }: React.ComponentProps<"nav">) {
  const id = React.useId()
  return (
    <PaginationContext.Provider value={id}>
      <nav data-slot="pagination" aria-label={label} className={cn("flex", className)} {...props} />
    </PaginationContext.Provider>
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("m-0 flex list-none items-center gap-1 p-0", className)} {...props} />
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

const pageBtn =
  "relative isolate inline-flex h-8 min-w-8 cursor-pointer items-center justify-center gap-1 rounded-facet px-2 text-[13px] font-medium text-foreground-secondary tabular-nums no-underline outline-none transition-colors select-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-3.5"

type PaginationLinkProps = Omit<HTMLMotionProps<"button">, "children"> & {
  isActive?: boolean
  children?: React.ReactNode
}

function PaginationLink({ className, isActive, children, ...props }: PaginationLinkProps) {
  const id = React.useContext(PaginationContext)
  return (
    <motion.button
      type="button"
      data-slot="pagination-link"
      aria-current={isActive ? "page" : undefined}
      className={cn(pageBtn, isActive && "text-foreground hover:bg-transparent", className)}
      whileTap={{ scale: 0.92 }}
      transition={spring}
      {...props}
    >
      {isActive && (
        <motion.span
          aria-hidden="true"
          layoutId={`${id}-current`}
          transition={spring}
          className="absolute inset-0 -z-10 rounded-facet border border-border-strong bg-card shadow-sm"
        />
      )}
      {children}
    </motion.button>
  )
}

function PaginationPrevious({ className, children, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Go to previous page" className={cn("px-2.5", className)} {...props}>
      <ChevronLeftIcon />
      {children ?? <span className="hidden sm:inline">Prev</span>}
    </PaginationLink>
  )
}

function PaginationNext({ className, children, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Go to next page" className={cn("px-2.5", className)} {...props}>
      {children ?? <span className="hidden sm:inline">Next</span>}
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span aria-hidden="true" data-slot="pagination-ellipsis" className={cn("flex h-8 min-w-8 items-center justify-center text-muted-foreground", className)} {...props}>
      <MoreHorizontalIcon className="size-4" />
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
