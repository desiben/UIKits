import * as React from "react"
import { Copy, MousePointerClick, Pencil, Share2, Trash2 } from "lucide-react"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/registry/facet/ui/context-menu"

export default function ContextMenuDemo() {
  const [grid, setGrid] = React.useState(true)
  const [snap, setSnap] = React.useState(false)
  const areaRef = React.useRef<HTMLDivElement>(null)

  // Open the menu once on mount so the preview shows it (right-click works as usual afterwards).
  React.useEffect(() => {
    const el = areaRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: r.left + r.width * 0.7, clientY: r.top + r.height - 30 }))
  }, [])

  return (
    <div className="min-h-[380px]">
      <ContextMenu modal={false}>
        <ContextMenuTrigger asChild>
          <div
            ref={areaRef}
            className="mx-auto grid min-h-[180px] max-w-[520px] place-items-center gap-2 rounded-facet-lg border-[1.5px] border-dashed border-border-strong p-6 text-center text-sm text-muted-foreground select-none"
          >
            <div className="flex flex-col items-center gap-2">
              <MousePointerClick className="size-5" />
              Right-click here (or long-press on a phone)
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Layer</ContextMenuLabel>
          <ContextMenuItem><Copy /> Copy <ContextMenuShortcut>⌘C</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuItem><Pencil /> Rename <ContextMenuShortcut>F2</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuItem><Share2 /> Share…</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={grid} onCheckedChange={(v) => setGrid(v === true)} onSelect={(e) => e.preventDefault()}>Show grid</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={snap} onCheckedChange={(v) => setSnap(v === true)} onSelect={(e) => e.preventDefault()}>Snap to pixels</ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive"><Trash2 /> Delete <ContextMenuShortcut>⌫</ContextMenuShortcut></ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
