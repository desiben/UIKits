import * as React from "react"
import { CellGroup } from "@/registry/facet/ui/cell-switch"
import { CellColorPicker } from "@/registry/facet/ui/cell-color-picker"

// Swatch values are user data (the colours being picked), not theme colours.
const presets = [
  { name: "Iris", value: "#5d4ff3" },
  { name: "Ember", value: "#be4000" },
  { name: "Lagoon", value: "#00817c" },
  { name: "Rose", value: "#c02b6c" },
  { name: "Cobalt", value: "#0072c5" },
]

export default function CellColorPickerDemo() {
  const [color, setColor] = React.useState(presets[0].value)
  return (
    <div className="mx-auto flex max-w-[480px] flex-col gap-4">
      <CellGroup>
        <CellColorPicker label="Accent color" swatches={presets} value={color} onValueChange={setColor} />
      </CellGroup>
      <div className="flex items-center gap-3 rounded-facet-lg border border-border bg-card p-3 text-sm">
        <span className="size-8 rounded-facet transition-colors duration-300" style={{ background: color }} />
        <span className="text-muted-foreground">Preview</span>
        <span className="ml-auto rounded-full px-2.5 py-1 text-xs font-medium text-white transition-colors duration-300" style={{ background: color }}>Primary</span>
      </div>
    </div>
  )
}
