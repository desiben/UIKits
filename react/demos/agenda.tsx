import { Video } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { Agenda, AgendaDay, AgendaEvent } from "@/registry/facet/ui/agenda"

function Avatars({ people }: { people: { initials: string; cls: string }[] }) {
  return (
    <span className="flex">
      {people.map((p, i) => (
        <span
          key={p.initials}
          className={`grid size-6 place-items-center rounded-full text-[10px] font-semibold ring-2 ring-card ${p.cls} ${i ? "-ml-2" : ""}`}
        >
          {p.initials}
        </span>
      ))}
    </span>
  )
}

export default function AgendaDemo() {
  return (
    <Agenda className="mx-auto max-w-[580px]">
      <AgendaDay day={18} label="Wed · Today" dateTime="2026-11-18" today>
        <AgendaEvent time="9:00–9:30" dateTime="2026-11-18T09:00" title="Standup" description="Product team · Zoom">
          <Avatars
            people={[
              { initials: "MC", cls: "bg-chart-1/15 text-brand" },
              { initials: "JR", cls: "bg-chart-3/20 text-warning" },
            ]}
          />
        </AgendaEvent>
        <AgendaEvent time="11:00–12:00" dateTime="2026-11-18T11:00" title="Northwind renewal call" description="Now · Room 4B" tone="lime" now>
          <Button size="sm"><Video /> Join</Button>
        </AgendaEvent>
        <AgendaEvent time="15:30–16:00" dateTime="2026-11-18T15:30" title="Design review" description="Onboarding v2" tone="amber" />
      </AgendaDay>
      <AgendaDay day={19} label="Thu" dateTime="2026-11-19">
        <AgendaEvent time="All day" dateTime="2026-11-19" title="Offsite — Lisbon" description="Leadership team" tone="rose" />
        <AgendaEvent time="18:00–19:00" dateTime="2026-11-19T18:00" title="Team dinner" description="Taberna da Rua" tone="blue" />
      </AgendaDay>
    </Agenda>
  )
}
