import { TextShimmer } from "@/registry/facet/ui/text-shimmer"

export default function TextShimmerDemo() {
  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <TextShimmer className="text-xl font-semibold tracking-tight">Analyzing 1,284 accounts…</TextShimmer>
      <TextShimmer variant="brand" className="text-xl font-semibold tracking-tight">Generating your report</TextShimmer>
      <div className="flex items-center gap-6 text-sm">
        <TextShimmer duration={1.4}>Thinking…</TextShimmer>
        <TextShimmer duration={3}>Searching 3 sources</TextShimmer>
        <TextShimmer paused>Paused</TextShimmer>
      </div>
    </div>
  )
}
