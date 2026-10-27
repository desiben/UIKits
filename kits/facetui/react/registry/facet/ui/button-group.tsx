"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { spring } from "@/registry/facet/lib/motion"

export interface ButtonGroupProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical"
}

/**
 * Joins buttons, inputs and text addons into one control with shared borders and a single
 * Facet outer corner. Buttons inside keep their own spring press.
 */
function ButtonGroup({ className, orientation = "horizontal", ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "isolate inline-flex w-fit items-stretch",
        "[&>*]:relative [&>*]:rounded-none [&>*:focus-visible]:z-10 [&>*:focus-within]:z-10 [&>*:hover]:z-[1]",
        "[&>[data-slot=input-shell]]:w-auto",
        orientation === "horizontal"
          ? [
              "[&>*:not(:first-child)]:-ml-px",
              "[&>*:first-child]:rounded-l-[var(--radius)]",
              "[&>*:last-child]:rounded-tr-[calc(var(--radius)*0.25)] [&>*:last-child]:rounded-br-[var(--radius)]",
              // separator line between solid buttons
              "[&>[data-slot=button]:not([class*=border])+[data-slot=button]:not([class*=border])]:shadow-[inset_1px_0_0_rgb(255_255_255/0.22)]",
            ]
          : [
              "flex-col [&>*]:justify-start",
              "[&>*:not(:first-child)]:-mt-px",
              "[&>*:first-child]:rounded-tl-[var(--radius)] [&>*:first-child]:rounded-tr-[calc(var(--radius)*0.25)]",
              "[&>*:last-child]:rounded-b-[var(--radius)]",
            ],
        className
      )}
      {...props}
    />
  )
}

/** Static text addon (e.g. "https://" or a counter). Pass `animateKey` to slide the content when it changes. */
function ButtonGroupText({
  className,
  children,
  animateKey,
  ...props
}: React.ComponentProps<"span"> & { animateKey?: React.Key }) {
  const prev = React.useRef(animateKey)
  const dir = React.useRef(1)
  if (prev.current !== animateKey) {
    dir.current = typeof animateKey === "number" && typeof prev.current === "number" && animateKey < prev.current ? -1 : 1
    prev.current = animateKey
  }
  return (
    <span
      data-slot="button-group-text"
      className={cn(
        "inline-flex items-center gap-1.5 overflow-hidden border border-border-strong bg-subtle px-3 text-[13px] font-medium text-foreground-secondary [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {animateKey === undefined ? (
        children
      ) : (
        <AnimatePresence mode="popLayout" initial={false} custom={dir.current}>
          <motion.span
            key={animateKey}
            custom={dir.current}
            className="inline-block tabular-nums"
            variants={{
              enter: (d: number) => ({ y: d * 14, opacity: 0 }),
              center: { y: 0, opacity: 1 },
              exit: (d: number) => ({ y: d * -14, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
          >
            {children}
          </motion.span>
        </AnimatePresence>
      )}
    </span>
  )
}

function ButtonGroupSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      data-slot="button-group-separator"
      className={cn("z-[2] w-px shrink-0 self-stretch bg-border-strong", className)}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupText, ButtonGroupSeparator }
