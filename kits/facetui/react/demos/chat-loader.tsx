import { ChatLoader } from "@/registry/facet/ui/chat-loader"

export default function ChatLoaderDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 py-8">
      <ChatLoader variant="typing" />
      <ChatLoader variant="shimmer">Thinking…</ChatLoader>
      <ChatLoader variant="pulse">Searching 3 sources</ChatLoader>
      <ChatLoader variant="spinner">Running tools</ChatLoader>
    </div>
  )
}
