"use client"

import * as React from "react"
import { motion, type Variants } from "motion/react"
import { AspectRatio as AspectRatioPrimitive } from "radix-ui"

import { cn } from "@/registry/facet/lib/utils"
import { springSoft } from "@/registry/facet/lib/motion"

const frame: Variants = {
  rest: {},
  hover: {},
}
const media: Variants = {
  hidden: { opacity: 0, scale: 1.06, filter: "blur(8px)" },
  rest: { opacity: 1, scale: 1, filter: "blur(0px)", transition: springSoft },
  hover: { opacity: 1, scale: 1.045, filter: "blur(0px)", transition: springSoft },
}
const caption: Variants = {
  rest: { y: 0 },
  hover: { y: -3, transition: springSoft },
}

interface AspectRatioProps extends React.ComponentProps<typeof AspectRatioPrimitive.Root> {
  /** Zoom the media slightly when hovered. Defaults to true. */
  interactive?: boolean
  /** Fade and un-blur the media the first time it scrolls into view. Defaults to true. */
  reveal?: boolean
  frameClassName?: string
}

/**
 * Keeps media at a fixed ratio while it scales. The media eases into view the first time it is
 * seen and zooms a touch on hover; a caption lifts with it.
 */
function AspectRatio({ ratio = 16 / 9, className, frameClassName, interactive = true, reveal = true, children, ...props }: AspectRatioProps) {
  return (
    <motion.div
      data-slot="aspect-ratio"
      variants={frame}
      initial={reveal ? "hidden" : "rest"}
      whileInView="rest"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={interactive ? "hover" : undefined}
      className={cn("relative w-full overflow-hidden rounded-facet-lg bg-muted", frameClassName)}
    >
      <AspectRatioPrimitive.Root ratio={ratio} {...props}>
        <div className={cn("absolute inset-0", className)}>{children}</div>
      </AspectRatioPrimitive.Root>
    </motion.div>
  )
}

/** Media layer (img, video, iframe or any element) that fills and covers the frame. */
function AspectRatioMedia({ className, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      data-slot="aspect-ratio-media"
      variants={media}
      className={cn("absolute inset-0 size-full [&>img,&>video,&>iframe]:size-full [&>img,&>video,&>iframe]:object-cover", className)}
      {...props}
    />
  )
}

/** Small frosted caption pinned to the bottom-left corner. */
function AspectRatioCaption({ className, ...props }: React.ComponentProps<typeof motion.figcaption>) {
  return (
    <motion.figcaption
      data-slot="aspect-ratio-caption"
      variants={caption}
      className={cn(
        "absolute bottom-3 left-3 rounded-facet-sm bg-black/45 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-md",
        className
      )}
      {...props}
    />
  )
}

export { AspectRatio, AspectRatioMedia, AspectRatioCaption }
