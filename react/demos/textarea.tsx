import { Textarea } from "@/registry/facet/ui/textarea"

export default function TextareaDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ta-bio" className="text-[13px] font-medium">Bio</label>
        <Textarea
          id="ta-bio"
          maxLength={160}
          showCount
          defaultValue="Product designer building calm, fast interfaces. Currently obsessed with motion systems"
          placeholder="Tell us a little about yourself"
          aria-describedby="ta-bio-help"
        />
        <span id="ta-bio-help" className="text-xs text-muted-foreground">Shown on your public profile.</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ta-notes" className="text-[13px] font-medium">Notes (auto-grow)</label>
        <Textarea
          id="ta-notes"
          autoSize
          minRows={2}
          maxRows={8}
          maxLength={280}
          showCount
          placeholder="Type a few lines — the field grows with you…"
        />
        <span className="text-xs text-muted-foreground">Grows smoothly up to 8 lines, then scrolls.</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ta-reason" className="text-[13px] font-medium">Reason</label>
        <Textarea id="ta-reason" aria-invalid defaultValue="x" aria-describedby="ta-reason-help" rows={2} />
        <span id="ta-reason-help" className="text-xs text-danger">Please give at least 20 characters.</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ta-locked" className="text-[13px] font-medium">Admin note</label>
        <Textarea id="ta-locked" disabled defaultValue="Locked by an admin." rows={2} />
      </div>
    </div>
  )
}
