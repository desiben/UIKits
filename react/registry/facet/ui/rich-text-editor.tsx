"use client"

import * as React from "react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { Toolbar as ToolbarPrimitive } from "radix-ui"
import {
  Bold,
  Check,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  X,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, popIn, spring } from "@/registry/facet/lib/motion"
import { AnimatedNumber } from "@/registry/facet/ui/number-stepper"

/* A deliberately small contentEditable editor (document.execCommand). It is fine for comments,
   notes and demos; swap in Tiptap or Lexical when you need a real document model. */

type InlineCmd = "bold" | "italic" | "underline" | "strikeThrough"
type ListCmd = "insertUnorderedList" | "insertOrderedList"
type Block = "p" | "h2" | "blockquote"

const INLINE: { cmd: InlineCmd; label: string; icon: LucideIcon; key: string }[] = [
  { cmd: "bold", label: "Bold", icon: Bold, key: "B" },
  { cmd: "italic", label: "Italic", icon: Italic, key: "I" },
  { cmd: "underline", label: "Underline", icon: Underline, key: "U" },
  { cmd: "strikeThrough", label: "Strikethrough", icon: Strikethrough, key: "" },
]
const LISTS: { cmd: ListCmd; label: string; icon: LucideIcon }[] = [
  { cmd: "insertUnorderedList", label: "Bulleted list", icon: List },
  { cmd: "insertOrderedList", label: "Numbered list", icon: ListOrdered },
]

type Active = Record<InlineCmd | ListCmd | "link", boolean>
const NONE: Active = {
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  insertUnorderedList: false,
  insertOrderedList: false,
  link: false,
}

const bar: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025 } },
}
const barItem: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.base, ease } },
}

function ToolButton({
  label,
  pressed,
  onPress,
  children,
  tone = "default",
  disabled,
}: {
  label: string
  pressed?: boolean
  onPress: () => void
  children: React.ReactNode
  tone?: "default" | "inverse"
  disabled?: boolean
}) {
  return (
    <ToolbarPrimitive.Button asChild disabled={disabled}>
      <motion.button
        type="button"
        aria-label={label}
        title={label}
        aria-pressed={pressed}
        variants={tone === "default" ? barItem : undefined}
        whileTap={{ scale: 0.88 }}
        transition={spring}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onPress}
        className={cn(
          "relative isolate grid size-[30px] shrink-0 cursor-pointer place-items-center rounded-facet-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
          tone === "default"
            ? "text-foreground-secondary hover:bg-accent hover:text-foreground aria-pressed:text-brand"
            : "size-7 text-inverse-foreground hover:bg-inverse-foreground/15 aria-pressed:text-brand-300 [&_svg]:size-3.5"
        )}
      >
        <AnimatePresence initial={false}>
          {pressed && tone === "default" && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-facet-sm bg-primary-subtle"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={spring}
            />
          )}
        </AnimatePresence>
        {children}
      </motion.button>
    </ToolbarPrimitive.Button>
  )
}

function Sep() {
  return <ToolbarPrimitive.Separator className="mx-1 h-[18px] w-px shrink-0 bg-border" />
}

export interface RichTextEditorProps extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  /** Initial HTML. */
  defaultValue?: string
  /** Called with the editor's HTML after every edit. */
  onChange?: (html: string) => void
  placeholder?: string
  /** Accessible name for the editable area. */
  "aria-label"?: string
  /** Floating formatting bubble on text selection. Defaults to true. */
  bubble?: boolean
  /** Footer with animated word and character counts. Defaults to true. */
  footer?: boolean
  contentClassName?: string
}

function RichTextEditor({
  defaultValue = "",
  onChange,
  placeholder = "Write something…",
  "aria-label": ariaLabel = "Editor",
  bubble = true,
  footer = true,
  className,
  contentClassName,
  ...props
}: RichTextEditorProps) {
  const root = React.useRef<HTMLDivElement>(null)
  const editor = React.useRef<HTMLDivElement>(null)
  const savedRange = React.useRef<Range | null>(null)
  const [active, setActive] = React.useState<Active>(NONE)
  const [block, setBlock] = React.useState<Block>("p")
  const [counts, setCounts] = React.useState({ words: 0, chars: 0 })
  const [empty, setEmpty] = React.useState(!defaultValue)
  const [bubbleAt, setBubbleAt] = React.useState<{ x: number; y: number } | null>(null)
  const [linkOpen, setLinkOpen] = React.useState(false)
  const [url, setUrl] = React.useState("")

  const measure = React.useCallback(() => {
    const el = editor.current
    if (!el) return
    const text = el.innerText.replace(/​/g, "")
    const trimmed = text.trim()
    setCounts({ words: trimmed ? trimmed.split(/\s+/).length : 0, chars: trimmed.length })
    setEmpty(!trimmed && !el.querySelector("li, img"))
  }, [])

  React.useLayoutEffect(() => {
    if (editor.current) editor.current.innerHTML = defaultValue
    measure()
    // initial content only — the editor is uncontrolled after mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sync = React.useCallback(() => {
    const el = editor.current
    const sel = document.getSelection()
    if (!el || !sel || sel.rangeCount === 0 || !el.contains(sel.anchorNode)) {
      setBubbleAt(null)
      return
    }
    const anchor = sel.anchorNode instanceof Element ? sel.anchorNode : sel.anchorNode?.parentElement
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      link: !!anchor?.closest("a"),
    })
    const b = anchor?.closest("h2, blockquote, p")
    setBlock(b && el.contains(b) ? (b.tagName.toLowerCase() as Block) : "p")
    if (bubble && !sel.isCollapsed && root.current) {
      const r = sel.getRangeAt(0).getBoundingClientRect()
      const host = root.current.getBoundingClientRect()
      if (r.width > 0) setBubbleAt({ x: r.left + r.width / 2 - host.left, y: r.top - host.top })
    } else {
      setBubbleAt(null)
    }
  }, [bubble])

  React.useEffect(() => {
    document.addEventListener("selectionchange", sync)
    return () => document.removeEventListener("selectionchange", sync)
  }, [sync])

  const changed = () => {
    measure()
    sync()
    onChange?.(editor.current?.innerHTML ?? "")
  }

  const exec = (cmd: string, value?: string) => {
    editor.current?.focus()
    document.execCommand(cmd, false, value)
    changed()
  }

  const openLink = () => {
    const sel = document.getSelection()
    if (active.link) {
      exec("unlink")
      return
    }
    if (sel && sel.rangeCount) savedRange.current = sel.getRangeAt(0).cloneRange()
    setUrl("https://")
    setLinkOpen(true)
  }

  const applyLink = () => {
    const sel = document.getSelection()
    editor.current?.focus()
    if (savedRange.current && sel) {
      sel.removeAllRanges()
      sel.addRange(savedRange.current)
    }
    if (url && url !== "https://") {
      if (sel?.isCollapsed) document.execCommand("insertHTML", false, `<a href="${encodeURI(url)}">${url.replace(/[<>&"]/g, "")}</a>`)
      else document.execCommand("createLink", false, url)
    }
    setLinkOpen(false)
    changed()
  }

  return (
    <div
      ref={root}
      data-slot="rich-text-editor"
      className={cn(
        "relative w-full rounded-facet-lg border border-input bg-card transition-[border-color,box-shadow] duration-150 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
        className
      )}
      {...props}
    >
      <ToolbarPrimitive.Root asChild aria-label="Formatting">
        <motion.div
          variants={bar}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center gap-0.5 rounded-t-[inherit] border-b border-border-subtle bg-subtle p-1"
        >
          <motion.span variants={barItem} className="inline-flex">
            <select
              aria-label="Block style"
              value={block}
              onChange={(e) => {
                const v = e.target.value as Block
                exec("formatBlock", v === "p" ? "<p>" : `<${v}>`)
                setBlock(v)
              }}
              className="h-[30px] cursor-pointer rounded-facet-sm border-0 bg-transparent px-1.5 text-[13px] font-medium text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="p">Paragraph</option>
              <option value="h2">Heading</option>
              <option value="blockquote">Quote</option>
            </select>
          </motion.span>
          <Sep />
          {INLINE.map(({ cmd, label, icon: Icon, key }) => (
            <ToolButton key={cmd} label={key ? `${label} (⌘${key})` : label} pressed={active[cmd]} onPress={() => exec(cmd)}>
              <Icon />
            </ToolButton>
          ))}
          <Sep />
          {LISTS.map(({ cmd, label, icon: Icon }) => (
            <ToolButton key={cmd} label={label} pressed={active[cmd]} onPress={() => exec(cmd)}>
              <Icon />
            </ToolButton>
          ))}
          <ToolButton label={active.link ? "Remove link" : "Link"} pressed={active.link || linkOpen} onPress={openLink}>
            <Link2 />
          </ToolButton>
          <AnimatePresence initial={false}>
            {linkOpen && (
              <motion.form
                key="link"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={spring}
                className="flex items-center gap-0.5 overflow-hidden"
                onSubmit={(e) => {
                  e.preventDefault()
                  applyLink()
                }}
              >
                <input
                  autoFocus
                  aria-label="Link URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setLinkOpen(false)}
                  className="ml-1 h-[26px] w-44 rounded-facet-sm border border-input bg-card px-2 text-[13px] text-foreground outline-none focus-visible:border-ring"
                />
                <button type="submit" aria-label="Apply link" className="grid size-[26px] cursor-pointer place-items-center rounded-facet-sm text-success hover:bg-accent">
                  <Check className="size-4" />
                </button>
                <button type="button" aria-label="Cancel" onClick={() => setLinkOpen(false)} className="grid size-[26px] cursor-pointer place-items-center rounded-facet-sm text-muted-foreground hover:bg-accent">
                  <X className="size-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
          <span className="flex-1" />
          <ToolButton label="Undo" onPress={() => exec("undo")}>
            <Undo2 />
          </ToolButton>
          <ToolButton label="Redo" onPress={() => exec("redo")}>
            <Redo2 />
          </ToolButton>
        </motion.div>
      </ToolbarPrimitive.Root>

      <div className="relative">
        {empty && (
          <span aria-hidden="true" className="pointer-events-none absolute top-4 left-4 text-[15px] text-placeholder">
            {placeholder}
          </span>
        )}
        <div
          ref={editor}
          data-slot="rich-text-editor-content"
          role="textbox"
          aria-multiline="true"
          aria-label={ariaLabel}
          contentEditable
          suppressContentEditableWarning
          onInput={changed}
          onBlur={() => setTimeout(() => setBubbleAt(null), 120)}
          onKeyDown={(e) => {
            if (!(e.metaKey || e.ctrlKey)) return
            const k = e.key.toLowerCase()
            const hit = INLINE.find((i) => i.key.toLowerCase() === k)
            if (hit) {
              e.preventDefault()
              exec(hit.cmd)
            }
          }}
          className={cn(
            "min-h-40 px-4 py-4 text-[15px] leading-6 text-foreground outline-none",
            "[&_h2]:mb-2 [&_h2]:text-lg [&_h2]:leading-7 [&_h2]:font-semibold [&_p]:mb-2 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5",
            "[&_blockquote]:mb-2 [&_blockquote]:border-l-[3px] [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:text-foreground-secondary [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2",
            contentClassName
          )}
        />
      </div>

      {footer && (
        <div className="flex items-center justify-between border-t border-border-subtle px-3 py-1.5 text-xs text-muted-foreground">
          <span>
            <AnimatedNumber value={counts.words} /> {counts.words === 1 ? "word" : "words"}
          </span>
          <span>
            <AnimatedNumber value={counts.chars} /> characters
          </span>
        </div>
      )}

      <AnimatePresence>
        {bubble && bubbleAt && !linkOpen && (
          <motion.div
            key="bubble"
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ left: bubbleAt.x, top: bubbleAt.y }}
            className="absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+8px)]"
          >
            <motion.div
              variants={popIn}
              style={{ transformOrigin: "50% 100%" }}
              className="flex gap-0.5 rounded-facet bg-inverse p-[3px] shadow-[0_12px_24px_-4px_rgb(10_10_31/0.25)]"
            >
            <ToolbarPrimitive.Root asChild aria-label="Selection formatting">
              <div className="flex gap-0.5">
                {INLINE.slice(0, 3).map(({ cmd, label, icon: Icon }) => (
                  <ToolButton key={cmd} tone="inverse" label={label} pressed={active[cmd]} onPress={() => exec(cmd)}>
                    <Icon />
                  </ToolButton>
                ))}
                <ToolButton tone="inverse" label="Link" pressed={active.link} onPress={openLink}>
                  <Link2 />
                </ToolButton>
              </div>
            </ToolbarPrimitive.Root>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { RichTextEditor }
