import * as React from "react"
import { Volume1, Volume2 } from "lucide-react"
import { Progress, Slider } from "@/registry/facet/ui/slider"
import { Button } from "@/registry/facet/ui/button"

export default function SliderDemo() {
  const [vol, setVol] = React.useState([60])
  const [price, setPrice] = React.useState([20, 80])
  const [progress, setProgress] = React.useState(75)
  return (
    <div className="flex max-w-[400px] flex-col gap-7">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Volume1 className="size-4" aria-hidden="true" />
        <Slider value={vol} onValueChange={setVol} aria-label="Volume" showValue formatValue={(v) => `${v}%`} />
        <Volume2 className="size-4" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-[13px] font-medium"><span>Price range</span><span className="text-muted-foreground tabular-nums">${price[0]} – ${price[1]}</span></div>
        <Slider value={price} onValueChange={setPrice} minStepsBetweenThumbs={5} thumbLabels={["Minimum price", "Maximum price"]} showValue formatValue={(v) => `$${v}`} />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[13px] font-medium"><span>Uploading assets</span><span className="text-muted-foreground tabular-nums">{progress}%</span></div>
        <Progress value={progress} aria-label="Upload progress" />
        <Progress value={30} size="sm" aria-label="Storage used" />
      </div>
      <Button size="sm" variant="outline" className="w-fit" onClick={() => setProgress((p) => (p >= 100 ? 10 : Math.min(100, p + 15)))}>Advance progress</Button>
    </div>
  )
}
