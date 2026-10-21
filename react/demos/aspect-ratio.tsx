import { Play } from "lucide-react"
import { AspectRatio, AspectRatioCaption, AspectRatioMedia } from "@/registry/facet/ui/aspect-ratio"

const fill =
  "grid place-items-center bg-[radial-gradient(120%_90%_at_0%_0%,var(--chart-2)_0%,transparent_60%),radial-gradient(120%_120%_at_100%_100%,var(--chart-3)_0%,transparent_55%),var(--primary)] text-sm font-medium text-white/90"

const items = [
  { ratio: 16 / 9, label: "16 : 9", caption: "Video", hue: "0deg" },
  { ratio: 4 / 3, label: "4 : 3", caption: "Photo", hue: "40deg" },
  { ratio: 1, label: "1 : 1", caption: "Avatar", hue: "90deg" },
  { ratio: 9 / 16, label: "9 : 16", caption: "Story", hue: "160deg" },
]

export default function AspectRatioDemo() {
  return (
    <div className="grid grid-cols-2 items-start gap-4 md:grid-cols-4">
      {items.map((it) => (
        <figure key={it.label} className="m-0">
          <AspectRatio ratio={it.ratio}>
            <AspectRatioMedia>
              <div className={`size-full ${fill}`} style={{ filter: `hue-rotate(${it.hue})` }}>
              {it.ratio === 16 / 9 ? (
                <span className="grid size-11 place-items-center rounded-full bg-black/30 backdrop-blur-sm">
                  <Play className="size-5 fill-current" />
                </span>
              ) : (
                it.label
              )}
              </div>
            </AspectRatioMedia>
            <AspectRatioCaption>{it.caption}</AspectRatioCaption>
          </AspectRatio>
        </figure>
      ))}
    </div>
  )
}
