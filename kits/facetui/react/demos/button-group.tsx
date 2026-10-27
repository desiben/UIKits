import * as React from "react"
import { AlignCenter, AlignJustify, AlignLeft, Archive, ChevronDown, Clock, Copy, Ellipsis, FileText, Minus, Plus } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { DropdownMenu } from "radix-ui"
import { Button } from "@/registry/facet/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/registry/facet/ui/button-group"
import { Input } from "@/registry/facet/ui/input"
import { popIn } from "@/registry/facet/lib/motion"

export default function ButtonGroupDemo() {
  const [qty, setQty] = React.useState(12)
  const [open, setOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  return (
    <div className="flex flex-col items-start gap-5">
      <ButtonGroup aria-label="Message actions">
        <Button variant="outline" size="sm"><Archive /> Archive</Button>
        <Button variant="outline" size="sm">Report</Button>
        <Button variant="outline" size="sm">Snooze</Button>
        <Button variant="outline" size="icon-sm" aria-label="More"><Ellipsis /></Button>
      </ButtonGroup>

      <ButtonGroup aria-label="Save">
        <Button size="sm">Save changes</Button>
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
          <DropdownMenu.Trigger asChild>
            <Button size="icon-sm" aria-label="More save options"><ChevronDown /></Button>
          </DropdownMenu.Trigger>
          <AnimatePresence>
            {open && (
              <DropdownMenu.Portal forceMount>
                <DropdownMenu.Content forceMount align="end" sideOffset={6} asChild>
                  <motion.div
                    variants={popIn} initial="hidden" animate="visible" exit="exit"
                    style={{ transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)" }}
                    className="z-50 min-w-44 rounded-facet-lg border border-border bg-popover p-1 text-sm text-popover-foreground shadow-lg outline-none"
                  >
                    {[[Copy, "Save as copy"], [FileText, "Save as draft"], [Clock, "Schedule…"]].map(([Icon, label]) => {
                      const I = Icon as typeof Copy
                      return (
                        <DropdownMenu.Item key={label as string} className="flex cursor-pointer items-center gap-2 rounded-facet-sm px-2 py-1.5 outline-none data-[highlighted]:bg-accent [&_svg]:size-4 [&_svg]:text-muted-foreground">
                          <I /> {label as string}
                        </DropdownMenu.Item>
                      )
                    })}
                  </motion.div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            )}
          </AnimatePresence>
        </DropdownMenu.Root>
      </ButtonGroup>

      <div className="flex flex-wrap items-center gap-4">
        <ButtonGroup>
          <ButtonGroupText>https://</ButtonGroupText>
          <Input size="sm" className="w-48" defaultValue="facet.dev" aria-label="Domain" />
          <Button variant="outline" size="sm" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1400) }}>
            <Copy /> <ButtonGroupLabel copied={copied} />
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Quantity">
          <Button variant="outline" size="icon-sm" aria-label="Decrease" onClick={() => setQty((q) => Math.max(0, q - 1))}><Minus /></Button>
          <ButtonGroupText animateKey={qty} className="min-w-11 justify-center bg-card text-foreground" aria-live="polite">{qty}</ButtonGroupText>
          <Button variant="outline" size="icon-sm" aria-label="Increase" onClick={() => setQty((q) => q + 1)}><Plus /></Button>
        </ButtonGroup>
      </div>

      <ButtonGroup orientation="vertical" aria-label="Alignment" className="w-40">
        <Button variant="outline" size="sm"><AlignLeft /> Left</Button>
        <Button variant="outline" size="sm"><AlignCenter /> Center</Button>
        <Button variant="outline" size="sm"><AlignJustify /> Justify</Button>
      </ButtonGroup>
    </div>
  )
}

function ButtonGroupLabel({ copied }: { copied: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={copied ? "y" : "n"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
        {copied ? "Copied" : "Copy"}
      </motion.span>
    </AnimatePresence>
  )
}
