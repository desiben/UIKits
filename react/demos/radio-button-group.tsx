import * as React from "react"
import { Building2, Rocket, Sprout } from "lucide-react"
import { RadioButtonGroup, RadioButton } from "@/registry/facet/ui/radio-button-group"

export default function RadioButtonGroupDemo() {
  const [plan, setPlan] = React.useState("growth")
  const [size, setSize] = React.useState("m")
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-2">
        <span id="rbg-plan" className="text-[13px] font-medium">Plan</span>
        <RadioButtonGroup aria-labelledby="rbg-plan" value={plan} onValueChange={setPlan}>
          <RadioButton value="starter" icon={<Sprout />} title="Starter" description="Up to 5 projects" aside="$0" />
          <RadioButton
            value="growth"
            icon={<Rocket />}
            title={
              <>
                Growth
                <span className="rounded-full bg-highlight px-1.5 py-px text-[11px] font-semibold text-highlight-foreground">
                  Popular
                </span>
              </>
            }
            description="Unlimited projects and AI copilot"
            aside="$24"
          />
          <RadioButton value="scale" icon={<Building2 />} title="Scale" description="SSO, SCIM and audit logs" aside="$48" />
        </RadioButtonGroup>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span id="rbg-size" className="text-[13px] font-medium">Size</span>
          <RadioButtonGroup aria-labelledby="rbg-size" variant="buttons" value={size} onValueChange={setSize} className="max-w-[340px]">
            {["XS", "S", "M", "L", "XL"].map((s) => (
              <RadioButton key={s} value={s.toLowerCase()} title={s} disabled={s === "XS"} />
            ))}
          </RadioButtonGroup>
        </div>
        <div className="flex flex-col gap-2">
          <span id="rbg-billing" className="text-[13px] font-medium">Billing</span>
          <RadioButtonGroup aria-labelledby="rbg-billing" columns={2} defaultValue="yearly" className="max-w-[340px]">
            <RadioButton value="monthly" title="Monthly" description="$24 / seat" />
            <RadioButton value="yearly" title="Yearly" description="$20 / seat · save 17%" />
          </RadioButtonGroup>
        </div>
      </div>
    </div>
  )
}
