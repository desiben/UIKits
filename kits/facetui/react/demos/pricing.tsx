import * as React from "react"
import { Segment, SegmentItem } from "@/registry/facet/ui/segment"
import { PricingCard } from "@/registry/facet/ui/pricing"

const plans = [
  {
    plan: "Starter",
    description: "For small teams getting going",
    monthly: 0,
    yearly: 0,
    cta: "Get started",
    features: ["Up to 5 projects", "Basic analytics", "Community support", { label: "AI copilot", included: false }],
  },
  {
    plan: "Growth",
    description: "For teams scaling their workflow",
    monthly: 24,
    yearly: 19,
    featured: true,
    badge: "Popular",
    cta: "Start free trial",
    features: ["Unlimited projects", "AI copilot", "Advanced permissions", "Priority support"],
  },
  {
    plan: "Scale",
    description: "For organisations with advanced needs",
    monthly: 129,
    yearly: 99,
    cta: "Contact sales",
    features: ["Everything in Growth", "SSO & SCIM", "Audit log", "Dedicated success manager"],
  },
]

export default function PricingDemo() {
  const [billing, setBilling] = React.useState("monthly")
  const yearly = billing === "yearly"
  return (
    <div className="flex flex-col items-center gap-8">
      <Segment value={billing} onValueChange={setBilling} tone="primary" aria-label="Billing period">
        <SegmentItem value="monthly">Monthly</SegmentItem>
        <SegmentItem value="yearly">Yearly · save 20%</SegmentItem>
      </Segment>
      <div className="grid w-full max-w-[920px] items-start gap-5 pt-2 md:grid-cols-3">
        {plans.map(({ monthly, yearly: perYear, ...p }) => {
          const price = yearly ? perYear : monthly
          return (
            <PricingCard
              key={p.plan}
              {...p}
              price={price}
              period="/user/mo"
              compareAt={yearly && monthly > 0 ? monthly : undefined}
              note={price === 0 ? "Free forever" : yearly ? `Billed $${(price * 12).toLocaleString("en-US")} yearly` : "Billed monthly"}
            />
          )
        })}
      </div>
    </div>
  )
}
