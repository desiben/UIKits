import * as React from "react"
import { Users, User, Zap } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/facet/ui/select"
import { Combobox } from "@/registry/facet/ui/combobox"

const labels = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "docs", label: "Docs" },
  { value: "design", label: "Design" },
  { value: "perf", label: "Performance" },
]

export default function SelectDemo() {
  const [fruit, setFruit] = React.useState<string>()
  const [tags, setTags] = React.useState<string[]>(["bug", "feature"])
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="flex flex-col gap-1.5">
        <span id="sel-fruit" className="text-[13px] font-medium">Fruit</span>
        <Select value={fruit} onValueChange={setFruit}>
          <SelectTrigger aria-labelledby="sel-fruit">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value="carrot">Carrot</SelectItem>
              <SelectItem value="leek">Leek</SelectItem>
              <SelectItem value="kale" disabled>Kale (out of stock)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">{fruit ? `You picked ${fruit}.` : "Arrow keys move, Enter selects."}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span id="sel-plan" className="text-[13px] font-medium">Plan</span>
        <Select defaultValue="pro">
          <SelectTrigger aria-labelledby="sel-plan">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free"><User /> Free</SelectItem>
            <SelectItem value="pro"><Zap /> Pro</SelectItem>
            <SelectItem value="team"><Users /> Team</SelectItem>
          </SelectContent>
        </Select>
        <div className="mt-2 flex gap-2">
          <Select defaultValue="sm">
            <SelectTrigger size="sm" aria-label="Density">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Compact</SelectItem>
              <SelectItem value="md">Comfortable</SelectItem>
            </SelectContent>
          </Select>
          <Select disabled>
            <SelectTrigger size="sm" aria-label="Disabled">
              <SelectValue placeholder="Disabled" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="x">X</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span id="sel-labels" className="text-[13px] font-medium">Labels (multiple)</span>
        <Combobox
          multiple
          searchable={false}
          aria-labelledby="sel-labels"
          options={labels}
          value={tags}
          onValueChange={setTags}
          placeholder="Add labels"
        />
        <span className="text-xs text-muted-foreground">The menu stays open while you pick.</span>
      </div>
    </div>
  )
}
