import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/facet/ui/accordion"

const faqs = [
  ["brand", "Can I change the brand color?", "Yes — switch data-brand or set a custom brand colour; every component picks it up through the semantic tokens."],
  ["dark", "Does it support dark mode?", "Every semantic token has Light and Dark values. Add the .dark class to <html> and everything follows."],
  ["shadcn", "Is it compatible with shadcn/ui?", "Yes. Components ship as a shadcn registry and the theme maps onto shadcn's CSS variables."],
  ["motion", "Can I turn the animations off?", "Wrap your app in FacetMotion: it honours the OS reduce-motion setting for every component."],
]

export default function AccordionDemo() {
  return (
    <div className="mx-auto w-full max-w-[560px]">
      <Accordion type="single" collapsible defaultValue="brand">
        {faqs.map(([value, q, a]) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent>{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
