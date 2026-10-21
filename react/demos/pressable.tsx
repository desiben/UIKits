import * as React from "react"
import { Hand, MousePointerClick, Sparkles } from "lucide-react"
import { Pressable, type PressFeedback } from "@/registry/facet/ui/pressable"
import { NumberValue } from "@/registry/facet/ui/number-value"

const styles: { feedback: PressFeedback; title: string; hint: string; icon: React.ElementType }[] = [
  { feedback: "scale", title: "Scale", hint: "Press me", icon: Hand },
  { feedback: "highlight", title: "Highlight", hint: "Press me", icon: MousePointerClick },
  { feedback: "lift", title: "Lift", hint: "Hover me", icon: Sparkles },
]

export default function PressableDemo() {
  const [counts, setCounts] = React.useState<Record<PressFeedback, number>>({ scale: 0, highlight: 0, lift: 0 })
  return (
    <div className="flex flex-wrap justify-center gap-4 py-2">
      {styles.map(({ feedback, title, hint, icon: Icon }) => (
        <Pressable
          key={feedback}
          feedback={feedback}
          aria-label={`${title} example`}
          onClick={() => setCounts((c) => ({ ...c, [feedback]: c[feedback] + 1 }))}
          className="flex w-[180px] flex-col items-center gap-2 rounded-facet-lg border border-border bg-card p-5 text-center"
        >
          <span className="grid size-10 place-items-center rounded-full bg-primary-subtle text-brand [&_svg]:size-5">
            <Icon />
          </span>
          <b className="text-sm font-medium">{title}</b>
          <span className="text-xs text-muted-foreground">
            {hint} · <NumberValue value={counts[feedback]} />
          </span>
        </Pressable>
      ))}
    </div>
  )
}
