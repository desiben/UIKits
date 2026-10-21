import { ScrollArea } from "@/registry/facet/ui/scroll-area"

const tags = Array.from({ length: 30 }, (_, i) => `v1.2.0-beta.${30 - i}`)
const art = [
  ["Ornella Binni", "from-brand-400 to-brand-800"],
  ["Tom Byrom", "from-brand-300 to-brand-600"],
  ["Vladimir Malyavko", "from-brand-600 to-brand-950"],
  ["Ada Lin", "from-brand-200 to-brand-500"],
  ["Kenji Ito", "from-brand-500 to-brand-900"],
]

export default function ScrollAreaDemo() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <ScrollArea label="Tags" fade className="h-60 w-56">
        <div className="p-4">
          <h4 className="text-[13px] font-medium">Tags</h4>
          <div className="mt-2 divide-y divide-border-subtle">
            {tags.map((t) => (
              <div key={t} className="py-2 text-sm text-foreground-secondary">
                {t}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      <ScrollArea label="Artwork" orientation="horizontal" fade className="w-[min(100%,460px)]">
        <div className="flex w-max gap-4 p-4">
          {art.map(([name, gradient]) => (
            <figure key={name} className="m-0 w-[150px] shrink-0">
              <div className={`aspect-[3/4] rounded-facet-lg bg-linear-to-br ${gradient}`} />
              <figcaption className="mt-1.5 text-xs text-muted-foreground">
                Photo by <b className="font-medium text-foreground">{name}</b>
              </figcaption>
            </figure>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
