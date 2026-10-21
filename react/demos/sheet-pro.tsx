import * as React from "react"
import { BarChart3, Folder, Inbox, LayoutDashboard, PanelLeft, PanelRight, Users } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import {
  SheetPro,
  SheetProBody,
  SheetProClose,
  SheetProContent,
  SheetProFooter,
  SheetProHeader,
  SheetProTrigger,
} from "@/registry/facet/ui/sheet-pro"

const field =
  "h-9 w-full rounded-facet border border-input bg-card px-3 text-sm text-foreground outline-none placeholder:text-placeholder focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-medium">
      {label}
      {children}
    </label>
  )
}

export default function SheetProDemo() {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
  const [open, setOpen] = React.useState(true)
  const [side, setSide] = React.useState<"left" | "right">("right")

  const show = (s: "left" | "right") => {
    if (open && s === side) return setOpen(false)
    setSide(s)
    setOpen(true)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button variant={open && side === "right" ? "secondary" : "outline"} size="sm" onClick={() => show("right")}><PanelRight /> Right · details</Button>
        <Button variant={open && side === "left" ? "secondary" : "outline"} size="sm" onClick={() => show("left")}><PanelLeft /> Left · navigation</Button>
      </div>
      <div ref={setContainer} className="relative h-[400px] overflow-hidden rounded-facet-lg border border-border bg-background">
        <div className="grid h-full place-items-center p-6 text-center text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">Northwind renewal</p>
            <p>$12,400 · Negotiation</p>
            <SheetPro open={open} onOpenChange={setOpen} modal={false}>
              <SheetProTrigger asChild>
                <Button size="sm" variant="ghost" className="mt-3">Edit deal</Button>
              </SheetProTrigger>
              <SheetProContent
                key={side}
                side={side}
                container={container}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
              >
                {side === "right" ? (
                  <>
                    <SheetProHeader title="Edit deal" description="Changes save to the CRM." />
                    <SheetProBody>
                      <Field label="Name"><input className={field} defaultValue="Northwind renewal" /></Field>
                      <Field label="Amount"><input className={field} defaultValue="$12,400" /></Field>
                      <Field label="Stage">
                        <select className={field} defaultValue="Negotiation">
                          <option>Qualified</option>
                          <option>Negotiation</option>
                          <option>Closed won</option>
                        </select>
                      </Field>
                      <Field label="Close date"><input className={field} defaultValue="Dec 18, 2026" /></Field>
                      <Field label="Notes"><textarea className={`${field} h-24 py-2`} defaultValue="Legal review scheduled for next week." /></Field>
                    </SheetProBody>
                    <SheetProFooter>
                      <SheetProClose asChild><Button variant="outline">Cancel</Button></SheetProClose>
                      <SheetProClose asChild><Button>Save</Button></SheetProClose>
                    </SheetProFooter>
                  </>
                ) : (
                  <>
                    <SheetProHeader title="Acme Inc." />
                    <SheetProBody className="p-3">
                      {[
                        [LayoutDashboard, "Dashboard"],
                        [Inbox, "Inbox"],
                        [Folder, "Projects"],
                        [Users, "Customers"],
                        [BarChart3, "Reports"],
                      ].map(([Icon, label], i) => {
                        const I = Icon as typeof Inbox
                        return (
                          <a
                            key={label as string}
                            href="#"
                            aria-current={i === 0 ? "page" : undefined}
                            className="-my-1.5 flex h-9 items-center gap-2.5 rounded-facet px-2.5 text-sm font-medium text-foreground-secondary hover:bg-accent aria-[current=page]:bg-primary-subtle aria-[current=page]:text-foreground"
                          >
                            <I className="size-4 text-muted-foreground" /> {label as string}
                          </a>
                        )
                      })}
                    </SheetProBody>
                  </>
                )}
              </SheetProContent>
            </SheetPro>
          </div>
        </div>
      </div>
    </div>
  )
}
