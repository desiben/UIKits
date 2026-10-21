import * as React from "react"
import { CircleAlert } from "lucide-react"
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@/registry/facet/ui/field"
import { Input } from "@/registry/facet/ui/input"

export default function FieldDemo() {
  const [slug, setSlug] = React.useState("acme ops")
  const invalid = !/^[a-z0-9-]*$/.test(slug)
  return (
    <div className="flex max-w-[340px] flex-col gap-5">
      <Field required>
        <FieldLabel>Workspace name</FieldLabel>
        <FieldControl><Input defaultValue="Acme Inc." /></FieldControl>
        <FieldDescription>Shown in invites and the sidebar.</FieldDescription>
      </Field>
      <Field invalid={invalid}>
        <FieldLabel>URL</FieldLabel>
        <FieldControl>
          <Input leading={<span className="text-[13px]">facet.dev/</span>} value={slug} onChange={(e) => setSlug(e.target.value)} />
        </FieldControl>
        <FieldError><CircleAlert className="size-3.5" aria-hidden="true" /> Only lowercase letters, numbers and dashes.</FieldError>
        <FieldDescription>{invalid ? "Try “acme-ops”." : "Looks good — this URL is available."}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Bio</FieldLabel>
        <FieldControl>
          <textarea placeholder="Add context for your teammates" className="min-h-20 w-full resize-none rounded-facet border border-input bg-card px-3 py-2 text-sm outline-none placeholder:text-placeholder hover:border-placeholder focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" />
        </FieldControl>
      </Field>
      <Field disabled>
        <FieldLabel>Billing email</FieldLabel>
        <FieldControl><Input placeholder="Managed by your admin" /></FieldControl>
      </Field>
    </div>
  )
}
