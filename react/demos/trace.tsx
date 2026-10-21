import * as React from "react"
import { Database, FileText, PenLine, RotateCcw, Search, Send } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { Trace, TraceCollapsible, TraceDescription, TraceIcon, TraceItem, TraceMeta, TraceTitle, type TraceStatus } from "@/registry/facet/ui/trace"

export default function TraceDemo() {
  const [tick, setTick] = React.useState(0)
  const [run, setRun] = React.useState(0)
  React.useEffect(() => {
    setTick(0)
    let t = 0
    const id = setInterval(() => {
      t++
      setTick(t)
      if (t >= 4) clearInterval(id)
    }, 1200)
    return () => clearInterval(id)
  }, [run])
  // step 2 errors; others run in order
  const st = (i: number): TraceStatus => (i === 2 && tick > 2 ? "error" : i < tick ? "done" : i === tick ? "running" : "pending")

  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-4">
      <Trace key={run}>
        <TraceItem status={st(0)}>
          <TraceIcon><Search /></TraceIcon>
          <TraceTitle>Searched the web <TraceMeta>1.2s</TraceMeta></TraceTitle>
          <TraceDescription>“enterprise churn benchmarks 2026” · 8 results</TraceDescription>
        </TraceItem>
        <TraceItem status={st(1)}>
          <TraceIcon><Database /></TraceIcon>
          <TraceTitle>Queried warehouse <TraceMeta>0.4s</TraceMeta></TraceTitle>
          <TraceCollapsible>{"SELECT segment, churn_rate FROM churn_q3 ORDER BY churn_rate;\n→ 4 rows · mid-market 1.9%"}</TraceCollapsible>
        </TraceItem>
        <TraceItem status={st(2)}>
          <TraceIcon><FileText /></TraceIcon>
          <TraceTitle>Read file <code>board-deck.pptx</code> <TraceMeta>0.1s</TraceMeta></TraceTitle>
          {tick > 2 && <TraceCollapsible label="Error" defaultOpen>Permission denied: request access from the deck owner.</TraceCollapsible>}
        </TraceItem>
        <TraceItem status={st(3)}>
          <TraceIcon><PenLine /></TraceIcon>
          <TraceTitle>Drafting summary <TraceMeta>3.8s</TraceMeta></TraceTitle>
        </TraceItem>
        <TraceItem status="pending">
          <TraceIcon><Send /></TraceIcon>
          <TraceTitle>Send to #revenue</TraceTitle>
        </TraceItem>
      </Trace>
      <Button variant="outline" size="sm" className="self-center" onClick={() => setRun((r) => r + 1)}>
        <RotateCcw /> Replay run
      </Button>
    </div>
  )
}
