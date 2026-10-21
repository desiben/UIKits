"use client"

import * as React from "react"
import { animate } from "motion/react"
import { Group, Panel, Separator, type PanelImperativeHandle } from "react-resizable-panels"

import { cn } from "@/registry/facet/lib/utils"
import { springSoft } from "@/registry/facet/lib/motion"

function ResizablePanelGroup({ className, ...props }: React.ComponentProps<typeof Group>) {
  return (
    <Group
      data-slot="resizable-panel-group"
      className={cn("size-full", className)}
      {...props}
    />
  )
}

function ResizablePanel({ className, ...props }: React.ComponentProps<typeof Panel>) {
  return <Panel data-slot="resizable-panel" className={cn("min-h-0 min-w-0", className)} {...props} />
}

interface ResizableHandleProps extends React.ComponentProps<typeof Separator> {
  /** Show a grip pill in the middle of the handle. */
  withHandle?: boolean
}

/**
 * Drag handle between panels (role=separator, arrow keys resize, double-click resets). The line
 * lights up in brand colour on hover, and the grip springs taller and fills while dragging.
 */
function ResizableHandle({ className, withHandle = true, ...props }: ResizableHandleProps) {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "group/handle relative flex shrink-0 items-center justify-center bg-border outline-none transition-colors duration-150",
        // vertical line (between side-by-side panels)
        "aria-[orientation=vertical]:w-px aria-[orientation=vertical]:cursor-col-resize aria-[orientation=vertical]:before:absolute aria-[orientation=vertical]:before:inset-y-0 aria-[orientation=vertical]:before:-inset-x-1.5",
        // horizontal line (between stacked panels)
        "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:cursor-row-resize aria-[orientation=horizontal]:before:absolute aria-[orientation=horizontal]:before:inset-x-0 aria-[orientation=horizontal]:before:-inset-y-1.5",
        "data-[separator=hover]:bg-brand-400 data-[separator=active]:bg-primary data-[separator=focus]:bg-ring",
        className
      )}
      {...props}
    >
      {withHandle && (
        <span
          aria-hidden="true"
          className={cn(
            "z-10 block rounded-full bg-card shadow-[inset_0_0_0_1px_var(--border-strong)] transition-[width,height,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            "group-aria-[orientation=vertical]/handle:h-7 group-aria-[orientation=vertical]/handle:w-1.5",
            "group-aria-[orientation=horizontal]/handle:h-1.5 group-aria-[orientation=horizontal]/handle:w-7",
            "group-data-[separator=hover]/handle:bg-primary group-data-[separator=hover]/handle:shadow-none",
            "group-data-[separator=focus]/handle:bg-ring group-data-[separator=focus]/handle:shadow-none",
            "group-data-[separator=active]/handle:bg-primary group-data-[separator=active]/handle:shadow-none",
            "group-aria-[orientation=vertical]/handle:group-data-[separator=active]/handle:h-11",
            "group-aria-[orientation=horizontal]/handle:group-data-[separator=active]/handle:w-11"
          )}
        />
      )}
    </Separator>
  )
}

/**
 * Smoothly resize a panel (by ref) to a percentage with a spring, instead of jumping.
 * `const resizeTo = useAnimatedPanel(ref); resizeTo(0)` — pass 0 to collapse a collapsible panel.
 */
function useAnimatedPanel(ref: React.RefObject<PanelImperativeHandle | null>) {
  const controls = React.useRef<ReturnType<typeof animate> | null>(null)
  React.useEffect(() => () => controls.current?.stop(), [])
  return React.useCallback(
    (to: number) => {
      const panel = ref.current
      if (!panel) return
      controls.current?.stop()
      const from = panel.getSize().asPercentage
      controls.current = animate(from, to, {
        ...springSoft,
        onUpdate: (v) => ref.current?.resize(`${v}%`),
        onComplete: () => ref.current?.resize(`${to}%`),
      })
    },
    [ref]
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle, useAnimatedPanel }
