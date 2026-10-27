"use client"

import * as React from "react"
import { LayoutGroup, motion, useAnimate } from "motion/react"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring } from "@/registry/facet/lib/motion"

/* ------------------------------------------------------------------------------------------------
 * Root
 * ----------------------------------------------------------------------------------------------*/

type NavMenuCtx = { value: string; hovered: string | null; setHovered: (v: string | null) => void; id: string }
const NavMenuContext = React.createContext<NavMenuCtx>({ value: "", hovered: null, setHovered: () => {}, id: "" })
const ItemContext = React.createContext<string>("")

/**
 * Site navigation with rich dropdown panels. A highlight slides between triggers, the shared panel
 * springs open from the bar, resizes smoothly between items and slides its content in from the
 * direction you moved. Opens on hover on desktop and on tap on touch screens.
 */
function NavigationMenu({
  className,
  children,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  viewport = true,
  "aria-label": label = "Main",
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & { viewport?: boolean }) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const [hovered, setHovered] = React.useState<string | null>(null)
  const id = React.useId()
  return (
    <NavMenuContext.Provider value={{ value, hovered, setHovered, id }}>
      <NavigationMenuPrimitive.Root
        data-slot="navigation-menu"
        aria-label={label}
        value={value}
        onValueChange={(v) => {
          if (valueProp === undefined) setInner(v)
          onValueChange?.(v)
        }}
        className={cn("relative z-20 flex max-w-max flex-1 items-center justify-center", className)}
        {...props}
      >
        <LayoutGroup id={id}>{children}</LayoutGroup>
        {viewport && <NavigationMenuViewport />}
      </NavigationMenuPrimitive.Root>
    </NavMenuContext.Provider>
  )
}

function NavigationMenuList({ className, onPointerLeave, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  const { setHovered } = React.useContext(NavMenuContext)
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex flex-1 list-none items-center gap-0.5", className)}
      onPointerLeave={(e) => {
        setHovered(null)
        onPointerLeave?.(e)
      }}
      {...props}
    />
  )
}

function NavigationMenuItem({ className, value: valueProp, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  const auto = React.useId()
  const value = valueProp ?? auto
  return (
    <ItemContext.Provider value={value}>
      <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" value={value} className={cn("relative", className)} {...props} />
    </ItemContext.Provider>
  )
}

/* Highlight shared by triggers and top-level links: follows the pointer, rests on the open item. */
function useHighlight() {
  const item = React.useContext(ItemContext)
  const { value, hovered, setHovered } = React.useContext(NavMenuContext)
  const show = (hovered ?? value) === item && item !== ""
  return {
    item,
    open: value === item,
    show,
    handlers: { onPointerEnter: () => setHovered(item), onFocus: () => setHovered(item) },
  }
}

function Highlight() {
  return (
    <motion.span
      aria-hidden="true"
      layoutId="navigation-menu-highlight"
      transition={spring}
      className="absolute inset-0 -z-10 rounded-[inherit] bg-accent"
    />
  )
}

const triggerClass =
  "group/nm relative isolate inline-flex h-9 cursor-pointer items-center gap-1 rounded-facet px-3 text-sm font-medium text-foreground no-underline outline-none select-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"

function NavigationMenuTrigger({ className, children, onPointerEnter, onFocus, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  const { show, open, handlers } = useHighlight()
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(triggerClass, className)}
      onPointerEnter={(e) => {
        handlers.onPointerEnter()
        onPointerEnter?.(e)
      }}
      onFocus={(e) => {
        handlers.onFocus()
        onFocus?.(e)
      }}
      {...props}
    >
      {show && <Highlight />}
      {children}
      <motion.span aria-hidden="true" className="inline-flex text-muted-foreground" animate={{ rotate: open ? 180 : 0 }} transition={spring}>
        <ChevronDownIcon className="size-3.5" />
      </motion.span>
    </NavigationMenuPrimitive.Trigger>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Content + viewport
 * ----------------------------------------------------------------------------------------------*/

/** Slides the panel's content in from the side the pointer came from (Radix's data-motion). */
function ContentMotion({ className, children }: { className?: string; children: React.ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  React.useLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    const dir = el.parentElement?.getAttribute("data-motion")
    const x = dir === "from-end" ? 28 : dir === "from-start" ? -28 : 0
    animate(el, { opacity: [0, 1], x: [x, 0] }, x ? spring : { duration: durations.base, ease })
  }, [animate, scope])
  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  )
}

type ContentProps = React.ComponentProps<typeof NavigationMenuPrimitive.Content> & {
  /** "feature" puts a tall featured card in the first column. */
  layout?: "grid" | "feature" | "list"
}

function NavigationMenuContent({ className, children, layout = "grid", ...props }: ContentProps) {
  return (
    <NavigationMenuPrimitive.Content data-slot="navigation-menu-content" data-layout={layout} className="absolute top-0 left-0 w-max outline-none" {...props}>
      <ContentMotion
        className={cn(
          "grid gap-1 p-2",
          layout === "grid" && "grid-cols-[repeat(2,230px)] max-sm:grid-cols-[minmax(0,280px)]",
          layout === "feature" && "grid-cols-[200px_260px] max-sm:grid-cols-[minmax(0,280px)]",
          layout === "list" && "w-[260px] grid-cols-1",
          className
        )}
      >
        {children}
      </ContentMotion>
    </NavigationMenuPrimitive.Content>
  )
}

/** The shared panel. Its width/height animate between items; it pops in and out from the bar. */
function NavigationMenuViewport({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  const { value } = React.useContext(NavMenuContext)
  const open = value !== ""
  return (
    <div className="absolute top-full left-0 flex pt-2">
      <NavigationMenuPrimitive.Viewport forceMount asChild {...props}>
        <motion.div
          data-slot="navigation-menu-viewport"
          className={cn(
            "relative h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) origin-top-left overflow-hidden rounded-facet-lg border border-border bg-popover text-popover-foreground shadow-lg data-[state=closed]:pointer-events-none",
            "transition-[width,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            className
          )}
          initial={false}
          animate={
            open
              ? { opacity: 1, scale: 1, y: 0, visibility: "visible", transition: spring }
              : { opacity: 0, scale: 0.97, y: -4, transition: { duration: durations.fast, ease }, transitionEnd: { visibility: "hidden" } }
          }
          style={{ opacity: 0, visibility: "hidden" }}
        />
      </NavigationMenuPrimitive.Viewport>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Links
 * ----------------------------------------------------------------------------------------------*/

/** Top-level link in the bar (shares the sliding highlight with triggers). */
function NavigationMenuLink({ className, onPointerEnter, onFocus, children, asChild, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  const { show, handlers } = useHighlight()
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      asChild={asChild}
      className={cn(triggerClass, "data-[active]:text-brand", className)}
      onPointerEnter={(e) => {
        handlers.onPointerEnter()
        onPointerEnter?.(e)
      }}
      onFocus={(e) => {
        handlers.onFocus()
        onFocus?.(e)
      }}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {show && <Highlight />}
          {children}
        </>
      )}
    </NavigationMenuPrimitive.Link>
  )
}

type CardProps = React.ComponentProps<typeof NavigationMenuPrimitive.Link> & {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
}

/** A link inside a panel: icon + title + one-line description. */
function NavigationMenuCard({ className, icon, title, description, children, ...props }: CardProps) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-card"
      className={cn(
        "group/card block rounded-facet px-3 py-2.5 text-foreground no-underline outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2 text-sm font-medium">
        {icon != null && (
          <span className="inline-flex text-brand transition-transform duration-200 group-hover/card:scale-110 [&_svg]:size-4">{icon}</span>
        )}
        {title}
      </span>
      {description != null && <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{description}</span>}
      {children}
    </NavigationMenuPrimitive.Link>
  )
}

/** Featured card (spans three rows of the "feature" layout). */
function NavigationMenuFeature({ className, icon, title, description, ...props }: CardProps) {
  return (
    <NavigationMenuPrimitive.Link asChild {...props}>
      <motion.a
        data-slot="navigation-menu-feature"
        className={cn(
          "relative row-span-3 flex min-h-[180px] flex-col justify-end gap-1 overflow-hidden rounded-facet bg-primary p-4 text-primary-foreground no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover max-sm:row-span-1 max-sm:min-h-[120px]",
          className
        )}
        style={{ backgroundImage: "radial-gradient(120% 100% at 0 0, var(--brand-400), transparent 65%), radial-gradient(90% 80% at 100% 100%, var(--brand-800), transparent 70%)" }}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        transition={spring}
      >
        {icon != null && <span className="mb-auto inline-flex [&_svg]:size-5">{icon}</span>}
        <b className="text-base font-semibold">{title}</b>
        {description != null && <span className="text-[13px] leading-snug opacity-85">{description}</span>}
      </motion.a>
    </NavigationMenuPrimitive.Link>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuViewport,
  NavigationMenuLink,
  NavigationMenuCard,
  NavigationMenuFeature,
}
