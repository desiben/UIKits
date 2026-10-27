import * as React from "react"
import { Database, RotateCcw } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { ChainOfThought, ChainOfThoughtChip, ChainOfThoughtStep, type StepStatus } from "@/registry/facet/ui/chain-of-thought"

const steps = [
  { title: "Searched CRM", description: "Found 14 deals over $50k closing in Q4", chip: "Salesforce" },
  { title: "Compared seat usage", description: "2 accounts dropped more than 25%" },
  { title: "Checking open invoices", description: "Stripe · 3 of 14 accounts" },
  { title: "Write summary" },
]

export default function ChainOfThoughtDemo() {
  const [progress, setProgress] = React.useState(0)
  const [run, setRun] = React.useState(0)
  React.useEffect(() => {
    setProgress(0)
    let p = 0
    const id = setInterval(() => {
      p++
      setProgress(p)
      if (p >= steps.length) clearInterval(id)
    }, 1100)
    return () => clearInterval(id)
  }, [run])
  const status = (i: number): StepStatus => (i < progress ? "done" : i === progress ? "active" : "pending")
  const done = progress >= steps.length

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <ChainOfThought defaultOpen loading={!done} title={done ? "Thought for 4 seconds" : "Researching your pipeline…"}>
        {steps.map((s, i) => (
          <ChainOfThoughtStep key={s.title} status={status(i)} title={s.title} description={s.description}>
            {s.chip && (
              <ChainOfThoughtChip>
                <Database /> {s.chip}
              </ChainOfThoughtChip>
            )}
          </ChainOfThoughtStep>
        ))}
      </ChainOfThought>
      <ChainOfThought title="Thought for 2 seconds">
        <ChainOfThoughtStep status="done" title="Read the brief" />
        <ChainOfThoughtStep status="error" title="Fetch pricing sheet" description="Permission denied" />
      </ChainOfThought>
      <Button variant="outline" size="sm" className="self-center" onClick={() => setRun((r) => r + 1)}>
        <RotateCcw /> Replay
      </Button>
    </div>
  )
}
