"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { ease, spring, springBouncy } from "@/registry/facet/lib/motion"

/* ---------- tiny tokenizer (no highlighting library) ---------- */

const KEYWORDS = new Set(
  (
    "import export from default function return const let var if else for while do switch case break continue new class extends " +
    "interface type enum implements async await yield try catch finally throw typeof instanceof in of as void null undefined true false " +
    "this super static public private protected readonly def lambda pass elif None True False and or not with select where order by group " +
    "insert update delete into values join on limit"
  ).split(" ")
)
const HASH_COMMENT_LANGS = new Set(["sh", "bash", "shell", "zsh", "py", "python", "yaml", "yml", "toml", "rb", "ruby"])

type Token = { kind: "k" | "s" | "f" | "c" | "n" | "a" | "p"; text: string }

function tokenize(line: string, lang: string): Token[] {
  const hash = HASH_COMMENT_LANGS.has(lang)
  const sqlComment = lang === "sql" ? "|--.*$" : ""
  const re = new RegExp(
    `(?<c>\\/\\/.*$|\\/\\*.*?\\*\\/|<!--.*?-->${hash ? "|#.*$" : ""}${sqlComment})` +
      "|(?<s>\"(?:[^\"\\\\]|\\\\.)*\"?|'(?:[^'\\\\]|\\\\.)*'?|`(?:[^`\\\\]|\\\\.)*`?)" +
      "|(?<n>\\b\\d+(?:\\.\\d+)?\\b|--?[a-z][\\w-]*(?=\\s*:))" +
      "|(?<w>[A-Za-z_$][\\w$]*)",
    "g"
  )
  const out: Token[] = []
  let last = 0
  for (const m of line.matchAll(re)) {
    const i = m.index ?? 0
    if (i > last) out.push({ kind: "p", text: line.slice(last, i) })
    const g = m.groups ?? {}
    if (g.c) out.push({ kind: "c", text: g.c })
    else if (g.s) out.push({ kind: "s", text: g.s })
    else if (g.n) out.push({ kind: "n", text: g.n })
    else if (g.w) {
      const rest = line.slice(i + g.w.length)
      const kind: Token["kind"] = KEYWORDS.has(g.w) || KEYWORDS.has(g.w.toLowerCase()) && lang === "sql"
        ? "k"
        : /^\s*\(/.test(rest) || /^[A-Z]/.test(g.w)
          ? "f"
          : /^=["{]/.test(rest)
            ? "a"
            : "p"
      out.push({ kind, text: g.w })
    }
    last = i + m[0].length
  }
  if (last < line.length) out.push({ kind: "p", text: line.slice(last) })
  return out
}

const tokenClass: Record<Token["kind"], string> = {
  k: "text-pink-300",
  s: "text-orange-200",
  f: "text-indigo-300",
  c: "text-zinc-500 italic",
  n: "text-lime-300",
  a: "text-lime-300",
  p: "",
}

/* ---------- copy button ---------- */

function CodeBlockCopy({ text, className, label = true }: { text: string; className?: string; label?: boolean }) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])
  const onClick = async () => {
    try {
      await navigator.clipboard?.writeText(text)
    } catch {
      /* ignore */
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1600)
  }
  return (
    <motion.button
      type="button"
      data-slot="code-block-copy"
      onClick={onClick}
      aria-label={copied ? "Copied" : "Copy code"}
      whileTap={{ scale: 0.94 }}
      transition={spring}
      className={cn(
        "inline-flex h-7 cursor-pointer items-center gap-1.5 overflow-hidden rounded-facet-sm px-2 text-[12px] font-medium text-zinc-300 outline-none transition-colors hover:bg-zinc-800 hover:text-white focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "y" : "n"}
          className={cn("inline-flex items-center gap-1.5", copied && "text-emerald-300")}
          initial={{ opacity: 0, y: copied ? 10 : -10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: copied ? -10 : 10, scale: 0.8 }}
          transition={springBouncy}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {label && (copied ? "Copied" : "Copy")}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

/* ---------- code block ---------- */

export interface CodeBlockProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** The source. Either pass `code` or a string child. */
  code?: string
  children?: string
  language?: string
  filename?: string
  /** 1-based line numbers to highlight. */
  highlightLines?: number[]
  /** 1-based line numbers shown as added / removed (diff). */
  addedLines?: number[]
  removedLines?: number[]
  /** Treat leading "+" / "-" as diff markers. */
  diff?: boolean
  showLineNumbers?: boolean
  /** Hide the header bar (a floating copy button is shown instead). */
  hideHeader?: boolean
}

function CodeBlock({
  code,
  children,
  language = "",
  filename,
  highlightLines = [],
  addedLines = [],
  removedLines = [],
  diff = false,
  showLineNumbers = false,
  hideHeader = false,
  className,
  ...props
}: CodeBlockProps) {
  const source = (code ?? children ?? "").replace(/\n$/, "")
  const lang = language.toLowerCase()
  const lines = React.useMemo(() => source.split("\n"), [source])
  const showHead = !hideHeader && (filename || language)

  return (
    <div
      data-slot="code-block"
      className={cn(
        "group/code relative overflow-hidden rounded-facet-lg border border-zinc-800 bg-zinc-950 text-zinc-100 dark:border-zinc-800/80",
        className
      )}
      {...props}
    >
      {showHead ? (
        <div className="flex h-10 items-center gap-2 border-b border-zinc-800 pr-1.5 pl-3.5 text-[12px] font-medium text-zinc-400">
          {language && <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">{language}</span>}
          {filename && <span className="truncate">{filename}</span>}
          <CodeBlockCopy text={source} className="ml-auto" />
        </div>
      ) : (
        <CodeBlockCopy
          text={source}
          label={false}
          className="absolute top-2 right-2 z-10 bg-zinc-900/80 opacity-0 transition-opacity group-hover/code:opacity-100 focus-visible:opacity-100"
        />
      )}
      <pre className="m-0 overflow-auto py-3 font-mono text-[12.5px] leading-[1.7]" tabIndex={0}>
        <code>
          {lines.map((line, i) => {
            const n = i + 1
            const marker = diff ? line[0] : ""
            const added = addedLines.includes(n) || marker === "+"
            const removed = removedLines.includes(n) || marker === "-"
            const hl = highlightLines.includes(n)
            return (
              <span
                key={i}
                data-line={n}
                data-highlighted={hl || undefined}
                data-diff={added ? "add" : removed ? "del" : undefined}
                className={cn(
                  "relative block pr-4 pl-3 whitespace-pre",
                  removed && "line-through decoration-red-400/50"
                )}
              >
                {(hl || added || removed) && (
                  <motion.span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute inset-0 origin-left",
                      hl && "bg-brand-500/20 shadow-[inset_2px_0_0_var(--brand-400)]",
                      added && "bg-emerald-500/12 shadow-[inset_2px_0_0_var(--color-emerald-400)]",
                      removed && "bg-red-500/12 shadow-[inset_2px_0_0_var(--color-red-400)]"
                    )}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.45, ease, delay: 0.15 + i * 0.03 }}
                  />
                )}
                {showLineNumbers && (
                  <span aria-hidden="true" className="relative mr-3.5 inline-block w-[26px] text-right text-zinc-600 select-none">
                    {n}
                  </span>
                )}
                <span className="relative">
                  {tokenize(line, lang).map((t, j) =>
                    t.kind === "p" ? (
                      <React.Fragment key={j}>{t.text}</React.Fragment>
                    ) : (
                      <span key={j} className={tokenClass[t.kind]}>
                        {t.text}
                      </span>
                    )
                  )}
                  {line === "" && "​"}
                </span>
              </span>
            )
          })}
        </code>
      </pre>
    </div>
  )
}

export { CodeBlock, CodeBlockCopy }
