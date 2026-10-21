"use client"

import * as React from "react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { Slot } from "radix-ui"
import { ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springSoft } from "@/registry/facet/lib/motion"

type SidebarCtx = { collapsed: boolean; id: string }
const SidebarContext = React.createContext<SidebarCtx>({ collapsed: false, id: "" })

function useSidebar() {
  return React.useContext(SidebarContext)
}

type SidebarProps = Omit<React.ComponentProps<"nav">, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"> & {
  /** Icon rail mode (60px): labels hide, items centre. */
  collapsed?: boolean
  /** Expanded width in px. */
  width?: number
}

/** Primary app navigation. The active item's selection and signal rail slide between items. */
function Sidebar({ className, collapsed = false, width = 248, children, "aria-label": label = "Main", ...props }: SidebarProps) {
  const id = React.useId()
  return (
    <SidebarContext.Provider value={{ collapsed, id }}>
      <motion.nav
        data-slot="sidebar"
        data-collapsed={collapsed || undefined}
        aria-label={label}
        className={cn("flex h-full shrink-0 flex-col gap-1 overflow-x-hidden overflow-y-auto bg-card p-3", className)}
        initial={false}
        animate={{ width: collapsed ? 60 : width }}
        transition={springSoft}
        {...props}
      >
        <LayoutGroup id={id}>{children}</LayoutGroup>
      </motion.nav>
    </SidebarContext.Provider>
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" className={cn("flex flex-col gap-1 pb-1", className)} {...props} />
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" className={cn("mt-auto flex flex-col gap-1 pt-2", className)} {...props} />
}

/** Text that fades out when the sidebar collapses (kept for screen readers). */
function SidebarText({ children, className }: { children: React.ReactNode; className?: string }) {
  const { collapsed } = useSidebar()
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {collapsed ? (
        <span key="sr" className="sr-only">{children}</span>
      ) : (
        <motion.span
          key="txt"
          className={cn("min-w-0 truncate", className)}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0, transition: { duration: durations.base, ease, delay: 0.06 } }}
          exit={{ opacity: 0, transition: { duration: 0.08 } }}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function SidebarWorkspace({
  className,
  name,
  logo,
  ...props
}: React.ComponentProps<"button"> & { name: React.ReactNode; logo?: React.ReactNode }) {
  const { collapsed } = useSidebar()
  return (
    <button
      type="button"
      data-slot="sidebar-workspace"
      className={cn(
        "flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-facet p-2 text-left outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
        collapsed && "justify-center px-0",
        className
      )}
      {...props}
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-facet bg-primary text-[13px] font-semibold text-primary-foreground">{logo}</span>
      <SidebarText className="flex-1 text-sm font-semibold text-foreground">{name}</SidebarText>
      {!collapsed && <ChevronsUpDownIcon className="size-3.5 shrink-0 text-muted-foreground" />}
    </button>
  )
}

function SidebarLabel({ className, children, ...props }: React.ComponentProps<"div">) {
  const { collapsed } = useSidebar()
  return (
    <div
      data-slot="sidebar-label"
      className={cn(
        "flex h-9 items-end px-2.5 pb-1 text-[11px] font-semibold tracking-wider whitespace-nowrap text-muted-foreground uppercase",
        className
      )}
      {...props}
    >
      {collapsed ? <span aria-hidden="true" className="mx-auto mb-1.5 h-px w-5 bg-border" /> : <SidebarText>{children}</SidebarText>}
    </div>
  )
}

type SidebarItemProps = React.ComponentProps<"a"> & {
  icon?: React.ReactNode
  active?: boolean
  /** Trailing count (e.g. unread). */
  count?: React.ReactNode
  asChild?: boolean
}

function SidebarItem({ className, icon, active = false, count, asChild, children, ...props }: SidebarItemProps) {
  const { collapsed, id } = useSidebar()
  const Comp = asChild ? Slot.Root : "a"
  const text = typeof children === "string" ? children : undefined
  return (
    <Comp
      data-slot="sidebar-item"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      title={collapsed ? text : undefined}
      className={cn(
        "group/item relative isolate flex h-[34px] w-full shrink-0 cursor-pointer items-center gap-2.5 rounded-facet px-2.5 text-sm font-medium text-foreground-secondary no-underline outline-none transition-[color,transform] duration-150 select-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
        active && "text-foreground",
        collapsed && "justify-center px-0",
        className
      )}
      {...props}
    >
      <span aria-hidden="true" className="absolute inset-0 -z-20 rounded-[inherit] transition-colors group-hover/item:bg-accent" />
      {active && (
        <motion.span aria-hidden="true" layoutId={`${id}-active`} transition={spring} className="absolute inset-0 -z-10 rounded-[inherit] bg-primary-subtle">
          <span className="absolute top-2 bottom-2 -left-3 w-[3px] rounded-r-[3px] bg-primary" />
        </motion.span>
      )}
      <span className={cn("inline-flex transition-colors", active ? "text-brand" : "text-muted-foreground group-hover/item:text-foreground")}>{icon}</span>
      <SidebarText className="flex-1">{children}</SidebarText>
      {count != null && !collapsed && (
        <motion.span
          className="ml-auto text-xs font-medium text-muted-foreground tabular-nums"
          key={String(count)}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          {count}
        </motion.span>
      )}
      {count != null && collapsed && <span aria-hidden="true" className="absolute top-1.5 right-2 size-1.5 rounded-full bg-primary" />}
    </Comp>
  )
}

export { Sidebar, SidebarHeader, SidebarFooter, SidebarWorkspace, SidebarLabel, SidebarItem, SidebarText, useSidebar }
