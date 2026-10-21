"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { ease, spring, springSoft } from "@/registry/facet/lib/motion"

interface FloatingTocItem {
  /** Id of the heading element this entry points at. */
  id: string
  label: React.ReactNode
  level?: 1 | 2
}

interface FloatingTocProps extends Omit<React.ComponentProps<"nav">, "onChange"> {
  items: FloatingTocItem[]
  /** Controlled active id. When omitted the active heading follows the scroll. */
  activeId?: string
  onActiveChange?: (id: string) => void
  /** Scroll container to observe (defaults to the viewport). */
  scrollRoot?: React.RefObject<HTMLElement | null>
  label?: string
}

/** Tracks which heading is closest to the top of the scroll root. */
function useActiveHeading(ids: string[], root?: React.RefObject<HTMLElement | null>) {
  const [active, setActive] = React.useState(ids[0])
  React.useEffect(() => {
    const rootEl = root?.current ?? null
    const target = rootEl ?? window
    const update = () => {
      const top = rootEl ? rootEl.getBoundingClientRect().top : 0
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top - top <= 24) current = id
      }
      // At the very bottom, the last heading wins.
      if (rootEl && rootEl.scrollTop + rootEl.clientHeight >= rootEl.scrollHeight - 2) current = ids[ids.length - 1]
      setActive(current)
    }
    update()
    target.addEventListener("scroll", update, { passive: true })
    return () => target.removeEventListener("scroll", update)
  }, [ids.join("|"), root]) // eslint-disable-line react-hooks/exhaustive-deps
  return active
}

function FloatingToc({ items, activeId, onActiveChange, scrollRoot, label = "On this page", className, ...props }: FloatingTocProps) {
  const tracked = useActiveHeading(items.map((i) => i.id), scrollRoot)
  const active = activeId ?? tracked
  const [open, setOpen] = React.useState(false)
  const lid = React.useId()

  React.useEffect(() => {
    if (activeId === undefined) onActiveChange?.(tracked)
  }, [tracked]) // eslint-disable-line react-hooks/exhaustive-deps

  const go = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    history.replaceState?.(null, "", `#${id}`)
  }

  return (
    <nav
      data-slot="floating-toc"
      data-open={open || undefined}
      aria-label={label}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") (e.currentTarget.querySelector<HTMLElement>(":focus")?.blur(), setOpen(false))
      }}
      className={cn("relative flex w-7 flex-col gap-[9px] px-1.5 py-2.5", className)}
      {...props}
    >
      {/* The bars: a decorative minimap of the headings. */}
      {items.map((it) => {
        const on = it.id === active
        return (
          <motion.span
            key={it.id}
            aria-hidden="true"
            initial={false}
            animate={{ width: on ? 18 : it.level === 2 ? 9 : 14 }}
            transition={springSoft}
            className={cn("block h-0.5 rounded-full transition-colors duration-200", on ? "bg-primary" : "bg-border-strong", it.level === 2 && "ml-[5px]")}
          />
        )
      })}

      {/* The panel holds the real links, so keyboard focus opens it. */}
      <motion.div
        data-slot="floating-toc-panel"
        initial={false}
        animate={open ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -6, scale: 0.98 }}
        transition={open ? spring : { duration: 0.14, ease }}
        style={{ transformOrigin: "left top", pointerEvents: open ? "auto" : "none" }}
        className="absolute -top-2 left-0 z-10 w-60 rounded-facet-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg"
      >
        {items.map((it) => {
          const on = it.id === active
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              aria-current={on ? "location" : undefined}
              onClick={(e) => go(e, it.id)}
              className={cn(
                "relative block rounded-facet-sm px-2 py-1.5 text-sm text-foreground-secondary no-underline outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                it.level === 2 && "pl-5 text-[13px]",
                on && "text-brand hover:text-brand"
              )}
            >
              {on && (
                <motion.span
                  layoutId={`${lid}-hl`}
                  transition={spring}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-facet-sm bg-primary-subtle"
                />
              )}
              <span className="relative">{it.label}</span>
            </a>
          )
        })}
      </motion.div>
    </nav>
  )
}

export { FloatingToc, useActiveHeading }
export type { FloatingTocItem, FloatingTocProps }
