import * as React from "react"
import { CalendarPlus, FileText, Folder, ListTodo, Moon, Plus, Search, Settings, Sparkles, UserPlus } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandKbd,
  CommandList,
  CommandShortcut,
} from "@/registry/facet/ui/command-palette"

const scopes = ["Q4 Launch", "Marketing", "All workspaces"]

function PaletteBody({ onRun }: { onRun?: (label: string) => void }) {
  const [search, setSearch] = React.useState("budget")
  const [scope, setScope] = React.useState<number | null>(0)
  const run = (label: string) => () => onRun?.(label)
  return (
    <>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search or ask Facet AI…"
        scope={scope === null ? undefined : scopes[scope]}
        scopeIcon={<Folder />}
        onScopeClear={() => setScope(null)}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault()
            setScope((s) => (s === null ? 0 : (s + 1) % scopes.length))
          }
        }}
      />
      <CommandList>
        <CommandEmpty>No results. Press ⇥ to search another scope.</CommandEmpty>
        <CommandGroup heading="Ask AI" forceMount>
          <CommandItem forceMount value="ask-ai" onSelect={run("Ask AI")}>
            <Sparkles />
            <span className="truncate">
              {search ? (
                <>
                  Ask Facet AI about “<b className="font-medium">{search}</b>”
                </>
              ) : (
                "Ask Facet AI anything"
              )}
            </span>
            <CommandShortcut>⌘↵</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading={scope === null ? "Results" : `Results in ${scopes[scope]}`}>
          <CommandItem onSelect={run("Budget review")} keywords={["budget", "doc"]}>
            <FileText /> Budget review — doc <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={run("Approve budget")} keywords={["budget", "task"]}>
            <ListTodo /> Approve budget — task assigned to you <CommandShortcut>⌘2</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={run("Launch brief")} keywords={["launch"]}>
            <FileText /> Launch brief — doc
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={run("Create budget request")} keywords={["budget", "new"]}>
            <Plus /> Create budget request <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={run("Schedule review")} keywords={["budget", "meeting"]}>
            <CalendarPlus /> Schedule budget review
          </CommandItem>
          <CommandItem onSelect={run("Invite teammate")}>
            <UserPlus /> Invite teammate
          </CommandItem>
          <CommandItem onSelect={run("Toggle theme")}>
            <Moon /> Toggle dark mode <CommandShortcut>⇧⌘L</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={run("Settings")}>
            <Settings /> Open settings <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandFooter>
        <span>
          <CommandKbd>↑↓</CommandKbd> Navigate
        </span>
        <span>
          <CommandKbd>↵</CommandKbd> Open
        </span>
        <span>
          <CommandKbd>⇥</CommandKbd> Change scope
        </span>
      </CommandFooter>
    </>
  )
}

export default function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false)
  const [last, setLast] = React.useState<string | null>(null)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="flex flex-col items-center gap-5">
      <Command className="max-w-[600px]" label="Command palette (inline example)">
        <PaletteBody onRun={setLast} />
      </Command>
      <div className="flex flex-wrap items-center justify-center gap-3 text-[13px] text-muted-foreground">
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Search /> Open palette
          <CommandKbd className="ml-1">⌘K</CommandKbd>
        </Button>
        <span aria-live="polite">{last ? `Ran: ${last}` : "Type to filter, hover or use ↑↓ — the highlight follows."}</span>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <PaletteBody
          onRun={(label) => {
            setLast(label)
            setOpen(false)
          }}
        />
      </CommandDialog>
    </div>
  )
}
