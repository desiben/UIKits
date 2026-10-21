import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { BarChart3, ChevronRight, Inbox, LayoutDashboard, LifeBuoy, Monitor, Search, Smartphone, Sparkles, Users } from "lucide-react"
import { slideUp, stagger } from "@/registry/facet/lib/motion"
import { cn } from "@/registry/facet/lib/utils"
import { Button } from "@/registry/facet/ui/button"
import { SidebarFooter, SidebarHeader, SidebarItem, SidebarLabel, SidebarWorkspace } from "@/registry/facet/ui/sidebar"
import {
  AppLayout,
  AppLayoutAsideContent,
  AppLayoutAsideHeader,
  AppLayoutMain,
  AppLayoutNavbar,
  AppLayoutSidebar,
  AppLayoutTrigger,
  useAppLayout,
} from "@/registry/facet/ui/app-layout"

const pages = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
  { id: "inbox", label: "Inbox", icon: <Inbox />, count: 8 },
  { id: "customers", label: "Customers", icon: <Users /> },
  { id: "reports", label: "Reports", icon: <BarChart3 /> },
]

const stats: Record<string, { label: string; value: string; delta: string }[]> = {
  dashboard: [
    { label: "MRR", value: "$248.9k", delta: "+12.4%" },
    { label: "Customers", value: "1,284", delta: "+3.1%" },
    { label: "Churn", value: "2.4%", delta: "-0.3%" },
  ],
  inbox: [
    { label: "Unread", value: "8", delta: "today" },
    { label: "Assigned", value: "23", delta: "+4" },
    { label: "Avg. reply", value: "1h 12m", delta: "-9m" },
  ],
  customers: [
    { label: "Active", value: "1,284", delta: "+38" },
    { label: "Trials", value: "96", delta: "+12" },
    { label: "NPS", value: "62", delta: "+4" },
  ],
  reports: [
    { label: "Scheduled", value: "14", delta: "weekly" },
    { label: "Shared", value: "31", delta: "+6" },
    { label: "Exports", value: "212", delta: "this month" },
  ],
}

function DemoSidebar({ active, onNavigate }: { active: string; onNavigate: (id: string) => void }) {
  const { setMobileNavOpen } = useAppLayout()
  return (
    <AppLayoutSidebar>
      <SidebarHeader>
        <SidebarWorkspace name="Acme Inc." logo="A" />
      </SidebarHeader>
      <SidebarLabel>Workspace</SidebarLabel>
      {pages.map((p) => (
        <SidebarItem
          key={p.id}
          href="#"
          icon={p.icon}
          count={p.count}
          active={active === p.id}
          onClick={(e) => {
            e.preventDefault()
            onNavigate(p.id)
            setMobileNavOpen(false)
          }}
        >
          {p.label}
        </SidebarItem>
      ))}
      <SidebarFooter>
        <SidebarItem href="#" icon={<LifeBuoy />} onClick={(e) => e.preventDefault()}>
          Help & support
        </SidebarItem>
      </SidebarFooter>
    </AppLayoutSidebar>
  )
}

function DemoNavbar({ title }: { title: string }) {
  return (
    <AppLayoutNavbar>
      <AppLayoutTrigger />
      <ol className="flex min-w-0 items-center gap-1.5 text-sm whitespace-nowrap">
        <li className="text-muted-foreground">Acme</li>
        <li aria-hidden="true" className="text-muted-foreground">
          <ChevronRight className="size-3.5" />
        </li>
        <li aria-current="page" className="truncate font-medium text-foreground">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={title} className="inline-block" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              {title}
            </motion.span>
          </AnimatePresence>
        </li>
      </ol>
      <span className="flex-1" />
      <Button variant="ghost" size="icon-sm" aria-label="Search">
        <Search />
      </Button>
      <AppLayoutTrigger target="aside" variant="outline">
        <Sparkles /> Ask AI
      </AppLayoutTrigger>
    </AppLayoutNavbar>
  )
}

export default function AppLayoutDemo() {
  const [active, setActive] = React.useState("dashboard")
  const [phone, setPhone] = React.useState(false)
  const page = pages.find((p) => p.id === active)!
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div role="group" aria-label="Preview size" className="inline-flex gap-0.5 rounded-facet bg-muted p-[3px]">
          {[
            { v: false, label: "Desktop", icon: <Monitor /> },
            { v: true, label: "Mobile", icon: <Smartphone /> },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              aria-pressed={phone === o.v}
              onClick={() => setPhone(o.v)}
              className={cn(
                "relative isolate inline-flex h-[30px] cursor-pointer items-center gap-1.5 rounded-[6px] px-3 text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5",
                phone === o.v ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {phone === o.v && <motion.span layoutId="app-layout-demo-size" className="absolute inset-0 -z-10 rounded-[inherit] bg-card shadow-sm" />}
              {o.icon}
              {o.label}
            </button>
          ))}
        </div>
        <span className="text-[13px] text-muted-foreground">Collapse the sidebar with the panel button; the active item slides between pages.</span>
      </div>
      <motion.div className="mx-auto w-full" initial={false} animate={{ maxWidth: phone ? 390 : 1100 }} transition={{ type: "spring", stiffness: 260, damping: 30 }}>
        <AppLayout
          variant="inset"
          asideBreakpoint={860}
          className="h-[560px]"
          sidebar={<DemoSidebar active={active} onNavigate={setActive} />}
          navbar={<DemoNavbar title={page.label} />}
          aside={
            <>
              <AppLayoutAsideHeader>
                <Sparkles className="text-brand" /> Facet AI
              </AppLayoutAsideHeader>
              <AppLayoutAsideContent>
                <div className="flex gap-2.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-subtle text-brand">
                    <Sparkles className="size-3.5" />
                  </span>
                  <p className="rounded-facet bg-muted px-3 py-2 text-sm text-foreground">Ask me anything about your {page.label.toLowerCase()}.</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-9">
                  {["Why did churn rise?", "Summarise this week"].map((q) => (
                    <motion.button
                      key={q}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      className="h-7 cursor-pointer rounded-full border border-border bg-card px-3 text-[13px] text-foreground-secondary transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </AppLayoutAsideContent>
            </>
          }
        >
          <AppLayoutMain>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active} className="flex flex-col gap-4" variants={stagger(0.05)} initial="hidden" animate="visible" exit="exit">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
                  {stats[active].map((s) => (
                    <motion.div key={s.label} variants={slideUp} className="flex flex-col gap-1 rounded-facet-lg border border-border bg-card p-4">
                      <span className="text-[13px] text-muted-foreground">{s.label}</span>
                      <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">{s.value}</span>
                      <span className="text-xs text-success">{s.delta}</span>
                    </motion.div>
                  ))}
                </div>
                <motion.div variants={slideUp} className="flex min-h-[200px] flex-col gap-2 rounded-facet-lg border border-border bg-card p-4">
                  <b className="text-sm font-semibold text-foreground">{page.label}</b>
                  <p className="text-sm text-muted-foreground">The main column scrolls; the navbar stays on top.</p>
                  <div className="mt-auto flex h-24 items-end gap-1.5">
                    {[38, 52, 44, 68, 57, 74, 63, 82, 70, 90, 78, 96].map((h, i) => (
                      <motion.span
                        key={i}
                        className="flex-1 rounded-t-[3px] bg-primary/80"
                        initial={{ height: 0 }}
                        animate={{ height: `${(h * (active === "dashboard" ? 1 : 0.6 + ((i * 7) % 5) / 10))}%` }}
                        transition={{ type: "spring", stiffness: 280, damping: 28, delay: i * 0.02 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </AppLayoutMain>
        </AppLayout>
      </motion.div>
    </div>
  )
}
