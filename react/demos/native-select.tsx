import * as React from "react"
import { NativeSelect, NativeSelectOption, NativeSelectOptGroup } from "@/registry/facet/ui/native-select"
import { Button } from "@/registry/facet/ui/button"

export default function NativeSelectDemo() {
  const [role, setRole] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const invalid = submitted && !role
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ns-country" className="text-[13px] font-medium">Country</label>
          <NativeSelect id="ns-country" defaultValue="us">
            <NativeSelectOptGroup label="North America">
              <NativeSelectOption value="us">United States</NativeSelectOption>
              <NativeSelectOption value="ca">Canada</NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="Europe">
              <NativeSelectOption value="de">Germany</NativeSelectOption>
              <NativeSelectOption value="fr">France</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
        </div>
        <NativeSelect size="sm" aria-label="Small">
          <NativeSelectOption>Small</NativeSelectOption>
          <NativeSelectOption>Second option</NativeSelectOption>
        </NativeSelect>
        <NativeSelect size="lg" aria-label="Large">
          <NativeSelectOption>Large</NativeSelectOption>
          <NativeSelectOption>Second option</NativeSelectOption>
        </NativeSelect>
        <NativeSelect disabled aria-label="Disabled">
          <NativeSelectOption>Disabled</NativeSelectOption>
        </NativeSelect>
      </div>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ns-role" className="text-[13px] font-medium">Role</label>
          <NativeSelect
            id="ns-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-invalid={invalid}
            aria-describedby="ns-role-help"
          >
            <NativeSelectOption value="">Choose a role…</NativeSelectOption>
            <NativeSelectOption value="admin">Admin</NativeSelectOption>
            <NativeSelectOption value="editor">Editor</NativeSelectOption>
            <NativeSelectOption value="viewer">Viewer</NativeSelectOption>
          </NativeSelect>
          <span id="ns-role-help" className={invalid ? "text-xs text-danger" : "text-xs text-muted-foreground"}>
            {invalid ? "Pick a role to continue." : role ? "Looks good." : "Submit empty to see the error shake."}
          </span>
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">Continue</Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setRole("")
              setSubmitted(false)
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  )
}
