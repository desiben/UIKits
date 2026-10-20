/* Facet UI v1.3 registry — shadcn/ui parity: every shadcn/ui component now has a Facet counterpart. */
(function () {
  const i = (n, c = "") => `<svg class="icon${c ? " " + c : ""}" aria-hidden="true"><use href="#${n}"/></svg>`;
  const add = (o) => window.FACET_REGISTRY.push({ isNew: true, since: "1.3", ...o });
  const opt = (v, label, sel, ic = "") => `<button class="menu-item" role="option" data-value="${v}" aria-selected="${!!sel}">${ic ? i(ic) : ""}${label}${i("check", "check-mark")}</button>`;
  const FRAMEWORKS = [["next", "Next.js"], ["remix", "Remix"], ["astro", "Astro"], ["nuxt", "Nuxt"], ["svelte", "SvelteKit"], ["solid", "SolidStart"]];

  /* ------------------------------ Actions ------------------------------ */
  add({ slug: "button-group", name: "Button Group", group: "Actions", figma: "Button Group · Outline · Split · With Input · Vertical",
    desc: "Joins related buttons into one control: shared borders, one outer corner shape. Works with outline, solid and ghost buttons, a split dropdown, text addons and inputs.",
    examples: [
      { title: "Outline group", html: `<div class="btn-group" role="group" aria-label="Message actions"><button class="btn btn-outline btn-sm">${i("archive", "icon-sm")} Archive</button><button class="btn btn-outline btn-sm">Report</button><button class="btn btn-outline btn-sm">Snooze</button><button class="btn btn-outline btn-sm icon-btn" aria-label="More">${i("ellipsis", "icon-sm")}</button></div>` },
      { title: "Split button", html: `<div class="btn-group" role="group" aria-label="Save"><button class="btn btn-sm">Save changes</button><div class="dropdown dropdown-end"><button class="btn btn-sm icon-btn" data-dropdown-trigger aria-haspopup="menu" aria-expanded="false" aria-label="More save options">${i("chevron-down", "icon-sm")}</button><div class="menu" role="menu"><button class="menu-item" role="menuitem">${i("copy")} Save as copy</button><button class="menu-item" role="menuitem">${i("file-text")} Save as draft</button><button class="menu-item" role="menuitem">${i("clock")} Schedule…</button></div></div></div>` },
      { title: "With text and input", html: `<div class="stack" style="--gap:12px;align-items:flex-start"><div class="btn-group"><span class="btn-group-text">https://</span><input class="input input-sm" style="width:200px" value="facet.dev" aria-label="Domain"><button class="btn btn-outline btn-sm">${i("copy", "icon-sm")} Copy</button></div><div class="btn-group" role="group" aria-label="Quantity"><button class="btn btn-outline btn-sm icon-btn" aria-label="Decrease">${i("minus", "icon-sm")}</button><span class="btn-group-text" style="min-width:44px;justify-content:center;background:var(--bg-surface)">12</span><button class="btn btn-outline btn-sm icon-btn" aria-label="Increase">${i("plus", "icon-sm")}</button></div></div>` },
      { title: "Vertical", html: `<div class="btn-group btn-group-vertical" role="group" aria-label="Alignment" style="width:160px"><button class="btn btn-outline btn-sm">${i("align-left", "icon-sm")} Left</button><button class="btn btn-outline btn-sm">${i("text-cursor", "icon-sm")} Center</button><button class="btn btn-outline btn-sm">${i("list", "icon-sm")} Justify</button></div>` }],
    react: `<ButtonGroup aria-label="Message actions">
  <Button variant="outline">Archive</Button>
  <Button variant="outline">Report</Button>
  <ButtonGroupSeparator />
  <Button variant="outline" size="icon" aria-label="More"><MoreHorizontal /></Button>
</ButtonGroup>`,
    api: [["btn-group", "class", "Horizontal group (default)"], ["btn-group-vertical", "modifier", "Stack vertically"], ["btn-group-text", "class", "Static text addon"], ["btn-group-sep", "class", "Separator between solid buttons"]],
    a11y: ["Give the wrapper role=\"group\" and an aria-label.", "Icon-only buttons need their own aria-label."] });

  /* ------------------------------ Forms ------------------------------ */
  add({ slug: "input-group", name: "Input Group", group: "Forms", figma: "Input Group · Icon + Text · Prefix + Suffix · Button · Textarea",
    desc: "One bordered control that holds an input plus addons: icons, text, kbd hints, inline buttons, or a toolbar above or below a textarea. Focus rings the whole group.",
    examples: [
      { title: "Addons", html: `<div class="stack" style="--gap:12px;width:340px">
  <div class="input-shell"><span class="input-shell-addon">${i("search")}</span><input placeholder="Search…" aria-label="Search"><span class="input-shell-addon"><span class="t-caption text-tertiary">12 results</span></span></div>
  <div class="input-shell"><span class="input-shell-addon" data-tone="muted">https://</span><input value="facet" aria-label="Subdomain"><span class="input-shell-addon" data-tone="muted">.dev</span></div>
  <div class="input-shell"><span class="input-shell-addon">$</span><input inputmode="decimal" placeholder="0.00" aria-label="Amount"><span class="input-shell-addon">USD</span></div>
  <div class="input-shell"><span class="input-shell-addon">${i("at-sign")}</span><input placeholder="username" aria-label="Username"><span class="input-shell-addon"><span class="kbd">⌘K</span></span></div>
</div>` },
      { title: "Inline buttons", html: `<div class="stack" style="--gap:12px;width:340px">
  <div class="input-shell"><input value="sk-live-••••••••••••3f9a" readonly aria-label="API key"><span class="input-shell-addon"><button class="btn btn-ghost btn-sm icon-btn" aria-label="Show">${i("eye", "icon-sm")}</button><button class="btn btn-ghost btn-sm icon-btn" aria-label="Copy">${i("copy", "icon-sm")}</button></span></div>
  <div class="input-shell"><span class="input-shell-addon">${i("mail")}</span><input type="email" placeholder="you@company.com" aria-label="Email"><span class="input-shell-addon"><button class="btn btn-sm">Subscribe</button></span></div>
  <div class="input-shell" data-invalid="true"><span class="input-shell-addon">${i("link")}</span><input value="htps:/facet" aria-label="URL" aria-invalid="true"></div>
</div>` },
      { title: "Textarea with toolbar", html: `<div class="input-shell" data-block style="width:420px">
  <span class="input-shell-addon" data-align="block-start"><span class="t-label-xs text-tertiary">${i("file-text", "icon-sm")} release-notes.md</span></span>
  <textarea placeholder="Ask, search or make anything…" aria-label="Prompt"></textarea>
  <span class="input-shell-addon" data-align="block-end"><button class="btn btn-ghost btn-sm icon-btn" aria-label="Attach">${i("paperclip", "icon-sm")}</button><button class="btn btn-ghost btn-sm">${i("sparkles", "icon-sm")} Auto</button><span class="grow"></span><span class="t-caption text-tertiary">52% used</span><button class="btn btn-sm icon-btn" aria-label="Send">${i("arrow-up", "icon-sm")}</button></span>
</div>` }],
    react: `<InputGroup>
  <InputGroupAddon><Search /></InputGroupAddon>
  <InputGroupInput placeholder="Search…" />
  <InputGroupAddon align="inline-end"><InputGroupButton>Search</InputGroupButton></InputGroupAddon>
</InputGroup>`,
    api: [["input-shell", "class", "Bordered wrapper; put a bare input or textarea inside"], ["input-shell-addon", "class", "Icon, text, kbd or buttons"], ["data-tone=\"muted\"", "addon", "Filled prefix/suffix segment"], ["data-block + data-align=\"block-start|block-end\"", "attribute", "Toolbar above or below a textarea"], ["data-invalid / data-disabled", "attribute", "States"]],
    a11y: ["The inner input still needs a label (visible or aria-label).", "Icon-only addon buttons need an aria-label."] });

  add({ slug: "label", name: "Label", group: "Forms", figma: "Label · Default · Required · Optional · Disabled",
    desc: "Accessible text for a control. Clicking it focuses or toggles the control. Shows required and optional markers and dims with a disabled control.",
    examples: [{ title: "Labels", html: `<div class="stack" style="--gap:16px;width:300px">
  <div class="field"><label class="label" for="lb1">Email <span class="req" aria-hidden="true">*</span></label><input class="input" id="lb1" type="email" placeholder="you@company.com" required></div>
  <div class="field"><label class="label" for="lb2">Company <span class="opt">(optional)</span></label><input class="input" id="lb2" placeholder="Northwind"></div>
  <label class="check"><input type="checkbox" checked> <span>Accept terms and conditions</span></label>
  <div class="field"><label class="label" data-disabled="true" for="lb3">Workspace ID</label><input class="input" id="lb3" value="ws_8f2a91" disabled></div>
</div>` }],
    react: `<Label htmlFor="email">Email</Label>\n<Input id="email" type="email" />`,
    api: [["label", "class", "Label text"], ["req · opt", "child class", "Required / optional marker"], ["label-row", "class", "Inline label around a checkbox, radio or switch"], ["data-disabled", "attribute", "Dims the label"]],
    a11y: ["Connect with for/id or wrap the control.", "Mark required fields with the required attribute too — the asterisk is visual only."] });

  add({ slug: "select", name: "Select", group: "Forms", figma: "Select · Placeholder · Filled · Hover · Open · Error · Disabled",
    desc: "A styled listbox for picking one value (or several) from a list, with groups, icons and a check on the chosen option. Use Native Select on mobile-heavy forms.",
    examples: [
      { title: "Single", html: `<div class="stack" style="--gap:12px;width:260px;margin-bottom:200px"><div class="dropdown" data-select style="width:100%"><button class="select-trigger" data-dropdown-trigger aria-haspopup="listbox" aria-expanded="false" aria-label="Fruit"><span class="value" data-placeholder="Select a fruit"></span>${i("chevrons-up-down")}</button><div class="menu listbox" role="listbox"><div class="menu-label">Fruits</div>${opt("apple", "Apple")}${opt("banana", "Banana")}${opt("blueberry", "Blueberry")}${opt("grapes", "Grapes")}<div class="menu-sep"></div><div class="menu-label">Vegetables</div>${opt("carrot", "Carrot")}${opt("leek", "Leek")}</div></div>
<div class="dropdown" data-select style="width:100%"><button class="select-trigger" data-dropdown-trigger aria-haspopup="listbox" aria-expanded="false" aria-label="Plan"><span class="value"></span>${i("chevrons-up-down")}</button><div class="menu listbox" role="listbox">${opt("free", "Free", false, "user")}${opt("pro", "Pro", true, "zap")}${opt("team", "Team", false, "users")}${opt("ent", "Enterprise", false, "building-2")}</div></div>
<button class="select-trigger" disabled aria-label="Region"><span class="value">EU (Frankfurt)</span>${i("chevrons-up-down")}</button></div>` },
      { title: "Multiple", html: `<div class="dropdown" data-select data-multiple style="width:300px;margin-bottom:220px"><button class="select-trigger" data-dropdown-trigger aria-haspopup="listbox" aria-expanded="false" aria-label="Labels"><span class="value" data-placeholder="Add labels"></span>${i("chevrons-up-down")}</button><div class="menu listbox" role="listbox" aria-multiselectable="true">${opt("bug", "Bug", true)}${opt("feature", "Feature", true)}${opt("docs", "Docs")}${opt("design", "Design")}${opt("perf", "Performance")}</div></div>` }],
    react: `<Select defaultValue="pro">
  <SelectTrigger><SelectValue placeholder="Select a plan" /></SelectTrigger>
  <SelectContent>
    <SelectGroup><SelectLabel>Plans</SelectLabel><SelectItem value="free">Free</SelectItem><SelectItem value="pro">Pro</SelectItem></SelectGroup>
  </SelectContent>
</Select>`,
    api: [["dropdown[data-select]", "wrapper", "Turns a dropdown into a select"], ["data-multiple", "attribute", "Multi-select; the menu stays open"], ["select-trigger > .value[data-placeholder]", "class", "Shows the selection or placeholder"], ["menu-item[role=option][aria-selected]", "option", "Option + selected state"], ["facet:change", "event", "detail.value"]],
    a11y: ["Trigger has aria-haspopup=\"listbox\"; options use role=\"option\" with aria-selected.", "Arrow keys move, Enter selects, Escape closes."] });

  add({ slug: "combobox", name: "Combobox", group: "Forms", figma: "Select · Combobox · Open",
    desc: "A select with a search box: type to filter, Enter to pick the first match. Shows an empty state when nothing matches. Works single or multiple.",
    examples: [
      { title: "Single", html: `<div class="dropdown" data-select data-combobox style="width:260px;margin-bottom:300px"><button class="select-trigger" data-dropdown-trigger aria-haspopup="listbox" aria-expanded="false" aria-label="Framework"><span class="value" data-placeholder="Select framework…"></span>${i("chevrons-up-down")}</button><div class="menu listbox" role="listbox"><div class="combobox-search">${i("search")}<input placeholder="Search framework…" aria-label="Search framework" role="combobox" aria-autocomplete="list"></div>${FRAMEWORKS.map(([v, l]) => opt(v, l)).join("")}<div class="combobox-empty">No framework found.</div></div></div>` },
      { title: "Multiple with chips", html: `<div class="dropdown" data-select data-combobox data-multiple style="width:340px;margin-bottom:280px"><button class="select-trigger" data-dropdown-trigger aria-haspopup="listbox" aria-expanded="false" aria-label="Assignees" style="height:auto;min-height:var(--control-height-md);padding-top:5px;padding-bottom:5px"><span class="combobox-chips"></span><span class="value" data-placeholder="Assign people…"></span>${i("chevrons-up-down")}</button><div class="menu listbox" role="listbox" aria-multiselectable="true"><div class="combobox-search">${i("search")}<input placeholder="Search people…" aria-label="Search people"></div>${[["ada", "Ada Lovelace", true], ["grace", "Grace Hopper", true], ["alan", "Alan Turing"], ["linus", "Linus Torvalds"], ["margaret", "Margaret Hamilton"]].map(([v, l, s]) => opt(v, l, s, "user")).join("")}<div class="combobox-empty">No people found.</div></div></div>` }],
    react: `<Combobox items={frameworks} value={value} onValueChange={setValue}>
  <ComboboxInput placeholder="Select framework…" />
  <ComboboxContent><ComboboxEmpty>No framework found.</ComboboxEmpty><ComboboxList>{(item) => <ComboboxItem value={item}>{item.label}</ComboboxItem>}</ComboboxList></ComboboxContent>
</Combobox>`,
    api: [["dropdown[data-select][data-combobox]", "wrapper", "Select + search"], ["combobox-search", "class", "Search field at the top of the list"], ["combobox-empty", "class", "Shown when nothing matches"], ["combobox-chips", "class", "Chips for multiple selection"]],
    a11y: ["The search input gets role=\"combobox\" and aria-autocomplete=\"list\".", "↓ from the search moves into the list; Enter picks the first match."] });

  add({ slug: "textarea", name: "Textarea", group: "Forms", figma: "Textarea · Default · Focus · Error · Disabled",
    desc: "Multi-line text input with an optional character counter and auto-grow. Uses the same border, focus and error tokens as Input.",
    examples: [{ title: "Textarea", html: `<div class="stack" style="--gap:16px;width:360px">
  <div class="field"><label class="label" for="ta1">Bio</label><div class="textarea-wrap"><textarea class="textarea" id="ta1" maxlength="160" placeholder="Tell us a little about yourself"></textarea><span class="textarea-count" aria-live="polite"></span></div><span class="help">Shown on your public profile.</span></div>
  <div class="field"><label class="label" for="ta2">Notes (auto-grow)</label><textarea class="textarea" id="ta2" data-autosize rows="2" placeholder="Type a few lines…"></textarea></div>
  <div class="field" data-invalid="true"><label class="label" for="ta3">Reason</label><textarea class="textarea" id="ta3" aria-invalid="true" aria-describedby="ta3h">x</textarea><span class="help" id="ta3h">Please give at least 20 characters.</span></div>
  <textarea class="textarea" disabled aria-label="Disabled">Locked by an admin.</textarea>
</div>` }],
    react: `<Textarea placeholder="Tell us a little about yourself" maxLength={160} />`,
    api: [["textarea", "class", "Base"], ["textarea-wrap + textarea-count", "class", "Live counter (uses maxlength)"], ["data-autosize", "attribute", "Grows with content"], ["aria-invalid", "attribute", "Error state"]],
    a11y: ["Link help and error text with aria-describedby.", "The counter is aria-live so screen readers hear the limit."] });

  add({ slug: "questionnaire", name: "Questionnaire", group: "Forms", figma: "Questionnaire · Q Option · Single · Multiple · Freeform · Summary",
    desc: "A multi-step question flow for agent clarifications, onboarding and surveys: single or multiple choice, an Other field, freeform answers, skippable steps, number-key shortcuts and a summary.",
    examples: [{ title: "Agent clarification", html: `<div class="questionnaire" tabindex="-1">
  <div class="q-head"><span class="q-count">1 of 3</span><div class="progress" role="presentation"><div style="width:33%"></div></div><span>${i("sparkles", "icon-sm")} Facet AI</span></div>
  <section class="q-step" data-key="Audience" data-required><h4>Who is this report for?</h4><p>I'll adjust depth and tone.</p><div class="q-options" role="radiogroup">
    <label class="q-option"><input type="radio" name="qa" value="Executives"><span class="kbd">1</span><span>Executives<small>One page, headline numbers</small></span>${i("check", "q-check")}</label>
    <label class="q-option"><input type="radio" name="qa" value="Sales team"><span class="kbd">2</span><span>Sales team<small>Deal-level detail</small></span>${i("check", "q-check")}</label>
    <label class="q-option"><input type="radio" name="qa" value="Board"><span class="kbd">3</span><span>Board<small>Quarterly trends and risks</small></span>${i("check", "q-check")}</label>
    <label class="q-option"><input type="radio" name="qa" value="__other"><span class="kbd">4</span><span>Other</span>${i("check", "q-check")}</label>
  </div><div class="q-other"><input class="input input-sm" placeholder="Describe the audience" aria-label="Other audience"></div></section>
  <section class="q-step" data-key="Include"><h4>What should I include?</h4><p>Pick any. You can skip this.</p><div class="q-options">
    <label class="q-option"><input type="checkbox" value="Pipeline"><span class="kbd">1</span><span>Pipeline by stage</span>${i("check", "q-check")}</label>
    <label class="q-option"><input type="checkbox" value="Churn risk"><span class="kbd">2</span><span>Churn risk</span>${i("check", "q-check")}</label>
    <label class="q-option"><input type="checkbox" value="Forecast"><span class="kbd">3</span><span>Forecast vs target</span>${i("check", "q-check")}</label>
  </div></section>
  <section class="q-step" data-key="Notes"><h4>Anything else?</h4><p>Optional — deadlines, format, things to avoid.</p><textarea class="textarea" rows="3" placeholder="e.g. Keep it under 300 words" aria-label="Notes"></textarea></section>
  <div class="q-foot"><button class="btn btn-ghost btn-sm" data-q-back>Back</button><span class="grow hint hide-sm">Press 1–4 to choose · Enter to continue</span><button class="btn btn-ghost btn-sm" data-q-skip>Skip</button><button class="btn btn-sm" data-q-next>Next</button></div>
  <div class="q-summary"><div class="row" style="gap:8px">${i("circle-check")} <b class="t-label-md">Thanks — drafting your report</b></div><dl></dl><button class="btn btn-outline btn-sm" style="margin-top:16px" data-q-restart>Start over</button></div>
</div>` }],
    react: `<Questionnaire onSubmit={(answers) => run(answers)}>
  <Question id="audience" required title="Who is this report for?">
    <Option value="exec">Executives</Option><Option value="sales">Sales team</Option><OptionOther />
  </Question>
  <Question id="include" multiple title="What should I include?">…</Question>
  <Question id="notes" freeform title="Anything else?" />
</Questionnaire>`,
    api: [["questionnaire > q-step", "class", "One step per question"], ["data-required", "step", "Hides Skip, Next waits for an answer"], ["data-key", "step", "Key used in the summary and facet:submit detail"], ["value=\"__other\" + q-other", "option", "Other with free text"], ["data-q-next · data-q-back · data-q-skip", "attribute", "Footer controls"], ["facet:submit", "event", "{ key: answers[] }"]],
    a11y: ["Options are real radios/checkboxes inside labels, so screen readers announce the group.", "Number keys 1–9 pick options; Enter continues."] });

  /* ------------------------------ Layout ------------------------------ */
  add({ slug: "aspect-ratio", name: "Aspect Ratio", group: "Layout", figma: "Aspect Ratio · 16:9 · 4:3 · 1:1 · 9:16",
    desc: "Keeps media at a fixed ratio while it scales: images, video, maps and embeds. Set --ratio; the content covers the frame.",
    examples: [{ title: "Ratios", layout: "block", html: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;align-items:start;max-width:720px;margin:auto">
  <figure class="aspect-ratio" style="--ratio:16/9;margin:0"><div class="aspect-fill">16 : 9</div><figcaption>Video</figcaption></figure>
  <figure class="aspect-ratio" style="--ratio:4/3;margin:0"><div class="aspect-fill" style="filter:hue-rotate(40deg)">4 : 3</div><figcaption>Photo</figcaption></figure>
  <figure class="aspect-ratio" style="--ratio:1;margin:0"><div class="aspect-fill" style="filter:hue-rotate(90deg)">1 : 1</div><figcaption>Avatar</figcaption></figure>
  <figure class="aspect-ratio" style="--ratio:9/16;margin:0"><div class="aspect-fill" style="filter:hue-rotate(160deg)">9 : 16</div><figcaption>Story</figcaption></figure>
</div>` }],
    react: `<AspectRatio ratio={16 / 9}><img src="/cover.jpg" alt="Cover" className="object-cover" /></AspectRatio>`,
    api: [["aspect-ratio", "class", "Frame"], ["--ratio", "CSS var", "e.g. 16/9 (default), 4/3, 1"], ["figcaption", "child", "Optional overlay caption"]],
    a11y: ["Images still need alt text; decorative ones use alt=\"\"."] });

  add({ slug: "collapsible", name: "Collapsible", group: "Layout", figma: "Collapsible · Closed · Open",
    desc: "Shows and hides one region with a trigger. Built on <details>, so it works without JavaScript. Use Accordion for a set of sections.",
    examples: [{ title: "Collapsible", html: `<details class="collapsible" style="width:340px" open>
  <summary><span>@peduarte starred 3 repositories</span><span class="collapsible-trigger btn btn-ghost btn-sm icon-btn" aria-hidden="true">${i("chevrons-up-down", "icon-sm")}</span></summary>
  <div class="collapsible-row">@radix-ui/primitives</div>
  <div class="collapsible-content"><div class="collapsible-row">@radix-ui/colors</div><div class="collapsible-row">@stitches/react</div></div>
</details>` }],
    react: `<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger asChild><Button variant="ghost" size="icon"><ChevronsUpDown /></Button></CollapsibleTrigger>
  <CollapsibleContent>…</CollapsibleContent>
</Collapsible>`,
    api: [["details.collapsible", "element", "Wrapper; add open to start expanded"], ["collapsible-trigger", "class", "Icon that flips when open"], ["collapsible-content", "class", "The hidden region"]],
    a11y: ["<summary> is a native button: Enter and Space toggle it and the expanded state is announced."] });

  add({ slug: "scroll-area", name: "Scroll Area", group: "Layout", figma: "Scroll Area · Vertical · Horizontal",
    desc: "A bounded scroll region with slim, themed scrollbars on every browser and optional edge fades. Native scrolling, so touch, wheel and keyboard all work.",
    examples: [
      { title: "Vertical", html: `<div class="scroll-area" style="height:240px;width:220px" tabindex="0" aria-label="Tags"><div class="scroll-area-viewport"><b class="t-label-sm">Tags</b><div class="scroll-area-list" style="margin-top:8px">${Array.from({ length: 30 }, (_, k) => `<div>v1.2.0-beta.${30 - k}</div>`).join("")}</div></div></div>` },
      { title: "Horizontal with fade", html: `<div class="scroll-area scroll-area-x" data-fade style="width:min(100%,460px)" tabindex="0" aria-label="Artwork"><div class="scroll-area-viewport">${["Ornella Binni", "Tom Byrom", "Vladimir Malyavko", "Ada Lin", "Kenji Ito"].map((n, k) => `<figure style="margin:0;width:150px"><div class="aspect-ratio" style="--ratio:3/4"><div class="aspect-fill" style="filter:hue-rotate(${k * 50}deg)"></div></div><figcaption class="t-caption text-tertiary" style="margin-top:6px">Photo by <b class="text-primary">${n}</b></figcaption></figure>`).join("")}</div></div>` }],
    react: `<ScrollArea className="h-72 w-48 rounded-md border">…</ScrollArea>`,
    api: [["scroll-area", "class", "Bounded region (set a height or width)"], ["scroll-area-x", "modifier", "Horizontal row"], ["data-fade", "attribute", "Fade the scrolling edges"], ["data-bare", "attribute", "No border or background"]],
    a11y: ["Give the region tabindex=\"0\" and an aria-label so keyboard users can scroll it."] });

  /* ------------------------------ Feedback ------------------------------ */
  const snr = (o, label, cls = "btn-outline") => `<button class="btn ${cls} btn-sm" data-sonner="${JSON.stringify({ target: "sonner-demo", ...o }).replace(/"/g, "&quot;").replace(/'/g, "&#39;")}">${label}</button>`;
  add({ slug: "sonner", name: "Sonner", group: "Feedback", figma: "Sonner · Default · Success · Error · Info · Warning · Loading · Action · Stack · Expanded",
    desc: "Stacked toasts: new ones slide in front, older ones tuck behind, hover to fan the stack out. Types, actions and promise toasts that go from loading to done.",
    examples: [{ title: "Try it", html: `<div class="stack" style="--gap:16px;align-items:center;width:100%">
  <div class="row" style="flex-wrap:wrap;justify-content:center;gap:8px">${snr({ title: "Event created", description: "Sunday, Dec 03 at 9:00 AM" }, "Default")}${snr({ title: "Invoice paid", type: "success" }, "Success")}${snr({ title: "Couldn't sync", description: "Check your connection.", type: "error" }, "Error")}${snr({ title: "New version available", type: "info" }, "Info")}${snr({ title: "Storage almost full", type: "warning" }, "Warning")}${snr({ title: "Message archived", action: "Undo" }, "Action")}${snr({ title: "Saving changes…", promise: "resolve", success: "Changes saved", error: "Save failed" }, "Promise", "btn")}</div>
  <section class="sonner" id="sonner-demo" data-inline aria-label="Notifications" aria-live="polite"><div class="sonner-toast" data-type="success"><button class="sonner-close" aria-label="Close">${i("x")}</button>${i("circle-check")}<div class="grow"><b>Deploy finished</b><span>facet-ui · production · 42s</span></div></div></section>
</div>` }],
    react: `import { toast } from "sonner"
<Toaster position="bottom-right" />
toast("Event created", { description: "Sunday at 9:00", action: { label: "Undo", onClick: undo } })
toast.promise(save(), { loading: "Saving…", success: "Saved", error: "Failed" })`,
    api: [["Facet.sonner(o)", "function", "{ title, description, type, action, duration, target }"], ["Facet.sonner.success|error|info|warning|loading(title)", "function", "Shortcuts"], ["Facet.sonner.promise(p, msgs)", "function", "Loading → success/error"], ["sonner[data-position=\"top-center\"]", "attribute", "Region position (default bottom-right)"], ["data-sonner='{…}'", "attribute", "Declarative trigger"]],
    a11y: ["The region is aria-live=\"polite\"; errors use role=\"alert\".", "Hovering or focusing the stack pauses dismissal."] });

  /* ------------------------------ AI ------------------------------ */
  add({ slug: "bubble", name: "Bubble", group: "AI", figma: "Bubble · Default · Primary · Outline · Tinted · Ghost × Start / End",
    desc: "The message surface for chat: variants, start/end alignment, grouped corners, reactions, link previews, action buttons and collapsible long content.",
    examples: [{ title: "Bubbles", layout: "block", html: `<div class="stack" style="--gap:10px;max-width:520px;margin:auto">
  <div class="bubble-row"><div class="bubble">Hey! Did the new pricing page ship?</div><div class="bubble">Marketing wants to link it in the newsletter 🙏</div><span class="bubble-meta">Ada · 9:41</span></div>
  <div class="bubble-row" data-align="end"><div class="bubble" data-variant="primary">Yes — live since this morning.<span class="bubble-reactions">👍 2</span></div></div>
  <div class="bubble-row" data-align="end"><div class="bubble" data-variant="primary">Here's the link:<a class="bubble-link" href="#"><div class="aspect-ratio" style="--ratio:2/1"><div class="aspect-fill">facet.dev/pricing</div></div><div><b>Pricing · Facet UI</b><span>Simple plans for every team</span></div></a></div><span class="bubble-meta">You · 9:43</span></div>
  <div class="bubble-row"><div class="bubble" data-variant="outline"><div class="bubble-more"><p>Release checklist for v1.3: tokens audited, Figma variants rebuilt, docs regenerated, changelog written, accessibility pass on the new components, Sonner stacking checked on Safari, and the questionnaire tested with a screen reader.</p><p>Ping me once the store listings are updated.</p></div><button class="bubble-toggle" aria-expanded="false">Show more</button></div></div>
  <div class="bubble-row"><div class="bubble" data-variant="tinted">Want me to schedule the newsletter?<div class="bubble-actions"><button class="btn btn-sm">Schedule</button><button class="btn btn-outline btn-sm">Not now</button></div></div></div>
</div>` }],
    react: `<Bubble align="end" variant="primary">
  Yes — live since this morning.
  <BubbleReactions>👍 2</BubbleReactions>
</Bubble>`,
    api: [["bubble-row[data-align=\"end\"]", "wrapper", "Groups bubbles from one sender; end aligns right"], ["bubble[data-variant]", "attribute", "default · primary · outline · tinted · ghost"], ["bubble-reactions · bubble-link · bubble-actions · bubble-meta", "class", "Parts"], ["bubble-more + bubble-toggle", "class", "Collapsible long content"]],
    a11y: ["Put sender and time in visible or visually-hidden text, not only alignment.", "The Show more button reports aria-expanded."] });

  add({ slug: "marker", name: "Marker", group: "AI", figma: "Marker · Date · Status · Unread · Pill",
    desc: "Separators and status notes inside a conversation: date breaks, “Ada joined”, “New messages”, “Conversation summarised”.",
    examples: [{ title: "Markers", layout: "block", html: `<div class="stack" style="--gap:18px;max-width:520px;margin:auto">
  <div class="marker" role="separator">Today</div>
  <div class="marker" data-variant="status">${i("user")} <span><b>Ada Lovelace</b> joined the conversation</span></div>
  <div class="marker" data-variant="unread" role="separator">New messages</div>
  <div class="marker" data-variant="pill" role="separator"><span class="marker-pill">${i("sparkles", "icon-sm")} Earlier messages summarised</span></div>
  <div class="marker" data-variant="status">${i("clock")} <span>Agent paused for approval · 2m</span></div>
</div>` }],
    react: `<Marker>Today</Marker>\n<Marker variant="status" icon={<UserPlus />}>Ada joined the conversation</Marker>`,
    api: [["marker", "class", "Line + centered label (date break)"], ["data-variant", "attribute", "status · unread · pill"], ["marker-pill", "class", "Pill label for the pill variant"]],
    a11y: ["Use role=\"separator\" on breaks; status markers are plain text so they're read in order."] });

  add({ slug: "message-scroller", name: "Message Scroller", group: "AI", figma: "Message Scroller · At bottom · Scrolled up",
    desc: "The scroll container for a conversation: sticks to the bottom while replies stream, anchors each new turn to the top, restores history without jumping, counts unread messages, jumps to any message and reports when messages are seen.",
    examples: [{ title: "Conversation", layout: "block", html: `<div class="stack" style="--gap:10px;max-width:560px;margin:auto">
  <div class="card" style="height:380px;padding:0;overflow:hidden"><div class="message-scroller" id="ms-demo">
    <div class="message-scroller-viewport"><div class="message-scroller-content">
      <button class="btn btn-ghost btn-sm message-scroller-load" data-scroller-demo="ms-demo" data-kind="earlier">Load earlier</button>
      <div class="marker" role="separator">Yesterday</div>
      <div class="bubble-row" id="ms-m1"><div class="bubble">Can you pull last quarter's churn numbers?</div></div>
      <div class="bubble-row" data-align="end"><div class="bubble" data-variant="primary">On it. Churn was 2.8%, down from 3.4%.</div></div>
      <div class="bubble-row"><div class="bubble">Nice. Which segment improved most?</div></div>
      <div class="bubble-row" data-align="end"><div class="bubble" data-variant="primary">Mid-market — onboarding emails cut early churn by a third.</div></div>
      <div class="marker" role="separator">Today</div>
      <div class="bubble-row"><div class="bubble">Great, let's add that to the board deck.</div></div>
      <div class="bubble-row" data-align="end" data-seen="false"><div class="bubble" data-variant="primary">Added as slide 7.</div><span class="bubble-meta">9:12</span></div>
    </div></div>
    <button class="btn btn-outline btn-sm message-scroller-jump" hidden>${i("arrow-down", "icon-sm")} Latest <span class="badge" hidden>0</span></button>
  </div></div>
  <div class="row" style="flex-wrap:wrap;gap:8px;justify-content:center"><button class="btn btn-sm" data-scroller-demo="ms-demo" data-kind="ask">Ask a question</button><button class="btn btn-outline btn-sm" data-scroller-demo="ms-demo">Stream a reply</button><button class="btn btn-ghost btn-sm" data-scroll-to="ms-m1">Jump to first question</button></div>
</div>` }],
    react: `<MessageScroller>
  <MessageScrollerViewport>{messages.map((m) => <Message key={m.id} turn={m.role === "user"} />)}</MessageScrollerViewport>
  <MessageScrollerJump />
</MessageScroller>`,
    api: [["message-scroller > message-scroller-viewport > message-scroller-content", "class", "Structure"], ["data-turn", "message", "Anchor this message to the top when added"], ["data-prepend", "message", "Restored history: keep the scroll position"], ["data-seen=\"false\"", "message", "Becomes true when half visible; fires facet:seen"], ["message-scroller-jump (+ .badge)", "class", "Jump to latest with unread count"], ["data-scroll-to=\"id\"", "attribute", "Jump to and highlight a message"]],
    a11y: ["Give the log role=\"log\" or aria-live on the content if replies should be announced.", "The jump button is a real button and appears only when you're scrolled up."] });

  add({ slug: "trace", name: "Trace", group: "AI", figma: "Trace · Trace Item · Done · Running · Error · Pending",
    desc: "Lists the steps an agent takes — searches, tool calls, file reads — with status, timing and collapsible input/output for each step.",
    examples: [{ title: "Agent run", html: `<ol class="trace" aria-label="Agent steps">
  <li class="trace-item" data-status="done"><span class="trace-line"></span><span class="trace-icon">${i("search")}</span><div class="trace-title">Searched the web <span class="trace-meta">1.2s</span></div><div class="trace-desc">“enterprise churn benchmarks 2026” · 8 results</div></li>
  <li class="trace-item" data-status="done"><span class="trace-line"></span><span class="trace-icon">${i("database")}</span><div class="trace-title">Queried warehouse <span class="trace-meta">0.4s</span></div><details class="trace-collapsible"><summary>${i("chevron-right")} Input &amp; output</summary><pre>SELECT segment, churn_rate FROM churn_q3 ORDER BY churn_rate;
→ 4 rows · mid-market 1.9%</pre></details></li>
  <li class="trace-item" data-status="error"><span class="trace-line"></span><span class="trace-icon">${i("circle-x")}</span><div class="trace-title">Read file <code>board-deck.pptx</code> <span class="trace-meta">0.1s</span></div><details class="trace-collapsible" open><summary>${i("chevron-right")} Error</summary><pre>Permission denied: request access from the deck owner.</pre></details></li>
  <li class="trace-item" data-status="running"><span class="trace-line"></span><span class="trace-icon">${i("loader-circle")}</span><div class="trace-title">Drafting summary <span class="trace-meta">3.8s</span></div></li>
  <li class="trace-item" data-status="pending"><span class="trace-line"></span><span class="trace-icon">${i("send")}</span><div class="trace-title">Send to #revenue</div></li>
</ol>` }],
    react: `<Trace>
  <TraceItem status="done"><TraceIcon><Search /></TraceIcon><TraceTitle>Searched the web</TraceTitle>
    <TraceCollapsible>…</TraceCollapsible></TraceItem>
</Trace>`,
    api: [["trace > trace-item", "class", "Ordered list of steps"], ["data-status", "item", "done · running · error · pending"], ["trace-line · trace-icon · trace-title · trace-meta · trace-desc", "class", "Parts"], ["details.trace-collapsible", "element", "Collapsible input/output"]],
    a11y: ["Use an ordered list; status is also given by the icon shape and the text, not color alone."] });

  /* ------------------------------ Navigation ------------------------------ */
  const mi = (ic, label, sc = "") => `<button class="menu-item" role="menuitem">${ic ? i(ic) : ""}${label}${sc ? `<span class="shortcut">${sc}</span>` : ""}</button>`;
  const mb = (label, items) => `<div class="dropdown"><button class="menubar-trigger" data-dropdown-trigger aria-haspopup="menu" aria-expanded="false" role="menuitem">${label}</button><div class="menu" role="menu">${items}</div></div>`;
  add({ slug: "menubar", name: "Menubar", group: "Navigation", figma: "Menubar",
    desc: "A desktop-app style menu bar. Click a menu to open it, then hover or use ←/→ to move between menus. Supports shortcuts, checkable items and separators.",
    examples: [{ title: "Menubar", html: `<div class="menubar" role="menubar" aria-label="Editor" style="margin-bottom:240px">
  ${mb("File", mi("file", "New tab", "⌘T") + mi("", "New window", "⌘N") + mi("", "New incognito window") + '<div class="menu-sep"></div>' + mi("", `Share ${i("chevron-right", "sub-arrow")}`) + '<div class="menu-sep"></div>' + mi("", "Print…", "⌘P"))}
  ${mb("Edit", mi("undo-2", "Undo", "⌘Z") + mi("redo-2", "Redo", "⇧⌘Z") + '<div class="menu-sep"></div>' + mi("search", "Find…", "⌘F") + mi("copy", "Copy", "⌘C"))}
  ${mb("View", `<button class="menu-item" role="menuitemcheckbox" aria-checked="true">${i("check", "check-mark")} Always show bookmarks</button><button class="menu-item" role="menuitemcheckbox" aria-checked="false">${i("check", "check-mark")} Always show full URLs</button><div class="menu-sep"></div>` + mi("refresh-cw", "Reload", "⌘R") + mi("maximize-2", "Toggle fullscreen"))}
  ${mb("Profiles", mi("user", "Andy") + mi("user", "Benoit") + mi("user", "Luis") + '<div class="menu-sep"></div>' + mi("pencil", "Edit…") + mi("plus", "Add profile…"))}
</div>` }],
    react: `<Menubar>
  <MenubarMenu><MenubarTrigger>File</MenubarTrigger>
    <MenubarContent><MenubarItem>New tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem></MenubarContent>
  </MenubarMenu>
</Menubar>`,
    api: [["menubar[role=menubar]", "class", "Bar"], ["dropdown > menubar-trigger", "class", "Each menu (reuses Dropdown Menu)"], ["menuitemcheckbox[aria-checked]", "item", "Checkable item"]],
    a11y: ["←/→ move between menus, ↑/↓ inside a menu, Escape closes.", "Shortcuts are hints only — register them in your app too."] });

  const nc = (ic, t, d) => `<a class="nav-menu-card" href="#"><b>${i(ic)} ${t}</b><span>${d}</span></a>`;
  add({ slug: "navigation-menu", name: "Navigation Menu", group: "Navigation", figma: "Navigation Menu · Navigation Menu Item · Mega",
    desc: "Site navigation with rich dropdown panels: a featured card plus links with descriptions. Opens on hover on desktop and on tap on touch screens.",
    examples: [{ title: "Navigation menu", layout: "block", html: `<div style="min-height:340px;display:flex;justify-content:center;align-items:flex-start"><nav class="nav-menu" aria-label="Main"><ul class="nav-menu-list">
  <li><button class="nav-menu-trigger" aria-expanded="false" aria-controls="nm-start">Getting started ${i("chevron-down")}</button></li>
  <li><button class="nav-menu-trigger" aria-expanded="false" aria-controls="nm-comp">Components ${i("chevron-down")}</button></li>
  <li><a class="nav-menu-link" href="#">Docs</a></li>
</ul>
<div class="nav-menu-viewport">
  <div class="nav-menu-panel" id="nm-start" data-layout="feature"><a class="nav-menu-feature" href="#">${i("sparkles")}<b>Facet UI</b><span>Tokens, components and Figma variants in one kit.</span></a>${nc("book-open", "Introduction", "Install and set up your theme.")}${nc("layers", "Theming", "Brand colors, density and style themes.")}${nc("code", "Installation", "CSS + JS, React or Tailwind preset.")}</div>
  <div class="nav-menu-panel" id="nm-comp">${nc("bell", "Alert Dialog", "Interrupts with important content.")}${nc("message-square", "Hover Card", "Preview content behind a link.")}${nc("sliders-horizontal", "Progress", "Shows completion of a task.")}${nc("panel-left", "Scroll Area", "Slim, themed scrollbars.")}${nc("layout-grid", "Tabs", "Layered sections of content.")}${nc("circle-help", "Tooltip", "Info on hover or focus.")}</div>
</div></nav></div>` }],
    react: `<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem><NavigationMenuTrigger>Components</NavigationMenuTrigger>
      <NavigationMenuContent>…</NavigationMenuContent></NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
    api: [["nav-menu > nav-menu-list", "class", "Bar"], ["nav-menu-trigger[aria-controls]", "button", "Opens the panel with that id"], ["nav-menu-viewport > nav-menu-panel", "class", "Panels (data-layout=\"feature\" for a featured card)"], ["nav-menu-card · nav-menu-feature · nav-menu-link", "class", "Content"]],
    a11y: ["Triggers are buttons with aria-expanded; Escape closes and returns focus.", "Wrap the menu in <nav> with an aria-label."] });
})();
