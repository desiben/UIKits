import * as React from "react"
import { Kbd, KbdGroup, Separator, Skeleton, Spinner } from "@/registry/facet/ui/kbd"
import { Button } from "@/registry/facet/ui/button"

export default function KbdDemo() {
  const [loading, setLoading] = React.useState(true)
  return (
    <div className="flex w-[380px] max-w-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <KbdGroup>
          <Kbd listenKey="Meta">⌘</Kbd>
          <Kbd listenKey="k">K</Kbd>
        </KbdGroup>
        <span className="text-[13px] text-muted-foreground">to search — try pressing it</span>
        <Spinner className="ml-auto text-brand" />
      </div>
      <Separator animated />
      <div className="flex items-center gap-3">
        {loading ? (
          <>
            <Skeleton className="size-10 rounded-full" />
            <div className="flex grow flex-col gap-2">
              <Skeleton className="h-3 w-[70%]" />
              <Skeleton className="h-3 w-[45%]" />
            </div>
          </>
        ) : (
          <>
            <span className="grid size-10 place-items-center rounded-full bg-primary-subtle text-sm font-medium text-brand">MC</span>
            <div className="flex grow flex-col">
              <span className="text-sm font-medium">Maya Chen</span>
              <span className="text-[13px] text-muted-foreground">Product designer</span>
            </div>
          </>
        )}
        <Button size="sm" variant="outline" onClick={() => setLoading((l) => !l)}>
          {loading ? "Load" : "Reset"}
        </Button>
      </div>
      <div className="flex h-5 items-center gap-3 text-[13px] text-muted-foreground">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Changelog</span>
        <Separator orientation="vertical" />
        <span className="inline-flex items-center gap-1.5">
          <Spinner size="sm" label="Deploying" /> Deploying
        </span>
      </div>
    </div>
  )
}
