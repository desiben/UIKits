import * as React from "react"
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/registry/facet/ui/avatar"
import { Button } from "@/registry/facet/ui/button"

const svg = (a: string, b: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='48' height='48' fill='url(#g)'/><circle cx='24' cy='19' r='8' fill='white' fill-opacity='.85'/><path d='M8 46c2-10 9-15 16-15s14 5 16 15' fill='white' fill-opacity='.85'/></svg>`
  )}`

const team = ["Maya Chen", "Jon Reyes", "Ana Kowal", "Ade Cole", "Sam Park", "Lee Wong", "Ivy Dunn"]
const initials = (n: string) => n.split(" ").map((p) => p[0]).join("")
const statuses = ["online", "away", "busy", "offline"] as const

export default function AvatarDemo() {
  const [s, setS] = React.useState(0)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar size="sm"><AvatarFallback tint={1}>MC</AvatarFallback></Avatar>
        <Avatar status="online"><AvatarFallback tint={2}>JR</AvatarFallback></Avatar>
        <Avatar size="lg" status="away"><AvatarFallback tint={3}>AK</AvatarFallback></Avatar>
        <Avatar shape="square"><AvatarFallback tint={4}>AC</AvatarFallback></Avatar>
        <Avatar size="lg"><AvatarImage src={svg("#6aa8ff", "#7b5cff")} alt="Taylor Brooks" /><AvatarFallback>TB</AvatarFallback></Avatar>
        <Avatar size="lg" shape="square"><AvatarImage src={svg("#ffb36b", "#ff5c8a")} alt="Rae Kim" /><AvatarFallback>RK</AvatarFallback></Avatar>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <AvatarGroup max={4}>
          {team.map((n) => (
            <Avatar key={n}><AvatarFallback tint="auto">{initials(n)}</AvatarFallback></Avatar>
          ))}
        </AvatarGroup>
        <AvatarGroup size="sm">
          {team.slice(0, 5).map((n) => (
            <Avatar key={n} size="sm"><AvatarFallback tint="auto">{initials(n)}</AvatarFallback></Avatar>
          ))}
        </AvatarGroup>
        <div className="flex items-center gap-3">
          <Avatar size="lg" status={statuses[s]}><AvatarFallback tint={5}>SP</AvatarFallback></Avatar>
          <Button size="sm" variant="outline" onClick={() => setS((s + 1) % statuses.length)}>
            Status: {statuses[s]}
          </Button>
        </div>
      </div>
    </div>
  )
}
