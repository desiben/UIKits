import * as React from "react"
import { motion } from "motion/react"
import { Bell, ChevronRight, CreditCard, Moon, ShieldCheck, Smartphone } from "lucide-react"
import { Badge } from "@/registry/facet/ui/badge"
import {
  ItemCard, ItemCardAction, ItemCardContent, ItemCardDescription, ItemCardGroup, ItemCardIcon, ItemCardTitle,
} from "@/registry/facet/ui/item-card"

function MiniSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="flex h-5 w-9 cursor-pointer items-center rounded-full bg-control-off p-0.5 outline-none transition-colors aria-checked:justify-end aria-checked:bg-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <motion.span layout transition={{ type: "spring", stiffness: 600, damping: 34 }} className="size-4 rounded-full bg-white shadow-sm" />
    </button>
  )
}

export default function ItemCardDemo() {
  const [twofa, setTwofa] = React.useState(true)
  const [digest, setDigest] = React.useState(false)
  const [freq, setFreq] = React.useState("Weekly")
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ItemCardGroup label="Security">
        <ItemCard>
          <ItemCardIcon tone="brand"><ShieldCheck /></ItemCardIcon>
          <ItemCardContent>
            <ItemCardTitle>Two-factor authentication</ItemCardTitle>
            <ItemCardDescription>Protect your account with an authenticator app</ItemCardDescription>
          </ItemCardContent>
          <ItemCardAction><MiniSwitch checked={twofa} onChange={setTwofa} label="Two-factor authentication" /></ItemCardAction>
        </ItemCard>
        <ItemCard variant="secondary">
          <ItemCardIcon><Smartphone /></ItemCardIcon>
          <ItemCardContent>
            <ItemCardTitle>iPhone 16 Pro</ItemCardTitle>
            <ItemCardDescription>Last active 2 min ago · San Francisco</ItemCardDescription>
          </ItemCardContent>
          <ItemCardAction><Badge variant="success" dot>This device</Badge></ItemCardAction>
        </ItemCard>
        <ItemCard variant="outline" asChild>
          <a href="#billing" onClick={(e) => e.preventDefault()}>
            <ItemCardIcon><CreditCard /></ItemCardIcon>
            <ItemCardContent>
              <ItemCardTitle>Visa ending 4242</ItemCardTitle>
              <ItemCardDescription>Expires 08/28</ItemCardDescription>
            </ItemCardContent>
            <ItemCardAction><ChevronRight /></ItemCardAction>
          </a>
        </ItemCard>
      </ItemCardGroup>

      <ItemCardGroup label="Notifications" joined>
        <ItemCard>
          <ItemCardIcon><Bell /></ItemCardIcon>
          <ItemCardContent>
            <ItemCardTitle>Daily digest</ItemCardTitle>
            <ItemCardDescription>A summary of activity at 9am</ItemCardDescription>
          </ItemCardContent>
          <ItemCardAction><MiniSwitch checked={digest} onChange={setDigest} label="Daily digest" /></ItemCardAction>
        </ItemCard>
        <ItemCard>
          <ItemCardContent>
            <ItemCardTitle>Report frequency</ItemCardTitle>
          </ItemCardContent>
          <ItemCardAction>
            <select
              aria-label="Report frequency"
              value={freq}
              onChange={(e) => setFreq(e.target.value)}
              className="h-8 cursor-pointer rounded-facet border border-border-strong bg-card px-2 text-[13px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option>Weekly</option>
              <option>Daily</option>
              <option>Monthly</option>
            </select>
          </ItemCardAction>
        </ItemCard>
        <ItemCard asChild>
          <button type="button">
            <ItemCardIcon><Moon /></ItemCardIcon>
            <ItemCardContent>
              <ItemCardTitle>Quiet hours</ItemCardTitle>
              <ItemCardDescription>10pm – 7am</ItemCardDescription>
            </ItemCardContent>
            <ItemCardAction><ChevronRight /></ItemCardAction>
          </button>
        </ItemCard>
      </ItemCardGroup>
    </div>
  )
}
