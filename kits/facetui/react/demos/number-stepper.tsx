import * as React from "react"
import { NumberStepper, AnimatedNumber } from "@/registry/facet/ui/number-stepper"

export default function NumberStepperDemo() {
  const [seats, setSeats] = React.useState(3)
  const [qty, setQty] = React.useState(1)
  const [rate, setRate] = React.useState(0.5)
  const price = 24

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium">Seats</span>
          <NumberStepper aria-label="Seats" value={seats} onValueChange={setSeats} min={1} max={10} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium">Quantity</span>
          <NumberStepper aria-label="Quantity" variant="pill" value={qty} onValueChange={setQty} min={1} max={99} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium">Rate</span>
          <NumberStepper
            aria-label="Rate"
            variant="ghost"
            size="sm"
            value={rate}
            onValueChange={setRate}
            min={0}
            max={2}
            step={0.25}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium">Disabled</span>
          <NumberStepper aria-label="Locked" defaultValue={4} disabled />
        </div>
      </div>
      <div className="flex max-w-sm items-center justify-between rounded-facet-lg border border-border bg-card px-4 py-3">
        <div>
          <div className="text-sm font-medium">Team plan</div>
          <div className="text-[13px] text-muted-foreground">
            {seats} seats × ${price} · hold + to speed up
          </div>
        </div>
        <div className="text-xl font-semibold">
          <AnimatedNumber value={seats * price} format={(v) => `$${v.toLocaleString("en-US")}`} />
          <span className="text-[13px] font-normal text-muted-foreground">/mo</span>
        </div>
      </div>
    </div>
  )
}
