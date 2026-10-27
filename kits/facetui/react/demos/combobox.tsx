import * as React from "react"
import { Combobox, type ComboboxOption } from "@/registry/facet/ui/combobox"

const frameworks: ComboboxOption[] = [
  { value: "next", label: "Next.js", hint: "React" },
  { value: "remix", label: "Remix", hint: "React" },
  { value: "astro", label: "Astro", hint: "Islands" },
  { value: "nuxt", label: "Nuxt", hint: "Vue" },
  { value: "svelte", label: "SvelteKit", hint: "Svelte" },
  { value: "solid", label: "SolidStart", hint: "Solid" },
]

const hues = ["bg-brand-600", "bg-brand-800", "bg-brand-500", "bg-brand-700", "bg-brand-900"]
const people: ComboboxOption[] = [
  ["ada", "Ada Lovelace", "Engineering"],
  ["grace", "Grace Hopper", "Engineering"],
  ["alan", "Alan Turing", "Research"],
  ["linus", "Linus Torvalds", "Engineering"],
  ["margaret", "Margaret Hamilton", "Research"],
].map(([value, label, group], i) => ({
  value,
  label,
  group,
  icon: (
    <span className={`grid size-5 shrink-0 place-items-center rounded-full text-[9px] font-semibold text-white ${hues[i]}`}>
      {label.split(" ").map((w) => w[0]).join("")}
    </span>
  ),
}))

export default function ComboboxDemo() {
  const [framework, setFramework] = React.useState<string | null>(null)
  const [assignees, setAssignees] = React.useState<string[]>(["ada", "grace"])
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex max-w-[280px] flex-col gap-1.5">
        <span id="cb-fw" className="text-[13px] font-medium">Framework</span>
        <Combobox
          aria-labelledby="cb-fw"
          options={frameworks}
          value={framework}
          onValueChange={setFramework}
          placeholder="Select framework…"
          searchPlaceholder="Search framework…"
          emptyText="No framework found."
        />
        <span className="text-xs text-muted-foreground">Type to filter, Enter picks the highlighted match.</span>
      </div>
      <div className="flex max-w-[360px] flex-col gap-1.5">
        <span id="cb-people" className="text-[13px] font-medium">Assignees</span>
        <Combobox
          multiple
          aria-labelledby="cb-people"
          options={people}
          value={assignees}
          onValueChange={setAssignees}
          placeholder="Assign people…"
          searchPlaceholder="Search people…"
          emptyText="No people found."
        />
        <span className="text-xs text-muted-foreground">{assignees.length} assigned · chips animate in and out.</span>
      </div>
    </div>
  )
}
