import * as React from "react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { Building2, Rocket, Store } from "lucide-react"
import { Chip, ChipRemovable, TextLink } from "@/registry/facet/ui/chip"

const segments = [
  { id: "enterprise", label: "Enterprise", icon: <Building2 /> },
  { id: "smb", label: "SMB", icon: <Store /> },
  { id: "startup", label: "Startup", icon: <Rocket /> },
]
const allTags = ["Design", "Q4", "Launch", "Marketing", "Urgent", "Web"]

export default function ChipDemo() {
  const [selected, setSelected] = React.useState<string[]>(["enterprise"])
  const [tags, setTags] = React.useState(allTags)
  const toggle = (id: string, on: boolean) => setSelected((s) => (on ? [...s, id] : s.filter((x) => x !== id)))
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">Filter by segment</span>
        <div className="flex flex-wrap items-center gap-2">
          {segments.map((s) => (
            <Chip key={s.id} selected={selected.includes(s.id)} onSelectedChange={(on) => toggle(s.id, on)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">Tags — remove one</span>
        <LayoutGroup>
          <motion.div layout className="flex min-h-[30px] flex-wrap items-center gap-2">
            <AnimatePresence mode="popLayout">
              {tags.map((t) => (
                <ChipRemovable key={t} removeLabel={`Remove ${t}`} onRemove={() => setTags((x) => x.filter((y) => y !== t))}>
                  {t}
                </ChipRemovable>
              ))}
              {tags.length < allTags.length && (
                <motion.button
                  key="reset"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  type="button"
                  onClick={() => setTags(allTags)}
                  className="h-[30px] cursor-pointer px-2 text-[13px] font-medium text-brand hover:underline"
                >
                  Reset
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {segments.map((s) => (
          <Chip key={s.id} showCheck={false} icon={s.icon} defaultSelected={s.id === "smb"}>{s.label}</Chip>
        ))}
        <span className="mx-2 h-4 w-px bg-border" />
        <TextLink href="#">Read the docs</TextLink>
      </div>
    </div>
  )
}
