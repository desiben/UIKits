import * as React from "react"
import { FileText, Image, Inbox, Sheet } from "lucide-react"
import {
  ListView,
  ListViewHeader,
  ListViewItem,
  ListViewItemContent,
  ListViewItemMedia,
  ListViewItemMeta,
} from "@/registry/facet/ui/list-view"

const threads = [
  { id: "1", name: "Maya Chen", initials: "MC", tone: 1, subject: "Q4 pricing proposal — final numbers attached", time: "9:41" },
  { id: "2", name: "Jonas Richter", initials: "JR", tone: 3, subject: "Re: Security review for Globex", time: "Yesterday" },
  { id: "3", name: "Aiko Kato", initials: "AK", tone: 4, subject: "Design sync notes and next steps", time: "Mon" },
  { id: "4", name: "Leo Duarte", initials: "LD", tone: 2, subject: "Invoice #4021 is ready", time: "Sun" },
] as const

const files = [
  { id: "a", icon: FileText, name: "Brand guidelines.pdf", meta: "2.4 MB" },
  { id: "b", icon: Sheet, name: "Revenue model.xlsx", meta: "860 KB" },
  { id: "c", icon: Image, name: "Hero.png", meta: "1.1 MB" },
]

export default function ListViewDemo() {
  const [selected, setSelected] = React.useState<string[]>(["1"])
  const [picked, setPicked] = React.useState<string[]>(["b"])
  return (
    <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <ListView selectionMode="single" value={selected} onValueChange={setSelected} label="Inbox">
        <ListViewHeader>
          <Inbox /> Inbox
          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground-secondary">12 unread</span>
        </ListViewHeader>
        {threads.map((t) => (
          <ListViewItem key={t.id} value={t.id}>
            <ListViewItemMedia tone={t.tone}>{t.initials}</ListViewItemMedia>
            <ListViewItemContent title={t.name} description={t.subject} />
            <ListViewItemMeta hideOnNarrow={t.id !== "1"}>{t.time}</ListViewItemMeta>
          </ListViewItem>
        ))}
      </ListView>

      <ListView selectionMode="multiple" value={picked} onValueChange={setPicked} label="Attachments">
        <ListViewHeader>
          Attachments
          <span className="ml-auto text-xs font-normal text-muted-foreground">{picked.length} selected</span>
        </ListViewHeader>
        {files.map((f) => (
          <ListViewItem key={f.id} value={f.id}>
            <ListViewItemMedia tone={5}><f.icon /></ListViewItemMedia>
            <ListViewItemContent title={f.name} description="Shared by Maya" />
            <ListViewItemMeta>{f.meta}</ListViewItemMeta>
          </ListViewItem>
        ))}
      </ListView>
    </div>
  )
}
