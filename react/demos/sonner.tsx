import * as React from "react"
import { Button } from "@/registry/facet/ui/button"
import { Toaster, toast } from "@/registry/facet/ui/sonner"

const wait = (ms: number, fail = false) =>
  new Promise<{ name: string }>((res, rej) => setTimeout(() => (fail ? rej(new Error("Timeout")) : res({ name: "facet-ui" })), ms))

export default function SonnerDemo() {
  /* seed a small stack so the card shows the deck on load */
  React.useEffect(() => {
    toast("Event created", { id: "seed-event", description: "Sunday, Dec 03 at 9:00 AM", duration: Infinity })
    toast.info("New version available", { id: "seed-info", description: "Facet UI 2.4 is ready to install.", duration: Infinity })
    toast.promise(wait(450), {
      id: "seed-deploy",
      loading: "Deploying…",
      success: (d) => `Deploy finished · ${d.name}`,
      error: "Deploy failed",
      description: "production · 42s",
      duration: Infinity,
    })
    return () => {
      toast.dismiss("seed-event")
      toast.dismiss("seed-info")
      toast.dismiss("seed-deploy")
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => toast("Event created", { description: "Sunday, Dec 03 at 9:00 AM" })}>
          Default
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.success("Invoice paid", { description: "INV-2041 · $1,280.00" })}>
          Success
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.error("Couldn't sync", { description: "Check your connection." })}>
          Error
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.info("New version available")}>
          Info
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.warning("Storage almost full", { description: "92% of 10 GB used." })}>
          Warning
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast("Message archived", {
              action: { label: "Undo", onClick: () => toast.success("Message restored") },
            })
          }
        >
          Action
        </Button>
        <Button
          size="sm"
          onClick={() =>
            toast.promise(wait(1600, Math.random() < 0.25), {
              loading: "Saving changes…",
              success: "Changes saved",
              error: (e) => `Save failed: ${(e as Error).message}`,
            })
          }
        >
          Promise
        </Button>
        <Button variant="ghost" size="sm" onClick={() => toast.dismiss()}>
          Clear all
        </Button>
      </div>
      <div className="flex min-h-[200px] w-full items-end justify-center rounded-facet-xl border border-dashed border-border bg-subtle px-4 pt-10 pb-6">
        <Toaster inline position="bottom-center" />
      </div>
      <p className="text-[13px] text-muted-foreground">
        Hover the stack to fan it out (timers pause), swipe a toast sideways to dismiss.
      </p>
    </div>
  )
}
