"use client"

import * as React from "react"
import { motion, useAnimate } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { springSoft } from "@/registry/facet/lib/motion"
import { AnimatedNumber } from "@/registry/facet/ui/number-stepper"

const textareaBase =
  "block w-full rounded-facet border border-input bg-card px-3 py-2 text-sm leading-5 text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-placeholder hover:border-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/25 disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-placeholder"

export interface TextareaProps extends Omit<React.ComponentProps<"textarea">, "style"> {
  /** Grow (and shrink) smoothly with the content instead of scrolling. */
  autoSize?: boolean
  /** Lower bound for auto-size, in rows (defaults to `rows` or 2). */
  minRows?: number
  /** Upper bound for auto-size, in rows; after that the textarea scrolls. */
  maxRows?: number
  /** Show an animated "count / maxLength" counter with a progress ring. Needs `maxLength`. */
  showCount?: boolean
  wrapperClassName?: string
  style?: React.CSSProperties
}

const LINE = 20
const PAD = 16 + 2 // py-2 + border

function Textarea({
  className,
  wrapperClassName,
  autoSize = false,
  minRows,
  maxRows,
  showCount = false,
  maxLength,
  rows,
  value: valueProp,
  defaultValue,
  onChange,
  style,
  ...props
}: TextareaProps) {
  const [inner, setInner] = React.useState(String(defaultValue ?? ""))
  const value = valueProp !== undefined ? String(valueProp) : inner
  const ghost = React.useRef<HTMLTextAreaElement>(null)
  const counted = showCount && !!maxLength
  const pad = PAD + (counted ? 20 : 0) // pb-7 leaves room for the counter
  const min = (minRows ?? rows ?? 2) * LINE + pad
  const max = maxRows ? maxRows * LINE + pad : Infinity
  const [height, setHeight] = React.useState<number>(min)

  React.useLayoutEffect(() => {
    if (!autoSize || !ghost.current) return
    const measure = () => {
      if (!ghost.current) return
      const h = ghost.current.scrollHeight + 2
      setHeight(Math.min(max, Math.max(min, h)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(ghost.current)
    return () => ro.disconnect()
  }, [autoSize, value, min, max])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (valueProp === undefined) setInner(e.target.value)
    onChange?.(e)
  }

  const textarea = autoSize ? (
    <div className="relative">
      <textarea
        ref={ghost}
        aria-hidden="true"
        tabIndex={-1}
        readOnly
        rows={1}
        value={value + "​"}
        className={cn(textareaBase, "pointer-events-none invisible absolute inset-x-0 top-0 h-0 resize-none overflow-hidden", counted && "pb-7", className)}
      />
      <motion.textarea
        data-slot="textarea"
        data-autosize=""
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        initial={false}
        animate={{ height }}
        transition={springSoft}
        className={cn(textareaBase, "resize-none", height >= max ? "overflow-y-auto" : "overflow-hidden", counted && "pb-7", className)}
        style={style}
        {...(props as React.ComponentProps<typeof motion.textarea>)}
      />
    </div>
  ) : (
    <textarea
      data-slot="textarea"
      rows={rows}
      value={value}
      onChange={handleChange}
      maxLength={maxLength}
      className={cn(textareaBase, "min-h-[88px] resize-y", counted && "pb-7", className)}
      style={style}
      {...props}
    />
  )

  if (!showCount || !maxLength) return wrapperClassName ? <div className={wrapperClassName}>{textarea}</div> : textarea

  return (
    <div data-slot="textarea-wrap" className={cn("relative", wrapperClassName)}>
      {textarea}
      <CharCounter count={value.length} max={maxLength} />
    </div>
  )
}

function CharCounter({ count, max }: { count: number; max: number }) {
  const ratio = Math.min(1, count / max)
  const left = max - count
  const tone = count >= max ? "text-danger" : ratio >= 0.85 ? "text-warning" : "text-muted-foreground"
  const [scope, animate] = useAnimate<HTMLSpanElement>()
  const wasFull = React.useRef(count >= max)
  React.useEffect(() => {
    const full = count >= max
    if (full && !wasFull.current && scope.current) animate(scope.current, { x: [0, -4, 4, -2, 2, 0] }, { duration: 0.35 })
    wasFull.current = full
  }, [count, max, animate, scope])

  return (
    <span
      ref={scope}
      data-slot="textarea-count"
      className={cn("pointer-events-none absolute bottom-1.5 right-2.5 flex items-center gap-1.5 text-xs tabular-nums transition-colors", tone)}
    >
      <svg viewBox="0 0 16 16" className="size-3.5 -rotate-90" aria-hidden="true">
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
        <motion.circle
          cx="8"
          cy="8"
          r="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: Math.max(0.001, ratio) }}
          transition={springSoft}
        />
      </svg>
      <span aria-hidden="true" className="inline-flex">
        <AnimatedNumber value={count} />/{max}
      </span>
      <span className="sr-only" aria-live="polite">
        {left <= Math.max(10, max * 0.1) ? `${left} characters left` : ""}
      </span>
    </span>
  )
}

export { Textarea }
