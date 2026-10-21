import * as React from "react"
import { createRoot } from "react-dom/client"
import { AnimatePresence, motion } from "motion/react"
import { Check, Copy, Moon, Sun, Terminal } from "lucide-react"
import { FacetMotion, spring } from "@/registry/facet/lib/motion"
import "./styles.css"

type Meta = { name: string; title: string; description: string; categories?: string[] }
const metas = Object.values(import.meta.glob<Meta>("../registry/meta/*.json", { eager: true, import: "default" }))
const demos = import.meta.glob<{ default: React.ComponentType }>("../demos/*.tsx")
const demoFor = (name: string) => demos[`../demos/${name}.tsx`]

const GROUPS: [string, string][] = [
  ["actions", "Actions"], ["forms", "Forms"], ["data-display", "Data display"], ["feedback", "Feedback"],
  ["overlays", "Overlays"], ["navigation", "Navigation"], ["signature", "Signature"], ["charts", "Charts"],
  ["ai", "AI"], ["layout", "Layout"],
]
const grouped = GROUPS.map(([id, label]) => ({
  id, label,
  items: metas.filter((m) => (m.categories?.[0] ?? "actions") === id).sort((a, b) => a.title.localeCompare(b.title)),
})).filter((g) => g.items.length)

const PMS = {
  pnpm: (c: string) => `pnpm dlx shadcn@latest ${c}`,
  npm: (c: string) => `npx shadcn@latest ${c}`,
  yarn: (c: string) => `yarn dlx shadcn@latest ${c}`,
  bun: (c: string) => `bunx --bun shadcn@latest ${c}`,
} as const
type PM = keyof typeof PMS
const PMContext = React.createContext<[PM, (p: PM) => void]>(["pnpm", () => {}])

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = React.useState(false)
  return (
    <button
      type="button"
      aria-label="Copy command"
      className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1400) }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={done ? "y" : "n"} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={spring}>
          {done ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export function Command({ cmd }: { cmd: string }) {
  const [pm, setPm] = React.useContext(PMContext)
  const text = PMS[pm](cmd)
  return (
    <div className="overflow-hidden rounded-facet-lg border bg-subtle">
      <div className="flex items-center gap-1 border-b px-2 py-1.5">
        <Terminal className="mx-1.5 size-4 text-muted-foreground" />
        {(Object.keys(PMS) as PM[]).map((k) => (
          <button key={k} type="button" onClick={() => setPm(k)} className="relative rounded-md px-2.5 py-1 font-mono text-[13px] text-muted-foreground data-[on=true]:text-foreground" data-on={pm === k}>
            {pm === k && <motion.span layoutId="pm-pill" className="absolute inset-0 rounded-md border bg-card shadow-sm" transition={spring} />}
            <span className="relative">{k}</span>
          </button>
        ))}
        <span className="flex-1" />
        <CopyButton text={text} />
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] text-foreground"><code>{text}</code></pre>
    </div>
  )
}

class Boundary extends React.Component<{ name: string; children: React.ReactNode }, { error?: Error }> {
  state: { error?: Error } = {}
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) return <p className="text-sm text-danger">Demo “{this.props.name}” failed: {this.state.error.message}</p>
    return this.props.children
  }
}

function Demo({ name }: { name: string }) {
  const load = demoFor(name)
  const Lazy = React.useMemo(() => (load ? React.lazy(load) : null), [load])
  if (!Lazy) return <p className="text-sm text-muted-foreground">Demo coming soon.</p>
  return (
    <Boundary name={name}>
      <React.Suspense fallback={<div className="h-24 animate-pulse rounded-facet bg-muted" />}>
        <Lazy />
      </React.Suspense>
    </Boundary>
  )
}

function Section({ m }: { m: Meta }) {
  const ref = React.useRef<HTMLElement>(null)
  const [seen, setSeen] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { rootMargin: "600px" })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section id={m.name} ref={ref} className="scroll-mt-20 border-t py-12 first:border-t-0">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight">{m.title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-foreground-secondary">{m.description}</p>
        </div>
      </div>
      <div className="rounded-facet-xl border bg-card p-6 shadow-sm sm:p-8">{seen ? <Demo name={m.name} /> : <div className="h-24" />}</div>
      <div className="mt-4"><Command cmd={`add @facet/${m.name}`} /></div>
    </section>
  )
}

function App() {
  const pmState = React.useState<PM>(() => (localStorage.getItem("facet-pm") as PM) || "pnpm")
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains("dark"))
  React.useEffect(() => { localStorage.setItem("facet-pm", pmState[0]) }, [pmState[0]])
  React.useEffect(() => { document.documentElement.classList.toggle("dark", dark) }, [dark])
  const total = metas.length
  return (
    <FacetMotion>
      <PMContext.Provider value={pmState}>
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-5">
            <a href="../" className="font-semibold tracking-tight">Facet UI <span className="text-brand">React</span></a>
            <span className="rounded-full bg-primary-subtle px-2 py-0.5 text-xs font-medium text-brand">{total} components</span>
            <span className="flex-1" />
            <a href="../" className="hidden text-sm text-foreground-secondary hover:text-foreground sm:block">HTML docs</a>
            <a href="../templates/" className="hidden text-sm text-foreground-secondary hover:text-foreground sm:block">Templates</a>
            <button type="button" aria-label="Toggle dark mode" onClick={() => setDark((d) => !d)} className="grid size-9 place-items-center rounded-facet border bg-card">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={dark ? "d" : "l"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={spring}>
                  {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </header>
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[220px_1fr]">
          <nav className="sticky top-14 hidden max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8 text-sm lg:block" aria-label="Components">
            <a href="#install" className="mb-4 block font-medium">Installation</a>
            {grouped.map((g) => (
              <div key={g.id} className="mb-5">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</p>
                {g.items.map((m) => (
                  <a key={m.name} href={`#${m.name}`} className="block rounded-md px-2 py-1 text-foreground-secondary hover:bg-accent hover:text-foreground">{m.title}</a>
                ))}
              </div>
            ))}
          </nav>
          <main className="min-w-0 py-10">
            <section id="install" className="pb-10">
              <p className="text-sm font-medium text-brand">Facet UI v1.3 · React</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Animated components, installed with one command.</h1>
              <p className="mt-4 max-w-2xl text-foreground-secondary">Every Facet UI component as a React component with motion on every interaction — springs, layout animations and gestures, built on Radix and Tailwind. They install into your project with the shadcn CLI, so you own the code.</p>
              <ol className="mt-8 grid gap-6">
                <li>
                  <p className="mb-2 font-medium">1. Start a project (Next.js, Vite, React Router, Astro or TanStack Start)</p>
                  <Command cmd="init" />
                </li>
                <li>
                  <p className="mb-2 font-medium">2. Add the Facet registry to <code className="rounded bg-muted px-1 py-0.5 text-[13px]">components.json</code></p>
                  <pre className="overflow-x-auto rounded-facet-lg border bg-subtle px-4 py-3 font-mono text-[13px]">{`{
  "registries": {
    "@facet": {
      "url": "https://facetui.vercel.app/r/{name}.json",
      "headers": { "Authorization": "Bearer \${FACET_LICENSE_KEY}" }
    }
  }
}`}</pre>
                  <p className="mt-2 text-sm text-foreground-secondary">Put the license key from your Gumroad receipt in <code className="rounded bg-muted px-1 py-0.5 text-[13px]">.env.local</code> as <code className="rounded bg-muted px-1 py-0.5 text-[13px]">FACET_LICENSE_KEY=…</code></p>
                </li>
                <li>
                  <p className="mb-2 font-medium">3. Add the theme, then any component — or everything at once</p>
                  <div className="grid gap-3"><Command cmd="add @facet/theme" /><Command cmd="add @facet/all" /></div>
                </li>
              </ol>
            </section>
            {grouped.map((g) => (
              <div key={g.id}>
                <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</h2>
                {g.items.map((m) => <Section key={m.name} m={m} />)}
              </div>
            ))}
          </main>
        </div>
      </PMContext.Provider>
    </FacetMotion>
  )
}

createRoot(document.getElementById("root")!).render(<App />)
