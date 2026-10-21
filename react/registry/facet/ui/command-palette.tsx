"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Command as CommandPrimitive, useCommandState } from "cmdk"
import { Dialog as DialogPrimitive } from "radix-ui"
import { Search, X } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, popIn, spring } from "@/registry/facet/lib/motion"

/* Root ---------------------------------------------------------------- */

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-facet-xl border border-border bg-popover text-popover-foreground shadow-2xl shadow-black/10",
        className
      )}
      {...props}
    />
  )
}

/* Input --------------------------------------------------------------- */

type CommandInputProps = React.ComponentProps<typeof CommandPrimitive.Input> & {
  /** Scope chip shown before the query (e.g. the current project). */
  scope?: React.ReactNode
  scopeIcon?: React.ReactNode
  /** Called on Backspace in an empty input (and from the chip's ×) to clear the scope. */
  onScopeClear?: () => void
  /** Key hint at the end of the input. Pass null to hide. */
  kbd?: React.ReactNode
}

function CommandInput({
  className,
  scope,
  scopeIcon,
  onScopeClear,
  kbd = "esc",
  onKeyDown,
  ...props
}: CommandInputProps) {
  return (
    <div data-slot="command-input-wrapper" className="flex h-[52px] items-center gap-2.5 border-b border-border-subtle px-4">
      <Search className="size-[18px] flex-none text-muted-foreground" aria-hidden="true" />
      <AnimatePresence initial={false} mode="popLayout">
        {scope && (
          <motion.span
            key={typeof scope === "string" ? scope : "scope"}
            data-slot="command-scope"
            className="inline-flex h-6 flex-none items-center gap-1 rounded-facet-sm bg-primary-subtle pr-1 pl-2 text-xs font-medium text-brand [&_svg]:size-3.5"
            initial={{ opacity: 0, scale: 0.8, x: -6 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -6, transition: { duration: durations.fast } }}
            transition={spring}
          >
            {scopeIcon}
            {scope}
            {onScopeClear ? (
              <button
                type="button"
                aria-label="Clear scope"
                tabIndex={-1}
                onClick={onScopeClear}
                className="grid size-4 place-items-center rounded-sm opacity-70 outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3"
              >
                <X />
              </button>
            ) : (
              <span className="w-1" />
            )}
          </motion.span>
        )}
      </AnimatePresence>
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-placeholder disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && scope && onScopeClear && e.currentTarget.value === "") onScopeClear()
          onKeyDown?.(e)
        }}
        {...props}
      />
      {kbd !== null && <CommandKbd>{kbd}</CommandKbd>}
    </div>
  )
}

/* List with a sliding highlight --------------------------------------- */

function CommandHighlight({ listRef }: { listRef: React.RefObject<HTMLDivElement | null> }) {
  const selected = useCommandState((s) => s.value)
  const search = useCommandState((s) => s.search)
  const [box, setBox] = React.useState<{ top: number; height: number } | null>(null)

  React.useLayoutEffect(() => {
    const measure = () => {
      const el = listRef.current?.querySelector<HTMLElement>('[cmdk-item][data-selected="true"]')
      if (!el) return setBox(null)
      // offsetTop is relative to the (positioned) list sizer and ignores transforms.
      let top = 0
      let node: HTMLElement | null = el
      while (node && !node.hasAttribute("cmdk-list-sizer")) {
        top += node.offsetTop
        node = node.offsetParent as HTMLElement | null
        if (node && node.hasAttribute("cmdk-list-sizer")) break
      }
      setBox((prev) => (prev && prev.top === top && prev.height === el.offsetHeight ? prev : { top, height: el.offsetHeight }))
    }
    measure()
    const raf = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(raf)
  }, [selected, search, listRef])

  return (
    <AnimatePresence>
      {box && (
        <motion.div
          aria-hidden="true"
          data-slot="command-highlight"
          className="pointer-events-none absolute inset-x-0 top-0 rounded-facet bg-primary-subtle"
          initial={{ opacity: 0, y: box.top, height: box.height }}
          animate={{ opacity: 1, y: box.top, height: box.height }}
          exit={{ opacity: 0, transition: { duration: durations.fast } }}
          transition={spring}
        >
          <span className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-primary" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CommandList({ className, children, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  const listRef = React.useRef<HTMLDivElement>(null)
  return (
    <CommandPrimitive.List
      ref={listRef}
      data-slot="command-list"
      className={cn(
        "box-content h-[min(var(--cmdk-list-height),340px)] max-h-[340px] scroll-py-1.5 overflow-y-auto overscroll-contain p-1.5 transition-[height] duration-200 ease-out [&_[cmdk-list-sizer]]:relative",
        className
      )}
      {...props}
    >
      <CommandHighlight listRef={listRef} />
      {children}
    </CommandPrimitive.List>
  )
}

function CommandEmpty({ className, children, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty data-slot="command-empty" className={cn("py-8 text-center text-sm text-muted-foreground", className)} {...props}>
      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: durations.base, ease }}>
        {children}
      </motion.div>
    </CommandPrimitive.Empty>
  )
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:leading-4 [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase",
        className
      )}
      {...props}
    />
  )
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative z-[1] flex h-9 cursor-pointer items-center gap-2 rounded-facet px-2.5 text-sm text-foreground outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg]:text-muted-foreground [&>svg]:transition-colors data-[selected=true]:[&>svg]:text-brand",
        className
      )}
      {...props}
    />
  )
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("ml-auto pl-3 text-xs font-medium tracking-wide text-muted-foreground", className)}
      {...props}
    />
  )
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator data-slot="command-separator" className={cn("-mx-1.5 my-1.5 h-px bg-border-subtle", className)} {...props} />
}

function CommandKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="command-kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-b-2 border-border bg-subtle px-1.5 font-sans text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-footer"
      className={cn(
        "flex flex-wrap items-center gap-4 border-t border-border-subtle bg-subtle px-4 py-2 text-xs text-muted-foreground [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1.5",
        className
      )}
      {...props}
    />
  )
}

/* Dialog -------------------------------------------------------------- */

type CommandDialogProps = Omit<React.ComponentProps<typeof DialogPrimitive.Root>, "children"> & {
  title?: string
  children: React.ReactNode
  className?: string
  /** Props for the inner <Command> (filter, loop, value…). */
  commandProps?: Omit<React.ComponentProps<typeof CommandPrimitive>, "children">
}

/** Command palette in a modal: scrim fades, the panel pops in from just above. */
function CommandDialog({ open, onOpenChange, title = "Command palette", children, className, commandProps, ...props }: CommandDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                data-slot="command-dialog-overlay"
                className="fixed inset-0 z-50 bg-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: durations.base, ease }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              asChild
              forceMount
              aria-describedby={undefined}
              onOpenAutoFocus={(e) => {
                e.preventDefault()
                ;(e.currentTarget as HTMLElement | null)?.querySelector<HTMLInputElement>("[cmdk-input]")?.focus()
              }}
            >
              <motion.div
                data-slot="command-dialog"
                className={cn("fixed top-[14vh] left-1/2 z-50 w-[min(600px,calc(100vw-32px))] outline-none", className)}
                style={{ x: "-50%", transformOrigin: "50% 0%" }}
                variants={popIn}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
                <Command loop {...commandProps}>
                  {children}
                </Command>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandKbd,
  CommandList,
  CommandSeparator,
  CommandShortcut,
}
