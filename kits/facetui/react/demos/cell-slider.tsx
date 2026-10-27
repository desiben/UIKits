import { CellGroup } from "@/registry/facet/ui/cell-switch"
import { CellSlider } from "@/registry/facet/ui/cell-slider"

export default function CellSliderDemo() {
  return (
    <CellGroup variant="secondary" className="mx-auto max-w-[440px]">
      <CellSlider label="Volume" defaultValue={60} formatOptions={{ style: "percent" }} />
      <CellSlider label="Monthly budget" min={0} max={5000} step={100} defaultValue={1200} formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} />
      <CellSlider label="Seats" min={1} max={100} defaultValue={24} />
    </CellGroup>
  )
}
