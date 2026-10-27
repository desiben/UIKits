"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { Ban, Check, ChevronDown, Hourglass, Wrench, X } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { ease, spring, springBouncy, springSoft } from "@/registry/facet/lib/motion"
import { Button } from "@/registry/facet/ui/button"

export type ChatToolState = "running" | "done" | "error" | "approval-requested" | "approved" | "denied"

const statusMeta: Record<ChatToolState, { label: string; tone: string }> = {
  running: { label: "Running", tone: "text-brand" },
  done: { label: "Done", tone: "text-success" },
  error: { label: "Failed", tone: "text-danger" },
  "approval-requested": { label: "Needs approval", tone: "text-warning" },
  approved: { label: "Approved", tone: "text-success" },
  denied: { label: "Denied", tone: "text-muted-foreground" },
}

function ToolSpinner() {
  const reduce = useReducedMotion()
  return (
    <motion.svg viewBox="0 0 24 24" aria-hidden="true" animate={reduce ? undefined : { rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </motion.svg>
  )
}

function StatusGlyph({ state }: { state: ChatToolState }) {
  switch (state) {
    case "running":
      return <ToolSpinner />
    case "done":
    case "approved":
      return <Check />
    case "error":
      return <X />
    case "denied":
      return <Ban />
    default:
      return <Hourglass />
  }
}

/** Pretty-print a value as JSON with brand-coloured keys (no HTML injection). */
function JsonView({ value }: { value: unknown }) {
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2)
  const parts = text.split(/("(?:[^"\\]|\\.)*")(?=\s*:)/g)
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <span key={i} className="text-brand">
            {p}
          </span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </>
  )
}

export interface ChatToolProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Tool name, e.g. "crm.search_deals". */
  name: string
  icon?: React.ReactNode
  state?: ChatToolState
  /** Overrides the status text (e.g. "14 results"). */
  statusLabel?: React.ReactNode
  input?: unknown
  output?: unknown
  defaultOpen?: boolean
  /** What will happen if approved — shown in the approval gate. */
  approvalMessage?: React.ReactNode
  onApprove?: () => void
  onDeny?: () => void
}

/** A tool call: name, morphing status chip, collapsible input/output and an approval gate. */
function ChatTool({
  name,
  icon,
  state = "done",
  statusLabel,
  input,
  output,
  defaultOpen = false,
  approvalMessage,
  onApprove,
  onDeny,
  className,
  ...props
}: ChatToolProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const hasBody = input !== undefined || output !== undefined
  const meta = statusMeta[state]
  const gate = state === "approval-requested"

  const head = (
    <>
      <span className="grid size-6 shrink-0 place-items-center rounded-facet-sm bg-primary-subtle text-brand [&_svg]:size-[13px]">{icon ?? <Wrench />}</span>
      <code className="truncate font-mono text-xs font-medium text-foreground-secondary">{name}</code>
      <span className={cn("ml-auto inline-flex shrink-0 items-center gap-1.5 text-xs font-medium transition-colors duration-300", meta.tone)}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={state}
            className="inline-flex items-center gap-1.5 [&_svg]:size-3.5"
            initial={{ opacity: 0, y: 6, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.8 }}
            transition={state === "done" || state === "approved" ? springBouncy : spring}
          >
            <StatusGlyph state={state} />
            <span aria-live="polite">{state === "done" && statusLabel ? statusLabel : meta.label}</span>
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  )

  return (
    <motion.div
      data-slot="chat-tool"
      data-state={state}
      layout
      transition={springSoft}
      className={cn("overflow-hidden rounded-facet-lg border border-border bg-card", className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      <CollapsiblePrimitive.Root open={open} onOpenChange={setOpen} disabled={!hasBody}>
        <CollapsiblePrimitive.Trigger
          className={cn(
            "flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            hasBody ? "cursor-pointer hover:bg-accent/60" : "cursor-default"
          )}
        >
          {head}
          {hasBody && (
            <motion.span className="inline-flex text-muted-foreground [&_svg]:size-3.5" animate={{ rotate: open ? 180 : 0 }} transition={spring}>
              <ChevronDown />
            </motion.span>
          )}
        </CollapsiblePrimitive.Trigger>
        <AnimatePresence initial={false}>
          {open && hasBody && (
            <CollapsiblePrimitive.Content forceMount asChild>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ height: springSoft, opacity: { duration: 0.2 } }}
                className="overflow-hidden"
              >
                {input !== undefined && (
                  <div className="border-t border-border-subtle bg-subtle">
                    <div className="px-3 pt-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Input</div>
                    <pre className="m-0 max-h-[200px] overflow-auto px-3 pt-1 pb-3 font-mono text-xs leading-relaxed text-foreground-secondary">
                      <JsonView value={input} />
                    </pre>
                  </div>
                )}
                {output !== undefined && (
                  <div className="border-t border-border-subtle bg-subtle">
                    <div className="px-3 pt-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Output</div>
                    <pre className="m-0 max-h-[200px] overflow-auto px-3 pt-1 pb-3 font-mono text-xs leading-relaxed text-foreground-secondary">
                      <JsonView value={output} />
                    </pre>
                  </div>
                )}
              </motion.div>
            </CollapsiblePrimitive.Content>
          )}
        </AnimatePresence>
      </CollapsiblePrimitive.Root>
      {(gate || ((state === "approved" || state === "denied") && approvalMessage)) && (
        <div className="flex flex-col gap-3 border-t border-border-subtle p-3">
          {approvalMessage && <p className="m-0 text-[13px] text-foreground-secondary [&_b]:font-semibold [&_b]:text-foreground">{approvalMessage}</p>}
          <AnimatePresence initial={false}>
            {gate && (
              <motion.div
                key="actions"
                className="flex justify-end gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0, transition: { duration: 0.2, ease } }}
              >
                <Button variant="outline" size="sm" onClick={onDeny}>
                  Deny
                </Button>
                <Button size="sm" onClick={onApprove}>
                  <Check /> Allow
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

export { ChatTool }
