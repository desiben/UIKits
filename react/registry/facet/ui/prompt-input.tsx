"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowUp, Square } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { spring } from "@/registry/facet/lib/motion"

type PromptInputContextValue = {
  value: string
  setValue: (v: string) => void
  submit: () => void
  streaming: boolean
  stop?: () => void
  disabled: boolean
  maxHeight: number
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}
const PromptInputContext = React.createContext<PromptInputContextValue | null>(null)
function usePromptInput() {
  const ctx = React.useContext(PromptInputContext)
  if (!ctx) throw new Error("PromptInput parts must be used inside <PromptInput>")
  return ctx
}

export interface PromptInputProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Called with the trimmed text on Enter or the send button. Uncontrolled inputs clear themselves. */
  onSubmit?: (value: string) => void
  /** While true the send button morphs into a stop button. */
  streaming?: boolean
  onStop?: () => void
  disabled?: boolean
  /** Max textarea height in px before it scrolls. */
  maxHeight?: number
}

/** The composer: auto-growing textarea, toolbar, and a send button that morphs to stop while streaming. */
function PromptInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  streaming = false,
  onStop,
  disabled = false,
  maxHeight = 200,
  className,
  children,
  ...props
}: PromptInputProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const setValue = React.useCallback(
    (v: string) => {
      if (valueProp === undefined) setInner(v)
      onValueChange?.(v)
    },
    [valueProp, onValueChange]
  )
  const submit = () => {
    const text = value.trim()
    if (!text || disabled || streaming) return
    onSubmit?.(text)
    if (valueProp === undefined) setInner("")
  }

  return (
    <PromptInputContext.Provider value={{ value, setValue, submit, streaming, stop: onStop, disabled, maxHeight, textareaRef }}>
      <form
        data-slot="prompt-input"
        data-streaming={streaming || undefined}
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) textareaRef.current?.focus()
        }}
        className={cn(
          "flex w-full flex-col gap-2 rounded-facet-xl border border-border-strong bg-card p-3 shadow-sm transition-[border-color,box-shadow] duration-200 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20",
          disabled && "opacity-60",
          className
        )}
        {...props}
      >
        {children}
      </form>
    </PromptInputContext.Provider>
  )
}

/** Grows with its content up to `maxHeight`; Enter sends, Shift+Enter adds a line. */
function PromptInputTextarea({ className, onKeyDown, onChange, ...props }: React.ComponentProps<"textarea">) {
  const { value, setValue, submit, disabled, maxHeight, textareaRef } = usePromptInput()

  React.useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    const prev = el.style.height
    el.style.height = "auto"
    const next = Math.min(el.scrollHeight, maxHeight)
    el.style.height = prev
    void el.offsetHeight // commit the previous height so the change transitions
    el.style.height = `${next}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [value, maxHeight, textareaRef])

  return (
    <textarea
      ref={textareaRef}
      data-slot="prompt-input-textarea"
      rows={1}
      aria-label="Message"
      placeholder="Ask anything…"
      value={value}
      disabled={disabled}
      onChange={(e) => {
        setValue(e.target.value)
        onChange?.(e)
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.defaultPrevented) return
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
          e.preventDefault()
          submit()
        }
      }}
      className={cn(
        "min-h-12 w-full resize-none border-0 bg-transparent p-1 text-sm leading-6 text-foreground outline-none transition-[height] duration-150 ease-out placeholder:text-placeholder",
        className
      )}
      {...props}
    />
  )
}

function PromptInputToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="prompt-input-toolbar" className={cn("flex items-center gap-1.5", className)} {...props} />
}

/** Ghost icon/text button for the toolbar (attach, voice, model picker…). */
function PromptInputAction({ className, ...props }: React.ComponentProps<typeof motion.button>) {
  return (
    <motion.button
      type="button"
      data-slot="prompt-input-action"
      whileTap={{ scale: 0.92 }}
      transition={spring}
      className={cn(
        "inline-flex h-8 min-w-8 cursor-pointer items-center justify-center gap-1 rounded-facet px-1.5 text-[13px] font-medium text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 aria-pressed:bg-primary-subtle aria-pressed:text-brand [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

/** Send button: disabled until there's text, morphs into Stop while streaming. */
function PromptInputSubmit({ className, ...props }: Omit<React.ComponentProps<typeof motion.button>, "children">) {
  const { value, streaming, stop, disabled } = usePromptInput()
  const empty = !value.trim()
  const off = disabled || (!streaming && empty)
  return (
    <motion.button
      data-slot="prompt-input-submit"
      type={streaming ? "button" : "submit"}
      onClick={streaming ? () => stop?.() : undefined}
      disabled={off}
      aria-label={streaming ? "Stop generating" : "Send"}
      whileTap={{ scale: 0.88 }}
      animate={{ scale: off ? 0.94 : 1 }}
      transition={spring}
      className={cn(
        "relative grid size-8 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full bg-primary text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-muted disabled:text-placeholder disabled:shadow-none",
        className
      )}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={streaming ? "stop" : "send"}
          className="grid place-items-center"
          initial={{ opacity: 0, scale: 0.3, rotate: streaming ? -90 : 90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.3 }}
          transition={spring}
        >
          {streaming ? <Square className="size-3" fill="currentColor" /> : <ArrowUp className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

export { PromptInput, PromptInputTextarea, PromptInputToolbar, PromptInputAction, PromptInputSubmit, usePromptInput }
