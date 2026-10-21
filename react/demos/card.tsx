import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowUpRight, FileText, Users } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { Badge } from "@/registry/facet/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/facet/ui/card"

export default function CardDemo() {
  const [dismissed, setDismissed] = React.useState(false)
  return (
    <div className="flex flex-wrap items-start gap-5">
      <AnimatePresence mode="popLayout">
        {!dismissed ? (
          <Card
            key="deal"
            className="w-[380px] max-w-full"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
          >
            <CardHeader>
              <div className="grow">
                <CardTitle>Northwind renewal</CardTitle>
                <CardDescription>Enterprise · closes Nov 30</CardDescription>
              </div>
              <CardAction>
                <Badge variant="success">On track</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="text-foreground-secondary">
              Legal review finished. Waiting on procurement to confirm seat count before sending the order form.
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>Dismiss</Button>
              <Button size="sm">Open deal</Button>
            </CardFooter>
          </Card>
        ) : (
          <motion.div key="restore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid h-[200px] w-[380px] max-w-full place-items-center rounded-facet-lg border border-dashed border-border-strong">
            <Button variant="outline" size="sm" onClick={() => setDismissed(false)}>Restore card</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex w-[260px] flex-col gap-3">
        {[
          { icon: FileText, title: "Q4 planning doc", desc: "Edited 2h ago" },
          { icon: Users, title: "Hiring pipeline", desc: "12 candidates" },
        ].map((c) => (
          <Card key={c.title} interactive variant="elevated" tabIndex={0} className="group outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <CardHeader className="items-center pb-6">
              <span className="grid size-9 place-items-center rounded-facet bg-primary-subtle text-brand">
                <c.icon className="size-4" />
              </span>
              <div className="grow">
                <CardTitle className="text-sm">{c.title}</CardTitle>
                <CardDescription className="text-[13px]">{c.desc}</CardDescription>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
