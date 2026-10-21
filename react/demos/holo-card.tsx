import { HoloCard, HoloCardChip, HoloCardContent, HoloCardNumber } from "@/registry/facet/ui/holo-card"

export default function HoloCardDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-4">
      <HoloCard>
        <HoloCardContent className="flex items-center justify-between">
          <b className="text-base font-semibold">Facet Pro</b>
          <span className="rounded-full bg-highlight px-2 py-0.5 text-[11px] font-semibold text-highlight-foreground">Founding member</span>
        </HoloCardContent>
        <HoloCardContent>
          <div className="text-xs opacity-75">Member since 2026</div>
          <HoloCardNumber className="mt-1.5">MAYA RODRIGUEZ</HoloCardNumber>
        </HoloCardContent>
      </HoloCard>

      <HoloCard
        gradient="linear-gradient(135deg, color-mix(in srgb, var(--chart-2) 18%, var(--brand-950)), color-mix(in srgb, var(--chart-2) 38%, var(--brand-950)) 50%, var(--brand-950))"
      >
        <HoloCardContent className="flex items-center justify-between">
          <HoloCardChip />
          <b className="text-sm font-semibold">Northwind Bank</b>
        </HoloCardContent>
        <HoloCardContent>
          <HoloCardNumber>4242 •••• •••• 9018</HoloCardNumber>
          <div className="mt-2 flex justify-between text-xs opacity-80">
            <span>M. RODRIGUEZ</span>
            <span>08/28</span>
          </div>
        </HoloCardContent>
      </HoloCard>

      <HoloCard static gradient="linear-gradient(135deg, var(--chart-4), var(--brand-800))">
        <HoloCardContent className="text-sm font-semibold">Static</HoloCardContent>
        <HoloCardContent className="text-xs opacity-80">No tilt or glare (also used with reduced motion)</HoloCardContent>
      </HoloCard>
    </div>
  )
}
