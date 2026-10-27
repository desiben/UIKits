"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { ChevronRight, FileCode, FileImage, FileText, File, Folder, FolderOpen } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { ease, spring } from "@/registry/facet/lib/motion"

interface FileTreeItem {
  id: string
  name: string
  /** Folders have children (an empty array is an empty folder). */
  children?: FileTreeItem[]
  icon?: React.ReactNode
  /** Trailing metadata, e.g. "16 KB". */
  meta?: React.ReactNode
  /** Status dot (e.g. modified). */
  status?: "modified" | "added" | "deleted"
}

interface FileTreeProps extends Omit<React.ComponentProps<"div">, "onSelect"> {
  items: FileTreeItem[]
  selectedKey?: string | null
  defaultSelectedKey?: string | null
  onSelect?: (id: string, item: FileTreeItem) => void
  expandedKeys?: string[]
  defaultExpandedKeys?: string[]
  onExpandedChange?: (keys: string[]) => void
  label?: string
}

interface Ctx {
  expanded: Set<string>
  toggle: (id: string, open?: boolean) => void
  selected: string | null
  select: (item: FileTreeItem) => void
  focusId: string | null
  setFocusId: (id: string) => void
  layoutId: string
}
const TreeContext = React.createContext<Ctx | null>(null)

function fileIcon(name: string) {
  if (/\.(tsx?|jsx?|css|json|html)$/.test(name)) return <FileCode />
  if (/\.(png|jpe?g|svg|gif|webp)$/.test(name)) return <FileImage />
  if (/\.(md|txt|mdx)$/.test(name)) return <FileText />
  return <File />
}

const statusColor = { modified: "bg-warning-solid", added: "bg-success-solid", deleted: "bg-destructive" } as const

function flattenVisible(items: FileTreeItem[], expanded: Set<string>, out: FileTreeItem[] = [], parents = new Map<string, string>(), parent?: string) {
  for (const it of items) {
    out.push(it)
    if (parent) parents.set(it.id, parent)
    if (it.children && expanded.has(it.id)) flattenVisible(it.children, expanded, out, parents, it.id)
  }
  return { list: out, parents }
}

function FileTree({
  items,
  selectedKey,
  defaultSelectedKey = null,
  onSelect,
  expandedKeys,
  defaultExpandedKeys = [],
  onExpandedChange,
  label = "Files",
  className,
  ...props
}: FileTreeProps) {
  const [innerSel, setInnerSel] = React.useState(defaultSelectedKey)
  const [innerExp, setInnerExp] = React.useState(defaultExpandedKeys)
  const selected = selectedKey !== undefined ? selectedKey : innerSel
  const expandedArr = expandedKeys ?? innerExp
  const expanded = React.useMemo(() => new Set(expandedArr), [expandedArr])
  const [focusId, setFocusId] = React.useState<string | null>(selected ?? items[0]?.id ?? null)
  const ref = React.useRef<HTMLUListElement>(null)
  const layoutId = React.useId()

  const toggle = React.useCallback(
    (id: string, open?: boolean) => {
      const isOpen = expanded.has(id)
      const want = open ?? !isOpen
      if (want === isOpen) return
      const next = want ? [...expanded, id] : [...expanded].filter((k) => k !== id)
      if (expandedKeys === undefined) setInnerExp(next)
      onExpandedChange?.(next)
    },
    [expanded, expandedKeys, onExpandedChange]
  )
  const select = (item: FileTreeItem) => {
    if (selectedKey === undefined) setInnerSel(item.id)
    onSelect?.(item.id, item)
  }

  const focusItem = (id: string) => {
    setFocusId(id)
    requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)?.focus())
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const { list, parents } = flattenVisible(items, expanded)
    const i = list.findIndex((it) => it.id === focusId)
    const cur = list[i]
    if (!cur) return
    const isFolder = !!cur.children
    switch (e.key) {
      case "ArrowDown":
        if (list[i + 1]) focusItem(list[i + 1].id)
        break
      case "ArrowUp":
        if (list[i - 1]) focusItem(list[i - 1].id)
        break
      case "Home":
        focusItem(list[0].id)
        break
      case "End":
        focusItem(list[list.length - 1].id)
        break
      case "ArrowRight":
        if (isFolder && !expanded.has(cur.id)) toggle(cur.id, true)
        else if (isFolder && cur.children?.[0]) focusItem(cur.children[0].id)
        break
      case "ArrowLeft":
        if (isFolder && expanded.has(cur.id)) toggle(cur.id, false)
        else if (parents.get(cur.id)) focusItem(parents.get(cur.id)!)
        break
      case "Enter":
      case " ":
        if (isFolder) toggle(cur.id)
        else select(cur)
        break
      default:
        return
    }
    e.preventDefault()
  }

  return (
    <TreeContext.Provider value={{ expanded, toggle, selected, select, focusId, setFocusId, layoutId }}>
      <div data-slot="file-tree" className={cn("select-none p-1 text-sm text-foreground-secondary", className)} {...props}>
        <ul ref={ref} role="tree" aria-label={label} onKeyDown={onKeyDown} className="m-0 list-none p-0">
          {items.map((it) => (
            <TreeNode key={it.id} item={it} level={1} />
          ))}
        </ul>
      </div>
    </TreeContext.Provider>
  )
}

function TreeNode({ item, level }: { item: FileTreeItem; level: number }) {
  const ctx = React.useContext(TreeContext)!
  const isFolder = !!item.children
  const open = isFolder && ctx.expanded.has(item.id)
  const isSelected = ctx.selected === item.id

  return (
    <li
      role="treeitem"
      aria-level={level}
      aria-expanded={isFolder ? open : undefined}
      aria-selected={isFolder ? undefined : isSelected}
      data-id={item.id}
      tabIndex={ctx.focusId === item.id ? 0 : -1}
      onFocus={(e) => {
        if (e.target === e.currentTarget) ctx.setFocusId(item.id)
      }}
      className="outline-none"
    >
      <motion.div
        data-slot="file-tree-row"
        onClick={() => {
          ctx.setFocusId(item.id)
          if (isFolder) ctx.toggle(item.id)
          else ctx.select(item)
        }}
        whileTap={{ scale: 0.98 }}
        transition={spring}
        className={cn(
          "relative flex h-7 cursor-pointer items-center gap-1.5 rounded-facet-sm px-2 whitespace-nowrap transition-colors hover:bg-accent hover:text-foreground",
          "[li:focus-visible>&]:ring-2 [li:focus-visible>&]:ring-ring [li:focus-visible>&]:ring-inset",
          isSelected && "text-foreground",
          "[&_svg]:size-[15px] [&_svg]:shrink-0 [&_svg]:text-muted-foreground"
        )}
      >
        {isSelected && (
          <motion.span
            layoutId={`${ctx.layoutId}-sel`}
            transition={spring}
            className="absolute inset-0 rounded-facet-sm bg-primary-subtle"
            aria-hidden="true"
          />
        )}
        <span className="relative flex min-w-0 flex-1 items-center gap-1.5">
          {isFolder ? (
            <>
              <motion.span initial={false} animate={{ rotate: open ? 90 : 0 }} transition={spring} className="inline-flex">
                <ChevronRight className="!size-3" />
              </motion.span>
              <span className="relative inline-grid size-[15px]">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={open ? "open" : "closed"}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={spring}
                    className={cn("inline-flex", open && "[&_svg]:!text-brand")}
                  >
                    {item.icon ?? (open ? <FolderOpen /> : <Folder />)}
                  </motion.span>
                </AnimatePresence>
              </span>
            </>
          ) : (
            <span className="inline-flex pl-[18px]">{item.icon ?? fileIcon(item.name)}</span>
          )}
          <span className="truncate">{item.name}</span>
          {item.status && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={spring}
              title={item.status}
              className={cn("ml-auto size-1.5 flex-none rounded-full", statusColor[item.status])}
            />
          )}
          {item.meta && !item.status && <span className="ml-auto pl-2 text-xs text-muted-foreground">{item.meta}</span>}
        </span>
      </motion.div>
      {isFolder && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              role="group"
              key="group"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ height: { duration: 0.24, ease }, opacity: { duration: 0.18 } }}
              className="ml-[13px] list-none overflow-hidden border-l border-border-subtle p-0 pl-2"
            >
              {item.children!.map((child) => (
                <TreeNode key={child.id} item={child} level={level + 1} />
              ))}
              {item.children!.length === 0 && <li className="h-7 px-2 pl-[26px] text-xs leading-7 text-muted-foreground italic">Empty</li>}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  )
}

export { FileTree }
export type { FileTreeItem, FileTreeProps }
