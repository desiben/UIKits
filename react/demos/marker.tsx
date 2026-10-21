import * as React from "react"
import { Clock, RotateCcw, Sparkles, User } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { Marker } from "@/registry/facet/ui/marker"

export default function MarkerDemo() {
  const [k, setK] = React.useState(0)
  return (
    <div key={k} className="mx-auto flex max-w-[520px] flex-col gap-[18px]">
      <Marker>Today</Marker>
      <Marker variant="status" icon={<User />}>
        <span><b>Ada Lovelace</b> joined the conversation</span>
      </Marker>
      <Marker variant="unread">New messages</Marker>
      <Marker variant="pill" icon={<Sparkles />}>Earlier messages summarised</Marker>
      <Marker variant="status" icon={<Clock />}>Agent paused for approval · 2m</Marker>
      <Button variant="ghost" size="sm" className="self-center" onClick={() => setK(k + 1)}>
        <RotateCcw /> Replay
      </Button>
    </div>
  )
}
