import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ArrowRight, Clock } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { Badge } from "@/registry/facet/ui/badge"
import { Avatar, AvatarFallback } from "@/registry/facet/ui/avatar"
import { ChartContainer, ChartLegendContent, ChartProvider, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/registry/facet/ui/charts"
import { Table, TableBody, TableCell, TableHead, TableHeadRow, TableHeader, TableRow } from "@/registry/facet/ui/table"
import {
  Widget, WidgetAction, WidgetContent, WidgetDescription, WidgetFooter, WidgetGrid, WidgetHeader, WidgetTitle,
} from "@/registry/facet/ui/widget"

const mrr = [212, 215, 218, 220, 221, 220, 219, 219, 220, 222, 225, 229, 232, 235, 236, 236, 235, 235, 236, 239, 243, 246, 249, 251, 252].map((v, i) => ({
  day: `Oct ${i + 1}`,
  mrr: v * 1000,
}))
const config = { mrr: { label: "MRR" } } satisfies ChartConfig
const accounts = [
  { id: "NW", name: "Northwind", plan: "Scale", mrr: 12400, tint: 1 },
  { id: "GL", name: "Globex", plan: "Growth", mrr: 8950, tint: 2 },
  { id: "IN", name: "Initech", plan: "Growth", mrr: 6120, tint: 4 },
] as const

export default function WidgetDemo() {
  return (
    <WidgetGrid className="items-start">
      <ChartProvider config={config}>
        <Widget>
          <WidgetHeader>
            <div>
              <WidgetTitle>Revenue</WidgetTitle>
              <WidgetDescription>Daily MRR · last 25 days</WidgetDescription>
            </div>
            <WidgetAction><ChartLegendContent /></WidgetAction>
          </WidgetHeader>
          <WidgetContent>
            <ChartContainer className="aspect-auto h-[180px]">
              <AreaChart data={mrr} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="w-mrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-mrr)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-mrr)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} minTickGap={40} />
                <YAxis tickLine={false} axisLine={false} width={44} domain={[200000, 260000]} ticks={[200000, 220000, 240000, 260000]} tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} />
                <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => `$${v.toLocaleString("en-US")}`} />} />
                <Area dataKey="mrr" type="monotone" stroke="var(--color-mrr)" strokeWidth={2} fill="url(#w-mrr)" animationDuration={900} activeDot={{ r: 4 }} />
              </AreaChart>
            </ChartContainer>
          </WidgetContent>
          <WidgetFooter>
            <Clock /> Updated 4 min ago
            <Button variant="link" size="sm" className="ml-auto text-[13px]">View report</Button>
          </WidgetFooter>
        </Widget>
      </ChartProvider>

      <Widget>
        <WidgetHeader>
          <div>
            <WidgetTitle>Top accounts</WidgetTitle>
            <WidgetDescription>By MRR</WidgetDescription>
          </div>
          <WidgetAction>
            <Button variant="ghost" size="sm">View all <ArrowRight /></Button>
          </WidgetAction>
        </WidgetHeader>
        <WidgetContent flush>
          <Table containerClassName="rounded-none border-0">
            <TableHeader>
              <TableHeadRow>
                <TableHead>Account</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead numeric>MRR</TableHead>
              </TableHeadRow>
            </TableHeader>
            <TableBody>
              {accounts.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm"><AvatarFallback tint={a.tint}>{a.id}</AvatarFallback></Avatar>
                      <b className="font-medium">{a.name}</b>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={a.plan === "Scale" ? "brand" : "neutral"}>{a.plan}</Badge></TableCell>
                  <TableCell numeric>${a.mrr.toLocaleString("en-US")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </WidgetContent>
      </Widget>
    </WidgetGrid>
  )
}
