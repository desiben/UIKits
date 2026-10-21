import { CodeBlock } from "@/registry/facet/ui/code-block"

const tsx = `import { Button } from "@/components/ui/button"

// Save the current draft
export function Save({ onSave }: { onSave: () => void }) {
  return <Button variant="primary" onClick={onSave}>Save changes</Button>
}`

const css = `  --brand-600: oklch(0.55 0.17 250);
  --brand-600: oklch(0.58 0.2 40);
  --bg-primary: var(--brand-600);`

export default function CodeBlockDemo() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <CodeBlock language="tsx" filename="save.tsx" showLineNumbers highlightLines={[5]} code={tsx} />
      <div className="grid gap-4 sm:grid-cols-2">
        <CodeBlock language="css" filename="tokens.css" removedLines={[1]} addedLines={[2]} code={css} />
        <CodeBlock hideHeader language="sh" code={"# install the component\nnpx shadcn add @facet/code-block"} />
      </div>
    </div>
  )
}
