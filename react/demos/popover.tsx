import * as React from "react"
import { Bell, Link2, MapPin, Settings2 } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/facet/ui/popover"

function Initials({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={`grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-sm font-semibold text-white ${className}`}>
      {children}
    </span>
  )
}

export default function PopoverDemo() {
  const [popOpen, setPopOpen] = React.useState(true)
  const [tipOpen, setTipOpen] = React.useState(true)
  const [cardOpen, setCardOpen] = React.useState(true)
  const [notify, setNotify] = React.useState(true)
  return (
    <div className="grid min-h-[360px] grid-cols-1 items-start gap-10 pt-10 sm:grid-cols-3">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Tooltip</span>
        <Tooltip open={tipOpen} onOpenChange={setTipOpen}>
          <TooltipTrigger asChild>
            <Button variant="outline"><Link2 /> Hover me</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Copy link</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Popover</span>
        <Popover open={popOpen} onOpenChange={setPopOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline"><Settings2 /> Notifications</Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="flex items-start gap-3">
              <span className="grid size-8 place-items-center rounded-facet bg-primary-subtle text-brand"><Bell className="size-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Weekly digest</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">A summary of activity every Monday.</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setPopOpen(false)}>Later</Button>
              <Button size="sm" onClick={() => setNotify(!notify)}>{notify ? "Turn off" : "Turn on"}</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Hover card</span>
        <HoverCard open={cardOpen} onOpenChange={setCardOpen}>
          <HoverCardTrigger asChild>
            <a href="#maya" className="text-sm font-medium text-brand underline decoration-current/30 underline-offset-4 hover:decoration-current">@mayachen</a>
          </HoverCardTrigger>
          <HoverCardContent side="bottom">
            <div className="flex items-center gap-3">
              <Initials>MC</Initials>
              <div>
                <p className="text-sm font-semibold">Maya Chen</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> Design lead · Lisbon</p>
              </div>
            </div>
            <p className="mt-3 text-[13px] text-foreground-secondary">Owns the design system and onboarding redesign.</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  )
}
