import * as React from "react"
import { addDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/registry/facet/ui/calendar"

export default function CalendarDemo() {
  const today = React.useMemo(() => new Date(2026, 9, 15), [])
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 9, 20))
  const [range, setRange] = React.useState<DateRange | undefined>({ from: addDays(today, 3), to: addDays(today, 9) })
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex flex-col gap-2">
        <Calendar mode="single" selected={date} onSelect={setDate} today={today} defaultMonth={today} />
        <p className="text-[13px] text-muted-foreground">{date ? format(date, "EEEE, MMM d") : "Pick a day"}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Calendar mode="range" selected={range} onSelect={setRange} today={today} defaultMonth={today} />
        <p className="text-[13px] text-muted-foreground">
          {range?.from ? `${format(range.from, "MMM d")} – ${range.to ? format(range.to, "MMM d") : "…"}` : "Pick a range"}
        </p>
      </div>
    </div>
  )
}
