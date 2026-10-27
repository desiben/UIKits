import * as React from "react"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { Stepper } from "@/registry/facet/ui/stepper"

const steps = [
  { title: "Account", description: "Your details" },
  { title: "Workspace", description: "Name and URL" },
  { title: "Invite team", description: "Optional" },
  { title: "Connect data", description: "Import or sync" },
]

export default function StepperDemo() {
  const [current, setCurrent] = React.useState(1)
  const done = current >= steps.length
  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6">
      <Stepper steps={steps} current={current} onStepClick={setCurrent} />
      <div className="flex items-center justify-between gap-2 rounded-facet-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          {done ? "All set — your workspace is ready." : <>Step {current + 1} of {steps.length}: <span className="font-medium text-foreground">{steps[current].title}</span></>}
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" disabled={current === 0} onClick={() => setCurrent(current - 1)}><ArrowLeft /> Back</Button>
          {done ? (
            <Button size="sm" variant="outline" onClick={() => setCurrent(0)}>Restart</Button>
          ) : (
            <Button size="sm" onClick={() => setCurrent(current + 1)}>
              {current === steps.length - 1 ? <><Check /> Finish</> : <>Continue <ArrowRight /></>}
            </Button>
          )}
        </div>
      </div>
      <Stepper steps={["Cart", "Shipping", "Payment"]} current={2} className="max-w-[420px]" />
    </div>
  )
}
