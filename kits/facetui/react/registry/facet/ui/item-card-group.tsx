"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/facet/lib/utils"
import { slideUp, spring, stagger } from "@/registry/facet/lib/motion"

type ItemCardGroupLayout = "spaced" | "joined" | "grid"

const GroupContext = React.createContext<ItemCardGroupLayout>("spaced")

interface ItemCardGroupProps extends Omit<HTMLMotionProps<"div">, "title" | "layout" | "children"> {
  children?: React.ReactNode
  layout?: ItemCardGroupLayout
  /** Overline header shown above the cards. */
  title?: React.ReactNode
  /** Trailing header content (e.g. a "Browse" link). */
  action?: React.ReactNode
}

function ItemCardGroup({ layout = "spaced", title, action, className, children, ...props }: ItemCardGroupProps) {
  return (
    <GroupContext.Provider value={layout}>
      <motion.div
        data-slot="item-card-group"
        data-layout={layout}
        role="group"
        initial="hidden"
        animate="visible"
        variants={stagger(0.045)}
        className={cn(
          "w-full",
          layout === "spaced" && "flex flex-col gap-2",
          layout === "joined" && "flex flex-col overflow-hidden rounded-facet-lg border border-border bg-card",
          layout === "grid" && "grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-2",
          className
        )}
        {...props}
      >
        {(title || action) && (
          <motion.header
            variants={slideUp}
            data-slot="item-card-group-header"
            className={cn(
              "flex items-baseline justify-between gap-2 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
              layout === "joined" && "px-4 pt-3 pb-1",
              layout === "grid" && "col-span-full"
            )}
          >
            <span>{title}</span>
            {action && <span className="normal-case tracking-normal text-[13px] font-medium">{action}</span>}
          </motion.header>
        )}
        {children}
      </motion.div>
    </GroupContext.Provider>
  )
}

const itemCardVariants = cva(
  "group/item-card relative flex w-full min-w-0 items-center gap-3 px-4 py-3 text-left text-foreground no-underline outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default: "rounded-facet-lg border border-border bg-card",
        secondary: "rounded-facet-lg border border-transparent bg-subtle",
        tertiary: "rounded-facet-lg border border-transparent bg-muted",
        outline: "rounded-facet-lg border border-border bg-transparent",
        transparent: "rounded-facet-lg border border-transparent bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const joinedClasses =
  "rounded-none border-0 bg-transparent [&+[data-slot=item-card]]:border-t [&+[data-slot=item-card]]:border-border-subtle focus-visible:ring-inset focus-visible:ring-offset-0"

type ItemCardProps = HTMLMotionProps<"div"> & VariantProps<typeof itemCardVariants>

function ItemCard({ className, variant, ...props }: ItemCardProps) {
  const layout = React.useContext(GroupContext)
  return (
    <motion.div
      data-slot="item-card"
      variants={slideUp}
      className={cn(itemCardVariants({ variant }), layout === "joined" && joinedClasses, className)}
      {...props}
    />
  )
}

type ItemCardLinkProps = HTMLMotionProps<"a"> & VariantProps<typeof itemCardVariants>

/** A pressable item card rendered as a link: hover surface, spring press and a nudging chevron. */
function ItemCardLink({ className, variant, ...props }: ItemCardLinkProps) {
  const layout = React.useContext(GroupContext)
  return (
    <motion.a
      data-slot="item-card"
      data-pressable=""
      variants={slideUp}
      whileTap={{ scale: layout === "joined" ? 0.99 : 0.98 }}
      transition={spring}
      className={cn(
        itemCardVariants({ variant }),
        "cursor-pointer hover:bg-accent",
        layout === "joined" && joinedClasses,
        className
      )}
      {...props}
    />
  )
}

type ItemCardButtonProps = HTMLMotionProps<"button"> & VariantProps<typeof itemCardVariants>

function ItemCardButton({ className, variant, type = "button", ...props }: ItemCardButtonProps) {
  const layout = React.useContext(GroupContext)
  return (
    <motion.button
      data-slot="item-card"
      data-pressable=""
      type={type}
      variants={slideUp}
      whileTap={{ scale: layout === "joined" ? 0.99 : 0.98 }}
      transition={spring}
      className={cn(
        itemCardVariants({ variant }),
        "cursor-pointer font-[inherit] hover:bg-accent",
        layout === "joined" && joinedClasses,
        className
      )}
      {...props}
    />
  )
}

function ItemCardIcon({ className, brand = false, ...props }: React.ComponentProps<"span"> & { brand?: boolean }) {
  return (
    <span
      data-slot="item-card-icon"
      aria-hidden="true"
      className={cn(
        "grid size-9 flex-none place-items-center rounded-facet bg-muted text-foreground transition-transform duration-300 [&_svg]:size-[18px]",
        "group-hover/item-card:[&_svg]:scale-110 [&_svg]:transition-transform",
        brand && "bg-primary-subtle text-brand",
        className
      )}
      {...props}
    />
  )
}

function ItemCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-card-content" className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)} {...props} />
}

function ItemCardTitle({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="item-card-title" className={cn("truncate text-sm font-medium", className)} {...props} />
}

function ItemCardDescription({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="item-card-description" className={cn("text-xs text-muted-foreground", className)} {...props} />
}

function ItemCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-card-action"
      className={cn(
        "flex flex-none items-center gap-2 text-muted-foreground [&>svg]:size-4 [&>svg]:transition-transform group-hover/item-card:[&>svg:last-child]:translate-x-0.5",
        className
      )}
      {...props}
    />
  )
}

export {
  ItemCardGroup,
  ItemCard,
  ItemCardLink,
  ItemCardButton,
  ItemCardIcon,
  ItemCardContent,
  ItemCardTitle,
  ItemCardDescription,
  ItemCardAction,
  itemCardVariants,
}
export type { ItemCardGroupLayout, ItemCardGroupProps }
