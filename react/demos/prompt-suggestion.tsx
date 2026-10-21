import * as React from "react"
import { BarChart3, Calendar, Mail, Sparkles, TrendingUp, Users } from "lucide-react"
import { PromptSuggestion, PromptSuggestions } from "@/registry/facet/ui/prompt-suggestion"

export default function PromptSuggestionDemo() {
  const [picked, setPicked] = React.useState<string | null>(null)
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <PromptSuggestions className="justify-center">
        <PromptSuggestion icon={<Sparkles />} onClick={() => setPicked("Summarize this week")}>Summarize this week</PromptSuggestion>
        <PromptSuggestion icon={<TrendingUp />} onClick={() => setPicked("Forecast Q4 revenue")}>Forecast Q4 revenue</PromptSuggestion>
        <PromptSuggestion icon={<Mail />} onClick={() => setPicked("Draft a follow-up")}>Draft a follow-up</PromptSuggestion>
      </PromptSuggestions>
      <PromptSuggestions variant="cards">
        <PromptSuggestion icon={<BarChart3 />} title="Show revenue by plan" description="Chart for the last 6 months" onClick={() => setPicked("Show revenue by plan")} />
        <PromptSuggestion icon={<Users />} title="Find at-risk accounts" description="Usage and invoice signals" onClick={() => setPicked("Find at-risk accounts")} />
        <PromptSuggestion icon={<Calendar />} title="Plan next week" description="From your calendar and tasks" onClick={() => setPicked("Plan next week")} />
      </PromptSuggestions>
      <p className="text-center text-[13px] text-muted-foreground" aria-live="polite">{picked ? `Sending “${picked}”` : "Pick a suggestion"}</p>
    </div>
  )
}
