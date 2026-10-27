"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import { LocateFixed, MapPin as MapPinIcon, Minus, Plus } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { popIn, spring, springBouncy } from "@/registry/facet/lib/motion"

/* Coordinates are in the base map's viewBox (VIEW_W × VIEW_H) so pins, routes and the base line up. */
const VIEW_W = 720
const VIEW_H = 320

interface MapContextValue {
  zoom: MotionValue<number>
  inverseZoom: MotionValue<number>
}
const MapContext = React.createContext<MapContextValue | null>(null)

interface MapProps extends React.ComponentProps<"div"> {
  /** Accessible description of what the map shows. */
  label?: string
  /** Show zoom controls (default true). */
  controls?: boolean
  minZoom?: number
  maxZoom?: number
  defaultZoom?: number
  /** Content pinned over the map that doesn't pan or zoom (chips, legends). */
  overlay?: React.ReactNode
}

function Map({
  label = "Map",
  controls = true,
  minZoom = 1,
  maxZoom = 2.5,
  defaultZoom = 1,
  overlay,
  className,
  children,
  ...props
}: MapProps) {
  const [zoomLevel, setZoomLevel] = React.useState(defaultZoom)
  const zoom = useSpring(defaultZoom, { stiffness: 260, damping: 30 })
  const inverseZoom = useTransform(zoom, (z) => 1 / z)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const ref = React.useRef<HTMLDivElement>(null)
  const [bounds, setBounds] = React.useState({ left: 0, right: 0, top: 0, bottom: 0 })

  const setZoom = (z: number) => {
    const next = Math.max(minZoom, Math.min(maxZoom, Math.round(z * 100) / 100))
    setZoomLevel(next)
    zoom.set(next)
  }

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const bx = ((zoomLevel - 1) * el.offsetWidth) / 2
    const by = ((zoomLevel - 1) * el.offsetHeight) / 2
    setBounds({ left: -bx, right: bx, top: -by, bottom: by })
    // Pull the layer back inside the new bounds when zooming out.
    x.set(Math.max(-bx, Math.min(bx, x.get())))
    y.set(Math.max(-by, Math.min(by, y.get())))
  }, [zoomLevel, x, y])

  return (
    <MapContext.Provider value={{ zoom, inverseZoom }}>
      <div
        ref={ref}
        data-slot="map"
        role="group"
        aria-roledescription="map"
        aria-label={label}
        className={cn(
          "relative aspect-[9/4] min-h-[240px] w-full overflow-hidden rounded-facet-lg border border-border",
          "bg-[color-mix(in_srgb,var(--subtle)_88%,var(--chart-5))] dark:bg-[color-mix(in_srgb,var(--background)_92%,var(--chart-5))]",
          className
        )}
        onWheel={(e) => {
          if (!e.ctrlKey && !e.metaKey) return
          setZoom(zoomLevel - e.deltaY * 0.01)
        }}
        {...props}
      >
        <motion.div
          data-slot="map-layer"
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ scale: zoom, x, y }}
          drag={zoomLevel > 1}
          dragConstraints={bounds}
          dragElastic={0.08}
          dragTransition={{ power: 0.25, timeConstant: 220 }}
        >
          {children}
        </motion.div>
        {overlay}
        {controls && (
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col overflow-hidden rounded-facet border border-border bg-card shadow-md">
            {[
              { label: "Zoom in", icon: <Plus />, onClick: () => setZoom(zoomLevel + 0.5), disabled: zoomLevel >= maxZoom },
              { label: "Zoom out", icon: <Minus />, onClick: () => setZoom(zoomLevel - 0.5), disabled: zoomLevel <= minZoom },
              {
                label: "Reset view",
                icon: <LocateFixed />,
                onClick: () => {
                  setZoom(defaultZoom)
                  x.set(0)
                  y.set(0)
                },
                disabled: false,
              },
            ].map((b) => (
              <motion.button
                key={b.label}
                type="button"
                aria-label={b.label}
                disabled={b.disabled}
                onClick={b.onClick}
                whileTap={{ scale: 0.88 }}
                transition={spring}
                className="grid size-8 cursor-pointer place-items-center text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default disabled:opacity-40 [&+button]:border-t [&+button]:border-border-subtle [&_svg]:size-4"
              >
                {b.icon}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </MapContext.Provider>
  )
}

/** The illustrative base: water, parks and a street grid. Swap for real tiles in production. */
function MapBase({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="map-base"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("absolute inset-0 size-full", className)}
      {...props}
    >
      <g className="fill-[color-mix(in_srgb,var(--chart-5)_26%,var(--card))] dark:fill-[color-mix(in_srgb,var(--chart-5)_18%,var(--background))]">
        <path d="M0 230 C120 210 180 260 300 250 S520 200 720 240 V320 H0Z" />
      </g>
      <g className="fill-[color-mix(in_srgb,var(--chart-2)_24%,var(--card))] dark:fill-[color-mix(in_srgb,var(--chart-2)_14%,var(--background))]">
        <rect x="430" y="40" width="150" height="90" rx="18" />
        <ellipse cx="120" cy="90" rx="46" ry="46" />
      </g>
      <g
        fill="none"
        strokeLinecap="round"
        className="stroke-card dark:stroke-[color-mix(in_srgb,var(--foreground)_12%,var(--background))]"
        style={{ vectorEffect: "non-scaling-stroke" }}
      >
        <path d="M-10 150 H730" strokeWidth={7} vectorEffect="non-scaling-stroke" />
        <path d="M260 -10 V330" strokeWidth={7} vectorEffect="non-scaling-stroke" />
        <path d="M-10 70 C200 60 420 110 730 90" strokeWidth={3} vectorEffect="non-scaling-stroke" />
        <path d="M520 -10 C500 120 560 200 540 330" strokeWidth={3} vectorEffect="non-scaling-stroke" />
        <path d="M80 -10 C110 120 60 220 120 330" strokeWidth={3} vectorEffect="non-scaling-stroke" />
        <path d="M-10 200 C150 190 300 205 400 190" strokeWidth={3} vectorEffect="non-scaling-stroke" opacity={0.8} />
      </g>
    </svg>
  )
}

/** An animated route: draws itself in, then a dashed line flows along it. Path in viewBox units. */
function MapRoute({ d, className }: { d: string; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <svg
      data-slot="map-route"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    >
      <motion.path
        d={d}
        fill="none"
        strokeWidth={8}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="stroke-primary/25"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.path
        d={d}
        fill="none"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="1 9"
        vectorEffect="non-scaling-stroke"
        className="stroke-primary"
        initial={{ opacity: 0, strokeDashoffset: 0 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, strokeDashoffset: -20 }}
        transition={{
          opacity: { delay: 0.9, duration: 0.3 },
          strokeDashoffset: { duration: 1.4, ease: "linear", repeat: Infinity },
        }}
      />
    </svg>
  )
}

const pos = (x: number, y: number) => ({ left: `${(x / VIEW_W) * 100}%`, top: `${(y / VIEW_H) * 100}%` })

interface MapPinProps extends Omit<React.ComponentProps<"button">, "children" | "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"> {
  /** Position in viewBox units (0–720 × 0–320). */
  x: number
  y: number
  /** Accessible name, e.g. "Northwind HQ". */
  label: string
  icon?: React.ReactNode
  variant?: "brand" | "inverse"
  /** Popup content; clicking the pin toggles it. */
  children?: React.ReactNode
  defaultOpen?: boolean
  /** Drop-in delay in seconds (stagger several pins). */
  delay?: number
}

function MapPin({ x, y, label, icon, variant = "brand", children, defaultOpen = false, delay = 0, className, onClick, ...props }: MapPinProps) {
  const ctx = React.useContext(MapContext)
  const [open, setOpen] = React.useState(defaultOpen)
  const popupId = React.useId()
  return (
    <motion.div className="absolute z-[2] origin-bottom" style={{ ...pos(x, y), scale: ctx?.inverseZoom }}>
      <motion.button
        type="button"
        aria-label={label}
        aria-expanded={children ? open : undefined}
        aria-controls={children && open ? popupId : undefined}
        onClick={(e) => {
          onClick?.(e)
          if (children) setOpen((o) => !o)
        }}
        onPointerDownCapture={(e) => e.stopPropagation()}
        initial={{ y: -28, opacity: 0, scale: 0.6 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.9 }}
        transition={{ ...springBouncy, delay }}
        className={cn(
          "absolute -translate-x-1/2 -translate-y-full cursor-pointer outline-none focus-visible:[&>span]:ring-2 focus-visible:[&>span]:ring-ring focus-visible:[&>span]:ring-offset-2",
          className
        )}
        {...(props as Omit<React.ComponentProps<typeof motion.button>, "ref">)}
      >
        <span
          className={cn(
            "grid size-[30px] -rotate-45 place-items-center rounded-[50%_50%_50%_4px] border-2 border-card shadow-lg",
            variant === "brand" ? "bg-primary text-primary-foreground" : "bg-inverse text-inverse-foreground"
          )}
        >
          <span className="rotate-45 [&_svg]:size-3.5">{icon ?? <MapPinIcon />}</span>
        </span>
      </motion.button>
      <AnimatePresence>
        {children && open && (
          <motion.div
            id={popupId}
            role="dialog"
            aria-label={label}
            variants={popIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformOrigin: "50% 100%" }}
            className="absolute bottom-[44px] left-0 z-[3] w-max min-w-[180px] max-w-[260px] -translate-x-1/2 rounded-facet-lg border border-border bg-popover p-3 text-xs text-foreground-secondary shadow-lg [&_b]:block [&_b]:text-sm [&_b]:font-medium [&_b]:text-foreground"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/** "You are here" dot with a soft ping. */
function MapDot({ x, y, className }: { x: number; y: number; className?: string }) {
  const ctx = React.useContext(MapContext)
  const reduce = useReducedMotion()
  return (
    <motion.span aria-hidden="true" className={cn("absolute z-[1] size-0", className)} style={{ ...pos(x, y), scale: ctx?.inverseZoom }}>
      {!reduce && (
        <motion.span
          className="absolute -top-3 -left-3 size-6 rounded-full bg-primary/30"
          animate={{ scale: [0.6, 1.8], opacity: [0.7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span className="absolute -top-[7px] -left-[7px] size-3.5 rounded-full border-[3px] border-card bg-primary shadow-[0_0_0_6px_color-mix(in_srgb,var(--brand-500)_25%,transparent)]" />
    </motion.span>
  )
}

/** A pill pinned over the map (bottom-left by default) for ETA / legend text. */
function MapChip({ className, ...props }: React.ComponentProps<typeof motion.span>) {
  return (
    <motion.span
      data-slot="map-chip"
      variants={popIn}
      initial="hidden"
      animate="visible"
      className={cn(
        "absolute bottom-2.5 left-2.5 z-10 inline-flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground shadow-md [&_svg]:size-3.5 [&_svg]:text-brand",
        className
      )}
      {...props}
    />
  )
}

export { Map, MapBase, MapRoute, MapPin, MapDot, MapChip }
export type { MapProps, MapPinProps }
