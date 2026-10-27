"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { springSoft } from "@/registry/facet/lib/motion"
import { CodeBlock } from "@/registry/facet/ui/code-block"

/* ---------- block parser (safe subset, no HTML passthrough) ---------- */

type ListItem = { text: string; task?: boolean; checked?: boolean }
type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; start: number; items: ListItem[] }
  | { type: "code"; lang: string; code: string }
  | { type: "quote"; text: string }
  | { type: "hr" }
  | { type: "table"; head: string[]; rows: string[][] }

const splitRow = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim())

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, "\n").split("\n")
  const blocks: Block[] = []
  let para: string[] = []
  const flush = () => {
    if (para.length) blocks.push({ type: "paragraph", text: para.join(" ") })
    para = []
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fence = line.match(/^\s*```\s*([\w+-]*)/)
    if (fence) {
      flush()
      const body: string[] = []
      i++
      while (i < lines.length && !/^\s*```/.test(lines[i])) body.push(lines[i++])
      blocks.push({ type: "code", lang: fence[1], code: body.join("\n") })
      continue
    }
    if (!line.trim()) {
      flush()
      continue
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      flush()
      blocks.push({ type: "heading", level: h[1].length, text: h[2].replace(/\s+#+\s*$/, "") })
      continue
    }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
      flush()
      blocks.push({ type: "hr" })
      continue
    }
    if (/^\s*>/.test(line)) {
      flush()
      const q: string[] = []
      while (i < lines.length && /^\s*>/.test(lines[i])) q.push(lines[i++].replace(/^\s*>\s?/, ""))
      i--
      blocks.push({ type: "quote", text: q.join(" ") })
      continue
    }
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
      flush()
      const head = splitRow(line)
      const rows: string[][] = []
      i += 2
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(splitRow(lines[i++]))
      i--
      blocks.push({ type: "table", head, rows })
      continue
    }
    const li = line.match(/^\s*(?:([-*+])|(\d+)[.)])\s+(.*)$/)
    if (li) {
      flush()
      const ordered = !li[1]
      const items: ListItem[] = []
      const start = ordered ? Number(li[2]) : 1
      while (i < lines.length) {
        const m = lines[i].match(/^\s*(?:([-*+])|(\d+)[.)])\s+(.*)$/)
        if (!m || !m[1] !== ordered) break
        const task = m[3].match(/^\[( |x|X)\]\s+(.*)$/)
        items.push(task ? { text: task[2], task: true, checked: task[1] !== " " } : { text: m[3] })
        i++
      }
      i--
      blocks.push({ type: "list", ordered, start, items })
      continue
    }
    para.push(line.trim())
  }
  flush()
  return blocks
}

/* ---------- inline parser ---------- */

const SAFE_URL = /^(https?:\/\/|mailto:|#|\/(?!\/))/i
const INLINE =
  /(`+)([^`]+?)\1|\*\*(.+?)\*\*|__(.+?)__|~~(.+?)~~|\*(?!\s)(.+?)\*|(?<![\w])_(?!\s)(.+?)_(?![\w])|\[([^\]]+)\]\(([^)\s]+)\)|<(https?:\/\/[^>\s]+)>/g

function renderInline(text: string, key = "i"): React.ReactNode[] {
  const out: React.ReactNode[] = []
  let last = 0
  let n = 0
  for (const m of text.matchAll(INLINE)) {
    const i = m.index ?? 0
    if (i > last) out.push(text.slice(last, i))
    const k = `${key}-${n++}`
    if (m[2] != null) out.push(<code key={k} className="rounded bg-muted px-[5px] py-0.5 font-mono text-[0.88em] font-medium text-foreground">{m[2]}</code>)
    else if (m[3] != null || m[4] != null) out.push(<strong key={k} className="font-semibold text-foreground">{renderInline(m[3] ?? m[4], k)}</strong>)
    else if (m[5] != null) out.push(<del key={k}>{renderInline(m[5], k)}</del>)
    else if (m[6] != null || m[7] != null) out.push(<em key={k}>{renderInline(m[6] ?? m[7], k)}</em>)
    else if (m[8] != null || m[10] != null) {
      const href = m[9] ?? m[10]
      const label = m[8] != null ? renderInline(m[8], k) : href
      out.push(
        SAFE_URL.test(href) ? (
          <a
            key={k}
            href={href}
            className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition-colors hover:decoration-brand"
            {...(/^https?:/i.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {label}
          </a>
        ) : (
          <React.Fragment key={k}>{label}</React.Fragment>
        )
      )
    }
    last = i + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/* ---------- component ---------- */

export interface MarkdownProps extends Omit<HTMLMotionProps<"div">, "children"> {
  /** Markdown source. Raw HTML is shown as text, never injected. */
  children: string
  /** Fade/rise each block in as it appears (great while streaming). */
  animate?: boolean
}

const headingClass: Record<number, string> = {
  1: "mt-6 text-2xl font-semibold tracking-tight",
  2: "mt-6 text-xl font-semibold tracking-tight",
  3: "mt-5 text-base font-semibold",
  4: "mt-4 text-sm font-semibold",
  5: "mt-4 text-sm font-semibold",
  6: "mt-4 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground",
}

/** Renders a safe Markdown subset (headings, lists, tasks, quotes, code, tables, links, emphasis) with Facet prose styles. */
function Markdown({ children, animate = true, className, ...props }: MarkdownProps) {
  const blocks = React.useMemo(() => parseBlocks(children ?? ""), [children])
  const enter = {
    initial: animate ? { opacity: 0, y: 6 } : false,
    animate: { opacity: 1, y: 0 },
    transition: springSoft,
  } as const

  return (
    <motion.div
      data-slot="markdown"
      className={cn("max-w-[68ch] text-sm leading-6 text-foreground-secondary [&>*+*]:mt-3 [&>*:first-child]:mt-0", className)}
      {...props}
    >
      {blocks.map((b, i) => {
        const key = `${i}-${b.type}`
        switch (b.type) {
          case "heading": {
            const H = (["h1", "h2", "h3", "h4", "h5", "h6"] as const)[b.level - 1]
            const MH = motion[H]
            return (
              <MH key={key} {...enter} className={cn("text-foreground", headingClass[b.level])}>
                {renderInline(b.text, key)}
              </MH>
            )
          }
          case "paragraph":
            return (
              <motion.p key={key} {...enter} className="m-0">
                {renderInline(b.text, key)}
              </motion.p>
            )
          case "list": {
            const L = b.ordered ? motion.ol : motion.ul
            return (
              <L
                key={key}
                {...enter}
                start={b.ordered && b.start !== 1 ? b.start : undefined}
                className={cn("m-0 pl-[1.3em] marker:text-brand [&>li+li]:mt-1", b.ordered ? "list-decimal" : "list-disc")}
              >
                {b.items.map((it, j) =>
                  it.task ? (
                    <li key={j} className="-ml-[1.3em] flex list-none items-start gap-2">
                      <input type="checkbox" checked={it.checked} disabled readOnly className="mt-[5px] accent-primary" aria-label={it.checked ? "Done" : "Not done"} />
                      <span className={cn(it.checked && "text-muted-foreground line-through")}>{renderInline(it.text, `${key}-${j}`)}</span>
                    </li>
                  ) : (
                    <li key={j}>{renderInline(it.text, `${key}-${j}`)}</li>
                  )
                )}
              </L>
            )
          }
          case "code":
            return (
              <motion.div key={key} {...enter}>
                <CodeBlock language={b.lang || undefined} code={b.code} hideHeader={!b.lang} />
              </motion.div>
            )
          case "quote":
            return (
              <motion.blockquote key={key} {...enter} className="m-0 rounded-r-md border-l-[3px] border-brand bg-subtle px-4 py-2">
                {renderInline(b.text, key)}
              </motion.blockquote>
            )
          case "hr":
            return <motion.hr key={key} {...enter} className="my-6 h-px border-0 bg-border" />
          case "table":
            return (
              <motion.div key={key} {...enter} className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr>
                      {b.head.map((c, j) => (
                        <th key={j} className="border-b border-border px-3 py-2 text-left text-xs font-medium whitespace-nowrap text-muted-foreground">
                          {renderInline(c, `${key}-h${j}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((c, j) => (
                          <td key={j} className="border-b border-border-subtle px-3 py-2 whitespace-nowrap">
                            {renderInline(c, `${key}-${ri}-${j}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )
        }
      })}
    </motion.div>
  )
}

export { Markdown }
