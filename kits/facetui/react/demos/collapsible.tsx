import * as React from "react"
import { ChevronRight, Folder, FileCode2 } from "lucide-react"
import { motion } from "motion/react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleIconTrigger,
  CollapsibleItem,
  CollapsibleTrigger,
} from "@/registry/facet/ui/collapsible"

const row =
  "rounded-facet border border-border bg-card px-3 py-2 font-mono text-[13px] text-foreground"

export default function CollapsibleDemo() {
  const [open, setOpen] = React.useState(true)
  const [srcOpen, setSrcOpen] = React.useState(false)
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <Collapsible open={open} onOpenChange={setOpen} className="max-w-[340px]">
        <div className="flex items-center gap-3 py-1">
          <span className="flex-1 text-sm font-medium">@peduarte starred 3 repositories</span>
          <CollapsibleIconTrigger aria-label={open ? "Hide repositories" : "Show repositories"} />
        </div>
        <div className={`${row} mt-2`}>@radix-ui/primitives</div>
        <CollapsibleContent className="flex flex-col gap-2 pt-2">
          <CollapsibleItem className={row}>@radix-ui/colors</CollapsibleItem>
          <CollapsibleItem className={row}>@stitches/react</CollapsibleItem>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={srcOpen} onOpenChange={setSrcOpen} className="max-w-[300px]">
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-2 rounded-facet px-2 py-1.5 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
          <motion.span animate={{ rotate: srcOpen ? 90 : 0 }} transition={{ type: "spring", stiffness: 520, damping: 34 }} className="inline-flex">
            <ChevronRight className="size-4 text-muted-foreground" />
          </motion.span>
          <Folder className="size-4 text-brand" />
          src
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-[19px] flex flex-col border-l border-border-subtle pl-3">
          {["button.tsx", "collapsible.tsx", "select.tsx", "utils.ts"].map((f) => (
            <CollapsibleItem key={f} className="flex items-center gap-2 rounded-facet px-2 py-1.5 text-sm text-foreground-secondary hover:bg-accent">
              <FileCode2 className="size-4 text-muted-foreground" />
              {f}
            </CollapsibleItem>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
