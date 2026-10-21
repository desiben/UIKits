import * as React from "react"
import { motion } from "motion/react"
import { Tabs, TabsBadge, TabsContent, TabsList, TabsTrigger } from "@/registry/facet/ui/tabs"

const ranges = { day: [32, 48, 41, 60, 52, 70, 64], week: [55, 62, 48, 74, 80, 69, 88], month: [40, 58, 66, 61, 78, 84, 92] }

export default function TabsDemo() {
  const [range, setRange] = React.useState<keyof typeof ranges>("week")
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <Tabs defaultValue="overview">
        <TabsList aria-label="Project">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics <TabsBadge>12</TabsBadge></TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="py-4 text-sm text-muted-foreground">
          Q4 Launch is on track: 18 of 24 tasks complete, next milestone on Friday.
        </TabsContent>
        <TabsContent value="analytics" className="py-4 text-sm text-muted-foreground">
          12 new events since yesterday — conversion is up 4.2% week over week.
        </TabsContent>
        <TabsContent value="settings" className="py-4 text-sm text-muted-foreground">
          Visibility, notifications and integrations for this project.
        </TabsContent>
      </Tabs>

      <Tabs value={range} onValueChange={(v) => setRange(v as keyof typeof ranges)}>
        <TabsList variant="pill" aria-label="Range">
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
        {(Object.keys(ranges) as (keyof typeof ranges)[]).map((k) => (
          <TabsContent key={k} value={k} className="pt-4">
            <div className="flex h-24 items-end gap-2 rounded-facet-lg border border-border bg-card p-3">
              {ranges[k].map((h, i) => (
                <motion.div key={i} className="flex-1 rounded-t-[3px] bg-primary/80" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ type: "spring", stiffness: 300, damping: 26, delay: i * 0.03 }} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
