import * as React from "react"
import { Database, RotateCcw, Send } from "lucide-react"
import { Button } from "@/registry/facet/ui/button"
import { ChatTool, type ChatToolState } from "@/registry/facet/ui/chat-tool"

export default function ChatToolDemo() {
  const [search, setSearch] = React.useState<ChatToolState>("running")
  const [email, setEmail] = React.useState<ChatToolState>("approval-requested")
  const reset = React.useCallback(() => {
    setSearch("running")
    setEmail("approval-requested")
    const t = setTimeout(() => setSearch("done"), 1400)
    return () => clearTimeout(t)
  }, [])
  React.useEffect(() => reset(), [reset])

  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-3">
      <ChatTool
        name="crm.search_deals"
        icon={<Database />}
        state={search}
        statusLabel="14 results"
        defaultOpen
        input={{ stage: "negotiation", minValue: 50000, closeBy: "2026-12-31" }}
        output={search === "done" ? [{ account: "Globex", value: 129500 }, { account: "Umbrella", value: 84000 }] : undefined}
      />
      <ChatTool
        name="email.send"
        icon={<Send />}
        state={email}
        input={{ to: "ops@globex.com", subject: "Checking in on your renewal" }}
        approvalMessage={
          <>
            Send <b>“Checking in on your renewal”</b> to <b>ops@globex.com</b>?
          </>
        }
        onApprove={() => {
          setEmail("approved")
          setTimeout(() => setEmail("done"), 1000)
        }}
        onDeny={() => setEmail("denied")}
      />
      <ChatTool name="billing.refund" state="error" input={{ invoice: "INV-2041" }} output={{ error: "Invoice already refunded" }} />
      <Button variant="outline" size="sm" className="self-center" onClick={reset}>
        <RotateCcw /> Reset
      </Button>
    </div>
  )
}
