import * as React from "react"
import { Button } from "@/registry/facet/ui/button"
import { Bubble, BubbleActions, BubbleCollapsible, BubbleGroup, BubbleLink, BubbleMeta, BubbleReactions } from "@/registry/facet/ui/bubble"

export default function BubbleDemo() {
  const [answer, setAnswer] = React.useState<string | null>(null)
  return (
    <div className="mx-auto flex max-w-[520px] flex-col gap-2.5">
      <BubbleGroup>
        <Bubble>Hey! Did the new pricing page ship?</Bubble>
        <Bubble>Marketing wants to link it in the newsletter 🙏</Bubble>
        <BubbleMeta>Ada · 9:41</BubbleMeta>
      </BubbleGroup>
      <BubbleGroup align="end">
        <Bubble variant="primary">
          Yes — live since this morning.
          <BubbleReactions>👍 2</BubbleReactions>
        </Bubble>
      </BubbleGroup>
      <BubbleGroup align="end">
        <Bubble variant="primary">
          Here's the link:
          <BubbleLink
            href="#"
            title="Pricing · Facet UI"
            description="Simple plans for every team"
            preview={<div className="grid size-full place-items-center bg-gradient-to-br from-brand-300 to-brand-600 text-xs font-medium text-primary-foreground">facet.dev/pricing</div>}
          />
        </Bubble>
        <BubbleMeta>You · 9:43</BubbleMeta>
      </BubbleGroup>
      <BubbleGroup>
        <Bubble variant="outline">
          <BubbleCollapsible>
            <p>Release checklist for v1.3: tokens audited, Figma variants rebuilt, docs regenerated, changelog written, accessibility pass on the new components, toast stacking checked on Safari, and the questionnaire tested with a screen reader.</p>
            <p>Ping me once the store listings are updated.</p>
          </BubbleCollapsible>
        </Bubble>
      </BubbleGroup>
      <BubbleGroup>
        <Bubble variant="tinted">
          Want me to schedule the newsletter?
          {answer ? (
            <p className="mt-1.5 text-xs text-muted-foreground">{answer}</p>
          ) : (
            <BubbleActions>
              <Button size="sm" className="h-7" onClick={() => setAnswer("Scheduled for Thursday 9:00.")}>Schedule</Button>
              <Button size="sm" variant="outline" className="h-7" onClick={() => setAnswer("Okay, not now.")}>Not now</Button>
            </BubbleActions>
          )}
        </Bubble>
      </BubbleGroup>
    </div>
  )
}
