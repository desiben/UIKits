import * as React from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { Alert, AlertActions, AlertDescription, AlertTitle } from "@/registry/facet/ui/alert"

export default function AlertDemo() {
  const [key, setKey] = React.useState(0)
  const [syncOpen, setSyncOpen] = React.useState(true)
  return (
    <div className="flex w-full max-w-[560px] flex-col gap-3">
      <div key={key} className="flex flex-col gap-3">
        <Alert dismissible>
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>Workspace billing moves to the 1st of each month.</AlertDescription>
        </Alert>
        <Alert variant="success" dismissible>
          <AlertTitle>Payment received</AlertTitle>
          <AlertDescription>Invoice INV-2041 was paid in full.</AlertDescription>
        </Alert>
        <Alert variant="warning" dismissible>
          <AlertTitle>Seat limit almost reached</AlertTitle>
          <AlertDescription>23 of 25 seats are in use.</AlertDescription>
        </Alert>
      </div>
      <Alert variant="danger" open={syncOpen} dismissible onDismiss={() => setSyncOpen(false)}>
        <AlertTitle>Sync failed</AlertTitle>
        <AlertDescription>We couldn't reach Salesforce. Retrying in 5 minutes.</AlertDescription>
        <AlertActions>
          <Button size="sm" variant="outline" onClick={() => setSyncOpen(false)}>Retry now</Button>
        </AlertActions>
      </Alert>
      <div>
        <Button size="sm" variant="ghost" onClick={() => { setKey((k) => k + 1); setSyncOpen(false); setTimeout(() => setSyncOpen(true), 250) }}>
          <RotateCcw /> Replay
        </Button>
      </div>
    </div>
  )
}
