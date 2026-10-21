import * as React from "react"
import { Bold, CalendarDays, Italic, Kanban, List, Star, Underline } from "lucide-react"
import { Toggle, ToggleGroup, ToggleGroupItem } from "@/registry/facet/ui/toggle"

export default function ToggleDemo() {
  const [view, setView] = React.useState("list")
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Bold" defaultPressed><Bold /></Toggle>
        <Toggle aria-label="Italic"><Italic /></Toggle>
        <Toggle aria-label="Underline"><Underline /></Toggle>
        <Toggle variant="outline"><Star /> Favorite</Toggle>
        <Toggle size="sm" variant="outline">Small</Toggle>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup type="single" value={view} onValueChange={(v: string) => v && setView(v)} aria-label="View">
          <ToggleGroupItem value="list"><List /> List</ToggleGroupItem>
          <ToggleGroupItem value="board"><Kanban /> Board</ToggleGroupItem>
          <ToggleGroupItem value="calendar"><CalendarDays /> Calendar</ToggleGroupItem>
        </ToggleGroup>
        <span className="text-[13px] text-muted-foreground">Showing <b className="font-medium text-foreground">{view}</b> view</span>
      </div>
      <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text formatting" size="sm" className="w-fit">
        <ToggleGroupItem value="bold" aria-label="Bold"><Bold /></ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic"><Italic /></ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline"><Underline /></ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
