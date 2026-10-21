import * as React from "react"
import { CalendarDays, Clock, Globe } from "lucide-react"
import { CellGroup } from "@/registry/facet/ui/cell-switch"
import { CellSelect } from "@/registry/facet/ui/cell-select"

const langs = [
  { value: "en", label: "English (US)" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
]
const zones = [
  { value: "pst", label: "Pacific (GMT−8)" },
  { value: "est", label: "Eastern (GMT−5)" },
  { value: "cet", label: "Berlin (GMT+1)" },
]

export default function CellSelectDemo() {
  const [lang, setLang] = React.useState("en")
  return (
    <CellGroup className="mx-auto max-w-[440px]">
      <CellSelect icon={<Globe />} tone="var(--chart-1)" label="Language" items={langs} value={lang} onValueChange={setLang} />
      <CellSelect icon={<Clock />} tone="var(--warning-solid)" label="Time zone" items={zones} defaultValue="pst" />
      <CellSelect icon={<CalendarDays />} tone="var(--chart-4)" label="Week starts on" items={[{ value: "mon", label: "Monday" }, { value: "sun", label: "Sunday" }]} />
    </CellGroup>
  )
}
