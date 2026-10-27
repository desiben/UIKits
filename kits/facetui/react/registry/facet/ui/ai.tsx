"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { ArrowUp, Check, ChevronDown, Paperclip, Sparkles, Square, X } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, popIn, slideUp, spring, springSoft } from "@/registry/facet/lib/motion"
import { Button } from "@/registry/facet/ui/button"

/* AI mark ------------------------------------------------------------- */

function AiMark({ active = false, className, ...props }: { active?: boolean } & React.ComponentProps<"span">) {
  const reduce = useReducedMotion()
  return (
    <span
      data-slot="ai-mark"
      aria-hidden="true"
      className={cn(
        "relative grid size-7 flex-none place-items-center rounded-facet bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm [&_svg]:size-3.5",
        className
      )}
      {...props}
    >
      <motion.span
        className="grid place-items-center"
        animate={active && !reduce ? { rotate: [0, 18, -12, 0], scale: [1, 1.15, 1] } : { rotate: 0, scale: 1 }}
        transition={active && !reduce ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : spring}
      >
        <Sparkles />
      </motion.span>
    </span>
  )
}

/* Conversation + messages --------------------------------------------- */

/** Message list. role="log" + aria-live so streamed replies are announced. */
function Conversation({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="conversation"
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

type MessageProps = Omit<React.ComponentProps<typeof motion.div>, "children"> & {
  from: "user" | "assistant"
  /** Assistant is still producing this message (animates the mark). */
  streaming?: boolean
  children?: React.ReactNode
}

function Message({ from, streaming = false, className, children, ...props }: MessageProps) {
  const user = from === "user"
  return (
    <motion.div
      data-slot="message"
      data-from={from}
      className={cn("flex gap-3", user && "justify-end", className)}
      variants={slideUp}
      initial="hidden"
      animate="visible"
      layout="position"
      transition={springSoft}
      {...props}
    >
      {!user && <AiMark active={streaming} />}
      <div
        data-slot="message-body"
        className={cn(
          "min-w-0 text-[15px] leading-6 text-foreground [&_b]:font-semibold",
          user ? "max-w-[85%] rounded-facet-lg bg-muted px-4 py-3" : "flex-1 pt-0.5"
        )}
      >
        {children}
      </div>
    </motion.div>
  )
}

/** Renders text as it streams in: new words fade/blur in, a caret blinks at the end while streaming. */
function StreamingText({ text, streaming = false, className }: { text: string; streaming?: boolean; className?: string }) {
  const tokens = React.useMemo(() => text.split(/(\s+)/), [text])
  return (
    <span data-slot="streaming-text" className={className}>
      {tokens.map((t, i) =>
        /^\s+$/.test(t) || t === "" ? (
          t
        ) : (
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: durations.slow, ease }}
          >
            {t}
          </motion.span>
        )
      )}
      {streaming && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] rounded-full bg-brand animate-[facet-caret-blink_1s_ease-out_infinite] motion-reduce:animate-none"
        />
      )}
    </span>
  )
}

/** "Thinking…" with a light sweep and three bouncing dots. Stops looping with reduced motion. */
function ThinkingIndicator({ label = "Thinking", className }: { label?: string; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <span data-slot="thinking" role="status" className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span
        className="bg-[linear-gradient(90deg,var(--muted-foreground)_35%,var(--foreground)_50%,var(--muted-foreground)_65%)] bg-[length:250%_100%] bg-clip-text font-medium text-transparent motion-safe:animate-[facet-shimmer_2s_linear_infinite]"
      >
        {label}
      </span>
      <span className="inline-flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1 rounded-full bg-muted-foreground"
            animate={reduce ? undefined : { y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </span>
    </span>
  )
}

/* Prompt composer ----------------------------------------------------- */

export type ContextChip = { id: string; label: string; icon?: React.ReactNode }
export type AiModel = { id: string; name: string; description?: string }

type PromptComposerProps = Omit<React.ComponentProps<typeof motion.form>, "onSubmit" | "onChange" | "children"> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSubmit?: (value: string) => void
  /** Swaps Send for Stop and disables submitting. */
  generating?: boolean
  onStop?: () => void
  context?: ContextChip[]
  onRemoveContext?: (id: string) => void
  onAttach?: () => void
  models?: AiModel[]
  model?: string
  onModelChange?: (id: string) => void
  placeholder?: string
}

function PromptComposer({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  generating = false,
  onStop,
  context = [],
  onRemoveContext,
  onAttach,
  models = [],
  model,
  onModelChange,
  placeholder = "Ask Facet AI…",
  className,
  ...props
}: PromptComposerProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const setValue = (v: string) => {
    if (valueProp === undefined) setInner(v)
    onValueChange?.(v)
  }
  const ref = React.useRef<HTMLTextAreaElement>(null)

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 200) + "px"
  }, [value])

  const canSend = value.trim().length > 0 && !generating
  const submit = () => {
    if (!canSend) return
    onSubmit?.(value.trim())
    setValue("")
  }
  const current = models.find((m) => m.id === model) ?? models[0]

  return (
    <motion.form
      data-slot="prompt-composer"
      layout="position"
      transition={spring}
      className={cn(
        "flex flex-col gap-2 rounded-facet-xl border border-border-strong bg-card p-3 shadow-md shadow-black/[0.04] transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20",
        className
      )}
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      {...props}
    >
      {context.length > 0 && (
        <motion.div layout className="flex flex-wrap gap-1.5">
          <AnimatePresence initial={false} mode="popLayout">
            {context.map((c) => (
              <motion.span
                key={c.id}
                layout
                data-slot="context-chip"
                className="inline-flex h-6 items-center gap-1 rounded-facet-sm bg-muted pr-1 pl-2 text-xs font-medium text-foreground-secondary [&_svg]:size-3.5"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: durations.fast } }}
                transition={spring}
              >
                {c.icon}
                {c.label}
                {onRemoveContext ? (
                  <button
                    type="button"
                    aria-label={`Remove ${c.label}`}
                    onClick={() => onRemoveContext(c.id)}
                    className="grid size-4 place-items-center rounded-sm text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3"
                  >
                    <X />
                  </button>
                ) : (
                  <span className="w-1" />
                )}
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      <textarea
        ref={ref}
        rows={2}
        value={value}
        aria-label="Prompt"
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            submit()
          }
        }}
        className="min-h-12 w-full resize-none bg-transparent p-1 text-[15px] leading-6 text-foreground outline-none placeholder:text-placeholder"
      />
      <div data-slot="composer-bar" className="flex items-center gap-1.5">
        {onAttach && (
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Attach" onClick={onAttach}>
            <Paperclip />
          </Button>
        )}
        {current && (
          <ModelPicker models={models} value={current.id} onValueChange={onModelChange} />
        )}
        <span className="flex-1" />
        <Button
          type={generating ? "button" : "submit"}
          size="icon-sm"
          aria-label={generating ? "Stop generating" : "Send"}
          disabled={!generating && !canSend}
          onClick={generating ? onStop : undefined}
          className="rounded-facet"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={generating ? "stop" : "send"}
              className="grid place-items-center"
              initial={{ opacity: 0, scale: 0.4, rotate: generating ? -90 : 90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={spring}
            >
              {generating ? <Square className="size-3 fill-current" /> : <ArrowUp />}
            </motion.span>
          </AnimatePresence>
        </Button>
      </div>
    </motion.form>
  )
}

function ModelPicker({ models, value, onValueChange }: { models: AiModel[]; value: string; onValueChange?: (id: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const current = models.find((m) => m.id === value) ?? models[0]
  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button type="button" variant="ghost" size="sm" className="gap-1.5 [&_svg]:size-3.5">
          <Sparkles className="text-brand" />
          {current.name}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring} className="inline-flex">
            <ChevronDown />
          </motion.span>
        </Button>
      </DropdownMenuPrimitive.Trigger>
      <AnimatePresence>
        {open && (
          <DropdownMenuPrimitive.Portal forceMount>
            <DropdownMenuPrimitive.Content asChild forceMount align="start" sideOffset={6}>
              <motion.div
                className="z-50 min-w-56 rounded-facet-lg border border-border bg-popover p-1 text-popover-foreground shadow-xl outline-none"
                style={{ transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)" }}
                variants={popIn}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <DropdownMenuPrimitive.RadioGroup value={value} onValueChange={onValueChange}>
                  {models.map((m) => (
                    <DropdownMenuPrimitive.RadioItem
                      key={m.id}
                      value={m.id}
                      className="relative flex cursor-pointer items-start gap-2 rounded-facet py-1.5 pr-2 pl-7 text-sm outline-none select-none data-[highlighted]:bg-accent"
                    >
                      <DropdownMenuPrimitive.ItemIndicator className="absolute top-2 left-2 text-brand">
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring} className="inline-flex">
                          <Check className="size-3.5" />
                        </motion.span>
                      </DropdownMenuPrimitive.ItemIndicator>
                      <span className="flex flex-col">
                        <span className="font-medium">{m.name}</span>
                        {m.description && <span className="text-xs text-muted-foreground">{m.description}</span>}
                      </span>
                    </DropdownMenuPrimitive.RadioItem>
                  ))}
                </DropdownMenuPrimitive.RadioGroup>
              </motion.div>
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        )}
      </AnimatePresence>
    </DropdownMenuPrimitive.Root>
  )
}

export { AiMark, Conversation, Message, StreamingText, ThinkingIndicator, PromptComposer, ModelPicker }
