import type * as React from "react"
import { Bell, BookOpen, CircleHelp, Code, LayoutGrid, Layers, MessageSquare, PanelLeft, SlidersHorizontal, Sparkles } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuCard,
  NavigationMenuContent,
  NavigationMenuFeature,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/registry/facet/ui/navigation-menu"

const components = [
  { icon: <Bell />, title: "Alert Dialog", description: "Interrupts with important content." },
  { icon: <MessageSquare />, title: "Hover Card", description: "Preview content behind a link." },
  { icon: <SlidersHorizontal />, title: "Progress", description: "Shows completion of a task." },
  { icon: <PanelLeft />, title: "Scroll Area", description: "Slim, themed scrollbars." },
  { icon: <LayoutGrid />, title: "Tabs", description: "Layered sections of content." },
  { icon: <CircleHelp />, title: "Tooltip", description: "Info on hover or focus." },
]

const resources = [
  { title: "Changelog", description: "What shipped in every release." },
  { title: "Figma variants", description: "How components map to the kit." },
  { title: "Accessibility", description: "Keyboard and screen reader notes." },
]

const prevent = (e: React.MouseEvent) => e.preventDefault()

export default function NavigationMenuDemo() {
  return (
    <div className="flex min-h-[360px] items-start justify-center pt-2">
      <NavigationMenu defaultValue="start">
        <NavigationMenuList>
          <NavigationMenuItem value="start">
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent layout="feature">
              <NavigationMenuFeature
                href="#"
                onClick={prevent}
                icon={<Sparkles />}
                title="Facet UI"
                description="Tokens, components and motion in one kit."
              />
              <NavigationMenuCard href="#" onClick={prevent} icon={<BookOpen />} title="Introduction" description="Install and set up your theme." />
              <NavigationMenuCard href="#" onClick={prevent} icon={<Layers />} title="Theming" description="Brand colors, density and style themes." />
              <NavigationMenuCard href="#" onClick={prevent} icon={<Code />} title="Installation" description="Add components with npx facetui." />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="components">
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              {components.map((c) => (
                <NavigationMenuCard key={c.title} href="#" onClick={prevent} {...c} />
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="resources">
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent layout="list">
              {resources.map((r) => (
                <NavigationMenuCard key={r.title} href="#" onClick={prevent} {...r} />
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="docs">
            <NavigationMenuLink href="#" onClick={prevent}>
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
