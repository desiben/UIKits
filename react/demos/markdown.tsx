import * as React from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { Markdown } from "@/registry/facet/ui/markdown"

const answer = `## Q4 renewal plan

Three accounts renew in December. Focus on **Globex** first — usage is down and the *champion changed roles*. See the [renewal playbook](https://example.com/playbook).

- Book an exec check-in by \`Nov 22\`
- Share the new analytics add-on

- [x] Pull usage report
- [ ] Send renewal quote

> "Tokens and components finally say the same thing."

| Account | Renews | MRR |
| --- | --- | --- |
| Globex | Dec 1 | $12,950 |
| Initech | Dec 9 | $6,120 |

\`\`\`ts
const atRisk = accounts.filter((a) => a.usage < 0.7)
\`\`\`

<script>alert("raw HTML is rendered as text")</script>`

export default function MarkdownDemo() {
  const [len, setLen] = React.useState(answer.length)
  const stream = () => {
    setLen(0)
    let n = 0
    const id = setInterval(() => {
      n += 9
      setLen(Math.min(n, answer.length))
      if (n >= answer.length) clearInterval(id)
    }, 30)
  }
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Button variant="outline" size="sm" className="self-start" onClick={stream}>
        <RotateCcw /> Stream it again
      </Button>
      <Markdown>{answer.slice(0, len)}</Markdown>
    </div>
  )
}
