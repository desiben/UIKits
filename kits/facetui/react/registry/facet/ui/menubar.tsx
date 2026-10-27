"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Menubar as MenubarPrimitive } from "radix-ui"
import { ChevronRightIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { spring } from "@/registry/facet/lib/motion"
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

const BarContext = React.createContext<{ value: string; id: string }>({ value: "", id: "" })
const MenuValueContext = React.createContext("")
const SubOpenContext = React.createContext(false)
const RadioValueContext = React.createContext<string | undefined>(undefined)

function Menubar({
  className,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const id = React.useId()
  return (
    <BarContext.Provider value={{ value, id }}>
      <MenubarPrimitive.Root
        data-slot="menubar"
        value={value}
        onValueChange={(v) => {
          if (valueProp === undefined) setInner(v)
          onValueChange?.(v)
        }}
        className={cn("inline-flex items-center gap-0.5 rounded-facet border border-border bg-card p-[3px] shadow-xs", className)}
        {...props}
      />
    </BarContext.Provider>
  )
}

function MenubarMenu({ value: valueProp, ...props }: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  const auto = React.useId()
  const value = valueProp ?? auto
  return (
    <MenuValueContext.Provider value={value}>
      <MenubarPrimitive.Menu data-slot="menubar-menu" value={value} {...props} />
    </MenuValueContext.Provider>
  )
}

function MenubarGroup(props: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />
}

function MenubarTrigger({ className, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  const bar = React.useContext(BarContext)
  const mine = React.useContext(MenuValueContext)
  const open = bar.value === mine
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "relative isolate inline-flex h-7 cursor-default items-center rounded-facet-sm px-3 text-[13px] font-medium text-foreground outline-none select-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {open && (
        <motion.span
          aria-hidden="true"
          layoutId={`${bar.id}-trigger`}
          transition={spring}
          className="absolute inset-0 -z-10 rounded-facet-sm bg-accent"
        />
      )}
      {children}
    </MenubarPrimitive.Trigger>
  )
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  const bar = React.useContext(BarContext)
  const mine = React.useContext(MenuValueContext)
  const open = bar.value === mine
  return (
    <AnimatePresence>
      {open && (
        <MenubarPrimitive.Portal forceMount>
          <MenubarPrimitive.Content forceMount asChild align={align} alignOffset={alignOffset} sideOffset={sideOffset} {...props}>
            <motion.div
              data-slot="menubar-content"
              className={cn(menuContentClass, "origin-(--radix-menubar-content-transform-origin)", className)}
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <MenuHighlightScope>{children}</MenuHighlightScope>
            </motion.div>
          </MenubarPrimitive.Content>
        </MenubarPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & { inset?: boolean; variant?: "default" | "destructive" }) {
  const danger = variant === "destructive"
  const { handlers, highlight } = useMenuHighlight<HTMLDivElement>(props, danger)
  return (
    <MenubarPrimitive.Item asChild {...props} {...handlers}>
      <motion.div
        data-slot="menubar-item"
        data-variant={variant}
        variants={menuItemVariants}
        className={cn(menuItemClass, danger && menuItemDangerClass, inset && "pl-8", className)}
      >
        {highlight}
        {children}
      </motion.div>
    </MenubarPrimitive.Item>
  )
}

function MenubarCheckboxItem({ className, children, checked, ...props }: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  const { handlers, highlight } = useMenuHighlight<HTMLDivElement>(props)
  return (
    <MenubarPrimitive.CheckboxItem asChild checked={checked} {...props} {...handlers}>
      <motion.div data-slot="menubar-checkbox-item" variants={menuItemVariants} className={cn(menuItemClass, "pl-8", className)}>
        {highlight}
        <span className="absolute left-2.5 flex items-center">
          <MenuCheck checked={checked === true} />
        </span>
        {children}
      </motion.div>
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarRadioGroup({ value, ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <RadioValueContext.Provider value={value}>
      <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" value={value} {...props} />
    </RadioValueContext.Provider>
  )
}

function MenubarRadioItem({ className, children, value, ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  const groupValue = React.useContext(RadioValueContext)
  const { handlers, highlight } = useMenuHighlight<HTMLDivElement>(props)
  return (
    <MenubarPrimitive.RadioItem asChild value={value} {...props} {...handlers}>
      <motion.div data-slot="menubar-radio-item" variants={menuItemVariants} className={cn(menuItemClass, "pl-8", className)}>
        {highlight}
        <span className="absolute left-2.5 flex items-center">
          <MenuDot checked={groupValue === value} />
        </span>
        {children}
      </motion.div>
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarLabel({ className, inset, ...props }: React.ComponentProps<typeof MenubarPrimitive.Label> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      className={cn("px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase", inset && "pl-8", className)}
      {...props}
    />
  )
}

function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return <MenubarPrimitive.Separator data-slot="menubar-separator" className={cn("-mx-1 my-1 h-px bg-border-subtle", className)} {...props} />
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="menubar-shortcut" className={cn("ml-auto pl-4 text-xs font-medium tracking-wide text-muted-foreground", className)} {...props} />
}

function MenubarSub({ open: openProp, defaultOpen = false, onOpenChange, ...props }: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  const [inner, setInner] = React.useState(defaultOpen)
  const open = openProp ?? inner
  return (
    <SubOpenContext.Provider value={open}>
      <MenubarPrimitive.Sub
        data-slot="menubar-sub"
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

function MenubarSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }) {
  const { handlers, highlight } = useMenuHighlight<HTMLDivElement>(props)
  return (
    <MenubarPrimitive.SubTrigger asChild {...props} {...handlers}>
      <motion.div data-slot="menubar-sub-trigger" variants={menuItemVariants} className={cn(menuItemClass, inset && "pl-8", className)}>
        {highlight}
        {children}
        <ChevronRightIcon className="ml-auto size-3.5" />
      </motion.div>
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarSubContent({ className, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  const open = React.useContext(SubOpenContext)
  return (
    <AnimatePresence>
      {open && (
        <MenubarPrimitive.Portal forceMount>
          <MenubarPrimitive.SubContent forceMount asChild {...props}>
            <motion.div
              data-slot="menubar-sub-content"
              className={cn(menuContentClass, "min-w-[180px] origin-(--radix-menubar-content-transform-origin)", className)}
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <MenuHighlightScope>{children}</MenuHighlightScope>
            </motion.div>
          </MenubarPrimitive.SubContent>
        </MenubarPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

export {
  Menubar,
  MenubarMenu,
  MenubarGroup,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
