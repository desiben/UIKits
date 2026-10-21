"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springSoft, stagger } from "@/registry/facet/lib/motion"
import { Button, type ButtonProps } from "@/registry/facet/ui/button"
import { Badge } from "@/registry/facet/ui/badge"

/* Rolling price -------------------------------------------------------- */

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

function DigitColumn({ digit }: { digit: number }) {
  return (
    <span className="relative inline-block h-[1em] overflow-hidden leading-none tabular-nums [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]">
      <motion.span
        className="flex flex-col"
        initial={false}
        animate={{ y: `${-digit * 10}%` }}
        transition={springSoft}
      >
        {DIGITS.map((d) => (
          <span key={d} className="block h-[1em] leading-none">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

type PriceRollProps = Omit<React.ComponentProps<"span">, "children"> & {
  value: number
  /** Prefix such as a currency symbol. */
  currency?: string
  /** Fraction digits to show (default: as many as the value needs, max 2). */
  decimals?: number
  locale?: string
}

/**
 * A number whose digits roll like an odometer when it changes. Columns are keyed from the right
 * so units stay put; new leading digits slide in. Screen readers get the plain value.
 */
function PriceRoll({ value, currency = "", decimals, locale = "en-US", className, ...props }: PriceRollProps) {
  const text = value.toLocaleString(locale, {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 2,
  })
  const chars = text.split("")
  return (
    <span data-slot="price-roll" className={cn("inline-flex items-baseline", className)} {...props}>
      <span className="sr-only">
        {currency}
        {text}
      </span>
      <span aria-hidden="true" className="inline-flex h-[1em] items-start leading-none">
        {currency && <span className="leading-none">{currency}</span>}
        <AnimatePresence initial={false} mode="popLayout">
          {chars.map((ch, i) => {
            const key = `p${chars.length - i}${/\d/.test(ch) ? "" : ch}`
            return (
              <motion.span
                key={key}
                layout="position"
                className="inline-flex leading-none"
                initial={{ opacity: 0, y: "-40%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "40%" }}
                transition={spring}
              >
                {/\d/.test(ch) ? <DigitColumn digit={Number(ch)} /> : <span className="leading-none">{ch}</span>}
              </motion.span>
            )
          })}
        </AnimatePresence>
      </span>
    </span>
  )
}

/* Pricing card --------------------------------------------------------- */

export type PricingFeature = string | { label: React.ReactNode; included?: boolean }

type PricingCardProps = Omit<HTMLMotionProps<"article">, "children"> & {
  plan: React.ReactNode
  description?: React.ReactNode
  price: number
  currency?: string
  /** Unit after the price, e.g. "/user/mo". */
  period?: React.ReactNode
  /** Struck-through reference price (e.g. the monthly price while yearly is selected). */
  compareAt?: number
  /** Highlighted plan: lifts, glows and uses the brand border. */
  featured?: boolean
  /** Label in the header, e.g. "Popular". */
  badge?: React.ReactNode
  features?: PricingFeature[]
  /** CTA label; omit to render no button. */
  cta?: React.ReactNode
  ctaProps?: Omit<ButtonProps, "children">
  /** Small print under the price (e.g. "Billed $288 yearly"). */
  note?: React.ReactNode
  /** Max tilt in degrees following the pointer (0 to disable). */
  tilt?: number
  children?: React.ReactNode
}

const checkPath = "M4 12.5l5 5L20 6.5"

/**
 * Plan card. Prices roll digit-by-digit when they change, the featured plan lifts with a soft brand
 * glow, features stagger in with drawn check marks, and the card tilts slightly toward the pointer.
 */
function PricingCard({
  plan,
  description,
  price,
  currency = "$",
  period,
  compareAt,
  featured = false,
  badge,
  features = [],
  cta,
  ctaProps,
  note,
  tilt = 3,
  className,
  children,
  onPointerMove,
  onPointerLeave,
  ...props
}: PricingCardProps) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [tilt, -tilt]), springSoft)
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-tilt, tilt]), springSoft)
  const canTilt = tilt > 0 && !reduce

  return (
    <motion.article
      data-slot="pricing-card"
      data-featured={featured || undefined}
      className={cn(
        "relative isolate flex flex-col gap-4 rounded-facet-lg border bg-card p-6 text-card-foreground",
        featured
          ? "border-[1.5px] border-primary shadow-[0_2px_4px_-1px_rgb(10_10_31/0.06),0_18px_40px_-12px_color-mix(in_oklab,var(--primary)_45%,transparent)]"
          : "border-border shadow-xs",
        className
      )}
      style={canTilt ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: featured ? -8 : 0 }}
      whileHover={{ y: featured ? -12 : -4 }}
      transition={springSoft}
      onPointerMove={(e) => {
        onPointerMove?.(e)
        if (!canTilt || e.pointerType !== "mouse") return
        const r = e.currentTarget.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width - 0.5)
        py.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        px.set(0)
        py.set(0)
      }}
      {...props}
    >
      {featured && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 -top-px -z-10 h-24 rounded-b-full bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: durations.slow, ease, delay: 0.15 }}
        />
      )}
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg leading-6 font-semibold text-foreground">{plan}</h3>
          {description && <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground">{description}</p>}
        </div>
        {badge && (
          <Badge variant="accent" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            {badge}
          </Badge>
        )}
      </header>

      <div>
        <div className="flex items-baseline gap-1.5">
          <PriceRoll
            value={price}
            currency={currency}
            className="text-[40px] leading-[44px] font-semibold tracking-[-0.025em] text-foreground"
          />
          {period && <small className="text-[13px] text-muted-foreground">{period}</small>}
          <AnimatePresence initial={false}>
            {compareAt !== undefined && compareAt !== price && (
              <motion.s
                key="compare"
                className="text-sm text-placeholder"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={spring}
              >
                <span className="sr-only">was </span>
                {currency}
                {compareAt}
              </motion.s>
            )}
          </AnimatePresence>
        </div>
        {note && (
          <AnimatePresence initial={false} mode="wait">
            <motion.p
              key={typeof note === "string" ? note : "note"}
              className="mt-1 text-xs text-muted-foreground"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: durations.fast, ease }}
            >
              {note}
            </motion.p>
          </AnimatePresence>
        )}
      </div>

      {cta && (
        <Button variant={featured ? "primary" : "outline"} className="w-full" {...ctaProps}>
          {cta}
        </Button>
      )}

      {features.length > 0 && (
        <motion.ul
          data-slot="pricing-features"
          className="m-0 flex list-none flex-col gap-2 p-0 text-[13px] leading-5 text-foreground-secondary"
          variants={stagger(0.05, 0.15)}
          initial="hidden"
          animate="visible"
        >
          {features.map((f, i) => {
            const label = typeof f === "string" ? f : f.label
            const included = typeof f === "string" ? true : f.included !== false
            return (
              <motion.li
                key={typeof label === "string" ? label : i}
                className={cn("flex items-start gap-2", !included && "text-placeholder")}
                variants={{
                  hidden: { opacity: 0, x: -6 },
                  visible: { opacity: 1, x: 0, transition: springSoft },
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={cn("mt-0.5 size-4 flex-none", included ? "text-brand" : "text-placeholder")}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.25}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {included ? (
                    <motion.path
                      d={checkPath}
                      variants={{
                        hidden: { pathLength: 0 },
                        visible: { pathLength: 1, transition: { duration: durations.base, ease, delay: 0.08 } },
                      }}
                    />
                  ) : (
                    <path d="M6 12h12" />
                  )}
                </svg>
                <span>
                  {!included && <span className="sr-only">Not included: </span>}
                  {label}
                </span>
              </motion.li>
            )
          })}
        </motion.ul>
      )}
      {children}
    </motion.article>
  )
}

export { PricingCard, PriceRoll }
