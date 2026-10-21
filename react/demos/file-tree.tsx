import * as React from "react"
import { FileTree, type FileTreeItem } from "@/registry/facet/ui/file-tree"

const tree: FileTreeItem[] = [
  {
    id: "src",
    name: "src",
    children: [
      {
        id: "components",
        name: "components",
        children: [
          { id: "button.tsx", name: "button.tsx", status: "modified" },
          { id: "card.tsx", name: "card.tsx" },
          { id: "dialog.tsx", name: "dialog.tsx", status: "added" },
        ],
      },
      { id: "hooks", name: "hooks", children: [{ id: "use-theme.ts", name: "use-theme.ts" }] },
      { id: "tokens.css", name: "tokens.css", meta: "16 KB" },
    ],
  },
  { id: "public", name: "public", children: [{ id: "logo.svg", name: "logo.svg", meta: "2 KB" }, { id: "og.png", name: "og.png", meta: "84 KB" }] },
  { id: "tmp", name: "tmp", children: [] },
  { id: "README.md", name: "README.md" },
  { id: "package.json", name: "package.json", meta: "1 KB" },
]

export default function FileTreeDemo() {
  const [selected, setSelected] = React.useState("button.tsx")
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="w-[280px] rounded-facet-lg border border-border bg-card">
        <FileTree items={tree} selectedKey={selected} onSelect={setSelected} defaultExpandedKeys={["src", "components"]} label="Project files" />
      </div>
      <div className="flex flex-col gap-1 pt-2 text-sm">
        <span className="text-xs text-muted-foreground">Open file</span>
        <span className="font-mono text-foreground">{selected}</span>
        <span className="mt-3 max-w-[260px] text-xs text-muted-foreground">Click folders to expand. Arrow keys move, ← / → collapse and expand, Enter opens.</span>
      </div>
    </div>
  )
}
