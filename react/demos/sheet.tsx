import * as React from "react"
import { Link2, PanelRight, Share } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/facet/ui/sheet"

const field =
  "h-9 w-full rounded-facet border border-input bg-card px-3 text-sm text-foreground outline-none placeholder:text-placeholder focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"

export default function SheetDemo() {
  const [open, setOpen] = React.useState(true)
  return (
    <div className="flex min-h-[420px] flex-wrap items-start gap-2">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline"><PanelRight /> Open sheet</Button>
        </SheetTrigger>
        <SheetContent side="right" onOpenAutoFocus={(e) => e.preventDefault()}>
          <SheetHeader>
            <SheetTitle>Edit customer</SheetTitle>
            <SheetDescription>Drag the panel right to dismiss.</SheetDescription>
          </SheetHeader>
          <SheetBody>
            <label className="flex flex-col gap-1.5 text-[13px] font-medium">
              Company
              <input className={field} defaultValue="Northwind" />
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-medium">
              Billing email
              <input className={field} defaultValue="ops@northwind.io" />
            </label>
          </SheetBody>
          <SheetFooter>
            <SheetClose asChild><Button variant="ghost">Cancel</Button></SheetClose>
            <SheetClose asChild><Button>Save</Button></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline"><Share /> Open drawer</Button>
        </SheetTrigger>
        <SheetContent side="bottom" showCloseButton={false} className="mx-auto max-w-lg">
          <SheetHeader className="pr-6 text-center">
            <SheetTitle>Share “Q4 Launch”</SheetTitle>
            <SheetDescription>Swipe down to close.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2 px-6 pt-4 pb-6">
            <Button className="w-full"><Link2 /> Copy link</Button>
            <SheetClose asChild><Button variant="outline" className="w-full">Done</Button></SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
