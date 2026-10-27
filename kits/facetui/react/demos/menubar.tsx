import * as React from "react"
import { Copy, File, Link2, Mail, Redo2, RefreshCw, Search, Undo2 } from "lucide-react"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/registry/facet/ui/menubar"

export default function MenubarDemo() {
  const [menu, setMenu] = React.useState("file")
  const [bookmarks, setBookmarks] = React.useState(true)
  const [urls, setUrls] = React.useState(false)
  const [profile, setProfile] = React.useState("maya")
  return (
    <div className="min-h-[340px]">
      <Menubar value={menu} onValueChange={setMenu} aria-label="Editor">
        <MenubarMenu value="file">
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem><File /> New tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
            <MenubarItem inset>New window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
            <MenubarItem inset disabled>New incognito window</MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger inset>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem><Mail /> Email link</MenubarItem>
                <MenubarItem><Link2 /> Copy link</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem inset>Print… <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu value="edit">
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem><Undo2 /> Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
            <MenubarItem><Redo2 /> Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarItem><Search /> Find… <MenubarShortcut>⌘F</MenubarShortcut></MenubarItem>
            <MenubarItem><Copy /> Copy <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu value="view">
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={bookmarks} onCheckedChange={(v) => setBookmarks(v === true)} onSelect={(e) => e.preventDefault()}>Always show bookmarks</MenubarCheckboxItem>
            <MenubarCheckboxItem checked={urls} onCheckedChange={(v) => setUrls(v === true)} onSelect={(e) => e.preventDefault()}>Always show full URLs</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem><RefreshCw /> Reload <MenubarShortcut>⌘R</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu value="profiles">
          <MenubarTrigger>Profiles</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={profile} onValueChange={setProfile}>
              <MenubarRadioItem value="maya" onSelect={(e) => e.preventDefault()}>Maya Chen</MenubarRadioItem>
              <MenubarRadioItem value="leo" onSelect={(e) => e.preventDefault()}>Leo Park</MenubarRadioItem>
              <MenubarRadioItem value="ana" onSelect={(e) => e.preventDefault()}>Ana Souza</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}
