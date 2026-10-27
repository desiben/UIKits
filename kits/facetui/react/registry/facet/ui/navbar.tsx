"use client"

import * as React from "react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { Slot } from "radix-ui"
import { MenuIcon, XIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springSoft } from "@/registry/facet/lib/motion"

type NavbarCtx = { open: boolean; setOpen: (o: boolean) => void; id: string; menuId: string }
const NavbarContext = React.createContext<NavbarCtx>({ open: false, setOpen: () => {}, id: "", menuId: "" })

function useNavbar() {
  return React.useContext(NavbarContext)
}

type NavbarProps = React.ComponentProps<"header"> & {
  /** Mobile menu open state (controlled). */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Sticky, blurred top bar. Responsive to its own width (container query): under 720px the links
 * collapse into a menu button and a mobile menu that springs open.
 */
function Navbar({ className, open: openProp, defaultOpen = false, onOpenChange, children, ...props }: NavbarProps) {
  const [inner, setInner] = React.useState(defaultOpen)
  const open = openProp ?? inner
  const setOpen = React.useCallback(
    (o: boolean) => {
      if (openProp === undefined) setInner(o)
      onOpenChange?.(o)
    },
    [openProp, onOpenChange]
  )
  const id = React.useId()
  return (
    <NavbarContext.Provider value={{ open, setOpen, id, menuId: `${id}-menu` }}>
      <header
        data-slot="navbar"
        data-open={open || undefined}
        className={cn(
          "@container relative z-30 border-b border-border bg-card/85 backdrop-blur-md backdrop-saturate-150",
          className
        )}
        {...props}
      >
        {children}
      </header>
    </NavbarContext.Provider>
  )
}

function NavbarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navbar-content"
      className={cn("mx-auto flex h-[60px] max-w-[1200px] items-center gap-4 px-5 @max-[719px]:px-3", className)}
      {...props}
    />
  )
}

function NavbarBrand({ className, logo, children, asChild, ...props }: React.ComponentProps<"a"> & { logo?: React.ReactNode; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"
  return (
    <Comp
      data-slot="navbar-brand"
      className={cn("inline-flex flex-none items-center gap-2.5 rounded-sm text-base font-semibold text-foreground no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      {...props}
    >
      {logo != null && (
        <motion.span
          className="grid size-7 place-items-center rounded-facet bg-primary text-[13px] font-semibold text-primary-foreground"
          whileHover={{ rotate: -8, scale: 1.06 }}
          transition={spring}
        >
          {logo}
        </motion.span>
      )}
      {children}
    </Comp>
  )
}

const LinksContext = React.createContext<{ hovered: string | null; setHovered: (v: string | null) => void }>({ hovered: null, setHovered: () => {} })

/** Desktop links. A highlight follows the pointer and rests on the current page. */
function NavbarLinks({ className, children, ...props }: React.ComponentProps<"nav">) {
  const { id } = useNavbar()
  const [hovered, setHovered] = React.useState<string | null>(null)
  return (
    <LinksContext.Provider value={{ hovered, setHovered }}>
      <nav
        data-slot="navbar-links"
        aria-label="Main"
        className={cn("flex items-center gap-0.5 @max-[719px]:hidden", className)}
        onPointerLeave={() => setHovered(null)}
        {...props}
      >
        <LayoutGroup id={`${id}-links`}>{children}</LayoutGroup>
      </nav>
    </LinksContext.Provider>
  )
}

function NavbarLink({ className, active, children, asChild, ...props }: React.ComponentProps<"a"> & { active?: boolean; asChild?: boolean }) {
  const key = React.useId()
  const { hovered, setHovered } = React.useContext(LinksContext)
  const Comp = asChild ? Slot.Root : "a"
  const showPill = hovered ? hovered === key : !!active
  return (
    <Comp
      data-slot="navbar-link"
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative isolate inline-flex h-[34px] items-center gap-1 rounded-facet px-3 text-sm font-medium text-foreground-secondary no-underline outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        active && "text-foreground",
        className
      )}
      onPointerEnter={() => setHovered(key)}
      onFocus={() => setHovered(key)}
      onBlur={() => setHovered(null)}
      {...props}
    >
      {showPill && (
        <motion.span
          aria-hidden="true"
          layoutId="navbar-pill"
          transition={spring}
          className={cn("absolute inset-0 -z-10 rounded-[inherit]", hovered ? "bg-accent" : "bg-transparent")}
        />
      )}
      {children}
      {active && (
        <motion.span aria-hidden="true" layoutId="navbar-active-dot" transition={spring} className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary" />
      )}
    </Comp>
  )
}

function NavbarActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="navbar-actions" className={cn("ml-auto flex items-center gap-2", className)} {...props} />
}

/** Hidden on wide navbars (use for actions that move into the mobile menu). */
function NavbarDesktopOnly({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("contents @max-[719px]:hidden", className)} {...props} />
}

function NavbarMenuToggle({ className, ...props }: React.ComponentProps<"button">) {
  const { open, setOpen, menuId } = useNavbar()
  return (
    <motion.button
      type="button"
      data-slot="navbar-toggle"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls={menuId}
      onClick={() => setOpen(!open)}
      whileTap={{ scale: 0.9 }}
      transition={spring}
      className={cn(
        "hidden size-8 cursor-pointer place-items-center rounded-facet text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring @max-[719px]:grid",
        className
      )}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={open ? "x" : "menu"}
          className="grid place-items-center"
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={spring}
        >
          {open ? <XIcon className="size-4" /> : <MenuIcon className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

/** Mobile menu: only rendered under 720px; items stagger in. */
function NavbarMobileMenu({ className, children, ...props }: Omit<React.ComponentProps<"nav">, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd">) {
  const { open, menuId } = useNavbar()
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.nav
          id={menuId}
          data-slot="navbar-mobile-menu"
          aria-label="Mobile"
          className={cn("hidden overflow-hidden border-t border-border-subtle @max-[719px]:block", className)}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1, transition: springSoft }}
          exit={{ height: 0, opacity: 0, transition: { duration: durations.base, ease } }}
          {...props}
        >
          <motion.div
            className="flex flex-col gap-0.5 px-3 pt-2 pb-4"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
          >
            {React.Children.map(children, (child) =>
              child == null ? null : (
                <motion.div variants={{ hidden: { opacity: 0, y: -6 }, visible: { opacity: 1, y: 0, transition: spring } }}>{child}</motion.div>
              )
            )}
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

function NavbarMobileLink({ className, active, asChild, ...props }: React.ComponentProps<"a"> & { active?: boolean; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"
  return (
    <Comp
      data-slot="navbar-mobile-link"
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-11 items-center rounded-facet px-3 text-[15px] font-medium text-foreground no-underline outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
        active && "bg-primary-subtle text-brand",
        className
      )}
      {...props}
    />
  )
}

export {
  Navbar,
  NavbarContent,
  NavbarBrand,
  NavbarLinks,
  NavbarLink,
  NavbarActions,
  NavbarDesktopOnly,
  NavbarMenuToggle,
  NavbarMobileMenu,
  NavbarMobileLink,
  useNavbar,
}
