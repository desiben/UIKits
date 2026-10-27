"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { File, FileCode, FileSpreadsheet, FileText, Image as ImageIcon, X } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { ease, spring, springSoft } from "@/registry/facet/lib/motion"

/** Wraps attachments; removed items collapse and the rest slide over. */
function ChatAttachments({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="chat-attachments" className={cn("flex flex-wrap gap-2", className)} {...props}>
      <AnimatePresence mode="popLayout" initial={false}>
        {children}
      </AnimatePresence>
    </div>
  )
}

const kinds = {
  pdf: { icon: FileText, tone: "bg-rose-500" },
  doc: { icon: FileText, tone: "bg-brand-600" },
  sheet: { icon: FileSpreadsheet, tone: "bg-emerald-600" },
  image: { icon: ImageIcon, tone: "bg-sky-600" },
  code: { icon: FileCode, tone: "bg-violet-600" },
  file: { icon: File, tone: "bg-zinc-500" },
} as const
type Kind = keyof typeof kinds

function kindOf(name: string): Kind {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  if (ext === "pdf") return "pdf"
  if (["csv", "xls", "xlsx", "numbers", "tsv"].includes(ext)) return "sheet"
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"].includes(ext)) return "image"
  if (["doc", "docx", "txt", "md", "rtf"].includes(ext)) return "doc"
  if (["ts", "tsx", "js", "jsx", "json", "py", "css", "html", "sql"].includes(ext)) return "code"
  return "file"
}

export interface ChatAttachmentProps extends Omit<React.ComponentProps<typeof motion.div>, "children"> {
  name: string
  /** Human readable size, e.g. "2.4 MB". */
  size?: string
  /** File-type label; derived from the extension when omitted. */
  type?: string
  /** 0–100 while uploading; omit when done. */
  progress?: number
  /** Square image preview: an image URL (object URL for local files) or any CSS background. */
  preview?: string
  onRemove?: () => void
}

/** A file or image chip with type colour, size, upload progress and remove. */
function ChatAttachment({ name, size, type, progress, preview, onRemove, className, ...props }: ChatAttachmentProps) {
  const kind = kindOf(name)
  const { icon: Icon, tone } = kinds[kind]
  const uploading = progress != null && progress < 100
  const label = type ?? name.split(".").pop()?.toUpperCase()
  const isImage = preview != null
  const bg = preview && /^(blob:|data:|https?:|\/)/.test(preview) ? `center / cover no-repeat url("${preview}")` : preview

  return (
    <motion.div
      layout
      data-slot="chat-attachment"
      data-state={uploading ? "uploading" : "ready"}
      initial={{ opacity: 0, scale: 0.9, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.16, ease } }}
      transition={springSoft}
      className={cn(
        "group/att relative inline-flex max-w-[260px] items-center gap-2.5 overflow-hidden rounded-facet border border-border bg-card",
        isImage ? "size-[72px] p-0" : "py-1.5 pr-8 pl-1.5",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "relative grid shrink-0 place-items-center overflow-hidden text-primary-foreground [&_svg]:size-4",
          isImage ? "size-full" : cn("size-9 rounded-facet-sm", tone)
        )}
        style={isImage ? { background: bg } : undefined}
        aria-hidden={isImage ? undefined : true}
        role={isImage ? "img" : undefined}
        aria-label={isImage ? name : undefined}
      >
        {!isImage && <Icon />}
        <AnimatePresence>
          {uploading && (
            <motion.span className="absolute inset-0 bg-black/35" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          )}
        </AnimatePresence>
      </span>
      {!isImage && (
        <div className="min-w-0">
          <b className="block max-w-[170px] truncate text-[13px] font-medium text-foreground">{name}</b>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={uploading ? "up" : "done"}
              className="block text-xs text-muted-foreground tabular-nums"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={spring}
              aria-live="polite"
            >
              {uploading ? `Uploading… ${Math.round(progress)}%` : [label, size].filter(Boolean).join(" · ")}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
      <AnimatePresence>
        {uploading && (
          <motion.span
            className="absolute inset-x-1.5 bottom-[3px] h-0.5 overflow-hidden rounded-full bg-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.25 } }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Uploading ${name}`}
          >
            <motion.span className="block h-full rounded-full bg-primary" initial={false} animate={{ width: `${progress}%` }} transition={springSoft} />
          </motion.span>
        )}
      </AnimatePresence>
      {onRemove && (
        <motion.button
          type="button"
          aria-label={`Remove ${name}`}
          onClick={onRemove}
          whileTap={{ scale: 0.85 }}
          transition={spring}
          className={cn(
            "absolute top-1 right-1 grid size-[22px] cursor-pointer place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5",
            isImage && "bg-black/50 text-white opacity-0 group-hover/att:opacity-100 hover:bg-black/70 hover:text-white focus-visible:opacity-100"
          )}
        >
          <X />
        </motion.button>
      )}
    </motion.div>
  )
}

export { ChatAttachments, ChatAttachment }
