import * as React from "react"
import { Sparkles } from "lucide-react"
import { Questionnaire, type QuestionStep, type QuestionnaireAnswers } from "@/registry/facet/ui/questionnaire"

const steps: QuestionStep[] = [
  {
    key: "Audience",
    title: "Who is this report for?",
    description: "I'll adjust depth and tone.",
    type: "single",
    required: true,
    other: "Describe the audience",
    options: [
      { value: "Executives", label: "Executives", description: "One page, headline numbers" },
      { value: "Sales team", label: "Sales team", description: "Deal-level detail" },
      { value: "Board", label: "Board", description: "Quarterly trends and risks" },
    ],
  },
  {
    key: "Include",
    title: "What should I include?",
    description: "Pick any. You can skip this.",
    type: "multiple",
    options: [
      { value: "Pipeline", label: "Pipeline by stage" },
      { value: "Churn risk", label: "Churn risk" },
      { value: "Forecast", label: "Forecast vs target" },
    ],
  },
  {
    key: "Notes",
    title: "Anything else?",
    description: "Optional — deadlines, format, things to avoid.",
    type: "text",
    placeholder: "e.g. Keep it under 300 words",
  },
]

export default function QuestionnaireDemo() {
  const [result, setResult] = React.useState<QuestionnaireAnswers | null>(null)
  return (
    <div className="flex flex-col items-center gap-3">
      <Questionnaire
        steps={steps}
        badge={<><Sparkles /> Facet AI</>}
        submitLabel="Generate report"
        onSubmit={setResult}
      />
      <p className="text-xs text-muted-foreground">
        {result ? `Submitted ${Object.values(result).flat().length} answers.` : "Number keys pick options; Enter continues."}
      </p>
    </div>
  )
}
