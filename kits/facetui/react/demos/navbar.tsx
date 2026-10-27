import * as React from "react"
import { Button } from "@/registry/facet/ui/button"
import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NavbarDesktopOnly,
  NavbarLink,
  NavbarLinks,
  NavbarMenuToggle,
  NavbarMobileLink,
  NavbarMobileMenu,
} from "@/registry/facet/ui/navbar"

const links = ["Product", "Components", "Pricing", "Docs"]

function DemoNavbar({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [active, setActive] = React.useState("Product")
  return (
    <Navbar defaultOpen={defaultOpen} className="rounded-facet-lg border">
      <NavbarContent>
        <NavbarBrand href="#" logo="F" onClick={(e) => e.preventDefault()}>Facet</NavbarBrand>
        <NavbarLinks>
          {links.map((l) => (
            <NavbarLink key={l} href="#" active={active === l} onClick={(e) => { e.preventDefault(); setActive(l) }}>{l}</NavbarLink>
          ))}
        </NavbarLinks>
        <NavbarActions>
          <NavbarDesktopOnly>
            <Button variant="ghost" size="sm">Sign in</Button>
          </NavbarDesktopOnly>
          <Button size="sm">Get started</Button>
          <NavbarMenuToggle />
        </NavbarActions>
      </NavbarContent>
      <NavbarMobileMenu>
        {links.map((l) => (
          <NavbarMobileLink key={l} href="#" active={active === l} onClick={(e) => { e.preventDefault(); setActive(l) }}>{l}</NavbarMobileLink>
        ))}
        <Button variant="outline" className="mt-2 w-full">Sign in</Button>
      </NavbarMobileMenu>
    </Navbar>
  )
}

export default function NavbarDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoNavbar />
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">Under 720px the links collapse into a menu</span>
        <div className="w-full max-w-[380px]">
          <DemoNavbar defaultOpen />
        </div>
      </div>
    </div>
  )
}
