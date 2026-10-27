import * as React from "react"
import { Dropzone, DropzoneFile, DropzoneFileList } from "@/registry/facet/ui/dropzone"

type Item = { id: number; name: string; size: number; type: string; progress: number }
let uid = 0

export default function DropzoneDemo() {
  const [files, setFiles] = React.useState<Item[]>([
    { id: uid++, name: "brand-guidelines.pdf", size: 2_400_000, type: "application/pdf", progress: 100 },
    { id: uid++, name: "hero@2x.png", size: 860_000, type: "image/png", progress: 64 },
  ])

  React.useEffect(() => {
    const t = setInterval(() => {
      setFiles((fs) => (fs.some((f) => f.progress < 100) ? fs.map((f) => (f.progress < 100 ? { ...f, progress: Math.min(100, f.progress + 9) } : f)) : fs))
    }, 350)
    return () => clearInterval(t)
  }, [])

  const add = (list: File[]) => setFiles((fs) => [...fs, ...list.map((f) => ({ id: uid++, name: f.name, size: f.size, type: f.type, progress: 0 }))])

  return (
    <div className="mx-auto flex max-w-[460px] flex-col">
      <Dropzone maxSize={20 * 1024 * 1024} onDrop={add} hint="PNG, PDF or CSV up to 20 MB" />
      <DropzoneFileList>
        {files.map((f, i) => (
          <DropzoneFile key={f.id} index={i} name={f.name} size={f.size} type={f.type} progress={f.progress} onRemove={() => setFiles((fs) => fs.filter((x) => x.id !== f.id))} />
        ))}
      </DropzoneFileList>
      <button
        type="button"
        className="mt-3 w-fit cursor-pointer text-[13px] font-medium text-brand hover:underline"
        onClick={() => add([new File(["x".repeat(420_000)], `export-${uid}.csv`, { type: "text/csv" })])}
      >
        + Simulate a dropped file
      </button>
    </div>
  )
}
