import * as React from "react"
import { Cloud, Database, GitBranch, MessageSquare } from "lucide-react"
import { CheckboxButton, CheckboxButtonGroup } from "@/registry/facet/ui/checkbox-button-group"

export default function CheckboxButtonGroupDemo() {
  const [picked, setPicked] = React.useState(["slack", "postgres"])
  return (
    <div className="flex flex-col gap-3">
      <CheckboxButtonGroup label="Integrations" value={picked} onValueChange={setPicked}>
        <CheckboxButton value="slack" title="Slack" description="Alerts in your channels" icon={<MessageSquare />} />
        <CheckboxButton value="github" title="GitHub" description="Link pull requests" icon={<GitBranch />} />
        <CheckboxButton value="postgres" title="Postgres" description="Sync your warehouse" icon={<Database />} />
        <CheckboxButton value="salesforce" title="Salesforce" description="Scale plan only" icon={<Cloud />} disabled />
      </CheckboxButtonGroup>
      <p className="text-[13px] text-muted-foreground" aria-live="polite">{picked.length} of 3 available integrations selected</p>
    </div>
  )
}
