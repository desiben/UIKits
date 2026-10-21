import * as React from "react"
import { ChevronDown, Copy, Pencil, Share2, Trash2, UserPlus, Mail, Link2 } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/facet/ui/dropdown-menu"

export default function DropdownMenuDemo() {
  const [open, setOpen] = React.useState(true)
  const [grid, setGrid] = React.useState(true)
  const [snap, setSnap] = React.useState(false)
  const [density, setDensity] = React.useState("comfortable")
  return (
    <div className="flex min-h-[360px] flex-wrap items-start gap-6">
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Options <ChevronDown className="transition-transform duration-200 data-[open=true]:rotate-180" data-open={open} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Project</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem><Pencil /> Rename <DropdownMenuShortcut>⌘R</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuItem><Copy /> Duplicate <DropdownMenuShortcut>⌘D</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger><Share2 /> Share</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem><Mail /> Email link</DropdownMenuItem>
                <DropdownMenuItem><Link2 /> Copy link</DropdownMenuItem>
                <DropdownMenuItem><UserPlus /> Invite people…</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive"><Trash2 /> Delete <DropdownMenuShortcut>⌫</DropdownMenuShortcut></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">View <ChevronDown /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px]">
          <DropdownMenuLabel>Canvas</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={grid} onCheckedChange={(v) => setGrid(v === true)} onSelect={(e) => e.preventDefault()}>Show grid</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={snap} onCheckedChange={(v) => setSnap(v === true)} onSelect={(e) => e.preventDefault()}>Snap to pixels</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Density</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
            <DropdownMenuRadioItem value="compact" onSelect={(e) => e.preventDefault()}>Compact</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="comfortable" onSelect={(e) => e.preventDefault()}>Comfortable</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
