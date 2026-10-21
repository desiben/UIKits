"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { CloudUpload, File as FileIcon, FileImage, FileText, X } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springBouncy, springSoft } from "@/registry/facet/lib/motion"

export interface DropzoneProps extends Omit<React.ComponentProps<"label">, "onDrop" | "title"> {
  /** Native accept string, e.g. "image/*,.pdf". */
  accept?: string
  multiple?: boolean
  disabled?: boolean
  /** Files larger than this (bytes) are passed to onReject instead of onDrop. */
  maxSize?: number
  onDrop?: (files: File[]) => void
  onReject?: (files: File[]) => void
  title?: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true
  return accept.split(",").some((raw) => {
    const a = raw.trim().toLowerCase()
    if (!a) return false
    if (a.startsWith(".")) return file.name.toLowerCase().endsWith(a)
    if (a.endsWith("/*")) return file.type.toLowerCase().startsWith(a.slice(0, -1))
    return file.type.toLowerCase() === a
  })
}

/**
 * File upload target. Lifts and glows while files are dragged over it; the icon hops up.
 * Keeps a real <input type="file"> inside so keyboard users can browse.
 */
function Dropzone({
  className,
  accept,
  multiple = true,
  disabled = false,
  maxSize,
  onDrop,
  onReject,
  title,
  hint,
  icon,
  children,
  ...props
}: DropzoneProps) {
  const [drag, setDrag] = React.useState(false)
  const depth = React.useRef(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handle = (list: FileList | null) => {
    if (!list || disabled) return
    const all = Array.from(list).slice(0, multiple ? undefined : 1)
    const ok = all.filter((f) => matchesAccept(f, accept) && (!maxSize || f.size <= maxSize))
    const bad = all.filter((f) => !ok.includes(f))
    if (ok.length) onDrop?.(ok)
    if (bad.length) onReject?.(bad)
  }

  return (
    <motion.label
      data-slot="dropzone"
      data-drag={drag || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "group/dropzone relative flex cursor-pointer flex-col items-center gap-2 rounded-facet-lg border-[1.5px] border-dashed border-border-strong bg-subtle px-6 py-8 text-center text-foreground-secondary transition-colors duration-200",
        "hover:border-primary hover:bg-primary-subtle data-[drag]:border-primary data-[drag]:bg-primary-subtle",
        "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      animate={{
        scale: drag ? 1.02 : 1,
        boxShadow: drag ? "0 0 0 4px color-mix(in oklab, var(--primary) 18%, transparent), 0 12px 32px -12px color-mix(in oklab, var(--primary) 45%, transparent)" : "0 0 0 0px transparent, 0 0 0 0 transparent",
      }}
      whileTap={{ scale: 0.99 }}
      transition={springSoft}
      onDragEnter={(e) => {
        e.preventDefault()
        if (disabled) return
        depth.current += 1
        setDrag(true)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) e.dataTransfer.dropEffect = "copy"
      }}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1)
        if (depth.current === 0) setDrag(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        depth.current = 0
        setDrag(false)
        handle(e.dataTransfer.files)
      }}
      {...(props as React.ComponentProps<typeof motion.label>)}
    >
      <motion.span
        aria-hidden="true"
        className="grid size-10 place-items-center rounded-facet bg-card text-brand shadow-sm [&_svg]:size-5"
        animate={drag ? { y: -6, scale: 1.12, rotate: [0, -6, 6, 0] } : { y: 0, scale: 1, rotate: 0 }}
        whileHover={{ y: -2 }}
        transition={drag ? { ...springBouncy, rotate: { duration: 0.4 } } : spring}
      >
        {icon ?? <CloudUpload />}
      </motion.span>
      <span className="text-sm font-medium text-foreground">
        {title ?? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={drag ? "drop" : "idle"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: durations.fast, ease }}
              className="inline-block"
            >
              {drag ? (
                "Release to upload"
              ) : (
                <>
                  Drop files or <span className="text-brand">browse</span>
                </>
              )}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
      {hint != null && <span className="text-xs text-muted-foreground">{hint}</span>}
      {children}
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          handle(e.target.files)
          e.target.value = ""
        }}
      />
    </motion.label>
  )
}

function DropzoneFileList({ className, children, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul data-slot="dropzone-file-list" className={cn("flex flex-col", className)} {...props}>
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </ul>
  )
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

export interface DropzoneFileProps extends Omit<React.ComponentProps<typeof motion.li>, "children"> {
  name: string
  size?: number
  type?: string
  /** 0–100; renders a progress bar until it reaches 100. */
  progress?: number
  error?: React.ReactNode
  onRemove?: () => void
  /** Position in the list, used to stagger the entrance. */
  index?: number
}

/** A row in the file list: slides in (staggered), springs its progress bar and collapses on removal. */
function DropzoneFile({ className, name, size, type = "", progress, error, onRemove, index = 0, ...props }: DropzoneFileProps) {
  const Icon = type.startsWith("image/") ? FileImage : type.includes("pdf") || type.startsWith("text/") ? FileText : FileIcon
  const done = progress == null || progress >= 100
  return (
    <motion.li
      layout
      data-slot="dropzone-file"
      initial={{ opacity: 0, height: 0, y: 8 }}
      animate={{ opacity: 1, height: "auto", y: 0, transition: { ...springSoft, delay: index * 0.05 } }}
      exit={{ opacity: 0, height: 0, x: 24, transition: { duration: durations.base, ease } }}
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <div className="mt-2 flex items-center gap-3 rounded-facet border border-border bg-card px-3 py-2.5">
        <span
          aria-hidden="true"
          className={cn("grid size-8 shrink-0 place-items-center rounded-facet-sm [&_svg]:size-4", error ? "bg-danger-subtle text-danger" : "bg-primary-subtle text-brand")}
        >
          <Icon />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-[13px] font-medium text-foreground">{name}</span>
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {error ? <span className="text-danger">{error}</span> : done ? (size != null ? formatBytes(size) : "Uploaded") : `${Math.round(progress!)}%`}
            </span>
          </div>
          <AnimatePresence initial={false}>
            {!done && !error && (
              <motion.div
                className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted"
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: durations.base, ease }}
              >
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={springSoft}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {onRemove && (
          <motion.button
            type="button"
            aria-label={`Remove ${name}`}
            onClick={onRemove}
            whileTap={{ scale: 0.85 }}
            transition={spring}
            className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-facet-sm text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4"
          >
            <X />
          </motion.button>
        )}
      </div>
    </motion.li>
  )
}

export { Dropzone, DropzoneFileList, DropzoneFile }
