"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { MenuIcon, PanelLeftIcon, XIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springSoft } from "@/registry/facet/lib/motion"
import { Button } from "@/registry/facet/ui/button"
import { Sidebar } from "@/registry/facet/ui/sidebar"

/* ------------------------------------------------------------------------------------------------
 * Context
 * ----------------------------------------------------------------------------------------------*/

type AsideMode = "auto" | "open" | "closed"

type AppLayoutCtx = {
  variant: "default" | "inset"
  /** Desktop icon-rail state. */
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  /** Phone layout: the sidebar is a sheet. */
  mobile: boolean
  mobileNavOpen: boolean
  setMobileNavOpen: (open: boolean) => void
  /** Narrow layout: the aside is an overlay. */
  compact: boolean
  asideOpen: boolean
  setAsideOpen: (open: boolean) => void
  sidebarId: string
  asideId: string
}

const AppLayoutContext = React.createContext<AppLayoutCtx | null>(null)

function useAppLayout() {
  const ctx = React.useContext(AppLayoutContext)
  if (!ctx) throw new Error("useAppLayout must be used inside <AppLayout>")
  return ctx
}

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/* ------------------------------------------------------------------------------------------------
 * AppLayout
 * ----------------------------------------------------------------------------------------------*/

type AppLayoutProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Sidebar content — usually an <AppLayoutSidebar> with SidebarItems. */
  sidebar?: React.ReactNode
  /** Top bar — usually an <AppLayoutNavbar>. */
  navbar?: React.ReactNode
  /** Optional right panel (e.g. an assistant) — usually an <AppLayoutAside>. */
  aside?: React.ReactNode
  children?: React.ReactNode
  /** "inset" floats the body as a card on a subtle canvas. */
  variant?: "default" | "inset"
  sidebarCollapsed?: boolean
  defaultSidebarCollapsed?: boolean
  onSidebarCollapsedChange?: (collapsed: boolean) => void
  /** "auto" = open on wide layouts, closed (overlay on demand) on narrow ones. */
  asideOpen?: boolean
  defaultAside?: AsideMode
  onAsideOpenChange?: (open: boolean) => void
  /** Collapse the sidebar with ⌘B / Ctrl+B (full-page layouts). */
  shortcut?: boolean
  /** Container width under which the sidebar becomes a sheet. */
  mobileBreakpoint?: number
  /** Container width under which the aside becomes an overlay. */
  asideBreakpoint?: number
}

/**
 * Full app shell: sidebar, sticky navbar, scrolling main column and an optional aside. The sidebar
 * springs between full width and an icon rail; on narrow containers it turns into a sliding sheet
 * and the aside into an overlay. Responsive to its own width, not the viewport.
 */
function AppLayout({
  className,
  sidebar,
  navbar,
  aside,
  children,
  variant = "default",
  sidebarCollapsed: collapsedProp,
  defaultSidebarCollapsed = false,
  onSidebarCollapsedChange,
  asideOpen: asideProp,
  defaultAside = "auto",
  onAsideOpenChange,
  shortcut = false,
  mobileBreakpoint = 768,
  asideBreakpoint = 1024,
  ...props
}: AppLayoutProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(1280)
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.getBoundingClientRect().width)
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const mobile = width < mobileBreakpoint
  const compact = width < asideBreakpoint

  const [innerCollapsed, setInnerCollapsed] = React.useState(defaultSidebarCollapsed)
  const sidebarCollapsed = collapsedProp ?? innerCollapsed
  const setCollapsed = React.useCallback(
    (c: boolean) => {
      if (collapsedProp === undefined) setInnerCollapsed(c)
      onSidebarCollapsedChange?.(c)
    },
    [collapsedProp, onSidebarCollapsedChange]
  )

  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  React.useEffect(() => {
    if (!mobile) setMobileNavOpen(false)
  }, [mobile])

  const [asideMode, setAsideMode] = React.useState<AsideMode>(defaultAside)
  const asideOpen = asideProp ?? (asideMode === "auto" ? !compact : asideMode === "open")
  const setAsideOpen = React.useCallback(
    (o: boolean) => {
      if (asideProp === undefined) setAsideMode(o ? "open" : "closed")
      onAsideOpenChange?.(o)
    },
    [asideProp, onAsideOpenChange]
  )

  const toggleSidebar = React.useCallback(() => {
    if (mobile) setMobileNavOpen((o) => !o)
    else setCollapsed(!sidebarCollapsed)
  }, [mobile, setCollapsed, sidebarCollapsed])

  React.useEffect(() => {
    if (!shortcut) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [shortcut, toggleSidebar])

  const overlayOpen = (mobile && mobileNavOpen) || (compact && asideOpen && !!aside)
  React.useEffect(() => {
    if (!overlayOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setMobileNavOpen(false)
      if (compact) setAsideOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [overlayOpen, compact, setAsideOpen])

  const id = React.useId()
  const ctx: AppLayoutCtx = {
    variant,
    sidebarCollapsed,
    toggleSidebar,
    mobile,
    mobileNavOpen,
    setMobileNavOpen,
    compact,
    asideOpen,
    setAsideOpen,
    sidebarId: `${id}-sidebar`,
    asideId: `${id}-aside`,
  }
  const inset = variant === "inset"

  return (
    <AppLayoutContext.Provider value={ctx}>
      <div
        ref={ref}
        data-slot="app-layout"
        data-variant={variant}
        data-sidebar={sidebarCollapsed ? "collapsed" : "expanded"}
        data-mobile={mobile || undefined}
        className={cn(
          "relative isolate flex min-h-[480px] w-full overflow-hidden rounded-facet-xl border border-border",
          inset ? "bg-subtle" : "bg-background",
          className
        )}
        {...props}
      >
        {sidebar != null &&
          (mobile ? (
            <motion.div
              id={ctx.sidebarId}
              data-slot="app-layout-sheet"
              className="absolute inset-y-0 left-0 z-30 flex w-[280px] max-w-[86%] overflow-hidden border-r border-border bg-card shadow-2xl"
              initial={false}
              animate={{ x: mobileNavOpen ? 0 : "-102%" }}
              transition={springSoft}
              inert={!mobileNavOpen || undefined}
            >
              {sidebar}
            </motion.div>
          ) : (
            <div id={ctx.sidebarId} data-slot="app-layout-sidebar" className={cn("flex shrink-0", !inset && "border-r border-border")}>
              {sidebar}
            </div>
          ))}

        <div
          data-slot="app-layout-body"
          className={cn(
            "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-auto",
            inset && !mobile && "m-2 ml-0 rounded-facet-lg border border-border bg-card shadow-sm",
            inset && mobile && "bg-card"
          )}
        >
          {navbar}
          {children}
        </div>

        {aside != null &&
          (compact ? (
            <AnimatePresence initial={false}>
              {asideOpen && (
                <motion.aside
                  key="overlay"
                  id={ctx.asideId}
                  data-slot="app-layout-aside"
                  className="absolute inset-y-0 right-0 z-30 flex w-[min(360px,100%)] flex-col border-l border-border bg-card shadow-2xl"
                  initial={{ x: "100%" }}
                  animate={{ x: 0, transition: springSoft }}
                  exit={{ x: "100%", transition: { duration: durations.base, ease } }}
                >
                  {aside}
                </motion.aside>
              )}
            </AnimatePresence>
          ) : (
            <AnimatePresence initial={false}>
              {asideOpen && (
                <motion.aside
                  key="inline"
                  id={ctx.asideId}
                  data-slot="app-layout-aside"
                  className={cn("flex shrink-0 overflow-hidden", inset ? "my-2 mr-2 rounded-facet-lg border border-border bg-card shadow-sm" : "border-l border-border bg-card")}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1, transition: springSoft }}
                  exit={{ width: 0, opacity: 0, transition: { duration: durations.base, ease } }}
                >
                  <div className="flex w-[320px] shrink-0 flex-col">{aside}</div>
                </motion.aside>
              )}
            </AnimatePresence>
          ))}

        <AnimatePresence>
          {overlayOpen && (
            <motion.div
              key="scrim"
              data-slot="app-layout-scrim"
              aria-hidden="true"
              className="absolute inset-0 z-20 bg-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: durations.base, ease } }}
              exit={{ opacity: 0, transition: { duration: durations.fast, ease } }}
              onClick={() => {
                setMobileNavOpen(false)
                if (compact) setAsideOpen(false)
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </AppLayoutContext.Provider>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Parts
 * ----------------------------------------------------------------------------------------------*/

/** Facet Sidebar wired to the layout: collapses to the icon rail with the layout's state. */
function AppLayoutSidebar({ className, width, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sidebarCollapsed, mobile, variant } = useAppLayout()
  return (
    <Sidebar
      collapsed={!mobile && sidebarCollapsed}
      width={mobile ? 280 : width}
      className={cn(variant === "inset" && !mobile && "bg-transparent", className)}
      {...props}
    />
  )
}

/** Sticky, blurred top bar of the main column. */
function AppLayoutNavbar({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="app-layout-navbar"
      className={cn(
        "sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card/90 px-4 backdrop-blur-md",
        "[[data-mobile]_&]:px-2",
        className
      )}
      {...props}
    />
  )
}

function AppLayoutMain({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="app-layout-main"
      className={cn("flex min-w-0 flex-col gap-4 p-5 [[data-mobile]_&]:px-3 [[data-mobile]_&]:py-4", className)}
      {...props}
    />
  )
}

/** Toggles the sidebar (icon rail on desktop, sheet on phones) or the aside. */
function AppLayoutTrigger({
  target = "sidebar",
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof Button> & { target?: "sidebar" | "aside" }) {
  const ctx = useAppLayout()
  if (target === "aside") {
    return (
      <Button
        variant="ghost"
        size="sm"
        data-app-toggle="aside"
        aria-expanded={ctx.asideOpen}
        aria-controls={ctx.asideId}
        onClick={(e) => {
          ctx.setAsideOpen(!ctx.asideOpen)
          onClick?.(e)
        }}
        className={className}
        {...props}
      >
        {children}
      </Button>
    )
  }
  const label = ctx.mobile ? (ctx.mobileNavOpen ? "Close menu" : "Open menu") : ctx.sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      data-app-toggle={ctx.mobile ? "mobile" : "sidebar"}
      aria-label={label}
      title={ctx.mobile ? undefined : `${label} (⌘B)`}
      aria-expanded={ctx.mobile ? ctx.mobileNavOpen : !ctx.sidebarCollapsed}
      aria-controls={ctx.sidebarId}
      onClick={(e) => {
        ctx.toggleSidebar()
        onClick?.(e)
      }}
      className={className}
      {...props}
    >
      {children ?? (
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={ctx.mobile ? "menu" : ctx.sidebarCollapsed ? "rail" : "full"}
            className="grid place-items-center"
            initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 45 }}
            transition={spring}
          >
            {ctx.mobile ? <MenuIcon /> : <PanelLeftIcon className={cn("transition-transform", ctx.sidebarCollapsed && "-scale-x-100")} />}
          </motion.span>
        </AnimatePresence>
      )}
    </Button>
  )
}

/** Aside header with a title and a close button. */
function AppLayoutAsideHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  const { setAsideOpen } = useAppLayout()
  return (
    <div
      data-slot="app-layout-aside-header"
      className={cn("flex h-14 shrink-0 items-center gap-2 border-b border-border pr-3 pl-4 text-sm font-semibold text-foreground [&_svg]:size-4", className)}
      {...props}
    >
      {children}
      <Button variant="ghost" size="icon-sm" className="ml-auto" aria-label="Close panel" onClick={() => setAsideOpen(false)}>
        <XIcon />
      </Button>
    </div>
  )
}

function AppLayoutAsideContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="app-layout-aside-content" className={cn("flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4", className)} {...props} />
}

export {
  AppLayout,
  AppLayoutSidebar,
  AppLayoutNavbar,
  AppLayoutMain,
  AppLayoutTrigger,
  AppLayoutAsideHeader,
  AppLayoutAsideContent,
  useAppLayout,
}
