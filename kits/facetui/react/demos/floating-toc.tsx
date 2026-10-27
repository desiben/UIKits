import * as React from "react"
import { FloatingToc, type FloatingTocItem } from "@/registry/facet/ui/floating-toc"

const items: FloatingTocItem[] = [
  { id: "ftoc-overview", label: "Overview" },
  { id: "ftoc-install", label: "Installation", level: 2 },
  { id: "ftoc-theming", label: "Theming", level: 2 },
  { id: "ftoc-motion", label: "Motion" },
  { id: "ftoc-api", label: "API reference" },
]

const filler =
  "Facet components ship as source you own. Every part takes a className, exposes data-slot attributes and reads its colours from theme tokens, so one variable change restyles the whole kit."

export default function FloatingTocDemo() {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(items[0].id)
  return (
    <div className="flex items-start gap-4">
      <FloatingToc items={items} scrollRoot={scrollRef} onActiveChange={setActive} className="mt-2" />
      <div ref={scrollRef} className="relative h-[300px] max-w-[560px] flex-1 overflow-y-auto rounded-facet-lg border border-border bg-card px-6 pb-40 text-sm text-foreground-secondary">
        {items.map((it) => (
          <section key={it.id} className="pt-5">
            <h3 id={it.id} className={`mb-2 font-semibold text-foreground ${it.level === 2 ? "text-sm" : "text-base"}`}>
              {it.label}
            </h3>
            <p className="mb-2 leading-relaxed">{filler}</p>
            <p className="leading-relaxed">Hover or tab into the bars on the left to open the panel; the active bar follows this scroll area.</p>
          </section>
        ))}
      </div>
      <div className="hidden w-40 pt-2 text-xs text-muted-foreground lg:block">
        Reading: <span className="font-medium text-foreground">{items.find((i) => i.id === active)?.label}</span>
      </div>
    </div>
  )
}
