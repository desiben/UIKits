import * as React from "react"
import { AnimatePresence } from "motion/react"
import { FolderOpen } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/facet/ui/breadcrumb"

const tree = ["Acme", "Projects", "Q4 Launch", "Design", "Hero banner"]
const TOTAL = 12

function pages(current: number): (number | "…")[] {
  if (current <= 3) return [1, 2, 3, 4, "…", TOTAL]
  if (current >= TOTAL - 2) return [1, "…", TOTAL - 3, TOTAL - 2, TOTAL - 1, TOTAL]
  return [1, "…", current - 1, current, current + 1, "…", TOTAL]
}

export default function BreadcrumbDemo() {
  const [depth, setDepth] = React.useState(3)
  const [page, setPage] = React.useState(2)
  const path = tree.slice(0, depth)
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <AnimatePresence mode="popLayout" initial={false}>
              {path.flatMap((name, i) => {
                const last = i === path.length - 1
                const crumb = (
                  <BreadcrumbItem key={name}>
                    {last ? (
                      <BreadcrumbPage>{name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); setDepth(i + 1) }}>{name}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                )
                return i > 0 ? [<BreadcrumbSeparator key={`${name}-sep`} />, crumb] : [crumb]
              })}
            </AnimatePresence>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-wrap gap-2">
          {tree.slice(depth, depth + 1).map((next) => (
            <button
              key={next}
              type="button"
              onClick={() => setDepth(depth + 1)}
              className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-facet border border-border bg-card px-3 text-[13px] font-medium hover:bg-accent"
            >
              <FolderOpen className="size-4 text-muted-foreground" /> Open “{next}”
            </button>
          ))}
          <span className="self-center text-xs text-muted-foreground">Click a crumb to go back up.</span>
        </div>
      </div>

      <Pagination className="justify-start">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious aria-disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))} />
          </PaginationItem>
          {pages(page).map((p, i) => (
            <PaginationItem key={`${p}-${i}`}>
              {p === "…" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink isActive={p === page} onClick={() => setPage(p)}>{p}</PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext aria-disabled={page === TOTAL} onClick={() => setPage(Math.min(TOTAL, page + 1))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
