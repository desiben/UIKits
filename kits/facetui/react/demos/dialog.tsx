import * as React from "react"
import { UserPlus } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/facet/ui/dialog"

const field =
  "h-9 w-full rounded-facet border border-input bg-card px-3 text-sm text-foreground outline-none placeholder:text-placeholder focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"

export default function DialogDemo() {
  const [open, setOpen] = React.useState(true)
  const [sending, setSending] = React.useState(false)
  const send = () => {
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setOpen(false)
    }, 1200)
  }
  return (
    <div className="flex min-h-[420px] items-start">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button><UserPlus /> Invite teammates</Button>
        </DialogTrigger>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Invite teammates</DialogTitle>
            <DialogDescription>They'll get an email with a link to join Acme.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <label className="flex flex-col gap-1.5 text-[13px] font-medium">
              Email addresses
              <input className={field} placeholder="name@acme.co, …" />
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-medium">
              Role
              <select className={field} defaultValue="Member">
                <option>Member</option>
                <option>Admin</option>
              </select>
            </label>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button loading={sending} loadingText="Sending…" onClick={send}>Send invites</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
