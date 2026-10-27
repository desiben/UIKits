import * as React from "react"
import { motion } from "motion/react"
import { Bell, ChevronRight, Cloud, Database, GitBranch, Mail, MessageSquare } from "lucide-react"
import {
  ItemCard,
  ItemCardAction,
  ItemCardButton,
  ItemCardContent,
  ItemCardDescription,
  ItemCardGroup,
  ItemCardIcon,
  ItemCardLink,
  ItemCardTitle,
} from "@/registry/facet/ui/item-card-group"

/* Minimal inline switch so the demo stays self-contained. */
function MiniSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative flex h-5 w-9 cursor-pointer items-center rounded-full p-0.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${checked ? "justify-end bg-primary" : "justify-start bg-control-off"}`}
    >
      <motion.span layout transition={{ type: "spring", stiffness: 520, damping: 34 }} className="size-4 rounded-full bg-white shadow-sm" />
    </button>
  )
}

export default function ItemCardGroupDemo() {
  const [prefs, setPrefs] = React.useState({ email: true, push: false })
  return (
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,420px)_1fr]">
      <ItemCardGroup layout="joined" title="Notifications">
        <ItemCard>
          <ItemCardIcon><Mail /></ItemCardIcon>
          <ItemCardContent>
            <ItemCardTitle>Email</ItemCardTitle>
            <ItemCardDescription>Weekly digest and mentions</ItemCardDescription>
          </ItemCardContent>
          <ItemCardAction>
            <MiniSwitch label="Email" checked={prefs.email} onChange={(email) => setPrefs((p) => ({ ...p, email }))} />
          </ItemCardAction>
        </ItemCard>
        <ItemCard>
          <ItemCardIcon><Bell /></ItemCardIcon>
          <ItemCardContent>
            <ItemCardTitle>Push</ItemCardTitle>
            <ItemCardDescription>Only direct messages</ItemCardDescription>
          </ItemCardContent>
          <ItemCardAction>
            <MiniSwitch label="Push" checked={prefs.push} onChange={(push) => setPrefs((p) => ({ ...p, push }))} />
          </ItemCardAction>
        </ItemCard>
        <ItemCardButton>
          <ItemCardIcon><MessageSquare /></ItemCardIcon>
          <ItemCardContent>
            <ItemCardTitle>Slack</ItemCardTitle>
            <ItemCardDescription>#sales-alerts</ItemCardDescription>
          </ItemCardContent>
          <ItemCardAction><ChevronRight /></ItemCardAction>
        </ItemCardButton>
      </ItemCardGroup>

      <div className="flex flex-col gap-6">
        <ItemCardGroup
          layout="grid"
          title="Connected apps"
          action={<a href="#apps" className="text-brand hover:underline">Browse</a>}
        >
          {[
            { icon: Database, title: "Postgres", desc: "Synced 2 min ago" },
            { icon: Cloud, title: "S3 bucket", desc: "3 folders" },
            { icon: GitBranch, title: "GitHub", desc: "facet/ui" },
            { icon: MessageSquare, title: "Slack", desc: "2 channels" },
          ].map(({ icon: Icon, title, desc }) => (
            <ItemCardLink key={title} href={`#${title}`} onClick={(e) => e.preventDefault()}>
              <ItemCardIcon brand><Icon /></ItemCardIcon>
              <ItemCardContent>
                <ItemCardTitle>{title}</ItemCardTitle>
                <ItemCardDescription>{desc}</ItemCardDescription>
              </ItemCardContent>
            </ItemCardLink>
          ))}
        </ItemCardGroup>

        <ItemCardGroup title="Spaced">
          <ItemCard variant="secondary">
            <ItemCardIcon><Cloud /></ItemCardIcon>
            <ItemCardContent>
              <ItemCardTitle>Backups</ItemCardTitle>
              <ItemCardDescription>Nightly at 02:00 UTC</ItemCardDescription>
            </ItemCardContent>
            <ItemCardAction><span className="text-xs">On</span></ItemCardAction>
          </ItemCard>
          <ItemCard variant="outline">
            <ItemCardIcon><GitBranch /></ItemCardIcon>
            <ItemCardContent>
              <ItemCardTitle>Preview deploys</ItemCardTitle>
              <ItemCardDescription>Every pull request</ItemCardDescription>
            </ItemCardContent>
            <ItemCardAction><span className="text-xs">Off</span></ItemCardAction>
          </ItemCard>
        </ItemCardGroup>
      </div>
    </div>
  )
}
