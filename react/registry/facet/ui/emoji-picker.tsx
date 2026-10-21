"use client"

import * as React from "react"
import { AnimatePresence, LayoutGroup, motion, useAnimate } from "motion/react"
import { Apple, Clock, Dumbbell, Flag, Heart, Lightbulb, Plane, PawPrint, SearchIcon, Smile, XIcon } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { durations, ease, spring, springBouncy } from "@/registry/facet/lib/motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/facet/ui/popover"
import { ScrollArea } from "@/registry/facet/ui/scroll-area"

/* ------------------------------------------------------------------------------------------------
 * Data — a modest built-in set. "t" marks emoji that take a skin-tone modifier.
 * ----------------------------------------------------------------------------------------------*/

type EmojiData = { emoji: string; name: string; tone?: boolean }
type EmojiCategory = { id: string; label: string; icon: React.ReactNode; emojis: EmojiData[] }
type EmojiSelection = { emoji: string; name: string }

const e = (spec: string): EmojiData[] =>
  spec.split("|").map((s) => {
    const [raw, name, t] = s.trim().split(":")
    // Text-default symbols (e.g. ❤ ✈) get the emoji variation selector.
    const emoji = /\p{Emoji_Presentation}/u.test(raw) ? raw : raw + "\uFE0F"
    return { emoji, name, tone: t === "t" || undefined }
  })

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: "smileys",
    label: "Smileys & people",
    icon: <Smile />,
    emojis: e(
      "😀:grinning face|😃:grinning face with big eyes|😄:grinning face with smiling eyes|😁:beaming face|😆:grinning squinting face|😅:grinning face with sweat|🤣:rolling on the floor laughing|😂:face with tears of joy|🙂:slightly smiling face|😉:winking face|😊:smiling face with smiling eyes|😇:smiling face with halo|🥰:smiling face with hearts|😍:smiling face with heart-eyes|🤩:star-struck|😘:face blowing a kiss|😋:face savoring food|😜:winking face with tongue|🤪:zany face|🤗:hugging face|🤔:thinking face|🤨:face with raised eyebrow|😐:neutral face|😴:sleeping face|😎:smiling face with sunglasses|🤓:nerd face|🥳:partying face|😮:face with open mouth|😢:crying face|😭:loudly crying face|😤:face with steam from nose|😡:pouting face|🤯:exploding head|🥶:cold face|😱:face screaming in fear|🫠:melting face|👋:waving hand:t|👍:thumbs up:t|👎:thumbs down:t|👏:clapping hands:t|🙌:raising hands:t|🙏:folded hands:t|💪:flexed biceps:t|👌:ok hand:t|🤞:crossed fingers:t|👉:backhand index pointing right:t|🫶:heart hands:t|✍:writing hand:t"
    ),
  },
  {
    id: "nature",
    label: "Animals & nature",
    icon: <PawPrint />,
    emojis: e(
      "🐶:dog face|🐱:cat face|🐭:mouse face|🐹:hamster|🐰:rabbit face|🦊:fox|🐻:bear|🐼:panda|🐨:koala|🐯:tiger face|🦁:lion|🐮:cow face|🐷:pig face|🐸:frog|🐵:monkey face|🐔:chicken|🐧:penguin|🐦:bird|🦄:unicorn|🐝:honeybee|🦋:butterfly|🐢:turtle|🐙:octopus|🐬:dolphin|🌵:cactus|🌲:evergreen tree|🌿:herb|🍀:four leaf clover|🌸:cherry blossom|🌻:sunflower|🌈:rainbow|🔥:fire"
    ),
  },
  {
    id: "food",
    label: "Food & drink",
    icon: <Apple />,
    emojis: e(
      "🍏:green apple|🍎:red apple|🍐:pear|🍊:tangerine|🍋:lemon|🍌:banana|🍉:watermelon|🍇:grapes|🍓:strawberry|🍒:cherries|🍑:peach|🥭:mango|🍍:pineapple|🥑:avocado|🥦:broccoli|🌽:ear of corn|🥐:croissant|🍞:bread|🧀:cheese wedge|🍕:pizza|🍔:hamburger|🌮:taco|🍣:sushi|🍜:steaming bowl|🍩:doughnut|🍪:cookie|🎂:birthday cake|🍫:chocolate bar|☕:hot beverage|🍵:teacup without handle|🧋:bubble tea|🍷:wine glass"
    ),
  },
  {
    id: "activity",
    label: "Activities",
    icon: <Dumbbell />,
    emojis: e(
      "⚽:soccer ball|🏀:basketball|🏈:american football|⚾:baseball|🎾:tennis|🏐:volleyball|🏓:ping pong|🏸:badminton|⛳:flag in hole|🎯:bullseye|🎳:bowling|🎮:video game|🎲:game die|🧩:puzzle piece|🎨:artist palette|🎬:clapper board|🎤:microphone|🎧:headphone|🎸:guitar|🎹:musical keyboard|🏆:trophy|🥇:1st place medal|🎉:party popper|🎁:wrapped gift"
    ),
  },
  {
    id: "travel",
    label: "Travel & places",
    icon: <Plane />,
    emojis: e(
      "🚗:automobile|🚕:taxi|🚌:bus|🚲:bicycle|🛵:motor scooter|🚂:locomotive|✈:airplane|🚀:rocket|🛸:flying saucer|⛵:sailboat|🗺:world map|🏔:snow-capped mountain|🏖:beach with umbrella|🏝:desert island|🏕:camping|🏠:house|🏢:office building|🏰:castle|🗽:statue of liberty|🌋:volcano|🌅:sunrise|🌃:night with stars|🌍:globe showing europe-africa|🌙:crescent moon"
    ),
  },
  {
    id: "objects",
    label: "Objects",
    icon: <Lightbulb />,
    emojis: e(
      "💡:light bulb|📱:mobile phone|💻:laptop|⌨:keyboard|🖥:desktop computer|🖨:printer|📷:camera|🎥:movie camera|📚:books|📝:memo|📎:paperclip|📌:pushpin|✂:scissors|🔒:locked|🔑:key|🔨:hammer|🧰:toolbox|⚙:gear|🧪:test tube|🔭:telescope|💰:money bag|💳:credit card|📦:package|📅:calendar|⏰:alarm clock|🔔:bell|📣:megaphone|✉:envelope"
    ),
  },
  {
    id: "symbols",
    label: "Symbols",
    icon: <Heart />,
    emojis: e(
      "❤:red heart|🧡:orange heart|💛:yellow heart|💚:green heart|💙:blue heart|💜:purple heart|🖤:black heart|🤍:white heart|💔:broken heart|💖:sparkling heart|💯:hundred points|✨:sparkles|⭐:star|🌟:glowing star|⚡:high voltage|💥:collision|💬:speech balloon|💭:thought balloon|✅:check mark button|❌:cross mark|⚠:warning|❓:question mark|❗:exclamation mark|♻:recycling symbol|🔴:red circle|🟢:green circle|🔵:blue circle|➕:plus"
    ),
  },
  {
    id: "flags",
    label: "Flags",
    icon: <Flag />,
    emojis: e(
      "🏁:chequered flag|🚩:triangular flag|🏳:white flag|🏴:black flag|🏳️‍🌈:rainbow flag|🇺🇸:flag united states|🇬🇧:flag united kingdom|🇨🇦:flag canada|🇫🇷:flag france|🇩🇪:flag germany|🇮🇹:flag italy|🇪🇸:flag spain|🇳🇱:flag netherlands|🇸🇪:flag sweden|🇯🇵:flag japan|🇰🇷:flag south korea|🇮🇳:flag india|🇧🇷:flag brazil|🇲🇽:flag mexico|🇦🇺:flag australia|🇿🇦:flag south africa|🇺🇦:flag ukraine|🇺🇳:flag united nations|🇪🇺:flag european union"
    ),
  },
]

/** Default, light, medium-light, medium, medium-dark, dark. */
const TONES = ["", "\u{1F3FB}", "\u{1F3FC}", "\u{1F3FD}", "\u{1F3FE}", "\u{1F3FF}"]
const TONE_NAMES = ["Default", "Light", "Medium-light", "Medium", "Medium-dark", "Dark"]

function withTone(item: EmojiData, tone: number) {
  if (!item.tone || !tone) return item.emoji
  return Array.from(item.emoji)[0] + TONES[tone]
}

/* ------------------------------------------------------------------------------------------------
 * Pieces
 * ----------------------------------------------------------------------------------------------*/

type EmojiButtonProps = {
  item: EmojiData
  tone: number
  index: number
  focusIndex: number
  layout?: boolean
  onPick: (item: EmojiData, glyph: string, el: HTMLElement) => void
  onPreview: (item: EmojiData | null) => void
  onFocusIndex: (i: number) => void
}

function EmojiButton({ item, tone, index, focusIndex, layout, onPick, onPreview, onFocusIndex }: EmojiButtonProps) {
  const [scope, animate] = useAnimate<HTMLSpanElement>()
  const glyph = withTone(item, tone)
  return (
    <motion.button
      type="button"
      data-emoji-index={index}
      aria-label={item.name}
      tabIndex={index === focusIndex ? 0 : -1}
      className="grid aspect-square cursor-pointer place-items-center rounded-facet-sm text-[20px] leading-none outline-none hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
      layout={layout ? "position" : undefined}
      initial={layout ? { opacity: 0, scale: 0.6 } : false}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6, transition: { duration: durations.fast, ease } }}
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.9 }}
      transition={spring}
      onPointerEnter={() => onPreview(item)}
      onFocus={() => {
        onPreview(item)
        onFocusIndex(index)
      }}
      onClick={(ev) => {
        if (scope.current) animate(scope.current, { scale: [1, 1.45, 1], rotate: [0, -12, 0] }, { duration: 0.36, ease: "easeOut" })
        onPick(item, glyph, ev.currentTarget)
      }}
    >
      <span ref={scope} className="inline-block" aria-hidden="true">
        {glyph}
      </span>
    </motion.button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-10 bg-popover px-1 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * EmojiPicker
 * ----------------------------------------------------------------------------------------------*/

type EmojiPickerProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  onSelect?: (emoji: EmojiSelection) => void
  /** Replace the built-in emoji set. */
  categories?: EmojiCategory[]
  /** Emoji (glyphs) to pre-fill the "Recent" row with. */
  defaultRecent?: string[]
  defaultTone?: number
  /** Number of grid columns. */
  columns?: number
}

/**
 * Search, categories, skin tones and a live preview. The category indicator slides and follows the
 * scroll position, search results re-flow with layout animations, and the picked emoji pops and floats up.
 */
function EmojiPicker({
  className,
  onSelect,
  categories = EMOJI_CATEGORIES,
  defaultRecent = [],
  defaultTone = 0,
  columns = 8,
  ...props
}: EmojiPickerProps) {
  const id = React.useId()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const bodyRef = React.useRef<HTMLDivElement>(null)
  const lockRef = React.useRef<number>(0)
  const all = React.useMemo(() => categories.flatMap((c) => c.emojis), [categories])

  const [query, setQuery] = React.useState("")
  const [tone, setTone] = React.useState(defaultTone)
  const [tonesOpen, setTonesOpen] = React.useState(false)
  const [preview, setPreview] = React.useState<EmojiData | null>(null)
  const [focusIndex, setFocusIndex] = React.useState(0)
  const [recent, setRecent] = React.useState<EmojiData[]>(() =>
    defaultRecent.map((g) => all.find((x) => x.emoji === g)).filter((x): x is EmojiData => !!x)
  )
  const [bursts, setBursts] = React.useState<{ id: number; glyph: string; x: number; y: number }[]>([])

  const sections = React.useMemo(
    () => (recent.length ? [{ id: "recent", label: "Recent", icon: <Clock />, emojis: recent }, ...categories] : categories),
    [recent, categories]
  )
  const [active, setActive] = React.useState(sections[0]?.id ?? "")

  const q = query.trim().toLowerCase()
  const results = React.useMemo(() => (q ? all.filter((x) => x.name.includes(q)) : []), [all, q])

  // Flat index for roving focus across sections.
  const flat = q ? results : sections.flatMap((s) => s.emojis)

  const viewport = () => bodyRef.current?.closest<HTMLElement>("[data-slot=scroll-area-viewport]") ?? null

  // Scroll-spy: the active tab follows the section at the top of the list.
  React.useEffect(() => {
    const vp = viewport()
    if (!vp || q) return
    const onScroll = () => {
      if (Date.now() < lockRef.current) return
      const top = vp.getBoundingClientRect().top
      let current = sections[0]?.id
      for (const s of sections) {
        const el = vp.querySelector<HTMLElement>(`[data-section="${s.id}"]`)
        if (el && el.getBoundingClientRect().top - top <= 12) current = s.id
      }
      if (vp.scrollTop + vp.clientHeight >= vp.scrollHeight - 2) current = sections[sections.length - 1]?.id
      if (current) setActive(current)
    }
    vp.addEventListener("scroll", onScroll, { passive: true })
    return () => vp.removeEventListener("scroll", onScroll)
  }, [sections, q])

  // Clearing the search re-renders the list from the top.
  React.useEffect(() => {
    if (!q && Date.now() >= lockRef.current) setActive(sections[0]?.id ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const jumpTo = (sectionId: string) => {
    lockRef.current = Date.now() + 700
    setActive(sectionId)
    if (q) setQuery("")
    requestAnimationFrame(() => {
      const vp = viewport()
      const el = vp?.querySelector<HTMLElement>(`[data-section="${sectionId}"]`)
      if (!vp || !el) return
      lockRef.current = Date.now() + 700
      vp.scrollTo({ top: el.getBoundingClientRect().top - vp.getBoundingClientRect().top + vp.scrollTop, behavior: "smooth" })
    })
  }

  const pick = (item: EmojiData, glyph: string, el: HTMLElement) => {
    onSelect?.({ emoji: glyph, name: item.name })
    setRecent((prev) => [item, ...prev.filter((x) => x.emoji !== item.emoji)].slice(0, columns * 2))
    const root = rootRef.current?.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    if (root) setBursts((b) => [...b, { id: Date.now() + Math.random(), glyph, x: r.left - root.left + r.width / 2, y: r.top - root.top + r.height / 2 }])
  }

  const focusAt = (i: number) => {
    const next = Math.max(0, Math.min(flat.length - 1, i))
    setFocusIndex(next)
    bodyRef.current?.querySelector<HTMLElement>(`[data-emoji-index="${next}"]`)?.focus()
  }

  const onGridKey = (ev: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns }
    if (ev.key in map) {
      ev.preventDefault()
      focusAt(focusIndex + map[ev.key])
    } else if (ev.key === "Home") {
      ev.preventDefault()
      focusAt(0)
    } else if (ev.key === "End") {
      ev.preventDefault()
      focusAt(flat.length - 1)
    }
  }

  React.useEffect(() => setFocusIndex(0), [q])

  const shown = preview ?? (q ? results[0] : null)
  let index = 0
  const gridStyle = { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }

  return (
    <div
      ref={rootRef}
      data-slot="emoji-picker"
      className={cn(
        "relative flex w-[320px] max-w-full flex-col overflow-hidden rounded-facet-lg border border-border bg-popover text-popover-foreground shadow-lg",
        className
      )}
      {...props}
    >
      {/* Search */}
      <div className="border-b border-border-subtle p-2">
        <label className="relative flex items-center">
          <span className="sr-only">Search emoji</span>
          <SearchIcon aria-hidden="true" className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === "ArrowDown") {
                ev.preventDefault()
                focusAt(0)
              } else if (ev.key === "Enter" && q && results[0]) {
                ev.preventDefault()
                const btn = bodyRef.current?.querySelector<HTMLElement>(`[data-emoji-index="0"]`)
                btn?.click()
              }
            }}
            placeholder="Search emoji"
            className="h-8 w-full rounded-facet border border-input bg-background pr-8 pl-8 text-sm text-foreground outline-none placeholder:text-placeholder focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 [&::-webkit-search-cancel-button]:hidden"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                aria-label="Clear search"
                className="absolute right-1.5 grid size-5 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={spring}
                onClick={() => setQuery("")}
              >
                <XIcon className="size-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </label>
      </div>

      {/* Categories */}
      <LayoutGroup id={id}>
        <div role="tablist" aria-label="Emoji categories" className="flex gap-0.5 border-b border-border-subtle px-2 py-1">
          <AnimatePresence initial={false}>
            {sections.map((s) => {
              const selected = !q && active === s.id
              return (
                <motion.button
                  key={s.id}
                  layout
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={s.label}
                  title={s.label}
                  className={cn(
                    "relative isolate grid h-[30px] flex-1 cursor-pointer place-items-center rounded-facet-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4",
                    selected ? "text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  whileTap={{ scale: 0.9 }}
                  transition={spring}
                  onClick={() => jumpTo(s.id)}
                >
                  {selected && (
                    <motion.span layoutId="emoji-cat" transition={spring} className="absolute inset-0 -z-10 rounded-[inherit] bg-accent">
                      <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary" />
                    </motion.span>
                  )}
                  {s.icon}
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      {/* Grid */}
      <ScrollArea bare className="h-[228px]" label="Emoji">
        <div ref={bodyRef} className="px-2 pb-2" onKeyDown={onGridKey}>
          {q ? (
            <div>
              <SectionLabel>
                {results.length} result{results.length === 1 ? "" : "s"}
              </SectionLabel>
              <div className="grid" style={gridStyle}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {results.map((item, i) => (
                    <EmojiButton
                      key={item.emoji}
                      item={item}
                      tone={tone}
                      index={i}
                      focusIndex={focusIndex}
                      layout
                      onPick={pick}
                      onPreview={setPreview}
                      onFocusIndex={setFocusIndex}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {results.length === 0 && (
                  <motion.p
                    className="flex flex-col items-center gap-1 py-10 text-center text-sm text-muted-foreground"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="text-2xl" aria-hidden="true">
                      🔍
                    </span>
                    No emoji match “{query}”
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ) : (
            sections.map((s) => (
              <section key={s.id} data-section={s.id} aria-label={s.label}>
                <SectionLabel>{s.label}</SectionLabel>
                <div className="grid" style={gridStyle}>
                  {s.emojis.map((item) => {
                    const i = index++
                    return (
                      <EmojiButton
                        key={item.emoji}
                        item={item}
                        tone={tone}
                        index={i}
                        focusIndex={focusIndex}
                        layout={s.id === "recent"}
                        onPick={pick}
                        onPreview={setPreview}
                        onFocusIndex={setFocusIndex}
                      />
                    )
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer: preview + skin tone */}
      <div className="flex h-11 items-center gap-2 border-t border-border-subtle px-3" onPointerLeave={() => setPreview(null)}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={shown ? shown.emoji : "none"}
            className="flex min-w-0 flex-1 items-center gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: durations.fast, ease }}
          >
            {shown ? (
              <>
                <span className="text-[22px] leading-none" aria-hidden="true">
                  {withTone(shown, tone)}
                </span>
                <span className="truncate text-[13px] font-medium text-foreground-secondary first-letter:uppercase">{shown.name}</span>
              </>
            ) : (
              <span className="truncate text-[13px] text-muted-foreground">Pick an emoji…</span>
            )}
          </motion.span>
        </AnimatePresence>
        <div role="radiogroup" aria-label="Skin tone" className="flex items-center gap-0.5">
          <AnimatePresence initial={false}>
            {TONES.map((_, t) =>
              tonesOpen || t === tone ? (
                <motion.button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={t === tone}
                  aria-label={`${TONE_NAMES[t]} skin tone`}
                  title={tonesOpen ? `${TONE_NAMES[t]} skin tone` : "Skin tone"}
                  className={cn(
                    "grid size-7 cursor-pointer place-items-center rounded-facet-sm text-base leading-none outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
                    tonesOpen && t === tone && "bg-accent"
                  )}
                  layout
                  initial={{ opacity: 0, scale: 0.4, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: 28 }}
                  exit={{ opacity: 0, scale: 0.4, width: 0 }}
                  transition={{ ...spring, delay: tonesOpen ? t * 0.025 : 0 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => {
                    if (tonesOpen) {
                      setTone(t)
                      setTonesOpen(false)
                    } else setTonesOpen(true)
                  }}
                >
                  <span aria-hidden="true">{"✋" + TONES[t]}</span>
                </motion.button>
              ) : null
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Picked emoji floats up */}
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.span
            key={b.id}
            aria-hidden="true"
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 text-[22px] leading-none"
            style={{ left: b.x, top: b.y }}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -44, scale: 1.7, transition: { ...springBouncy, opacity: { duration: 0.55, ease } } }}
            onAnimationComplete={() => setBursts((all) => all.filter((x) => x.id !== b.id))}
          >
            {b.glyph}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Popover wrapper
 * ----------------------------------------------------------------------------------------------*/

type EmojiPickerPopoverProps = EmojiPickerProps & {
  /** The trigger element (rendered asChild). */
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Close after an emoji is picked. */
  closeOnSelect?: boolean
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}

/** The picker in a Facet popover that pops from its trigger. */
function EmojiPickerPopover({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  closeOnSelect = true,
  side = "bottom",
  align = "start",
  onSelect,
  className,
  ...props
}: EmojiPickerPopoverProps) {
  const [inner, setInner] = React.useState(defaultOpen)
  const open = openProp ?? inner
  const setOpen = (o: boolean) => {
    if (openProp === undefined) setInner(o)
    onOpenChange?.(o)
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side={side} align={align} className="w-auto overflow-hidden p-0">
        <EmojiPicker
          className={cn("rounded-none border-0 shadow-none", className)}
          onSelect={(sel) => {
            onSelect?.(sel)
            if (closeOnSelect) setTimeout(() => setOpen(false), 180)
          }}
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}

export { EmojiPicker, EmojiPickerPopover, EMOJI_CATEGORIES }
export type { EmojiCategory, EmojiData, EmojiSelection }
