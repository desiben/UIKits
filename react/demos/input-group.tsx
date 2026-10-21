import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowUp, AtSign, Check, Copy, Eye, EyeOff, FileText, Link2, Mail, Paperclip, Search, Sparkles } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/registry/facet/ui/input-group"

const swap = {
  initial: { opacity: 0, scale: 0.5, rotate: -45 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.5, rotate: 45 },
  transition: { type: "spring", stiffness: 520, damping: 30 },
} as const

export default function InputGroupDemo() {
  const [query, setQuery] = React.useState("")
  const [show, setShow] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [subscribed, setSubscribed] = React.useState(false)
  const [prompt, setPrompt] = React.useState("")
  const results = query ? Math.max(0, 12 - query.length * 3) : 12

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <InputGroup>
          <InputGroupAddon><Search /></InputGroupAddon>
          <InputGroupInput placeholder="Search…" aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
          <InputGroupAddon align="inline-end">
            <InputGroupText>
              <motion.span key={results} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                {results}
              </motion.span>
              results
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon tone="muted">https://</InputGroupAddon>
          <InputGroupInput defaultValue="facet" aria-label="Subdomain" />
          <InputGroupAddon align="inline-end" tone="muted">.dev</InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput inputMode="decimal" placeholder="0.00" aria-label="Amount" />
          <InputGroupAddon align="inline-end">USD</InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon><AtSign /></InputGroupAddon>
          <InputGroupInput placeholder="username" aria-label="Username" />
          <InputGroupAddon align="inline-end">
            <kbd className="rounded border border-border bg-subtle px-1.5 font-sans text-[11px] text-muted-foreground">⌘K</kbd>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex flex-col gap-3">
        <InputGroup>
          <InputGroupInput readOnly value={show ? "sk-live-4b1e93ad2c7f3f9a" : "sk-live-••••••••••••3f9a"} aria-label="API key" className="font-mono text-[13px]" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-sm" aria-label={show ? "Hide" : "Show"} aria-pressed={show} onClick={() => setShow((s) => !s)}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={String(show)} {...swap} className="inline-flex">
                  {show ? <EyeOff /> : <Eye />}
                </motion.span>
              </AnimatePresence>
            </InputGroupButton>
            <InputGroupButton
              size="icon-sm"
              aria-label={copied ? "Copied" : "Copy"}
              onClick={() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 1400)
              }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={String(copied)} {...swap} className={copied ? "inline-flex text-success" : "inline-flex"}>
                  {copied ? <Check /> : <Copy />}
                </motion.span>
              </AnimatePresence>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon><Mail /></InputGroupAddon>
          <InputGroupInput type="email" placeholder="you@company.com" aria-label="Email" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant={subscribed ? "secondary" : "primary"} layout onClick={() => setSubscribed((s) => !s)}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={String(subscribed)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-1">
                  {subscribed ? <><Check /> Subscribed</> : "Subscribe"}
                </motion.span>
              </AnimatePresence>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup invalid>
          <InputGroupAddon><Link2 /></InputGroupAddon>
          <InputGroupInput defaultValue="htps:/facet" aria-label="URL" aria-invalid />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon align="block-start">
            <InputGroupText className="font-medium"><FileText /> release-notes.md</InputGroupText>
          </InputGroupAddon>
          <InputGroupTextarea placeholder="Ask, search or make anything…" aria-label="Prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <InputGroupAddon align="block-end">
            <InputGroupButton size="icon-sm" aria-label="Attach"><Paperclip /></InputGroupButton>
            <InputGroupButton><Sparkles /> Auto</InputGroupButton>
            <span className="flex-1" />
            <InputGroupText>52% used</InputGroupText>
            <InputGroupButton size="icon-sm" variant="primary" aria-label="Send" disabled={!prompt.trim()}>
              <ArrowUp />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}
