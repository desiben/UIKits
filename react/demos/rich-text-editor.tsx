import { RichTextEditor } from "@/registry/facet/ui/rich-text-editor"

const initial = `<h2>Launch notes</h2><p>Facet v1.2 adds <b>50+ components</b>, style themes and AI agent examples. <i>Select some text</i> to see the bubble menu.</p><ul><li>New charts</li><li>AI chat primitives</li></ul>`

export default function RichTextEditorDemo() {
  return (
    <div className="mx-auto max-w-[640px]">
      <RichTextEditor defaultValue={initial} aria-label="Launch notes" placeholder="Write something…" />
    </div>
  )
}
