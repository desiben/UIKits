"use client"

import * as React from "react"
import { motion } from "motion/react"
import { XIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { slideUp, spring, stagger } from "@/registry/facet/lib/motion"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/registry/facet/ui/sheet"

/* A Sheet with structured parts: a sticky header (with close), a scrolling body whose fields
 * stagger in, and a sticky footer. Header/footer dividers fade in only while the body scrolls under them. */

type ScrollState = { top: boolean; bottom: boolean }
const ScrollContext = React.createContext<{ state: ScrollState; set: (s: ScrollState) => void }>({
  state: { top: true, bottom: true },
  set: () => {},
})

const SheetPro = Sheet
const SheetProTrigger = SheetTrigger
const SheetProClose = SheetClose

function SheetProContent({
  className,
  children,
  side = "right",
  ...props
}: Omit<React.ComponentProps<typeof SheetContent>, "showCloseButton">) {
  const [state, set] = React.useState<ScrollState>({ top: true, bottom: true })
  return (
    <SheetContent
      side={side}
      showCloseButton={false}
      className={cn(side === "left" || side === "right" ? "w-[min(400px,100%)]" : "", "overflow-hidden", className)}
      {...props}
    >
      <ScrollContext.Provider value={{ state, set }}>{children}</ScrollContext.Provider>
    </SheetContent>
  )
}

function SheetProHeader({
  className,
  title,
  description,
  showClose = true,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & { title?: React.ReactNode; description?: React.ReactNode; showClose?: boolean }) {
  const { state } = React.useContext(ScrollContext)
  return (
    <div data-slot="sheet-pro-header" className={cn("relative flex shrink-0 items-center gap-2 py-4 pr-4 pl-5", className)} {...props}>
      <div className="min-w-0 flex-1">
        {title && <SheetTitle className="text-base font-semibold">{title}</SheetTitle>}
        {description && <SheetDescription className="text-[13px]">{description}</SheetDescription>}
        {children}
      </div>
      {showClose && (
        <SheetClose
          aria-label="Close"
          className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-facet text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <motion.span className="grid place-items-center" whileHover={{ rotate: 90 }} transition={spring}>
            <XIcon className="size-4" />
          </motion.span>
        </SheetClose>
      )}
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-border"
        initial={false}
        animate={{ opacity: state.top ? 0.5 : 1 }}
        transition={spring}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-full z-10 h-3 bg-gradient-to-b from-foreground/[0.06] to-transparent"
        initial={false}
        animate={{ opacity: state.top ? 0 : 1 }}
      />
    </div>
  )
}

function SheetProBody({ className, children, onScroll, ...props }: React.ComponentProps<"div">) {
  const { set } = React.useContext(ScrollContext)
  const ref = React.useRef<HTMLDivElement>(null)
  const measure = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    set({ top: el.scrollTop <= 1, bottom: el.scrollTop + el.clientHeight >= el.scrollHeight - 1 })
  }, [set])
  React.useEffect(() => {
    measure()
    const el = ref.current
    if (!el || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure])
  return (
    <div
      ref={ref}
      data-slot="sheet-pro-body"
      className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain p-5", className)}
      onScroll={(e) => {
        measure()
        onScroll?.(e)
      }}
      {...props}
    >
      <motion.div className="flex flex-col gap-4" variants={stagger(0.045, 0.08)} initial="hidden" animate="visible">
        {React.Children.map(children, (child) =>
          child == null || child === false ? null : <motion.div variants={slideUp}>{child}</motion.div>
        )}
      </motion.div>
    </div>
  )
}

function SheetProFooter({ className, ...props }: React.ComponentProps<"div">) {
  const { state } = React.useContext(ScrollContext)
  return (
    <div data-slot="sheet-pro-footer" className={cn("relative flex shrink-0 items-center justify-end gap-2 px-5 py-3", className)} {...props}>
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-border"
        initial={false}
        animate={{ opacity: state.bottom ? 0.5 : 1 }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-full h-3 bg-gradient-to-t from-foreground/[0.06] to-transparent"
        initial={false}
        animate={{ opacity: state.bottom ? 0 : 1 }}
      />
      {props.children}
    </div>
  )
}

export { SheetPro, SheetProTrigger, SheetProClose, SheetProContent, SheetProHeader, SheetProBody, SheetProFooter }
