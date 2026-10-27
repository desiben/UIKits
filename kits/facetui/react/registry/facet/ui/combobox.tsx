"use client"

import * as React from "react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { Command as CommandPrimitive } from "cmdk"
import { ChevronsUpDown, Search, X } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring } from "@/registry/facet/lib/motion"

export interface ComboboxOption {
  value: string
  label: string
  /** Leading icon or avatar. */
  icon?: React.ReactNode
  /** Secondary text on the right. */
  hint?: React.ReactNode
  /** Extra words to match when filtering. */
  keywords?: string[]
  disabled?: boolean
  /** Options with the same group are listed under that heading. */
  group?: string
}

interface ComboboxBaseProps {
  options: ComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: React.ReactNode
  /** Show the search field (default). Turn off for a plain multi-select listbox. */
  searchable?: boolean
  disabled?: boolean
  invalid?: boolean
  className?: string
  contentClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  id?: string
  "aria-label"?: string
  "aria-labelledby"?: string
}

interface ComboboxSingleProps extends ComboboxBaseProps {
  multiple?: false
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
}

interface ComboboxMultipleProps extends ComboboxBaseProps {
  multiple: true
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Max chips shown in the trigger before collapsing into "+n". */
  maxChips?: number
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps

const panel: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { ...spring, staggerChildren: 0.022, delayChildren: 0.03 } },
  exit: { opacity: 0, scale: 0.97, y: -2, transition: { duration: durations.fast, ease } },
}
const row: Variants = {
  hidden: { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.base, ease } },
}

function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 text-brand" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ pathLength: 0, opacity: 0 }} transition={{ duration: 0.22, ease }} />
    </svg>
  )
}

/**
 * A searchable select built on Radix Popover + cmdk. Single or multiple (with chips). The panel
 * pops from the trigger, options stagger in, a highlight glides between options and checks draw.
 */
function Combobox(props: ComboboxProps) {
  const {
    options,
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    emptyText = "No results found.",
    searchable = true,
    disabled,
    invalid,
    className,
    contentClassName,
    id,
  } = props
  const multiple = props.multiple === true
  const listId = React.useId()
  const cmdkRef = React.useRef<HTMLDivElement>(null)

  const [openInner, setOpenInner] = React.useState(false)
  const open = props.open ?? openInner
  const setOpen = (o: boolean) => {
    if (props.open === undefined) setOpenInner(o)
    props.onOpenChange?.(o)
    if (!o) setSearch("")
  }

  const [inner, setInner] = React.useState<string[]>(() => {
    const d = props.defaultValue
    return Array.isArray(d) ? d : d ? [d] : []
  })
  const selected: string[] =
    props.value === undefined ? inner : Array.isArray(props.value) ? props.value : props.value ? [props.value] : []

  const commit = (next: string[]) => {
    if (props.value === undefined) setInner(next)
    if (props.multiple) props.onValueChange?.(next)
    else (props as ComboboxSingleProps).onValueChange?.(next[0] ?? null)
  }

  const toggle = (v: string) => {
    if (multiple) {
      commit(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v])
    } else {
      commit(selected[0] === v ? [] : [v])
      setOpen(false)
    }
  }

  const [search, setSearch] = React.useState("")
  const [highlighted, setHighlighted] = React.useState("")
  const byValue = React.useMemo(() => new Map(options.map((o) => [o.value, o])), [options])

  const groups = React.useMemo(() => {
    const map = new Map<string, ComboboxOption[]>()
    for (const o of options) {
      const k = o.group ?? ""
      map.set(k, [...(map.get(k) ?? []), o])
    }
    return [...map.entries()]
  }, [options])

  const maxChips = props.multiple ? props.maxChips ?? 3 : 0
  const chips = selected.slice(0, maxChips)
  const overflow = selected.length - chips.length
  const single = !multiple && selected[0] ? byValue.get(selected[0]) : undefined

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listId : undefined}
          aria-label={props["aria-label"]}
          aria-labelledby={props["aria-labelledby"]}
          aria-invalid={invalid || undefined}
          data-slot="combobox-trigger"
          className={cn(
            "group/trigger flex min-h-9 w-full cursor-pointer items-center gap-2 rounded-facet border border-input bg-card px-3 text-left text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-150 hover:border-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 data-[state=open]:border-ring data-[state=open]:ring-2 data-[state=open]:ring-ring/30 aria-invalid:border-danger disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-placeholder",
            multiple && selected.length > 0 && "py-1 pl-1",
            className
          )}
        >
          {multiple ? (
            selected.length ? (
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                <AnimatePresence initial={false} mode="popLayout">
                  {chips.map((v) => {
                    const o = byValue.get(v)
                    return (
                      <motion.span
                        key={v}
                        layout
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={spring}
                        className="inline-flex h-6 items-center gap-1 rounded-facet-sm bg-secondary pr-1 pl-2 text-[13px] font-medium text-secondary-foreground"
                      >
                        {o?.label ?? v}
                        <span
                          role="button"
                          tabIndex={-1}
                          aria-label={`Remove ${o?.label ?? v}`}
                          onPointerDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggle(v)
                          }}
                          className="grid size-4 place-items-center rounded-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                          <X className="size-3" />
                        </span>
                      </motion.span>
                    )
                  })}
                  {overflow > 0 && (
                    <motion.span
                      key="more"
                      layout
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      className="inline-flex h-6 items-center rounded-facet-sm bg-primary-subtle px-2 text-[13px] font-medium text-brand"
                    >
                      +{overflow}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            ) : (
              <span className="flex-1 truncate text-placeholder">{placeholder}</span>
            )
          ) : (
            <span className="relative flex min-w-0 flex-1 overflow-hidden">
              <motion.span
                key={single?.value ?? "__placeholder"}
                initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={spring}
                className={cn("flex min-w-0 items-center gap-2 truncate [&_svg]:size-4 [&_svg]:text-muted-foreground", !single && "text-placeholder")}
              >
                {single?.icon}
                {single?.label ?? placeholder}
              </motion.span>
            </span>
          )}
          <ChevronsUpDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/trigger:scale-y-75" />
        </button>
      </PopoverPrimitive.Trigger>
      <AnimatePresence>
        {open && (
          <PopoverPrimitive.Portal forceMount>
            <PopoverPrimitive.Content
              forceMount
              asChild
              align="start"
              sideOffset={6}
              onOpenAutoFocus={(e) => {
                if (!searchable) {
                  e.preventDefault()
                  cmdkRef.current?.focus()
                }
              }}
            >
              <motion.div
                data-slot="combobox-content"
                variants={panel}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ transformOrigin: "var(--radix-popover-content-transform-origin)" }}
                className={cn(
                  "z-50 w-(--radix-popover-trigger-width) min-w-[200px] overflow-hidden rounded-facet-lg border border-border bg-popover text-popover-foreground shadow-[0_2px_4px_-1px_rgb(10_10_31/0.06),0_12px_24px_-4px_rgb(10_10_31/0.12)] outline-none",
                  contentClassName
                )}
              >
                <CommandPrimitive
                  ref={cmdkRef}
                  loop
                  value={highlighted}
                  onValueChange={setHighlighted}
                  tabIndex={searchable ? undefined : 0}
                  className="outline-none"
                >
                  {searchable && (
                    <div className="flex items-center gap-2 border-b border-border-subtle px-2.5">
                      <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <CommandPrimitive.Input
                        value={search}
                        onValueChange={setSearch}
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder.replace(/…$/, "")}
                        className="h-9 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-placeholder"
                      />
                    </div>
                  )}
                  <CommandPrimitive.List
                    id={listId}
                    aria-multiselectable={multiple || undefined}
                    className="max-h-[280px] overflow-y-auto overscroll-contain p-1 outline-none [scrollbar-width:thin]"
                  >
                    <CommandPrimitive.Empty>
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-3 py-6 text-center text-sm text-muted-foreground"
                      >
                        {emptyText}
                      </motion.div>
                    </CommandPrimitive.Empty>
                    {groups.map(([group, items], gi) => (
                      <CommandPrimitive.Group
                        key={group || gi}
                        heading={group || undefined}
                        className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-[0.06em] [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase"
                      >
                        {items.map((o) => {
                          const isSelected = selected.includes(o.value)
                          const isActive = highlighted === o.value
                          return (
                            <CommandPrimitive.Item
                              key={o.value}
                              value={o.value}
                              keywords={[o.label, ...(o.keywords ?? [])]}
                              disabled={o.disabled}
                              onSelect={() => toggle(o.value)}
                              aria-checked={multiple ? isSelected : undefined}
                              asChild
                            >
                              <motion.div
                                variants={row}
                                data-slot="combobox-item"
                                data-checked={isSelected || undefined}
                                className="relative isolate flex h-8 cursor-pointer items-center gap-2 rounded-facet-sm pr-2 pl-2.5 text-sm text-foreground outline-none select-none data-[checked]:font-medium data-[disabled=true]:pointer-events-none data-[disabled=true]:text-placeholder [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground"
                              >
                                {isActive && (
                                  <motion.span
                                    layoutId={`${listId}-hl`}
                                    aria-hidden="true"
                                    className="absolute inset-0 -z-10 rounded-facet-sm bg-accent"
                                    transition={{ type: "spring", stiffness: 700, damping: 45 }}
                                  >
                                    <span className="absolute top-[7px] bottom-[7px] left-0 w-0.5 rounded-full bg-primary" />
                                  </motion.span>
                                )}
                                {multiple && (
                                  <span
                                    aria-hidden="true"
                                    className={cn(
                                      "grid size-4 shrink-0 place-items-center rounded-[4px] border-[1.5px] transition-colors",
                                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card"
                                    )}
                                  >
                                    <AnimatePresence>
                                      {isSelected && (
                                        <svg viewBox="0 0 24 24" className="size-3 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                                          <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ pathLength: 0 }} transition={{ duration: 0.2, ease }} />
                                        </svg>
                                      )}
                                    </AnimatePresence>
                                  </span>
                                )}
                                {o.icon}
                                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                                {o.hint && <span className="text-xs text-muted-foreground">{o.hint}</span>}
                                {!multiple && <AnimatePresence>{isSelected && <CheckMark />}</AnimatePresence>}
                              </motion.div>
                            </CommandPrimitive.Item>
                          )
                        })}
                      </CommandPrimitive.Group>
                    ))}
                  </CommandPrimitive.List>
                </CommandPrimitive>
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </PopoverPrimitive.Root>
  )
}

export { Combobox }
