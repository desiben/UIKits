"use client"

import * as React from "react"
import { motion, useAnimate } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/registry/facet/lib/utils"
import { spring } from "@/registry/facet/lib/motion"

const nativeSelectVariants = cva(
  "w-full cursor-pointer appearance-none rounded-facet border border-input bg-card pl-3 pr-9 text-foreground outline-none transition-[border-color,box-shadow] duration-150 hover:border-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/25 disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-placeholder",
  {
    variants: {
      size: {
        sm: "h-8 text-[13px]",
        md: "h-9 text-sm",
        lg: "h-11 text-[15px]",
      },
    },
    defaultVariants: { size: "md" },
  }
)

export interface NativeSelectProps
  extends Omit<React.ComponentProps<"select">, "size">,
    VariantProps<typeof nativeSelectVariants> {
  wrapperClassName?: string
}

/**
 * The browser's own <select>, dressed as a Facet input. Presses give a soft squeeze, the chevron
 * nods on change and an invalid state arrives with a short shake.
 */
function NativeSelect({ className, wrapperClassName, size, onChange, children, ...props }: NativeSelectProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const chevron = React.useRef<SVGSVGElement>(null)
  const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true"
  const first = React.useRef(true)

  React.useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (invalid && scope.current) animate(scope.current, { x: [0, -5, 5, -3, 3, 0] }, { duration: 0.35 })
  }, [invalid, animate, scope])

  return (
    <motion.div
      ref={scope}
      data-slot="native-select-wrapper"
      className={cn("group/ns relative w-full", wrapperClassName)}
      whileTap={props.disabled ? undefined : { scale: 0.985 }}
      transition={spring}
    >
      <select
        data-slot="native-select"
        className={cn(nativeSelectVariants({ size }), className)}
        onChange={(e) => {
          if (chevron.current) animate(chevron.current, { y: [0, 3, 0] }, { duration: 0.3 })
          onChange?.(e)
        }}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        ref={chevron}
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-placeholder transition-colors group-hover/ns:text-muted-foreground group-focus-within/ns:text-brand"
      />
    </motion.div>
  )
}

function NativeSelectOption(props: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />
}

function NativeSelectOptGroup(props: React.ComponentProps<"optgroup">) {
  return <optgroup data-slot="native-select-optgroup" {...props} />
}

export { NativeSelect, NativeSelectOption, NativeSelectOptGroup, nativeSelectVariants }
