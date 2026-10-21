"use client"

import * as React from "react"
import { animate, motion, useMotionValue, type PanInfo } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springSoft } from "@/registry/facet/lib/motion"

interface CarouselContextValue {
  index: number
  count: number
  pages: number
  goTo: (i: number) => void
  next: () => void
  prev: () => void
  setCount: (n: number) => void
  viewportRef: React.RefObject<HTMLDivElement | null>
  trackRef: React.RefObject<HTMLDivElement | null>
  x: ReturnType<typeof useMotionValue<number>>
  peek: boolean
  label: string
  setPages: (n: number) => void
  stepRef: React.RefObject<number>
  maxRef: React.RefObject<number>
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const ctx = React.useContext(CarouselContext)
  if (!ctx) throw new Error("Carousel parts must be used inside <Carousel>")
  return ctx
}

interface CarouselProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** Show part of the next slide (46% slides) when the carousel is 640px or wider. */
  peek?: boolean
  /** Advance automatically every n ms; pauses on hover and focus. */
  autoplay?: number
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** Accessible name for the carousel region. */
  label?: string
}

function Carousel({
  peek = false,
  autoplay,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  label = "Carousel",
  className,
  children,
  onKeyDown,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: CarouselProps) {
  const [inner, setInner] = React.useState(defaultIndex)
  const index = indexProp ?? inner
  const [count, setCount] = React.useState(0)
  const [pages, setPages] = React.useState(1)
  const [paused, setPaused] = React.useState(false)
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const stepRef = React.useRef(0)
  const maxRef = React.useRef(0)
  const x = useMotionValue(0)

  const goTo = React.useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(pages - 1, i))
      if (indexProp === undefined) setInner(clamped)
      onIndexChange?.(clamped)
      animate(x, -Math.min(clamped * stepRef.current, maxRef.current), springSoft)
    },
    [pages, indexProp, onIndexChange, x]
  )
  const next = React.useCallback(() => goTo(index + 1), [goTo, index])
  const prev = React.useCallback(() => goTo(index - 1), [goTo, index])

  // Keep the track aligned when the controlled index changes from outside.
  React.useEffect(() => {
    animate(x, -Math.min(index * stepRef.current, maxRef.current), springSoft)
  }, [index, x])

  React.useEffect(() => {
    if (!autoplay || paused || pages < 2) return
    const t = setTimeout(() => goTo(index + 1 >= pages ? 0 : index + 1), autoplay)
    return () => clearTimeout(t)
  }, [autoplay, paused, pages, index, goTo])

  return (
    <CarouselContext.Provider
      value={{ index, count, pages, goTo, next, prev, setCount, viewportRef, trackRef, x, peek, label, setPages, stepRef, maxRef }}
    >
      <div
        data-slot="carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        data-peek={peek || undefined}
        className={cn("@container relative w-full", className)}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          if (e.key === "ArrowRight") (next(), e.preventDefault())
          if (e.key === "ArrowLeft") (prev(), e.preventDefault())
        }}
        onPointerEnter={(e) => (setPaused(true), onPointerEnter?.(e))}
        onPointerLeave={(e) => (setPaused(false), onPointerLeave?.(e))}
        onFocus={(e) => (setPaused(true), onFocus?.(e))}
        onBlur={(e) => (setPaused(false), onBlur?.(e))}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, children, ...props }: React.ComponentProps<"div">) {
  const { viewportRef, trackRef, x, setCount, setPages, stepRef, maxRef, index, goTo, pages, peek } = useCarousel()
  const dragged = React.useRef(false)
  const [bounds, setBounds] = React.useState({ left: 0, right: 0 })
  const slides = React.Children.toArray(children)

  React.useEffect(() => setCount(slides.length), [slides.length, setCount])

  React.useLayoutEffect(() => {
    const vp = viewportRef.current
    const tr = trackRef.current
    if (!vp || !tr) return
    const measure = () => {
      const first = tr.children[0] as HTMLElement | undefined
      if (!first) return
      const gap = parseFloat(getComputedStyle(tr).columnGap) || 0
      const step = first.offsetWidth + gap
      const max = Math.max(0, tr.scrollWidth - vp.offsetWidth)
      stepRef.current = step
      maxRef.current = max
      const p = step ? Math.ceil(max / step - 0.01) + 1 : 1
      setPages(Math.max(1, p))
      setBounds({ left: -max, right: 0 })
      x.set(-Math.min(index * step, max))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(vp)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, peek])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const step = stepRef.current || 1
    // Project the release velocity forward (momentum), then snap to the nearest slide.
    const projected = x.get() + info.velocity.x * 0.18
    let target = Math.round(-projected / step)
    if (Math.abs(info.offset.x) > 40 && target === index) target = index + (info.offset.x < 0 ? 1 : -1)
    target = Math.max(index - 2, Math.min(index + 2, target))
    goTo(Math.max(0, Math.min(pages - 1, target)))
  }

  return (
    <div ref={viewportRef} data-slot="carousel-viewport" className="overflow-hidden rounded-facet-lg">
      <motion.div
        ref={trackRef}
        data-slot="carousel-content"
        className={cn("flex cursor-grab touch-pan-y gap-3 active:cursor-grabbing", className)}
        style={{ x }}
        drag={pages > 1 ? "x" : false}
        dragConstraints={bounds}
        dragElastic={0.12}
        dragMomentum={false}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={onDragEnd}
        onClickCapture={(e) => {
          // Swallow the click that ends a drag so slides with links don't fire.
          if (dragged.current) {
            e.stopPropagation()
            e.preventDefault()
            dragged.current = false
          }
        }}
        onPointerDown={() => (dragged.current = false)}
        {...(props as Omit<React.ComponentProps<typeof motion.div>, "ref">)}
      >
        {slides.map((child, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={cn("min-w-0 shrink-0 grow-0 basis-full", peek && "@min-[640px]:basis-[46%]")}
          >
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/** A Facet slide: 16:9 gradient tile with a caption in the bottom-left corner. */
function CarouselSlide({
  className,
  title,
  description,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & { title?: React.ReactNode; description?: React.ReactNode }) {
  return (
    <div
      data-slot="carousel-slide"
      className={cn(
        "relative grid aspect-video select-none items-end justify-items-start overflow-hidden rounded-facet-lg bg-linear-135 from-brand-500 to-brand-800 p-5 text-white",
        className
      )}
      {...props}
    >
      <div className="relative">
        {title && <b className="block text-xl font-semibold tracking-tight">{title}</b>}
        {description && <span className="block text-sm opacity-85">{description}</span>}
        {children}
      </div>
    </div>
  )
}

function NavButton({ direction: dir, className, ...props }: React.ComponentProps<typeof motion.button> & { direction: "prev" | "next" }) {
  const { index, pages, next, prev } = useCarousel()
  const disabled = dir === "prev" ? index <= 0 : index >= pages - 1
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight
  return (
    <motion.button
      type="button"
      data-slot={`carousel-${dir === "prev" ? "previous" : "next"}`}
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      disabled={disabled}
      onClick={dir === "prev" ? prev : next}
      initial={false}
      animate={{ opacity: disabled ? 0 : 1, scale: disabled ? 0.85 : 1 }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.06 }}
      transition={spring}
      className={cn(
        "absolute top-1/2 z-[2] grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-border-strong bg-card text-foreground shadow-md outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none [&_svg]:size-4",
        dir === "prev" ? "left-2" : "right-2",
        className
      )}
      {...props}
    >
      <Icon />
    </motion.button>
  )
}

function CarouselPrevious(props: React.ComponentProps<typeof motion.button>) {
  return <NavButton direction="prev" {...props} />
}

function CarouselNext(props: React.ComponentProps<typeof motion.button>) {
  return <NavButton direction="next" {...props} />
}

function CarouselDots({ className, ...props }: React.ComponentProps<"div">) {
  const { index, pages, goTo } = useCarousel()
  const id = React.useId()
  if (pages < 2) return null
  return (
    <div data-slot="carousel-dots" className={cn("mt-3 flex justify-center gap-1.5", className)} {...props}>
      {Array.from({ length: pages }, (_, i) => (
        <motion.button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === index || undefined}
          onClick={() => goTo(i)}
          animate={{ width: i === index ? 20 : 6 }}
          transition={spring}
          className="relative h-1.5 cursor-pointer overflow-hidden rounded-full bg-border-strong outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {i === index && <motion.span layoutId={`${id}-dot`} transition={spring} className="absolute inset-0 rounded-full bg-primary" />}
        </motion.button>
      ))}
    </div>
  )
}

export { Carousel, CarouselContent, CarouselSlide, CarouselPrevious, CarouselNext, CarouselDots, useCarousel }
export type { CarouselProps }
