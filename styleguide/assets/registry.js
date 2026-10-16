/* Facet UI — component registry for the living style guide.
   Each entry: { slug, name, group, figma, desc, examples:[{title, html, layout}], react, api, a11y }
   The HTML shown in "Code" is exactly the markup rendered in "Preview". */
(function () {
  const i = (n, c = "") => `<svg class="icon${c ? " " + c : ""}" aria-hidden="true"><use href="#${n}"/></svg>`;
  const C = [];
  const add = (o) => C.push(o);

  /* ------------------------------ Actions ------------------------------ */
  add({ slug: "button", name: "Button", group: "Actions", figma: "Button · 6 variants × 3 sizes × 6 states",
    desc: "Triggers an action. One primary button per view; pair with secondary or ghost for the rest.",
    examples: [
      { title: "Variants", html: `<button class="btn">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-destructive">Delete</button>
<button class="btn btn-link">Link</button>` },
      { title: "Sizes", html: `<button class="btn btn-sm">Small</button>
<button class="btn">Medium</button>
<button class="btn btn-lg">Large</button>` },
      { title: "With icon, loading, disabled", html: `<button class="btn">${i("plus")} New project</button>
<button class="btn btn-outline">Continue ${i("arrow-right")}</button>
<button class="btn" data-loading="true"><span class="spinner"></span> Saving…</button>
<button class="btn" disabled>Disabled</button>` },
      { title: "Icon button", html: `<button class="btn btn-outline icon-btn" aria-label="Settings" data-tooltip="Settings">${i("settings")}</button>
<button class="btn btn-ghost icon-btn" aria-label="More">${i("more-horizontal")}</button>
<button class="btn icon-btn btn-sm" aria-label="Add">${i("plus")}</button>` },
    ],
    react: `import { Button } from "@/components/ui/button"

<Button>Primary</Button>
<Button variant="outline" size="sm"><Plus /> New</Button>
<Button variant="destructive" disabled>Delete</Button>`,
    api: [["btn-secondary | btn-outline | btn-ghost | btn-destructive | btn-link", "class", "Visual variant (default: primary)"], ["btn-sm | btn-lg", "class", "Size — heights follow the Density tokens (32/36/44 comfortable)"], ["icon-btn", "class", "Square icon-only button. Always add aria-label"], ["data-loading", "attribute", "Shows loading state and blocks pointer events"], ["disabled", "attribute", "Native disabled state"]],
    a11y: ["Use <button> for actions and <a> for navigation.", "Icon-only buttons need aria-label (and optionally a tooltip).", "Focus ring is a 2-layer token ring (border/focus) visible in every theme."] });

  add({ slug: "toggle", name: "Toggle & Toggle Group", group: "Actions", figma: "Toggle, Toggle Group",
    desc: "Two-state buttons for formatting and view switching. A toggle group can be single- or multi-select.",
    examples: [
      { title: "Toggle", html: `<button class="toggle" data-toggle aria-pressed="true" aria-label="Bold"><b>B</b></button>
<button class="toggle" data-toggle aria-pressed="false" aria-label="Italic"><i>I</i></button>
<button class="toggle toggle-outline" data-toggle aria-pressed="false">${i("star")} Favorite</button>` },
      { title: "Single-select group", html: `<div class="toggle-group" role="group" aria-label="View" data-single>
  <button class="toggle" data-toggle aria-pressed="true">${i("list-todo")} List</button>
  <button class="toggle" data-toggle aria-pressed="false">${i("kanban-square")} Board</button>
  <button class="toggle" data-toggle aria-pressed="false">${i("calendar")} Calendar</button>
</div>` },
    ],
    react: `<ToggleGroup type="single" defaultValue="list">
  <ToggleGroupItem value="list"><List /> List</ToggleGroupItem>
  <ToggleGroupItem value="board"><Kanban /> Board</ToggleGroupItem>
</ToggleGroup>`,
    api: [["data-toggle", "attribute", "Enables click-to-toggle (facet.js)"], ["aria-pressed", "attribute", "Current state — styles key off it"], ["data-single", "attribute (group)", "Makes the group behave as a radio set"]],
    a11y: ["aria-pressed communicates state to assistive tech.", "Group needs role=group and an aria-label."] });

  /* ------------------------------ Forms ------------------------------ */
  add({ slug: "input", name: "Input", group: "Forms", figma: "Input · 3 sizes × 6 states",
    desc: "Single-line text entry. Facet inputs carry the control facet cut and a 2-layer focus ring.",
    examples: [
      { title: "Default", html: `<input class="input" style="max-width:320px" placeholder="you@company.com" type="email">` },
      { title: "With icon and shortcut", html: `<div class="input-group" style="width:320px">${i("search")}<input class="input" placeholder="Search projects…"><span class="kbd">⌘K</span></div>` },
      { title: "Sizes & states", layout: "left", html: `<div class="stack" style="width:320px">
  <input class="input input-sm" placeholder="Small">
  <input class="input" placeholder="Medium">
  <input class="input input-lg" placeholder="Large">
  <input class="input" aria-invalid="true" value="not-an-email">
  <input class="input" disabled placeholder="Disabled">
</div>` },
    ],
    react: `<Input type="email" placeholder="you@company.com" />`,
    api: [["input-sm | input-lg", "class", "Size"], ["aria-invalid=\"true\"", "attribute", "Error styling + danger focus ring"], ["input-group", "wrapper", "Leading icon / trailing kbd"]],
    a11y: ["Always pair with a visible <label> (see Field).", "border/input is 2.5:1 on white — it is decorative; the label and placeholder carry meaning. Raise to ink/500 if your audit requires 3:1 for control edges."] });

  add({ slug: "field", name: "Field", group: "Forms", figma: "Field · Default / Error / Disabled",
    desc: "Label + control + help/error text. Use for every form input.",
    examples: [
      { title: "Field", layout: "left", html: `<div class="stack" style="width:340px;--gap:20px">
  <div class="field">
    <label class="label" for="f1">Workspace name <span class="req">*</span></label>
    <input class="input" id="f1" value="Acme Inc." aria-describedby="f1h">
    <span class="help" id="f1h">Shown in invites and the sidebar.</span>
  </div>
  <div class="field" data-invalid="true">
    <label class="label" for="f2">URL</label>
    <input class="input" id="f2" value="acme ops" aria-invalid="true" aria-describedby="f2h">
    <span class="help" id="f2h">Only lowercase letters, numbers and dashes.</span>
  </div>
</div>` },
      { title: "Textarea & select", layout: "left", html: `<div class="stack" style="width:340px;--gap:20px">
  <div class="field"><label class="label" for="f3">Bio</label><textarea class="textarea" id="f3" placeholder="Add context for your teammates"></textarea></div>
  <div class="field"><label class="label" for="f4">Role</label><select class="select" id="f4"><option>Admin</option><option selected>Member</option><option>Viewer</option></select></div>
</div>` },
    ],
    react: `<div className="grid gap-1.5">
  <Label htmlFor="name">Workspace name</Label>
  <Input id="name" aria-describedby="name-help" />
  <p id="name-help" className="text-sm text-muted-foreground">Shown in invites.</p>
</div>`,
    api: [["field", "class", "Vertical stack with 6px gap"], ["data-invalid", "attribute", "Turns help text red"], ["label / .req", "class", "Label + required marker"]],
    a11y: ["Connect help/error text with aria-describedby.", "Mark required fields in the label, not only with color."] });

  add({ slug: "checkbox", name: "Checkbox & Radio", group: "Forms", figma: "Checkbox · Radio",
    desc: "Select one or many options. Built on native inputs, so keyboard and forms work for free.",
    examples: [
      { title: "Checkbox", layout: "left", html: `<div class="stack">
  <label class="check"><input type="checkbox" checked><span>Email me weekly digests<small>A summary of activity across your projects.</small></span></label>
  <label class="check"><input type="checkbox"><span>Product updates</span></label>
  <label class="check"><input type="checkbox" disabled><span>Disabled</span></label>
</div>` },
      { title: "Radio", layout: "left", html: `<div class="stack" role="radiogroup" aria-label="Plan">
  <label class="check"><input type="radio" name="plan" checked><span>Monthly</span></label>
  <label class="check"><input type="radio" name="plan"><span>Yearly <span class="badge badge-success">-20%</span></span></label>
</div>` },
    ],
    react: `<Checkbox id="digest" defaultChecked />
<RadioGroup defaultValue="monthly">…</RadioGroup>`,
    api: [["check", "class (label)", "Wraps a native checkbox/radio and its text"], ["indeterminate", "JS property", "el.indeterminate = true shows the dash state"]],
    a11y: ["The whole label is the hit target.", "Use a fieldset/legend or role=radiogroup with a name for groups."] });

  add({ slug: "switch", name: "Switch", group: "Forms", figma: "Switch · SM / MD",
    desc: "Instant on/off settings. Use a checkbox instead when the change needs a Save button.",
    examples: [{ title: "Switch", html: `<label class="switch"><input type="checkbox" role="switch" checked> Auto-sync</label>
<label class="switch"><input type="checkbox" role="switch"> Notifications</label>
<label class="switch switch-sm"><input type="checkbox" role="switch" checked> Small</label>
<label class="switch"><input type="checkbox" role="switch" disabled> Disabled</label>` }],
    react: `<Switch id="sync" defaultChecked /> <Label htmlFor="sync">Auto-sync</Label>`,
    api: [["switch", "class (label)", "Wrapper"], ["switch-sm", "class", "Small size"], ['role="switch"', "attribute", "Announces as a switch"]],
    a11y: ['Add role="switch" to the input.', "The off state uses bg/control-off (≥3:1) so the track is visible."] });

  add({ slug: "slider", name: "Slider & Progress", group: "Forms", figma: "Slider · Progress",
    desc: "Slider picks a value in a range; Progress shows completion of a task.",
    examples: [{ title: "Slider & progress", layout: "left", html: `<div class="stack" style="width:360px;--gap:20px">
  <input class="slider" type="range" min="0" max="100" value="60" aria-label="Volume">
  <div class="stack" style="--gap:6px"><div class="row t-label-sm" style="justify-content:space-between"><span>Uploading assets</span><span class="text-tertiary">75%</span></div>
  <div class="progress" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"><span style="--value:75%"></span></div></div>
  <div class="progress progress-sm"><span style="--value:30%"></span></div>
</div>` }],
    react: `<Slider defaultValue={[60]} max={100} />
<Progress value={75} />`,
    api: [["slider", "class (input range)", "Track fill follows value via facet.js"], ["--value", "CSS var", "Progress width, e.g. 75%"]],
    a11y: ["Give sliders an aria-label or visible label.", "Use role=progressbar with aria-valuenow."] });

  add({ slug: "input-otp", name: "Input OTP", group: "Forms", figma: "Input OTP · OTP Slot",
    desc: "One-time code entry with auto-advance, backspace and paste support.",
    examples: [{ title: "6-digit code", html: `<div class="otp" role="group" aria-label="Verification code">
  <input inputmode="numeric" maxlength="1" aria-label="Digit 1"><input inputmode="numeric" maxlength="1" aria-label="Digit 2"><input inputmode="numeric" maxlength="1" aria-label="Digit 3">
  <span class="sep"></span>
  <input inputmode="numeric" maxlength="1" aria-label="Digit 4"><input inputmode="numeric" maxlength="1" aria-label="Digit 5"><input inputmode="numeric" maxlength="1" aria-label="Digit 6">
</div>` }],
    react: `<InputOTP maxLength={6}>
  <InputOTPGroup><InputOTPSlot index={0} />…</InputOTPGroup>
</InputOTP>`,
    api: [["otp", "class", "Container; facet.js handles focus movement and paste"]],
    a11y: ['Use autocomplete="one-time-code" on the first input in production.', "Label each slot."] });

  add({ slug: "dropzone", name: "Dropzone", group: "Forms", figma: "Dropzone · Attachment",
    desc: "File upload target with drag state.",
    examples: [{ title: "Dropzone", layout: "block", html: `<label class="dropzone facet" style="max-width:460px;margin:auto">
  <span class="icon-wrap">${i("upload-cloud")}</span>
  <b class="t-label-md" style="color:var(--text-primary)">Drop files or <span class="text-brand">browse</span></b>
  <span class="t-body-xs text-tertiary">PNG, PDF or CSV up to 20 MB</span>
  <input type="file" class="sr-only" multiple>
</label>` }],
    react: `<Dropzone accept={{"image/*": []}} onDrop={upload} />`,
    api: [["dropzone", "class", "Dashed container"], ['data-drag="true"', "attribute", "Set while dragging over"]],
    a11y: ["Keep a real <input type=file> inside so keyboard users can browse."] });

  /* ------------------------------ Display ------------------------------ */
  add({ slug: "badge", name: "Badge", group: "Data display", figma: "Badge · 8 variants × 2 sizes",
    desc: "Short status or metadata labels.",
    examples: [{ title: "Variants", html: `<span class="badge badge-brand">Brand</span>
<span class="badge">Neutral</span>
<span class="badge badge-outline">Outline</span>
<span class="badge badge-success"><span class="dot"></span>Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Overdue</span>
<span class="badge badge-info">Beta</span>
<span class="badge badge-accent">New</span>
<span class="badge badge-solid">Solid</span>` }],
    react: `<Badge variant="success">Active</Badge>`,
    api: [["badge-{brand|success|warning|danger|info|accent|outline|solid}", "class", "Tone"], [".dot", "child", "Status dot"]],
    a11y: ["Don't rely on color alone — the text must say the status."] });

  add({ slug: "avatar", name: "Avatar", group: "Data display", figma: "Avatar · Avatar Group",
    desc: "Represents a person or workspace. Initials fall back automatically to tinted tiles.",
    examples: [{ title: "Avatars", html: `<span class="avatar avatar-sm av-1">MC</span>
<span class="avatar av-2" data-status="online">JR</span>
<span class="avatar avatar-lg av-3" data-status="away">AK</span>
<span class="avatar avatar-square av-4">AC</span>
<span class="avatar-group"><span class="avatar av-1">MC</span><span class="avatar av-2">JR</span><span class="avatar av-3">AK</span><span class="avatar av-5">+4</span></span>` }],
    react: `<Avatar><AvatarImage src={url} /><AvatarFallback>MC</AvatarFallback></Avatar>`,
    api: [["avatar-sm | avatar-lg | avatar-square", "class", "Size / shape"], ["data-status", "online | away | busy", "Presence dot"], ["av-1 … av-5", "class", "Fallback tints"]],
    a11y: ["Give images alt text; decorative initials can be aria-hidden when the name is adjacent."] });

  add({ slug: "kbd", name: "Kbd, Spinner, Skeleton, Separator", group: "Data display", figma: "Kbd · Spinner · Skeleton · Separator",
    desc: "Small utilities used across the system.",
    examples: [{ title: "Utilities", layout: "left", html: `<div class="stack" style="width:360px;--gap:16px">
  <div class="row"><span class="kbd">⌘</span><span class="kbd">K</span><span class="t-body-sm text-tertiary">to search</span><span class="spinner text-brand" role="status" aria-label="Loading"></span></div>
  <hr class="separator">
  <div class="row" style="--gap:12px"><div class="skeleton" style="width:40px;height:40px;border-radius:50%"></div><div class="stack grow" style="--gap:8px"><div class="skeleton" style="height:12px;width:70%"></div><div class="skeleton" style="height:12px;width:45%"></div></div></div>
</div>` }],
    react: `<Kbd>⌘K</Kbd>  <Spinner />  <Skeleton className="h-3 w-2/3" />  <Separator />`,
    api: [["kbd | spinner | skeleton | separator", "class", "—"]], a11y: ["Spinners need role=status and a label."] });

  add({ slug: "card", name: "Card", group: "Data display", figma: "Card · Default / Elevated",
    desc: "Groups related content. Carries the Facet cut — the sharper top-right corner.",
    examples: [{ title: "Card", html: `<div class="card" style="width:380px">
  <div class="card-header"><div class="grow"><div class="card-title">Northwind renewal</div><div class="card-desc">Enterprise · closes Nov 30</div></div><span class="badge badge-success">On track</span></div>
  <div class="card-body t-body-sm text-secondary">Legal review finished. Waiting on procurement to confirm seat count before sending the order form.</div>
  <div class="card-footer"><button class="btn btn-ghost btn-sm">Dismiss</button><button class="btn btn-sm">Open deal</button></div>
</div>` },
      { title: "KPI card", html: `<div class="card kpi" style="width:260px"><span class="kpi-label">Monthly recurring revenue</span><span class="kpi-value">$248,920</span><span class="row" style="--gap:6px"><span class="delta">${i("trending-up", "icon-sm")} +12.4%</span><span class="t-caption text-tertiary">vs. last month</span></span></div>
<div class="card kpi" style="width:260px"><span class="kpi-label">Churn</span><span class="kpi-value">2.1%</span><span class="row" style="--gap:6px"><span class="delta down">${i("trending-down", "icon-sm")} -0.3pt</span><span class="t-caption text-tertiary">vs. last month</span></span></div>` }],
    react: `<Card>
  <CardHeader><CardTitle>Northwind renewal</CardTitle><CardDescription>…</CardDescription></CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button size="sm">Open deal</Button></CardFooter>
</Card>`,
    api: [["card / card-elevated", "class", "Container"], ["card-header | card-body | card-footer", "class", "Sections; padding = layout/card-padding (density-aware)"], ["kpi, kpi-label, kpi-value, delta", "class", "Metric card parts"]],
    a11y: ["If the entire card is clickable, use one link and keep other actions outside it."] });

  add({ slug: "table", name: "Data Table", group: "Data display", figma: "Data Table · Table Row · Header Cell",
    desc: "Tabular data with selection, numeric alignment and row actions. Row height follows the Density mode.",
    examples: [{ title: "Table", layout: "block", html: `<div class="table-wrap">
<table class="table">
  <thead><tr><th style="width:40px"><label class="check"><input type="checkbox" aria-label="Select all"></label></th><th><button>Customer ${i("chevrons-up-down", "icon-sm")}</button></th><th>Status</th><th class="num">MRR</th><th style="width:48px"></th></tr></thead>
  <tbody>
    <tr aria-selected="true"><td><label class="check"><input type="checkbox" checked aria-label="Select row"></label></td><td><div class="cell-user"><span class="avatar avatar-sm av-1">NW</span><div><b>Northwind</b><span>ops@northwind.io</span></div></div></td><td><span class="badge badge-success"><span class="dot"></span>Active</span></td><td class="num">$12,400</td><td><button class="btn btn-ghost btn-sm icon-btn" aria-label="Row actions">${i("more-horizontal")}</button></td></tr>
    <tr><td><label class="check"><input type="checkbox" aria-label="Select row"></label></td><td><div class="cell-user"><span class="avatar avatar-sm av-2">GL</span><div><b>Globex</b><span>finance@globex.com</span></div></div></td><td><span class="badge badge-warning">Trial</span></td><td class="num">$3,150</td><td><button class="btn btn-ghost btn-sm icon-btn" aria-label="Row actions">${i("more-horizontal")}</button></td></tr>
    <tr><td><label class="check"><input type="checkbox" aria-label="Select row"></label></td><td><div class="cell-user"><span class="avatar avatar-sm av-3">IN</span><div><b>Initech</b><span>it@initech.co</span></div></div></td><td><span class="badge badge-danger">Past due</span></td><td class="num">$890</td><td><button class="btn btn-ghost btn-sm icon-btn" aria-label="Row actions">${i("more-horizontal")}</button></td></tr>
  </tbody>
</table></div>` }],
    react: `const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })
<Table>…</Table>  // shadcn data-table recipe, styled by Facet tokens`,
    api: [["table-wrap", "class", "Scroll container with border + facet cut"], ["num", "class (td/th)", "Right-aligned tabular numbers"], ['aria-selected="true"', "tr attribute", "Selected row"]],
    a11y: ["Use real <table> markup with <th> headers.", "Sortable headers should be buttons with aria-sort on the th."] });

  add({ slug: "calendar", name: "Calendar", group: "Data display", figma: "Calendar · Date Picker · Date Range Picker",
    desc: "Month grid for picking dates. Today is outlined, selection uses the brand fill.",
    examples: [{ title: "Calendar", html: `<div class="card calendar">
  <div class="cal-head"><button class="btn btn-ghost btn-sm icon-btn" aria-label="Previous month">${i("chevron-left")}</button>October 2026<button class="btn btn-ghost btn-sm icon-btn" aria-label="Next month">${i("chevron-right")}</button></div>
  <div class="cal-grid" role="grid">
    <span class="dow">Mo</span><span class="dow">Tu</span><span class="dow">We</span><span class="dow">Th</span><span class="dow">Fr</span><span class="dow">Sa</span><span class="dow">Su</span>
    <button class="cal-day muted">28</button><button class="cal-day muted">29</button><button class="cal-day muted">30</button>${Array.from({ length: 31 }, (_, d) => `<button class="cal-day${d + 1 === 15 ? " today" : ""}"${d + 1 === 20 ? ' aria-selected="true"' : ""}>${d + 1}</button>`).join("")}<button class="cal-day muted">1</button>
  </div>
</div>` }],
    react: `<Calendar mode="single" selected={date} onSelect={setDate} />`,
    api: [["cal-day.today | .muted | .in-range", "class", "Day states"], ['aria-selected="true"', "attribute", "Selected day"]],
    a11y: ["Production calendars need roving tabindex + arrow-key navigation (react-day-picker provides it)."] });

  add({ slug: "charts", name: "Charts", group: "Data display", figma: "Chart Bar · Chart Area · Chart Donut · Legend",
    desc: "Chart colors come from chart/1–6 tokens, so charts re-theme with the brand. Use any chart library and map its palette to these variables.",
    examples: [{ title: "Bar chart (CSS)", layout: "block", html: `<div class="card card-body" style="max-width:560px;margin:auto">
  <div class="row" style="justify-content:space-between;margin-bottom:16px"><div><div class="card-title">Revenue</div><div class="card-desc">Last 8 weeks</div></div><div class="legend"><span><i style="--c:var(--chart-1)"></i>New</span><span><i style="--c:var(--chart-2)"></i>Expansion</span></div></div>
  <div class="bars">${[46, 58, 52, 70, 64, 82, 76, 94].map((v, k) => `<div><i style="--h:${v}%"${k % 3 === 2 ? ' class="alt"' : ""}></i><span>W${k + 1}</span></div>`).join("")}</div>
</div>` }],
    react: `// Recharts example
<Bar dataKey="new" fill="var(--chart-1)" radius={[4, 2, 0, 0]} />`,
    api: [["--chart-1 … --chart-6", "CSS vars", "Categorical palette (chart/1 follows brand)"]],
    a11y: ["Provide a data table or summary text for screen readers.", "Don't encode meaning by color alone; add labels or patterns."] });

  /* ------------------------------ Feedback ------------------------------ */
  add({ slug: "alert", name: "Alert", group: "Feedback", figma: "Alert · 5 variants",
    desc: "Inline, persistent messages. The signal rail on the left carries the tone.",
    examples: [{ title: "Variants", layout: "left", html: `<div class="stack" style="width:100%;max-width:560px">
  <div class="alert" role="status">${i("info")}<div><div class="alert-title">Heads up</div><div class="alert-desc">Workspace billing moves to the 1st of each month.</div></div></div>
  <div class="alert alert-success" role="status">${i("check-circle-2")}<div><div class="alert-title">Payment received</div><div class="alert-desc">Invoice INV-2041 was paid in full.</div></div></div>
  <div class="alert alert-warning" role="status">${i("alert-triangle")}<div><div class="alert-title">Seat limit almost reached</div><div class="alert-desc">23 of 25 seats are in use.</div></div></div>
  <div class="alert alert-danger" role="alert">${i("alert-circle")}<div><div class="alert-title">Sync failed</div><div class="alert-desc">We couldn't reach Salesforce. Retrying in 5 minutes.</div></div></div>
</div>` }],
    react: `<Alert variant="warning"><AlertTriangle /><AlertTitle>…</AlertTitle><AlertDescription>…</AlertDescription></Alert>`,
    api: [["alert-{success|warning|danger|info}", "class", "Tone"]], a11y: ['Use role="alert" only for urgent errors; role="status" otherwise.'] });

  add({ slug: "toast", name: "Toast", group: "Feedback", figma: "Toast",
    desc: "Transient confirmation. Fire from JS with Facet.toast().",
    examples: [{ title: "Trigger toasts", html: `<button class="btn btn-outline" data-toast='{"title":"Project created","description":"Q4 Launch is ready for your team."}'>Show toast</button>
<button class="btn btn-outline" data-toast='{"title":"Changes discarded","description":"Your draft was removed.","tone":"var(--icon-danger)","icon":"trash-2"}'>Danger toast</button>` }],
    react: `import { toast } from "sonner"
toast("Project created", { description: "Q4 Launch is ready." })`,
    api: [["Facet.toast({ title, description, tone, icon, timeout })", "JS", "Returns the toast element"]],
    a11y: ["Region uses aria-live=polite.", "Never put the only copy of important info in a toast."] });

  add({ slug: "empty-state", name: "Empty State", group: "Feedback", figma: "Empty State",
    desc: "Explains why a view is empty and what to do next.",
    examples: [{ title: "Empty state", html: `<div class="card empty" style="width:440px"><span class="icon-wrap">${i("folder")}</span><b class="t-h5">No projects yet</b><p>Projects group your tasks, files and docs. Create one to get your team started.</p><div class="row" style="margin-top:8px"><button class="btn btn-outline btn-sm">Import</button><button class="btn btn-sm">${i("plus")} New project</button></div></div>` }],
    react: `<EmptyState icon={<Folder />} title="No projects yet" action={<Button>New project</Button>} />`,
    api: [["empty", "class", "Centered stack"]], a11y: ["Lead with a clear heading; keep one primary action."] });

  /* ------------------------------ Overlays ------------------------------ */
  add({ slug: "dialog", name: "Dialog", group: "Overlays", figma: "Dialog · Alert Dialog",
    desc: "Modal for focused tasks or confirmation. Escape and backdrop click close it; focus returns to the trigger.",
    examples: [{ title: "Dialog", html: `<button class="btn" data-open="demo-dialog">Invite teammates</button>
<div class="overlay" id="demo-dialog" hidden>
  <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dt">
    <div class="dialog-header"><div class="dialog-title" id="dt">Invite teammates</div><div class="dialog-desc">They'll get an email with a link to join Acme.</div></div>
    <div class="dialog-body"><div class="field"><label class="label" for="dm">Email addresses</label><input class="input" id="dm" placeholder="name@acme.co, …" autofocus></div>
      <div class="field"><label class="label" for="dr">Role</label><select class="select" id="dr"><option>Member</option><option>Admin</option></select></div></div>
    <div class="dialog-footer"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn" data-close>Send invites</button></div>
  </div>
</div>` }],
    react: `<Dialog>
  <DialogTrigger asChild><Button>Invite</Button></DialogTrigger>
  <DialogContent><DialogHeader><DialogTitle>Invite teammates</DialogTitle></DialogHeader>…</DialogContent>
</Dialog>`,
    api: [['data-open="id"', "trigger attribute", "Opens the overlay with that id"], ["data-close", "attribute", "Closes the nearest overlay"], ["overlay > dialog", "structure", "Backdrop + panel"]],
    a11y: ["role=dialog + aria-modal + aria-labelledby.", "For production, add a focus trap (Radix Dialog does this)."] });

  add({ slug: "sheet", name: "Sheet & Drawer", group: "Overlays", figma: "Sheet · Drawer",
    desc: "Side panel for long forms and detail views; bottom drawer on mobile.",
    examples: [{ title: "Sheet / drawer", html: `<button class="btn btn-outline" data-open="demo-sheet">Open sheet</button>
<button class="btn btn-outline" data-open="demo-drawer">Open drawer</button>
<div class="overlay sheet-overlay" id="demo-sheet" hidden>
  <aside class="sheet" role="dialog" aria-modal="true" aria-label="Edit customer">
    <div class="dialog-header row" style="justify-content:space-between"><div class="dialog-title">Edit customer</div><button class="btn btn-ghost btn-sm icon-btn" data-close aria-label="Close">${i("x")}</button></div>
    <div class="dialog-body grow"><div class="field"><label class="label" for="sn">Company</label><input class="input" id="sn" value="Northwind"></div><div class="field"><label class="label" for="se">Billing email</label><input class="input" id="se" value="ops@northwind.io"></div></div>
    <div class="dialog-footer"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn" data-close>Save</button></div>
  </aside>
</div>
<div class="overlay drawer-overlay" id="demo-drawer" hidden>
  <div class="drawer" role="dialog" aria-modal="true" aria-label="Share">
    <div class="dialog-body"><div class="dialog-title">Share “Q4 Launch”</div><button class="btn btn-block">${i("link")} Copy link</button><button class="btn btn-outline btn-block" data-close>Done</button></div>
  </div>
</div>` }],
    react: `<Sheet><SheetTrigger>Open</SheetTrigger><SheetContent side="right">…</SheetContent></Sheet>`,
    api: [["overlay.sheet-overlay > .sheet", "structure", "Right-side panel"], ["overlay.drawer-overlay > .drawer", "structure", "Bottom drawer"]],
    a11y: ["Same rules as Dialog."] });

  add({ slug: "dropdown-menu", name: "Dropdown Menu", group: "Overlays", figma: "Dropdown Menu · Menu Item · Context Menu",
    desc: "Actions in a floating menu. Highlighted items show the signal rail. Arrow keys move focus.",
    examples: [{ title: "Dropdown", layout: "left", html: `<div class="dropdown" style="margin-bottom:220px">
  <button class="btn btn-outline" data-dropdown-trigger aria-haspopup="menu" aria-expanded="false">Options ${i("chevron-down")}</button>
  <div class="menu" role="menu">
    <div class="menu-label">Project</div>
    <button class="menu-item" role="menuitem">${i("pencil")} Rename <span class="shortcut">⌘R</span></button>
    <button class="menu-item" role="menuitem">${i("copy")} Duplicate <span class="shortcut">⌘D</span></button>
    <button class="menu-item" role="menuitem">${i("share-2")} Share</button>
    <div class="menu-sep" role="separator"></div>
    <button class="menu-item danger" role="menuitem">${i("trash-2")} Delete</button>
  </div>
</div>` }],
    react: `<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="outline">Options</Button></DropdownMenuTrigger>
  <DropdownMenuContent><DropdownMenuItem>Rename</DropdownMenuItem></DropdownMenuContent>
</DropdownMenu>`,
    api: [["dropdown", "class", "Positioning wrapper; dropdown-end aligns right"], ["data-dropdown-trigger", "attribute", "Toggles the menu"], ["menu-item.danger", "class", "Destructive item"]],
    a11y: ["role=menu / menuitem; trigger has aria-haspopup and aria-expanded.", "Escape closes."] });

  add({ slug: "popover", name: "Popover, Hover Card & Tooltip", group: "Overlays", figma: "Popover · Hover Card · Tooltip",
    desc: "Lightweight floating content. Tooltips are CSS-only via data-tooltip.",
    examples: [{ title: "Tooltip & popover", html: `<button class="btn btn-outline" data-tooltip="Copy link">${i("link")} Hover me</button>
<div class="popover"><div class="row" style="--gap:12px"><span class="avatar av-1">MC</span><div><b class="t-label-md">Maya Chen</b><div class="t-body-xs text-tertiary">Design lead · Lisbon</div></div></div><p class="t-body-sm text-secondary" style="margin-top:12px">Owns the design system and onboarding redesign.</p></div>` }],
    react: `<Tooltip><TooltipTrigger>…</TooltipTrigger><TooltipContent>Copy link</TooltipContent></Tooltip>`,
    api: [["data-tooltip", "attribute", "Tooltip text"], ['data-tooltip-side="bottom"', "attribute", "Placement"], ["popover", "class", "Floating surface"]],
    a11y: ["Tooltips must not hold essential info; they don't show on touch."] });

  add({ slug: "accordion", name: "Accordion", group: "Overlays", figma: "Accordion · Accordion Item",
    desc: "Progressive disclosure using native <details>.",
    examples: [{ title: "Accordion", layout: "block", html: `<div class="accordion" style="max-width:560px;margin:auto">
  <details open><summary>Can I change the brand color?${i("chevron-down")}</summary><div>Yes — switch data-brand or call Facet.theme.setCustomBrand('#ff5a1f').</div></details>
  <details><summary>Does it support dark mode?${i("chevron-down")}</summary><div>Every semantic token has Light and Dark values.</div></details>
  <details><summary>Is it compatible with shadcn/ui?${i("chevron-down")}</summary><div>Yes. Use the Tailwind preset; class names map to shadcn's CSS variables.</div></details>
</div>` }],
    react: `<Accordion type="single" collapsible><AccordionItem value="a">…</AccordionItem></Accordion>`,
    api: [["accordion > details > summary", "structure", "Native disclosure"]], a11y: ["Native details/summary is keyboard and screen-reader accessible."] });

  /* ------------------------------ Navigation ------------------------------ */
  add({ slug: "tabs", name: "Tabs", group: "Navigation", figma: "Tab · Tab List (Underline / Pill)",
    desc: "Switch between views of the same context. Arrow keys move between tabs.",
    examples: [
      { title: "Underline", layout: "block", html: `<div>
  <div class="tabs-list" role="tablist" aria-label="Project">
    <button class="tab" role="tab" aria-selected="true" aria-controls="tp1" id="tb1">Overview</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="tp2" id="tb2" tabindex="-1">Analytics <span class="badge">12</span></button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="tp3" id="tb3" tabindex="-1">Settings</button>
  </div>
  <div class="tab-panel t-body-sm text-secondary" role="tabpanel" id="tp1" aria-labelledby="tb1" style="padding:16px 0">Overview content.</div>
  <div class="tab-panel t-body-sm text-secondary" role="tabpanel" id="tp2" aria-labelledby="tb2" style="padding:16px 0" hidden>Analytics content.</div>
  <div class="tab-panel t-body-sm text-secondary" role="tabpanel" id="tp3" aria-labelledby="tb3" style="padding:16px 0" hidden>Settings content.</div>
</div>` },
      { title: "Pill", html: `<div class="tabs-pill" role="tablist" aria-label="Range">
  <button class="tab" role="tab" aria-selected="false">Day</button><button class="tab" role="tab" aria-selected="true">Week</button><button class="tab" role="tab" aria-selected="false">Month</button>
</div>` }],
    react: `<Tabs defaultValue="overview">
  <TabsList><TabsTrigger value="overview">Overview</TabsTrigger></TabsList>
  <TabsContent value="overview">…</TabsContent>
</Tabs>`,
    api: [["tabs-list | tabs-pill", "class (tablist)", "Style"], ["aria-selected / aria-controls", "attribute", "State + panel link"]],
    a11y: ["Roving tabindex: only the selected tab is in the tab order."] });

  add({ slug: "breadcrumb", name: "Breadcrumb & Pagination", group: "Navigation", figma: "Breadcrumb · Pagination",
    desc: "Where you are, and how to move through pages of results.",
    examples: [{ title: "Breadcrumb & pagination", layout: "left", html: `<div class="stack" style="--gap:24px">
<nav aria-label="Breadcrumb"><ol class="breadcrumb"><li><a href="#">Acme</a></li>${i("chevron-right")}<li><a href="#">Projects</a></li>${i("chevron-right")}<li aria-current="page">Q4 Launch</li></ol></nav>
<nav class="pagination" aria-label="Pagination"><button class="page-btn">${i("chevron-left", "icon-sm")} Prev</button><button class="page-btn">1</button><button class="page-btn" aria-current="page">2</button><button class="page-btn">3</button><span class="page-btn" aria-hidden="true">…</span><button class="page-btn">12</button><button class="page-btn">Next ${i("chevron-right", "icon-sm")}</button></nav>
</div>` }],
    react: `<Breadcrumb><BreadcrumbList>…</BreadcrumbList></Breadcrumb>
<Pagination>…</Pagination>`,
    api: [["breadcrumb", "class (ol)", "—"], ["page-btn[aria-current=page]", "class", "Current page"]], a11y: ["Wrap in <nav> with aria-label."] });

  add({ slug: "chip", name: "Chip & Link", group: "Navigation", figma: "Chip · Link",
    desc: "Chips filter or select; links navigate.",
    examples: [{ title: "Chips & links", html: `<button class="chip" data-toggle aria-pressed="true">${i("check", "icon-sm")} Enterprise</button>
<button class="chip" data-toggle aria-pressed="false">SMB</button>
<button class="chip" data-toggle aria-pressed="false">Startup</button>
<a class="link" href="#">Read the docs</a>` }],
    react: `<Toggle variant="chip" pressed>Enterprise</Toggle>`,
    api: [["chip[aria-pressed]", "class", "Selectable"], ["link", "class", "Underlined text link"]], a11y: ["Links must have discernible, unique text."] });

  add({ slug: "stepper", name: "Stepper", group: "Navigation", figma: "Step · Stepper",
    desc: "Progress through a multi-step flow (onboarding, checkout).",
    examples: [{ title: "Stepper", layout: "block", html: `<ol class="stepper" style="max-width:640px;margin:auto">
  <li class="step" data-state="complete"><span class="step-bar"></span><b>Account</b><span>Done</span></li>
  <li class="step" data-state="current" aria-current="step"><span class="step-bar"></span><b>Workspace</b><span>In progress</span></li>
  <li class="step" data-state="upcoming"><span class="step-bar"></span><b>Invite team</b><span>Next</span></li>
  <li class="step" data-state="upcoming"><span class="step-bar"></span><b>Connect data</b><span>Optional</span></li>
</ol>` }],
    react: `<Stepper current={1} steps={["Account","Workspace","Invite team","Connect data"]} />`,
    api: [["data-state", "complete | current | upcoming", "Step state"]], a11y: ['Mark the current step with aria-current="step".'] });

  add({ slug: "sidebar", name: "Sidebar", group: "Navigation", figma: "Sidebar · Sidebar Item",
    desc: "Primary app navigation. The active item gets the signal rail and brand icon.",
    examples: [{ title: "Sidebar", layout: "left", html: `<nav class="sidebar card" aria-label="Main" style="height:420px">
  <div class="workspace"><span class="logo">A</span><b class="t-label-md grow">Acme Inc.</b>${i("chevrons-up-down", "icon-sm")}</div>
  <div class="sidebar-label">Workspace</div>
  <a class="sidebar-item" href="#" aria-current="page">${i("layout-dashboard")} Dashboard</a>
  <a class="sidebar-item" href="#">${i("inbox")} Inbox <span class="count">12</span></a>
  <a class="sidebar-item" href="#">${i("folder")} Projects</a>
  <a class="sidebar-item" href="#">${i("users")} Customers</a>
  <div class="sidebar-label">Insights</div>
  <a class="sidebar-item" href="#">${i("bar-chart-3")} Reports</a>
  <a class="sidebar-item" href="#">${i("settings")} Settings</a>
</nav>` }],
    react: `<SidebarProvider><Sidebar><SidebarMenuButton isActive>Dashboard</SidebarMenuButton></Sidebar></SidebarProvider>`,
    api: [["sidebar-item[aria-current=page]", "class", "Active item"], ["sidebar-label", "class", "Section label"], [".count", "child", "Trailing count"]],
    a11y: ['Use aria-current="page" on the active link.'] });

  /* ------------------------------ Signature ------------------------------ */
  add({ slug: "command-palette", name: "Command Palette", group: "Signature", figma: "Command Palette ★",
    desc: "Keyboard-first search, actions and AI in one surface. Press ⌘K / Ctrl K anywhere in this guide to try the live one.",
    examples: [{ title: "Command palette", layout: "block", html: `<div class="command" style="margin:auto" role="dialog" aria-label="Command palette">
  <div class="command-input">${i("search")}<span class="scope">${i("folder", "icon-sm")} Q4 Launch</span><input value="budget" aria-label="Search"><span class="kbd">esc</span></div>
  <div class="command-list" role="listbox">
    <div class="menu-label">Ask AI</div>
    <div class="menu-item" role="option" aria-selected="true">${i("sparkles")} Summarize budget changes this week</div>
    <div class="menu-label">Results in Q4 Launch</div>
    <div class="menu-item" role="option">${i("file-text")} Budget review — doc <span class="shortcut">⌘1</span></div>
    <div class="menu-item" role="option">${i("list-todo")} Approve budget — task assigned to you <span class="shortcut">⌘2</span></div>
    <div class="menu-label">Actions</div>
    <div class="menu-item" role="option">${i("plus")} Create budget request <span class="shortcut">⌘N</span></div>
  </div>
  <div class="command-foot"><span><span class="kbd">↑↓</span> Navigate</span><span><span class="kbd">↵</span> Open</span><span><span class="kbd">⇥</span> Change scope</span></div>
</div>` }],
    react: `<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search…" />
  <CommandList><CommandGroup heading="Ask AI">…</CommandGroup></CommandList>
</CommandDialog>`,
    api: [["command, command-input, command-list, command-foot", "class", "Parts"], ["scope", "class", "Scope chip (⇥ to change)"]],
    a11y: ["Use combobox + listbox semantics (cmdk handles this)."] });

  add({ slug: "ai", name: "AI: Prompt Composer & Message", group: "Signature", figma: "Prompt Composer · Message · AI Copilot Panel",
    desc: "Composer with context chips and model picker; messages for user and assistant.",
    examples: [{ title: "Conversation", layout: "block", html: `<div class="stack" style="max-width:620px;margin:auto;--gap:16px">
  <div class="msg msg-user"><div class="msg-body">Draft a launch plan for the Q4 release.</div></div>
  <div class="msg"><span class="ai-mark">${i("sparkles", "icon-sm")}</span><div class="msg-body">Here's a 3-phase plan: <b>Prepare</b> (assets, docs), <b>Launch</b> (email + in-app), <b>Measure</b> (activation dashboard). Want me to create tasks?</div></div>
  <div class="composer">
    <div class="row" style="--gap:6px"><span class="ctx-chip">${i("file-text", "icon-sm")} Launch brief</span><span class="ctx-chip">${i("folder", "icon-sm")} Q4 Launch</span></div>
    <textarea placeholder="Ask Facet AI…" aria-label="Prompt"></textarea>
    <div class="composer-bar"><button class="btn btn-ghost btn-sm icon-btn" aria-label="Attach">${i("paperclip")}</button><button class="btn btn-ghost btn-sm">${i("sparkles", "icon-sm")} Facet Pro ${i("chevron-down", "icon-sm")}</button><span class="grow"></span><button class="btn btn-sm icon-btn" aria-label="Send">${i("send", "icon-sm")}</button></div>
  </div>
</div>` }],
    react: `<PromptComposer context={chips} model="facet-pro" onSubmit={send} generating={busy} />`,
    api: [["composer, ctx-chip, composer-bar", "class", "Composer parts"], ["msg / msg-user, ai-mark", "class", "Messages"]],
    a11y: ["Announce streamed responses via an aria-live region.", "Show Stop while generating."] });

  add({ slug: "kanban", name: "Kanban", group: "Signature", figma: "Kanban Card · Kanban Column",
    desc: "Board column and draggable task cards.",
    examples: [{ title: "Kanban", html: `<div class="kanban-col">
  <header><span class="dot" style="width:8px;height:8px;border-radius:50%;background:var(--chart-1)"></span>In progress <span class="badge">3</span></header>
  <article class="kanban-card"><div class="row" style="--gap:6px"><span class="badge badge-brand">Design</span><span class="badge badge-danger">P1</span></div><b>Redesign onboarding</b><div class="progress progress-sm"><span style="--value:75%"></span></div><footer><span class="row" style="--gap:4px">${i("calendar", "icon-sm")} Oct 24</span><span class="avatar-group"><span class="avatar avatar-sm av-1">MC</span><span class="avatar avatar-sm av-2">JR</span></span></footer></article>
  <article class="kanban-card"><div class="row" style="--gap:6px"><span class="badge badge-info">Eng</span></div><b>Billing webhooks retry</b><footer><span class="row" style="--gap:4px">${i("message-square", "icon-sm")} 4</span><span class="avatar avatar-sm av-3">AK</span></footer></article>
</div>` }],
    react: `<KanbanColumn title="In progress"><KanbanCard title="Redesign onboarding" tags={["Design","P1"]} progress={75} /></KanbanColumn>`,
    api: [["kanban-col / kanban-card", "class", "Parts"]], a11y: ["Support keyboard moves (Space to lift, arrows to move) — dnd-kit provides this."] });

  add({ slug: "timeline", name: "Activity Timeline & Notifications", group: "Signature", figma: "Activity Timeline · Notification Center",
    desc: "Chronological activity and an inbox of notifications.",
    examples: [{ title: "Timeline & notifications", layout: "left", html: `<ul class="timeline" style="width:340px">
  <li><span class="node brand">${i("sparkles", "icon-sm")}</span><div><b>AI drafted the launch plan</b><p>12 tasks proposed in Q4 Launch</p><time>2 min ago</time></div></li>
  <li><span class="node">${i("check", "icon-sm")}</span><div><b>Maya approved the budget</b><p>$48,000 · Marketing</p><time>1 h ago</time></div></li>
  <li><span class="node">${i("upload-cloud", "icon-sm")}</span><div><b>Jordan uploaded 6 files</b><time>Yesterday</time></div></li>
</ul>
<div class="card" style="width:360px">
  <div class="notif" data-unread><span class="avatar avatar-sm av-1">MC</span><div><b>Maya mentioned you</b><p>“Can you review the pricing page copy?”</p><time>5 min ago</time></div></div><hr class="separator">
  <div class="notif"><span class="avatar avatar-sm av-4">${i("credit-card", "icon-sm")}</span><div><b>Invoice paid</b><p>INV-2041 · $12,400</p><time>3 h ago</time></div></div>
</div>` }],
    react: `<ActivityTimeline items={events} />  <NotificationCenter items={notifications} />`,
    api: [["timeline > li > .node", "structure", "Node + connector line"], ["notif[data-unread]", "class", "Unread dot"]], a11y: ["Use <time datetime> in production."] });

  add({ slug: "pricing", name: "Pricing Card", group: "Signature", figma: "Pricing Card",
    desc: "Plan comparison for marketing and upgrade flows.",
    examples: [{ title: "Pricing", html: `<div class="card pricing" style="width:280px"><div><b class="t-h4">Starter</b><p class="t-body-sm text-tertiary">For small teams</p></div><div class="price">$0<small> /user/mo</small></div><button class="btn btn-outline btn-block">Get started</button><ul><li>${i("check")}Up to 5 projects</li><li>${i("check")}Basic analytics</li></ul></div>
<div class="card pricing featured" style="width:280px"><div class="row" style="justify-content:space-between"><b class="t-h4">Growth</b><span class="badge badge-accent">Popular</span></div><div class="price">$24<small> /user/mo</small></div><button class="btn btn-block">Start free trial</button><ul><li>${i("check")}Unlimited projects</li><li>${i("check")}AI copilot</li><li>${i("check")}Advanced permissions</li></ul></div>` }],
    react: `<PricingCard plan="Growth" price={24} featured features={[…]} />`,
    api: [["pricing / pricing.featured", "class", "Card + highlighted plan"]], a11y: ["Make the price readable as text, not an image."] });

  window.FACET_REGISTRY = C;
})();
