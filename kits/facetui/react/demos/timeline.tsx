import * as React from "react"
import { Check, CreditCard, FileText, Package, RotateCcw, Rocket, Sparkles, Truck, UploadCloud, X } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { Badge } from "@/registry/facet/ui/badge"
import { Avatar, AvatarFallback } from "@/registry/facet/ui/avatar"
import { Card } from "@/registry/facet/ui/card"
import { Notification, NotificationList, Timeline, TimelineItem } from "@/registry/facet/ui/timeline"

const activity = [
  { icon: <Sparkles />, tone: "brand" as const, title: "AI drafted the launch plan", description: "12 tasks proposed in Q4 Launch", time: "2 min ago", dateTime: "2026-10-21T10:58" },
  { icon: <Check />, title: "Maya approved the budget", description: "$48,000 · Marketing", time: "1 h ago", dateTime: "2026-10-21T10:00" },
  { icon: <UploadCloud />, title: "Jordan uploaded 6 files", time: "Yesterday", dateTime: "2026-10-20" },
  { icon: <FileText />, title: "Brief created from template", description: "Launch brief · v1", time: "Oct 18", dateTime: "2026-10-18" },
]

const steps = [
  { icon: <FileText />, title: "Order placed", description: "#FC-2041 · 3 items" },
  { icon: <Package />, title: "Packed", description: "Warehouse Berlin" },
  { icon: <Truck />, title: "Out for delivery", description: "Courier: DHL Express" },
  { icon: <Rocket />, title: "Delivered", description: "Signed by Alex" },
]

const initialNotifs = [
  { id: "n1", initials: "MC", tint: 1 as const, title: "Maya mentioned you", description: "“Can you review the pricing page copy?”", time: "5 min ago", unread: true },
  { id: "n2", initials: "JR", tint: 2 as const, title: "Jordan assigned you a task", description: "Redesign onboarding · Due Oct 24", time: "32 min ago", unread: true },
  { id: "n3", icon: true, title: "Invoice paid", description: "INV-2041 · $12,400", time: "3 h ago", unread: false },
  { id: "n4", initials: "AK", tint: 3 as const, title: "Alex replied in #launch", description: "“Shipping the beta on Thursday.”", time: "Yesterday", unread: false },
]

export default function TimelineDemo() {
  const [current, setCurrent] = React.useState(2)
  const [notifs, setNotifs] = React.useState(initialNotifs)
  const unread = notifs.filter((n) => n.unread).length

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)]">
      <section className="flex flex-col gap-3">
        <h3 className="flex h-8 items-center text-[13px] font-medium text-muted-foreground">Activity</h3>
        <Timeline>
          {activity.map((a) => (
            <TimelineItem key={a.title} {...a} />
          ))}
        </Timeline>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-medium text-muted-foreground">Order tracking</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCurrent((c) => (c >= steps.length ? 0 : c + 1))}
          >
            {current >= steps.length ? <><RotateCcw /> Restart</> : "Next step"}
          </Button>
        </div>
        <Timeline>
          {steps.map((s, i) => {
            const status = i < current ? "complete" : i === current ? "current" : "upcoming"
            return (
              <TimelineItem
                key={s.title}
                title={s.title}
                description={s.description}
                status={status}
                tone={status === "complete" ? "success" : status === "current" ? "brand" : "neutral"}
                icon={status === "complete" ? <Check /> : s.icon}
                time={status === "current" ? "In progress" : status === "complete" ? "Done" : undefined}
              />
            )
          })}
        </Timeline>
      </section>

      <Card className="self-start overflow-hidden">
        <header className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
          <b className="text-sm font-semibold text-foreground">Notifications</b>
          {unread > 0 && <Badge variant="brand">{unread} new</Badge>}
          <Button
            size="sm"
            variant="link"
            className="ml-auto text-[13px]"
            disabled={unread === 0}
            onClick={() => setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })))}
          >
            Mark all read
          </Button>
        </header>
        <NotificationList>
          {notifs.map((n) => (
            <Notification
              key={n.id}
              unread={n.unread}
              title={n.title}
              description={n.description}
              time={n.time}
              onSelect={() => setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
              avatar={
                <Avatar size="sm">
                  <AvatarFallback tint={"tint" in n ? n.tint : 4}>
                    {"icon" in n ? <CreditCard className="size-3.5" aria-hidden="true" /> : n.initials}
                  </AvatarFallback>
                </Avatar>
              }
              action={
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Dismiss: ${n.title}`}
                  className="size-7 text-muted-foreground"
                  onClick={() => setNotifs((ns) => ns.filter((x) => x.id !== n.id))}
                >
                  <X className="size-3.5" />
                </Button>
              }
            />
          ))}
        </NotificationList>
        {notifs.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground">
            You're all caught up.
            <Button size="sm" variant="outline" onClick={() => setNotifs(initialNotifs)}>
              <RotateCcw /> Restore
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
