"use client"

import * as React from "react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { Ellipsis, Pencil, Trash2 } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { ease, popIn, spring, springSoft } from "@/registry/facet/lib/motion"

export type ChatThread = {
  id: string
  title: string
  preview?: string
  time?: string
  unread?: boolean
}
export type ChatThreadGroup = { label: string; threads: ChatThread[] }

export interface ChatListViewProps extends Omit<React.ComponentProps<"nav">, "onSelect"> {
  groups: ChatThreadGroup[]
  selectedId?: string
  onSelect?: (id: string) => void
  onRename?: (id: string) => void
  onDelete?: (id: string) => void
}

function ThreadMenu({ thread, onRename, onDelete }: { thread: ChatThread; onRename?: (id: string) => void; onDelete?: (id: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const item =
    "flex h-8 cursor-pointer items-center gap-2 rounded-facet-sm px-2 text-[13px] outline-none select-none data-[highlighted]:bg-accent [&_svg]:size-3.5"
  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger
        aria-label={`More options for ${thread.title}`}
        className={cn(
          "relative z-10 grid size-6 shrink-0 cursor-pointer place-items-center rounded-facet-sm text-muted-foreground opacity-0 outline-none transition-opacity group-hover/thread:opacity-100 hover:bg-background/60 hover:text-foreground focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:opacity-100 [&_svg]:size-4"
        )}
      >
        <Ellipsis />
      </DropdownMenuPrimitive.Trigger>
      <AnimatePresence>
        {open && (
          <DropdownMenuPrimitive.Portal forceMount>
            <DropdownMenuPrimitive.Content forceMount asChild align="end" sideOffset={4}>
              <motion.div
                variants={popIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)" }}
                className="z-50 min-w-36 rounded-facet-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
              >
                <DropdownMenuPrimitive.Item className={item} onSelect={() => onRename?.(thread.id)}>
                  <Pencil /> Rename
                </DropdownMenuPrimitive.Item>
                <DropdownMenuPrimitive.Item className={cn(item, "text-danger data-[highlighted]:bg-danger-subtle")} onSelect={() => onDelete?.(thread.id)}>
                  <Trash2 /> Delete
                </DropdownMenuPrimitive.Item>
              </motion.div>
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        )}
      </AnimatePresence>
    </DropdownMenuPrimitive.Root>
  )
}

/** Sidebar chat threads grouped by date, with a sliding selection, unread dots and a hover menu. */
function ChatListView({ groups, selectedId, onSelect, onRename, onDelete, className, "aria-label": ariaLabel = "Chats", ...props }: ChatListViewProps) {
  const id = React.useId()
  const hasMenu = Boolean(onRename || onDelete)
  return (
    <nav data-slot="chat-list-view" aria-label={ariaLabel} className={cn("flex flex-col", className)} {...props}>
      <LayoutGroup id={id}>
        <AnimatePresence initial={false}>
          {groups
            .filter((g) => g.threads.length)
            .map((g) => (
              <motion.div key={g.label} layout="position" exit={{ opacity: 0 }} transition={springSoft} role="group" aria-label={g.label}>
                <div className="px-2.5 pt-3 pb-1 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">{g.label}</div>
                <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                  <AnimatePresence initial={false}>
                    {g.threads.map((t) => {
                      const current = t.id === selectedId
                      return (
                        <motion.li
                          key={t.id}
                          layout="position"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0, transition: { duration: 0.2, ease } }}
                          transition={springSoft}
                          className="group/thread relative"
                        >
                          {current && (
                            <motion.span
                              layoutId="chat-list-selected"
                              className="absolute inset-0 rounded-facet bg-accent"
                              transition={spring}
                              aria-hidden="true"
                            />
                          )}
                          <div
                            className={cn(
                              "relative flex items-center gap-2.5 rounded-facet px-2.5 py-2 transition-colors",
                              !current && "hover:bg-accent/60"
                            )}
                          >
                            <button
                              type="button"
                              aria-current={current ? "page" : undefined}
                              onClick={() => onSelect?.(t.id)}
                              className="absolute inset-0 cursor-pointer rounded-facet outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <span className="sr-only">
                                {t.title}
                                {t.unread ? " (unread)" : ""}
                              </span>
                            </button>
                            <div className="pointer-events-none min-w-0 flex-1" aria-hidden="true">
                              <b className={cn("block truncate text-[13px] text-foreground", t.unread ? "font-semibold" : "font-medium")}>{t.title}</b>
                              {t.preview && <span className="block truncate text-xs text-muted-foreground">{t.preview}</span>}
                            </div>
                            <div className="pointer-events-none flex shrink-0 items-center gap-1 self-start pt-0.5" aria-hidden="true">
                              {t.time && <time className={cn("text-xs text-muted-foreground transition-opacity", hasMenu && "group-hover/thread:opacity-0")}>{t.time}</time>}
                              <AnimatePresence>
                                {t.unread && (
                                  <motion.span
                                    className={cn("size-[7px] rounded-full bg-primary", hasMenu && "group-hover/thread:opacity-0")}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={spring}
                                  />
                                )}
                              </AnimatePresence>
                            </div>
                            {hasMenu && (
                              <div className="absolute top-1.5 right-1.5">
                                <ThreadMenu thread={t} onRename={onRename} onDelete={onDelete} />
                              </div>
                            )}
                          </div>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>
              </motion.div>
            ))}
        </AnimatePresence>
      </LayoutGroup>
    </nav>
  )
}

export { ChatListView }
