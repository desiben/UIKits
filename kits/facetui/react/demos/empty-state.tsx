import * as React from "react"
import { Folder, Plus, Search, Upload } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { EmptyState } from "@/registry/facet/ui/empty-state"

export default function EmptyStateDemo() {
  const [k, setK] = React.useState(0)
  return (
    <div className="grid items-start gap-5 md:grid-cols-2">
      <EmptyState
        key={k}
        icon={<Folder />}
        title="No projects yet"
        description="Projects group your tasks, files and docs. Create one to get your team started."
        action={
          <>
            <Button variant="outline" size="sm" onClick={() => setK(k + 1)}><Upload /> Import</Button>
            <Button size="sm"><Plus /> New project</Button>
          </>
        }
      />
      <EmptyState
        variant="dashed"
        icon={<Search />}
        title="No results for “northwnd”"
        description="Check the spelling or try a broader search. Filters may be hiding matches."
        action={<Button variant="ghost" size="sm">Clear filters</Button>}
      />
    </div>
  )
}
