import * as React from "react"
import { PanelLeftClose, PanelLeftOpen, SquareTerminal, FileCode2 } from "lucide-react"
import type { PanelImperativeHandle } from "react-resizable-panels"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, useAnimatedPanel } from "@/registry/facet/ui/resizable"
import { AnimatedNumber } from "@/registry/facet/ui/number-stepper"
import { Button } from "@/registry/facet/ui/button"

function SizeTag({ value }: { value: number }) {
  return (
    <span className="rounded-full bg-secondary px-1.5 py-px text-[11px] font-medium text-muted-foreground">
      <AnimatedNumber value={Math.round(value)} />%
    </span>
  )
}

export default function ResizableDemo() {
  const sidebar = React.useRef<PanelImperativeHandle | null>(null)
  const resizeSidebar = useAnimatedPanel(sidebar)
  const [sizes, setSizes] = React.useState({ side: 30, editor: 65 })
  const collapsed = sizes.side < 1

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => resizeSidebar(collapsed ? 30 : 0)}
          aria-label={collapsed ? "Show sidebar" : "Hide sidebar"}
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          {collapsed ? "Show sidebar" : "Hide sidebar"}
        </Button>
        <span className="text-[13px] text-muted-foreground">Drag a handle, focus it and use the arrow keys, or double-click to reset.</span>
      </div>
      <div className="h-[300px] overflow-hidden rounded-facet-lg border border-border bg-card">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel
            panelRef={sidebar}
            defaultSize="30"
            minSize="15"
            collapsible
            collapsedSize="0"
            onResize={(s) => setSizes((p) => ({ ...p, side: s.asPercentage }))}
            className="bg-subtle"
          >
            <div className="flex h-full flex-col gap-1 overflow-hidden p-4">
              <div className="flex items-center justify-between gap-2">
                <b className="truncate text-sm font-medium">Sidebar</b>
                <SizeTag value={sizes.side} />
              </div>
              <p className="truncate text-[13px] text-muted-foreground">Drag the handle →</p>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize="30">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="65" minSize="20" onResize={(s) => setSizes((p) => ({ ...p, editor: s.asPercentage }))}>
                <div className="flex h-full flex-col gap-2 p-4">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="size-4 text-brand" />
                    <b className="text-sm font-medium">Editor</b>
                    <SizeTag value={sizes.editor} />
                  </div>
                  <pre className="m-0 font-mono text-[13px] leading-5 text-foreground-secondary">{`export function greet(name: string) {\n  return \`Hello, \${name}\`\n}`}</pre>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel minSize="15">
                <div className="flex h-full flex-col gap-2 bg-subtle p-4">
                  <div className="flex items-center gap-2">
                    <SquareTerminal className="size-4 text-muted-foreground" />
                    <b className="text-sm font-medium">Terminal</b>
                    <SizeTag value={100 - sizes.editor} />
                  </div>
                  <code className="font-mono text-[13px] text-success">✓ built in 412ms</code>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
