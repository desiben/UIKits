"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { ContextMenu as ContextMenuPrimitive } from "radix-ui"
import { ChevronRightIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import {
  MenuCheck,
  MenuDot,
  MenuHighlightScope,
  menuContentClass,
  menuItemClass,
  menuItemDangerClass,
  menuItemVariants,
  menuVariants,
  useMenuHighlight,
} from "@/registry/facet/ui/dropdown-menu"

/* Radix ContextMenu has no controlled `open`, so we mirror it from onOpenChange to animate the exit. */
const OpenContext = React.createContext(false)
const SubOpenContext = React.createContext(false)
const RadioValueContext = React.createContext<string | undefined>(undefined)

function ContextMenu({ onOpenChange, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  const [open, setOpen] = React.useState(false)
  return (
    <OpenContext.Provider value={open}>
      <ContextMenuPrimitive.Root
        data-slot="context-menu"
        onOpenChange={(o) => {
          setOpen(o)
          onOpenChange?.(o)
        }}
        {...props}
      />
    </OpenContext.Provider>
  )
}

function ContextMenuTrigger({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn(
        "transition-[background-color,border-color] duration-200 data-[state=open]:border-primary data-[state=open]:bg-primary-subtle",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuContent({ className, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  const open = React.useContext(OpenContext)
  return (
    <AnimatePresence>
      {open && (
        <ContextMenuPrimitive.Portal forceMount>
          <ContextMenuPrimitive.Content forceMount asChild {...props}>
            <motion.div
              data-slot="context-menu-content"
              className={cn(menuContentClass, "origin-(--radix-context-menu-content-transform-origin)", className)}
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <MenuHighlightScope>{children}</MenuHighlightScope>
            </motion.div>
          </ContextMenuPrimitive.Content>
        </ContextMenuPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function ContextMenuGroup(props: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & { inset?: boolean; variant?: "default" | "destructive" }) {
  const danger = variant === "destructive"
  const { handlers, highlight } = useMenuHighlight<HTMLDivElement>(props, danger)
  return (
    <ContextMenuPrimitive.Item asChild {...props} {...handlers}>
      <motion.div
        data-slot="context-menu-item"
        data-variant={variant}
        variants={menuItemVariants}
        className={cn(menuItemClass, danger && menuItemDangerClass, inset && "pl-8", className)}
      >
        {highlight}
        {children}
      </motion.div>
    </ContextMenuPrimitive.Item>
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  const { handlers, highlight } = useMenuHighlight<HTMLDivElement>(props)
  return (
    <ContextMenuPrimitive.CheckboxItem asChild checked={checked} {...props} {...handlers}>
      <motion.div data-slot="context-menu-checkbox-item" variants={menuItemVariants} className={cn(menuItemClass, "pl-8", className)}>
        {highlight}
        <span className="absolute left-2.5 flex items-center">
          <MenuCheck checked={checked === true} />
        </span>
        {children}
      </motion.div>
    </ContextMenuPrimitive.CheckboxItem>
  )
}

function ContextMenuRadioGroup({ value, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <RadioValueContext.Provider value={value}>
      <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" value={value} {...props} />
    </RadioValueContext.Provider>
  )
}

function ContextMenuRadioItem({ className, children, value, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  const groupValue = React.useContext(RadioValueContext)
  const { handlers, highlight } = useMenuHighlight<HTMLDivElement>(props)
  return (
    <ContextMenuPrimitive.RadioItem asChild value={value} {...props} {...handlers}>
      <motion.div data-slot="context-menu-radio-item" variants={menuItemVariants} className={cn(menuItemClass, "pl-8", className)}>
        {highlight}
        <span className="absolute left-2.5 flex items-center">
          <MenuDot checked={groupValue === value} />
        </span>
        {children}
      </motion.div>
    </ContextMenuPrimitive.RadioItem>
  )
}

function ContextMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      className={cn("px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase", inset && "pl-8", className)}
      {...props}
    />
  )
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return <ContextMenuPrimitive.Separator data-slot="context-menu-separator" className={cn("-mx-1 my-1 h-px bg-border-subtle", className)} {...props} />
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="context-menu-shortcut" className={cn("ml-auto pl-4 text-xs font-medium tracking-wide text-muted-foreground", className)} {...props} />
}

function ContextMenuSub({ open: openProp, defaultOpen = false, onOpenChange, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  const [inner, setInner] = React.useState(defaultOpen)
  const open = openProp ?? inner
  return (
    <SubOpenContext.Provider value={open}>
      <ContextMenuPrimitive.Sub
        data-slot="context-menu-sub"
        open={open}
        onOpenChange={(o) => {
          if (openProp === undefined) setInner(o)
          onOpenChange?.(o)
        }}
        {...props}
      />
    </SubOpenContext.Provider>
  )
}

function ContextMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  const { handlers, highlight } = useMenuHighlight<HTMLDivElement>(props)
  return (
    <ContextMenuPrimitive.SubTrigger asChild {...props} {...handlers}>
      <motion.div data-slot="context-menu-sub-trigger" variants={menuItemVariants} className={cn(menuItemClass, inset && "pl-8", className)}>
        {highlight}
        {children}
        <ChevronRightIcon className="ml-auto size-3.5" />
      </motion.div>
    </ContextMenuPrimitive.SubTrigger>
  )
}

function ContextMenuSubContent({ className, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  const open = React.useContext(SubOpenContext)
  return (
    <AnimatePresence>
      {open && (
        <ContextMenuPrimitive.Portal forceMount>
          <ContextMenuPrimitive.SubContent forceMount asChild {...props}>
            <motion.div
              data-slot="context-menu-sub-content"
              className={cn(menuContentClass, "min-w-[180px] origin-(--radix-context-menu-content-transform-origin)", className)}
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <MenuHighlightScope>{children}</MenuHighlightScope>
            </motion.div>
          </ContextMenuPrimitive.SubContent>
        </ContextMenuPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
}
