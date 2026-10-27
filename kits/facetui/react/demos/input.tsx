import * as React from "react"
import { AtSign, Eye, EyeOff, Search } from "lucide-react"
import { Input, InputKbd } from "@/registry/facet/ui/input"

export default function InputDemo() {
  const [show, setShow] = React.useState(false)
  const [email, setEmail] = React.useState("not-an-email")
  const invalid = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email)
  return (
    <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
      <div className="flex max-w-80 flex-col gap-3">
        <Input type="email" placeholder="you@company.com" aria-label="Email" />
        <Input leading={<Search aria-hidden="true" />} trailing={<InputKbd>⌘K</InputKbd>} placeholder="Search projects…" aria-label="Search projects" />
        <Input
          type={show ? "text" : "password"}
          defaultValue="hunter2hunter2"
          aria-label="Password"
          trailing={
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="grid size-6 cursor-pointer place-items-center rounded-facet-sm hover:bg-accent hover:text-foreground">
              {show ? <EyeOff /> : <Eye />}
            </button>
          }
        />
        <Input leading={<AtSign aria-hidden="true" />} value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={invalid} aria-label="Email (validated)" />
      </div>
      <div className="flex max-w-80 flex-col gap-3">
        <Input size="sm" placeholder="Small" aria-label="Small" />
        <Input placeholder="Medium" aria-label="Medium" />
        <Input size="lg" placeholder="Large" aria-label="Large" />
        <Input disabled placeholder="Disabled" aria-label="Disabled" />
      </div>
    </div>
  )
}
