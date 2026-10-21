import { ChatCitation, ChatSource, ChatSources } from "@/registry/facet/ui/chat-source"

export default function ChatSourceDemo() {
  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-3">
      <p className="m-0 text-sm leading-6 text-foreground-secondary">
        Northwind's renewal is on track{" "}
        <ChatCitation index={1} href="#" title="salesforce.com · Northwind renewal" description="Opportunity moved to Commit on Oct 14; signed order form expected Nov 2." />{" "}
        and usage is up 18% this month{" "}
        <ChatCitation index={2} href="#" title="mixpanel.com · Seat usage" description="Weekly active seats 412 → 486 over the last 30 days." />.
      </p>
      <ChatSources>
        <ChatSource href="#" index={1} title="salesforce.com · Northwind renewal" />
        <ChatSource href="#" index={2} title="mixpanel.com · Seat usage" />
        <ChatSource href="#" index="+3" title="More sources" />
      </ChatSources>
    </div>
  )
}
