import * as React from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { ToastProvider, useToast } from "@/registry/facet/ui/toast"

function Triggers() {
  const { toast, dismiss } = useToast()
  const save = () => {
    const id = toast({ title: "Saving changes…", description: "Uploading 3 files.", duration: Infinity })
    setTimeout(() => toast({ id, title: "Changes saved", description: "Everyone on the project can see them.", tone: "success", duration: 4000 }), 1400)
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast({ title: "Project created", description: "Q4 Launch is ready for your team." })}>
          Show toast
        </Button>
        <Button variant="outline" onClick={() => toast({ title: "Payment received", description: "Invoice INV-2041 was paid.", tone: "success" })}>
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: "Changes discarded",
              description: "Your draft was removed.",
              tone: "danger",
              icon: <Trash2 className="size-[18px]" />,
              action: { label: "Undo", onClick: () => toast({ title: "Draft restored", tone: "info" }) },
            })
          }
        >
          Danger with undo
        </Button>
        <Button variant="outline" onClick={save}>Update in place</Button>
        <Button variant="ghost" onClick={() => dismiss()}>Clear all</Button>
      </div>
      <p className="text-[13px] text-muted-foreground">
        Fire a few: they stack like a deck, fan out on hover, pause while hovered, and swipe sideways to dismiss.
      </p>
    </div>
  )
}

export default function ToastDemo() {
  return (
    <ToastProvider>
      <Triggers />
    </ToastProvider>
  )
}
