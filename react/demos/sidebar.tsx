import * as React from "react"
import { BarChart3, Folder, Inbox, LayoutDashboard, LifeBuoy, PanelLeft, Settings, Users } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { Sidebar, SidebarFooter, SidebarHeader, SidebarItem, SidebarLabel, SidebarWorkspace } from "@/registry/facet/ui/sidebar"

const groups = [
  {
    label: "Workspace",
    items: [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
      { id: "inbox", label: "Inbox", icon: <Inbox />, count: 12 },
      { id: "projects", label: "Projects", icon: <Folder /> },
      { id: "customers", label: "Customers", icon: <Users /> },
    ],
  },
  {
    label: "Insights",
    items: [
      { id: "reports", label: "Reports", icon: <BarChart3 /> },
      { id: "settings", label: "Settings", icon: <Settings /> },
    ],
  },
]

export default function SidebarDemo() {
  const [active, setActive] = React.useState("dashboard")
  const [collapsed, setCollapsed] = React.useState(false)
  const [inbox, setInbox] = React.useState(12)
  return (
    <div className="flex items-start gap-4">
      <div className="h-[460px] overflow-hidden rounded-facet-lg border border-border shadow-xs">
        <Sidebar collapsed={collapsed}>
          <SidebarHeader>
            <SidebarWorkspace name="Acme Inc." logo="A" />
          </SidebarHeader>
          {groups.map((g) => (
            <React.Fragment key={g.label}>
              <SidebarLabel>{g.label}</SidebarLabel>
              {g.items.map((it) => (
                <SidebarItem
                  key={it.id}
                  href="#"
                  icon={it.icon}
                  active={active === it.id}
                  count={it.id === "inbox" ? (inbox || undefined) : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    setActive(it.id)
                    if (it.id === "inbox") setInbox(0)
                  }}
                >
                  {it.label}
                </SidebarItem>
              ))}
            </React.Fragment>
          ))}
          <SidebarFooter>
            <SidebarItem href="#" icon={<LifeBuoy />} onClick={(e) => e.preventDefault()}>Help & support</SidebarItem>
          </SidebarFooter>
        </Sidebar>
      </div>
      <Button variant="outline" size="sm" onClick={() => setCollapsed((c) => !c)} aria-pressed={collapsed}>
        <PanelLeft /> {collapsed ? "Expand" : "Collapse"}
      </Button>
    </div>
  )
}
