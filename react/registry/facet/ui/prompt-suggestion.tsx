"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/registry/facet/lib/utils"
import { spring, springSoft, stagger } from "@/registry/facet/lib/motion"

type Layout = "chips" | "cards"
const LayoutContext = React.createContext<Layout>("chips")

export interface PromptSuggestionsProps extends React.ComponentProps<typeof motion.div> {
  /** Pill chips for short prompts, cards for richer starters. */
  variant?: Layout
}

/** Group of suggestions; children stagger in. */
function PromptSuggestions({ variant: layout = "chips", className, ...props }: PromptSuggestionsProps) {
  return (
    <LayoutContext.Provider value={layout}>
      <motion.div
        data-slot="prompt-suggestions"
        data-layout={layout}
        role="group"
        className={cn(
          layout === "cards" ? "grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-2" : "flex flex-wrap gap-2",
          className
        )}
        variants={stagger(0.06, 0.05)}
        initial="hidden"
        animate="visible"
        {...props}
      />
    </LayoutContext.Provider>
  )
}

export interface PromptSuggestionProps extends Omit<React.ComponentProps<typeof motion.button>, "title" | "children"> {
  children?: React.ReactNode
  icon?: React.ReactNode
  /** Card title (cards layout). Children are used when omitted. */
  title?: React.ReactNode
  description?: React.ReactNode
}

/** A suggested prompt. It's a button: clicking it should fill or send the prompt. */
function PromptSuggestion({ icon, title, description, className, children, ...props }: PromptSuggestionProps) {
  const layout = React.useContext(LayoutContext)
  const card = layout === "cards"
  return (
    <motion.button
      type="button"
      data-slot="prompt-suggestion"
      variants={{
        hidden: { opacity: 0, y: 10, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: springSoft },
      }}
      whileHover={{ y: -2, transition: spring }}
      whileTap={{ scale: 0.97, transition: spring }}
      className={cn(
        "group/sug inline-flex cursor-pointer border border-border bg-card text-left text-[13px] font-medium text-foreground-secondary outline-none transition-[color,border-color,box-shadow] hover:border-brand-400 hover:text-foreground hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:shrink-0 [&_svg]:text-brand",
        card
          ? "flex-col items-start gap-1 rounded-facet-lg px-4 py-3 [&_svg]:mb-1 [&_svg]:size-[18px]"
          : "min-h-9 items-center gap-2 rounded-full px-3.5 py-1.5 [&_svg]:size-3.5",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="inline-flex transition-transform duration-300 group-hover/sug:-rotate-8 group-hover/sug:scale-110">{icon}</span>
      )}
      {card ? (
        <>
          <b className="font-semibold text-foreground">{title ?? children}</b>
          {description && <small className="text-xs font-normal text-muted-foreground">{description}</small>}
        </>
      ) : (
        (title ?? children)
      )}
    </motion.button>
  )
}

export { PromptSuggestions, PromptSuggestion }
