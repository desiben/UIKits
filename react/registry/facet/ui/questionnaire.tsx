"use client"

import * as React from "react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { ArrowLeft, ArrowRight, Check, CornerDownLeft, RotateCcw } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springBouncy, springSoft } from "@/registry/facet/lib/motion"
import { Button } from "@/registry/facet/ui/button"
import { AnimatedNumber } from "@/registry/facet/ui/number-stepper"
import { Textarea } from "@/registry/facet/ui/textarea"

export interface QuestionOption {
  value: string
  label: string
  description?: string
}

export interface QuestionStep {
  /** Key used in the summary and in the submitted answers. */
  key: string
  title: string
  description?: string
  type: "single" | "multiple" | "text"
  options?: QuestionOption[]
  /** Adds an "Other" option with a free-text field (pass a string to set its placeholder). */
  other?: boolean | string
  /** Hides Skip; Next waits for an answer. */
  required?: boolean
  placeholder?: string
}

export type QuestionnaireAnswers = Record<string, string[]>

export interface QuestionnaireProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  steps: QuestionStep[]
  /** Shown at the top right, e.g. the agent's name. */
  badge?: React.ReactNode
  onSubmit?: (answers: QuestionnaireAnswers) => void
  submitLabel?: string
  summaryTitle?: React.ReactNode
}

const OTHER = "__other"

const stepVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 28, filter: "blur(2px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)", transition: { ...springSoft, staggerChildren: 0.035, delayChildren: 0.05 } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -28, filter: "blur(2px)", transition: { duration: durations.fast, ease } }),
}
const itemVariants: Variants = {
  enter: { opacity: 0, y: 6 },
  center: { opacity: 1, y: 0, transition: { duration: durations.base, ease } },
}

/**
 * A multi-step question flow for agent clarifications, onboarding and surveys. Steps slide in the
 * direction you travel, the progress bar springs, picked options fill their number key and draw a
 * check, and the summary cascades in at the end.
 */
function Questionnaire({
  steps,
  badge,
  onSubmit,
  submitLabel = "Submit",
  summaryTitle = "Thanks — here's what I'll use",
  className,
  ...props
}: QuestionnaireProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const uid = React.useId()
  const [index, setIndex] = React.useState(0)
  const [dir, setDir] = React.useState(1)
  const [answers, setAnswers] = React.useState<QuestionnaireAnswers>({})
  const [other, setOther] = React.useState<Record<string, string>>({})
  const [done, setDone] = React.useState(false)

  const step = steps[index]
  const picked = answers[step?.key] ?? []
  const otherText = other[step?.key] ?? ""
  const textValue = step?.type === "text" ? picked[0] ?? "" : ""
  const answered =
    step?.type === "text" ? textValue.trim().length > 0 : picked.length > 0 && (!picked.includes(OTHER) || otherText.trim().length > 0)
  const last = index === steps.length - 1

  const finalAnswers = React.useCallback(
    (a: QuestionnaireAnswers) => {
      const out: QuestionnaireAnswers = {}
      for (const s of steps) {
        const v = (a[s.key] ?? []).map((x) => (x === OTHER ? other[s.key]?.trim() || "Other" : x)).filter(Boolean)
        out[s.key] = s.type === "text" ? v.map((t) => t.trim()).filter(Boolean) : v
      }
      return out
    },
    [steps, other]
  )

  const go = (delta: number) => {
    const next = index + delta
    setDir(delta)
    if (next >= steps.length) {
      setDone(true)
      onSubmit?.(finalAnswers(answers))
      return
    }
    if (next < 0) return
    setIndex(next)
  }

  React.useEffect(() => {
    rootRef.current?.focus({ preventScroll: true })
  }, [index, done])

  const toggle = (value: string) => {
    if (!step) return
    setAnswers((a) => {
      const cur = a[step.key] ?? []
      const next =
        step.type === "single" ? (cur[0] === value ? [] : [value]) : cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]
      return { ...a, [step.key]: next }
    })
  }

  const options: QuestionOption[] = step?.options
    ? [...step.options, ...(step.other ? [{ value: OTHER, label: "Other" }] : [])]
    : []

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (done || !step) return
    const typing = (e.target as HTMLElement).closest("input:not([type=radio]):not([type=checkbox]), textarea")
    if (!typing && /^[1-9]$/.test(e.key)) {
      const opt = options[Number(e.key) - 1]
      if (opt) {
        e.preventDefault()
        toggle(opt.value)
      }
    }
    if (e.key === "Enter" && (e.target as HTMLElement).closest("button")) return
    if (e.key === "Enter" && (!typing || e.metaKey || e.ctrlKey || (typing as HTMLElement).tagName === "INPUT")) {
      if (answered || !step.required) {
        e.preventDefault()
        go(1)
      }
    }
  }

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      data-slot="questionnaire"
      onKeyDown={onKeyDown}
      className={cn(
        "w-full max-w-[520px] overflow-hidden rounded-facet-xl border border-border bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(10_10_31/0.06)] outline-none",
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false} custom={dir}>
        {done ? (
          <motion.div key="summary" custom={1} variants={stepVariants} initial="enter" animate="center" exit="exit">
            <motion.div variants={itemVariants} className="flex items-center gap-2.5">
              <motion.span
                className="grid size-7 place-items-center rounded-full bg-success-subtle text-success"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ ...springBouncy, delay: 0.1 }}
              >
                <Check className="size-4" />
              </motion.span>
              <h4 className="m-0 text-base font-semibold">{summaryTitle}</h4>
            </motion.div>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              {steps.map((s) => {
                const v = finalAnswers(answers)[s.key]
                return (
                  <React.Fragment key={s.key}>
                    <motion.dt variants={itemVariants} className="text-muted-foreground">{s.key}</motion.dt>
                    <motion.dd variants={itemVariants} className={cn("m-0", v.length ? "text-foreground" : "text-placeholder italic")}>
                      {v.length ? v.join(", ") : "Skipped"}
                    </motion.dd>
                  </React.Fragment>
                )
              })}
            </dl>
            <motion.div variants={itemVariants} className="mt-5">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDir(-1)
                  setDone(false)
                  setIndex(0)
                }}
              >
                <RotateCcw /> Edit answers
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: durations.fast } }}>
            <div className="mb-4 flex items-center gap-3 text-xs font-medium text-muted-foreground">
              <span className="tabular-nums">
                <AnimatedNumber value={index + 1} /> of {steps.length}
              </span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary" role="presentation">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={false}
                  animate={{ width: `${((index + (answered ? 1 : 0.5)) / steps.length) * 100}%` }}
                  transition={springSoft}
                />
              </div>
              {badge && <span className="inline-flex items-center gap-1 [&_svg]:size-3.5">{badge}</span>}
            </div>

            <div className="relative">
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.section
                  key={step.key}
                  custom={dir}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  aria-labelledby={`${uid}-${index}-t`}
                >
                  <motion.h4 variants={itemVariants} id={`${uid}-${index}-t`} className="m-0 mb-1 text-base font-semibold text-foreground">
                    {step.title}
                  </motion.h4>
                  {step.description && (
                    <motion.p variants={itemVariants} className="m-0 mb-4 text-sm text-muted-foreground">
                      {step.description}
                    </motion.p>
                  )}

                  {step.type === "text" ? (
                    <motion.div variants={itemVariants}>
                      <Textarea
                        autoSize
                        minRows={3}
                        maxRows={8}
                        aria-label={step.title}
                        placeholder={step.placeholder}
                        value={textValue}
                        onChange={(e) => setAnswers((a) => ({ ...a, [step.key]: [e.target.value] }))}
                      />
                    </motion.div>
                  ) : (
                    <div role={step.type === "single" ? "radiogroup" : "group"} aria-labelledby={`${uid}-${index}-t`} className="flex flex-col gap-2">
                      {options.map((o, i) => {
                        const checked = picked.includes(o.value)
                        return (
                          <motion.label
                            key={o.value}
                            variants={itemVariants}
                            whileTap={{ scale: 0.985 }}
                            className={cn(
                              "relative flex min-h-11 cursor-pointer items-center gap-3 rounded-facet border px-3 py-2 text-sm text-foreground transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
                              checked ? "border-primary bg-primary-subtle" : "border-border bg-card hover:bg-accent"
                            )}
                          >
                            <input
                              type={step.type === "single" ? "radio" : "checkbox"}
                              name={`${uid}-${step.key}`}
                              value={o.value}
                              checked={checked}
                              onChange={() => toggle(o.value)}
                              className="sr-only"
                            />
                            <motion.kbd
                              animate={{ scale: checked ? [1, 1.18, 1] : 1 }}
                              transition={{ duration: 0.3, ease }}
                              className={cn(
                                "grid h-5 min-w-5 shrink-0 place-items-center rounded-[5px] border px-1 font-sans text-[11px] font-medium transition-colors",
                                checked ? "border-transparent bg-primary text-primary-foreground" : "border-border bg-subtle text-muted-foreground"
                              )}
                            >
                              {i + 1}
                            </motion.kbd>
                            <span className="min-w-0 flex-1">
                              {o.label}
                              {o.description && <small className="block text-xs text-muted-foreground">{o.description}</small>}
                            </span>
                            <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <motion.path
                                d="M5 12.5l4.5 4.5L19 7.5"
                                initial={false}
                                animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
                                transition={{ duration: 0.22, ease }}
                              />
                            </svg>
                          </motion.label>
                        )
                      })}
                      <AnimatePresence initial={false}>
                        {picked.includes(OTHER) && (
                          <motion.div
                            key="other"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={springSoft}
                            className="overflow-hidden"
                          >
                            <input
                              autoFocus
                              aria-label={`Other ${step.key.toLowerCase()}`}
                              placeholder={typeof step.other === "string" ? step.other : "Tell me more"}
                              value={otherText}
                              onChange={(e) => setOther((s) => ({ ...s, [step.key]: e.target.value }))}
                              className="mt-0.5 h-8 w-full rounded-facet border border-input bg-card px-3 text-[13px] text-foreground outline-none placeholder:text-placeholder focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.section>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => go(-1)} disabled={index === 0} aria-label="Back">
                <ArrowLeft />
              </Button>
              <span className="flex-1 text-xs text-muted-foreground">
                {step.type === "text" ? (
                  <>⌘ <CornerDownLeft className="inline size-3" /> to continue</>
                ) : (
                  <>Press 1–{options.length} · <CornerDownLeft className="inline size-3" /> to continue</>
                )}
              </span>
              <AnimatePresence initial={false} mode="popLayout">
                {!step.required && !answered && (
                  <motion.span key="skip" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={spring}>
                    <Button size="sm" variant="ghost" onClick={() => go(1)}>Skip</Button>
                  </motion.span>
                )}
              </AnimatePresence>
              <Button size="sm" onClick={() => go(1)} disabled={step.required && !answered}>
                {last ? submitLabel : "Next"}
                {!last && <ArrowRight />}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Questionnaire }
