"use client"

import * as React from "react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { ChevronRightIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring } from "@/registry/facet/lib/motion"

/* ------------------------------------------------------------------------------------------------
 * Shared menu building blocks (also used by ContextMenu and Menubar)
 * ----------------------------------------------------------------------------------------------*/

export const menuContentClass =
  "z-50 min-w-[220px] overflow-hidden rounded-facet-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"

export const menuItemClass =
  "relative isolate flex h-8 w-full cursor-default select-none items-center gap-2 rounded-facet-sm px-2.5 text-left text-sm text-foreground outline-none data-[disabled]:pointer-events-none data-[disabled]:text-placeholder [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground"

export const menuItemDangerClass = "text-danger [&_svg:not([class*='text-'])]:text-danger"

/** Panel: scales out of the trigger (Radix transform-origin) and staggers its items in. */
export const menuVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...spring, staggerChildren: 0.022, delayChildren: 0.02 },
  },
  exit: { opacity: 0, scale: 0.97, transition: { duration: durations.fast, ease } },
}

export const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: durations.base, ease } },
}

const MenuHighlightContext = React.createContext<string | null>(null)

/** Provides a layout group so the highlight slides between the items of one menu panel. */
export function MenuHighlightScope({ children }: { children: React.ReactNode }) {
  const id = React.useId()
  return <MenuHighlightContext.Provider value={id}>{children}</MenuHighlightContext.Provider>
}

/**
 * Tracks whether a Radix menu item is highlighted (Radix focuses the highlighted item) and returns
 * handlers to spread on it, plus the sliding highlight element to render inside it.
 */
export function useMenuHighlight<T extends HTMLElement>(
  props: { onFocus?: React.FocusEventHandler<T>; onBlur?: React.FocusEventHandler<T> },
  danger = false
) {
  const scope = React.useContext(MenuHighlightContext)
  const [active, setActive] = React.useState(false)
  const handlers = {
    onFocus: (e: React.FocusEvent<T>) => {
      setActive(true)
      props.onFocus?.(e)
    },
    onBlur: (e: React.FocusEvent<T>) => {
      setActive(false)
      props.onBlur?.(e)
    },
  }
  const highlight = active ? (
    <motion.span
      aria-hidden="true"
      layoutId={scope ? `${scope}-hl` : undefined}
      transition={spring}
      className={cn("absolute inset-0 -z-10 rounded-facet-sm", danger ? "bg-danger-subtle" : "bg-accent")}
    >
      <span className={cn("absolute top-[7px] bottom-[7px] left-0 w-0.5 rounded-full", danger ? "bg-danger" : "bg-primary")} />
    </motion.span>
  ) : null
  return { handlers, highlight, active }
}

/** Animated check that draws itself when `checked` turns on. */
export function MenuCheck({ checked }: { checked: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 text-brand" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <motion.path
        d="M5 12.5l4.5 4.5L19 7.5"
        initial={false}
        animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={{ duration: durations.base, ease }}
      />
    </svg>
  )
}

export function MenuDot({ checked }: { checked: boolean }) {
  return (
    <span aria-hidden="true" className="grid size-3.5 place-items-center">
      <motion.span
        className="size-2 rounded-full bg-primary"
        initial={false}
        animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={spring}
      />
    </span>
  )
}

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = React.useState(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? value : inner
  const set = React.useCallback(
    (v: T) => {
      if (!controlled) setInner(v)
      onChange?.(v)
    },
    [controlled, onChange]
  )
  return [current, set] as const
}

/* ------------------------------------------------------------------------------------------------
 * DropdownMenu
 * ----------------------------------------------------------------------------------------------*/

const OpenContext = React.createContext(false)
const SubOpenContext = React.createContext(false)
const RadioValueContext = React.createContext<string | undefined>(undefined)

function DropdownMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange)
  return (
    <OpenContext.Provider value={open}>
      <DropdownMenuPrimitive.Root data-slot="dropdown-menu" open={open} onOpenChange={setOpen} {...props} />
    </OpenContext.Provider>
  )
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  const open = React.useContext(OpenContext)
  return (
    <AnimatePresence>
      {open && (
        <DropdownMenuPrimitive.Portal forceMount>
          <DropdownMenuPrimitive.Content forceMount asChild sideOffset={sideOffset} {...props}>
            <motion.div
              data-slot="dropdown-menu-content"
              className={cn(menuContentClass, "origin-(--radix-dropdown-menu-content-transform-origin)", className)}
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <MenuHighlightScope>{children}</MenuHighlightScope>
            </motion.div>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { inset?: boolean; variant?: "default" | "destructive" }) {
  const danger = variant === "destructive"
  const { handlers, highlight } = useMenuHighlight<HTMLDivElement>(props, danger)
  return (
    <DropdownMenuPrimitive.Item asChild {...props} {...handlers}>
      <motion.div
        data-slot="dropdown-menu-item"
        data-variant={variant}
        variants={menuItemVariants}
        className={cn(menuItemClass, danger && menuItemDangerClass, inset && "pl-8", className)}
      >
        {highlight}
        {children}
      </motion.div>
    </DropdownMenuPrimitive.Item>
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  const { handlers, highlight } = useMenuHighlight<HTMLDivElement>(props)
  return (
    <DropdownMenuPrimitive.CheckboxItem asChild checked={checked} {...props} {...handlers}>
      <motion.div
        data-slot="dropdown-menu-checkbox-item"
        variants={menuItemVariants}
        className={cn(menuItemClass, "pl-8", className)}
      >
        {highlight}
        <span className="absolute left-2.5 flex items-center">
          <MenuCheck checked={checked === true} />
        </span>
        {children}
      </motion.div>
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ value, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <RadioValueContext.Provider value={value}>
      <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" value={value} {...props} />
    </RadioValueContext.Provider>
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  const groupValue = React.useContext(RadioValueContext)
  const { handlers, highlight } = useMenuHighlight<HTMLDivElement>(props)
  return (
    <DropdownMenuPrimitive.RadioItem asChild value={value} {...props} {...handlers}>
      <motion.div
        data-slot="dropdown-menu-radio-item"
        variants={menuItemVariants}
        className={cn(menuItemClass, "pl-8", className)}
      >
        {highlight}
        <span className="absolute left-2.5 flex items-center">
          <MenuDot checked={groupValue === value} />
        </span>
        {children}
      </motion.div>
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={cn("px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase", inset && "pl-8", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border-subtle", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ml-auto pl-4 text-xs font-medium tracking-wide text-muted-foreground", className)}
      {...props}
    />
  )
}

function DropdownMenuSub({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange)
  return (
    <SubOpenContext.Provider value={open}>
      <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" open={open} onOpenChange={setOpen} {...props} />
    </SubOpenContext.Provider>
  )
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  const { handlers, highlight } = useMenuHighlight<HTMLDivElement>(props)
  return (
    <DropdownMenuPrimitive.SubTrigger asChild {...props} {...handlers}>
      <motion.div
        data-slot="dropdown-menu-sub-trigger"
        variants={menuItemVariants}
        className={cn(menuItemClass, inset && "pl-8", className)}
      >
        {highlight}
        {children}
        <ChevronRightIcon className="ml-auto size-3.5" />
      </motion.div>
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  children,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  const open = React.useContext(SubOpenContext)
  return (
    <AnimatePresence>
      {open && (
        <DropdownMenuPrimitive.Portal forceMount>
          <DropdownMenuPrimitive.SubContent forceMount asChild sideOffset={sideOffset} {...props}>
            <motion.div
              data-slot="dropdown-menu-sub-content"
              className={cn(menuContentClass, "min-w-[180px] origin-(--radix-dropdown-menu-content-transform-origin)", className)}
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <MenuHighlightScope>{children}</MenuHighlightScope>
            </motion.div>
          </DropdownMenuPrimitive.SubContent>
        </DropdownMenuPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
