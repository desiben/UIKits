import { Carousel, CarouselContent, CarouselDots, CarouselNext, CarouselPrevious, CarouselSlide } from "@/registry/facet/ui/carousel"

const slides = [
  { title: "Facet cut", description: "The signature corner", className: "" },
  { title: "6 brands", description: "Switch with one variable", className: "from-chart-5 to-brand-900" },
  { title: "Live code", description: "Tokens, CSS and React", className: "from-chart-4 to-chart-3" },
  { title: "Dark mode", description: "Every component", className: "from-foreground-secondary to-inverse dark:from-secondary dark:to-background" },
  { title: "Motion", description: "Springs, not keyframes", className: "from-chart-2 to-brand-800" },
]

export default function CarouselDemo() {
  return (
    <div className="flex flex-col gap-10">
      <Carousel peek label="Facet highlights" className="mx-auto max-w-[680px]">
        <CarouselContent>
          {slides.map((s) => (
            <CarouselSlide key={s.title} title={s.title} description={s.description} className={s.className} />
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>

      <Carousel label="Autoplay" autoplay={3500} className="mx-auto max-w-[420px]">
        <CarouselContent>
          {slides.slice(0, 3).map((s) => (
            <CarouselSlide key={s.title} title={s.title} description="Drag, swipe or use the arrow keys" className={s.className} />
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  )
}
