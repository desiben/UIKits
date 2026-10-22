/*! FacetUI Industry Templates · Technology & Software · © 2026 ETKits. Demo content; Relaypoint, its customers and every tool named here are fictional. */
// Edit this file to rebrand: brand, theme, navigation, copy, images and demo data live here.
// Page structure lives in pages.mjs; composition styles in template.css.

/* Connected tools. All names are invented for this template; they are not real products. */
const tools = [
  { id: "ledgerly", name: "ledgerly", kind: "Accounting", team: "finance", wm: 1 },
  { id: "spendloop", name: "Spendloop", kind: "Corporate cards", team: "finance", wm: 2 },
  { id: "tallyroll", name: "TALLYROLL", kind: "Expenses", team: "finance", wm: 3 },
  { id: "paycadence", name: "Paycadence", kind: "Payroll", team: "finance people", wm: 4 },
  { id: "hirewell", name: "hirewell", kind: "Recruiting", team: "people", wm: 5 },
  { id: "peoplebase", name: "Peoplebase", kind: "HR records", team: "people", wm: 1 },
  { id: "inkpost", name: "Inkpost", kind: "E-signature", team: "people finance", wm: 3 },
  { id: "keyring", name: "keyring", kind: "Identity and SSO", team: "it", wm: 2 },
  { id: "gatepass", name: "GATEPASS", kind: "Device management", team: "it", wm: 4 },
  { id: "deskline", name: "Deskline", kind: "Help desk", team: "it", wm: 5 },
  { id: "murmur", name: "murmur", kind: "Team chat", team: "finance people it", wm: 1 },
  { id: "sheetwise", name: "Sheetwise", kind: "Spreadsheets", team: "finance people it", wm: 2 },
  { id: "stackhouse", name: "Stackhouse", kind: "File storage", team: "finance people it", wm: 3 },
  { id: "mailroute", name: "mailroute", kind: "Email", team: "finance people it", wm: 4 },
  { id: "fieldnote", name: "Fieldnote", kind: "Docs and wiki", team: "people it", wm: 5 },
  { id: "parcelkit", name: "PARCELKIT", kind: "Shipping", team: "it people", wm: 2 },
];

/* The three workflows shown in the hero canvas and on their own feature pages.
   step kinds: trigger | action | branch (condition with yes/no paths). */
const workflows = [
  {
    id: "invoice-approval", name: "Invoice approval", short: "Invoices", team: "Finance ops", icon: "receipt",
    lede: "Every bill that lands in your accounting tool is read, checked against its purchase order and routed to the right approver, then scheduled for payment on time.",
    summary: "Read incoming bills, match them to purchase orders, ask for approval only when the amount needs it, and schedule payment.",
    tools: ["ledgerly", "murmur", "sheetwise"],
    edited: "Edited by Dana Kowalski, 2 days ago", runsToday: "38",
    steps: [
      { kind: "trigger", icon: "file-input", app: "ledgerly", title: "New bill in Ledgerly", detail: "Any vendor, any entity" },
      { kind: "action", icon: "scan-text", app: "Relaypoint", title: "Read invoice fields", detail: "Vendor, amount, PO number, due date" },
      { kind: "branch", icon: "split", title: "Amount over $5,000?", detail: "Or vendor added in the last 30 days",
        yes: { icon: "user-check", app: "murmur", title: "Ask the controller to approve", detail: "Reminder after 1 business day" },
        no: { icon: "git-compare", app: "ledgerly", title: "Match to PO and approve", detail: "Within 2% of the PO total" } },
      { kind: "action", icon: "calendar-clock", app: "ledgerly", title: "Schedule payment", detail: "3 days before the due date" },
      { kind: "action", icon: "message-square", app: "murmur", title: "Post to #ap-daily", detail: "One summary at 4:00 PM" },
    ],
    runs: [
      { ref: "INV-20931", what: "Harlow Supply · $7,420.00", state: "Waiting on controller", tone: "warning", when: "9:42 AM" },
      { ref: "INV-20930", what: "Pinebrook Freight · $1,180.50", state: "Scheduled Nov 3", tone: "success", when: "9:37 AM" },
      { ref: "INV-20929", what: "Ostrander Print · $312.00", state: "Scheduled Nov 1", tone: "success", when: "9:12 AM" },
      { ref: "INV-20928", what: "Calder Tools · $2,960.00", state: "PO mismatch, sent to AP", tone: "danger", when: "8:58 AM" },
    ],
    walkthrough: [
      ["A bill arrives", "Relaypoint watches Ledgerly for new bills, whether they were emailed in, uploaded or created by hand."],
      ["Fields are read and checked", "Vendor, amount, PO number and due date are pulled from the bill. Duplicates of a bill paid in the last 90 days are held for review."],
      ["Only the right bills need a person", "Bills over your threshold, or from new vendors, go to the controller in Murmur with the PO and bill side by side. Everything else is matched to its PO and approved."],
      ["Payment is scheduled", "Approved bills are scheduled three days before they're due, so nothing is paid late and nothing is paid early."],
      ["The team sees one summary", "Instead of a message per bill, #ap-daily gets one post each afternoon: what was approved, what's waiting and what needs a look."],
    ],
    settings: [
      ["Approval threshold", "$5,000"],
      ["PO match tolerance", "2%"],
      ["Approver if controller is out", "Assistant controller"],
      ["Reminder schedule", "After 1 and 3 business days"],
      ["Summary channel", "#ap-daily at 4:00 PM"],
    ],
    edges: [
      "Approver is out of office: the request moves to their named delegate automatically.",
      "Bill in a foreign currency: the threshold is checked against the converted amount on the bill date.",
      "PO doesn't exist yet: the bill waits, and the requester gets one message asking for the PO number.",
      "Same invoice number from the same vendor: held as a possible duplicate, never paid twice.",
    ],
  },
  {
    id: "new-hire-onboarding", name: "New-hire onboarding", short: "Onboarding", team: "People ops", icon: "user-plus",
    lede: "When an offer is signed, the employee record, laptop, accounts and first-week checklist are all set up before the start date, without a single spreadsheet tracker.",
    summary: "Turn a signed offer into an employee record, a laptop on its way, accounts ready on day one and a checklist for the manager.",
    tools: ["inkpost", "peoplebase", "gatepass", "keyring", "parcelkit"],
    edited: "Edited by Marcus Bell, last week", runsToday: "6",
    steps: [
      { kind: "trigger", icon: "file-signature", app: "Inkpost", title: "Offer letter signed", detail: "Full-time and contract offers" },
      { kind: "action", icon: "id-card", app: "Peoplebase", title: "Create the employee record", detail: "Title, manager, start date, location" },
      { kind: "branch", icon: "split", title: "Engineering role?", detail: "Based on department in Peoplebase",
        yes: { icon: "laptop", app: "GATEPASS", title: "Order a developer laptop", detail: "32 GB build, ships 10 days out" },
        no: { icon: "laptop", app: "GATEPASS", title: "Order a standard laptop", detail: "16 GB build, ships 7 days out" } },
      { kind: "action", icon: "key-round", app: "keyring", title: "Create accounts", detail: "Email, chat and calendar active at 8:00 AM on day one" },
      { kind: "action", icon: "list-checks", app: "murmur", title: "Send the manager a checklist", detail: "First-week plan, buddy, 30-day check-in" },
    ],
    runs: [
      { ref: "Priya Nair", what: "Data analyst · starts Nov 2", state: "Laptop shipped", tone: "success", when: "Yesterday" },
      { ref: "Tom Albers", what: "Backend engineer · starts Nov 9", state: "Accounts scheduled", tone: "info", when: "Yesterday" },
      { ref: "Rosa Lindqvist", what: "Payroll specialist · starts Nov 9", state: "Waiting on manager", tone: "warning", when: "Mon" },
      { ref: "Ade Okonkwo", what: "Account executive · starts Oct 26", state: "Complete", tone: "success", when: "Oct 19" },
    ],
    walkthrough: [
      ["The offer is signed", "As soon as the candidate signs in Inkpost, onboarding starts. Nobody has to remember to forward the letter."],
      ["The employee record is created", "Title, manager, start date and work location are copied into Peoplebase, so payroll and benefits start from the same facts."],
      ["The right laptop is ordered", "Engineering hires get the developer build; everyone else gets the standard build. Shipping is timed to arrive two days before the start date."],
      ["Accounts are ready on day one", "Email, chat and calendar are created in advance and switched on at 8:00 AM local time on the first day, not before."],
      ["The manager gets a plan", "A checklist arrives in Murmur with the first-week plan, a suggested buddy and a reminder for the 30-day check-in."],
    ],
    settings: [
      ["Laptop arrives", "2 business days before start"],
      ["Accounts switch on", "8:00 AM local time, day one"],
      ["Default groups", "By department and office"],
      ["Contractors", "Accounts expire on contract end date"],
      ["Checklist owner", "Hiring manager"],
    ],
    edges: [
      "Start date moves: the laptop shipment and account activation move with it.",
      "Offer is withdrawn: every step taken so far is reversed and the laptop order is cancelled if it hasn't shipped.",
      "Remote hire in another country: the laptop is ordered from the regional supplier set for that country.",
      "Rehire: the old employee record is reactivated instead of a duplicate being created.",
    ],
  },
  {
    id: "access-requests", name: "Access requests", short: "Access", team: "IT", icon: "key-round",
    lede: "People ask for access in the help desk, the right approvers say yes in chat, and access is granted, logged and set to expire, so the next audit takes an afternoon.",
    summary: "Collect access requests in one place, get the right approvals, grant time-limited access and keep a log you can hand to an auditor.",
    tools: ["deskline", "keyring", "murmur", "sheetwise"],
    edited: "Edited by Lena Fischer, 4 days ago", runsToday: "21",
    steps: [
      { kind: "trigger", icon: "inbox", app: "Deskline", title: "Access request submitted", detail: "Request type: app or shared folder" },
      { kind: "branch", icon: "split", title: "Sensitive app?", detail: "Finance, payroll or customer data",
        yes: { icon: "users", app: "murmur", title: "Manager and app owner approve", detail: "Both must approve within 3 days" },
        no: { icon: "user-check", app: "murmur", title: "Manager approves", detail: "One tap in chat" } },
      { kind: "action", icon: "key-round", app: "keyring", title: "Grant access for 90 days", detail: "Least-privilege role for the app" },
      { kind: "action", icon: "scroll-text", app: "Sheetwise", title: "Write to the access log", detail: "Who asked, who approved, when" },
      { kind: "action", icon: "bell", app: "murmur", title: "Remind the owner before expiry", detail: "7 days before access ends" },
    ],
    runs: [
      { ref: "REQ-4471", what: "J. Ortega → Ledgerly, read only", state: "Granted until Jan 20", tone: "success", when: "10:05 AM" },
      { ref: "REQ-4470", what: "S. Park → Payroll exports folder", state: "Waiting on app owner", tone: "warning", when: "9:51 AM" },
      { ref: "REQ-4469", what: "M. Haddad → Fieldnote, editor", state: "Granted until Jan 20", tone: "success", when: "9:20 AM" },
      { ref: "REQ-4468", what: "K. Brennan → Customer exports", state: "Declined by owner", tone: "danger", when: "Yesterday" },
    ],
    walkthrough: [
      ["Someone asks", "Requests come in through one Deskline form, so IT stops getting them in direct messages, hallway chats and email."],
      ["The app decides the approvers", "Everyday tools need the manager's yes. Apps holding finance, payroll or customer data also need the app owner."],
      ["Access is granted with an end date", "Keyring grants the smallest role that fits the request, for 90 days by default."],
      ["Everything is logged", "Who asked, why, who approved and when access was granted all land in one log your auditors can read."],
      ["Nothing lingers", "Seven days before access ends, the owner is asked whether to renew. No answer means it expires."],
    ],
    settings: [
      ["Default access length", "90 days"],
      ["Sensitive apps", "Ledgerly, Paycadence, customer exports"],
      ["Approval window", "3 business days, then auto-decline"],
      ["Log destination", "Access log sheet in Sheetwise"],
      ["Renewal reminder", "7 days before expiry"],
    ],
    edges: [
      "Manager is the requester: approval goes to their own manager instead.",
      "Request for an app Keyring doesn't manage: it becomes a task for IT with the approvals already attached.",
      "Employee changes team: access granted for the old team is flagged for review.",
      "Employee leaves: every grant from this workflow is revoked the same day.",
    ],
  },
];

const toolById = Object.fromEntries(tools.map((t) => [t.id, t]));

export default {
  slug: "technology",
  business: "workflow automation software company",
  description: "Relaypoint is workflow automation for finance, people and IT operations teams. Build approvals, onboarding and access requests across the tools you already use.",
  brand: { name: "Relaypoint", tagline: "Workflow automation for operations teams", markPath: "M8 5a5 5 0 1 1 0 10A5 5 0 0 1 8 5Zm16 12a5 5 0 1 1 0 10 5 5 0 0 1 0-10ZM6.5 14h3v5a2 2 0 0 0 2 2H19v3h-7.5a5 5 0 0 1-5-5v-5Z" },
  theme: { mode: "light", brand: "iris", density: "comfortable", themeColor: "#ffffff" },
  header: {
    variant: "bar",
    secondary: { label: "Estimate cost", page: "home", hash: "pricing" },
    cta: { label: "Book a demo", page: "demo" },
  },
  nav: [
    { label: "Product", page: "home", hash: "product" },
    { label: "Workflows", page: "workflow-invoice-approval" },
    { label: "Integrations", page: "home", hash: "integrations" },
    { label: "Security", page: "home", hash: "security" },
    { label: "Pricing", page: "home", hash: "pricing" },
  ],
  footer: {
    variant: "columns",
    blurb: "Workflow automation for finance, people and IT operations teams at companies of 50 to 1,000 people.",
    contact: [
      { icon: "mail", label: "sales@relaypoint.example", href: "mailto:sales@relaypoint.example" },
      { icon: "phone", label: "(555) 014-3380", href: "tel:+15550143380" },
    ],
    columns: [
      { title: "Workflows", links: workflows.map((w) => ({ label: w.name, page: `workflow-${w.id}` })) },
      { title: "Product", links: [{ label: "How it works", page: "home", hash: "product" }, { label: "Integrations", page: "home", hash: "integrations" }, { label: "Teams", page: "home", hash: "teams" }, { label: "Cost estimator", page: "home", hash: "pricing" }] },
      { title: "Company", links: [{ label: "Book a demo", page: "demo" }, { label: "Security", page: "home", hash: "security" }, { label: "Security review pack", page: "demo", query: { topic: "security" } }] },
    ],
  },

  hero: {
    title: "The follow-ups between your tools, handled.",
    lede: "Relaypoint runs the approvals, handoffs and requests your operations team chases by hand. Pick a trigger, add the rules you already follow, and every request reaches the right person.",
    workspace: "Fernhill Co.",
    note: "A working preview. Pick a workflow, then run a test.",
  },

  teams: [
    { id: "finance", name: "Finance ops", image: "team-finance",
      line: "Close the month without chasing approvals in your inbox.",
      text: "Bills, expenses and vendor changes move through the same rules every time, and the controller only sees the ones that need a decision.",
      flows: [
        { title: "Invoice approval", path: ["ledgerly", "murmur", "ledgerly"], text: "Match bills to POs and route the exceptions.", page: "workflow-invoice-approval" },
        { title: "Vendor bank detail changes", path: ["mailroute", "murmur", "ledgerly"], text: "Hold the change until someone calls the vendor back on a known number." },
        { title: "Card spend over policy", path: ["spendloop", "murmur", "tallyroll"], text: "Ask for a receipt and a reason the same day, not at month end." },
        { title: "Month-end checklist", path: ["sheetwise", "murmur"], text: "Assign close tasks and nudge owners as each deadline nears." },
      ] },
    { id: "people", name: "People ops", image: "team-people",
      line: "Give every new hire the same first day, even in your busiest hiring month.",
      text: "Offers, records, equipment and accounts are set up in order, with the manager kept in the loop instead of left to remember.",
      flows: [
        { title: "New-hire onboarding", path: ["inkpost", "peoplebase", "gatepass", "keyring"], text: "From signed offer to ready-on-day-one.", page: "workflow-new-hire-onboarding" },
        { title: "Offboarding", path: ["peoplebase", "keyring", "parcelkit"], text: "Revoke access on the last day and send a laptop return label." },
        { title: "Role and pay changes", path: ["peoplebase", "murmur", "paycadence"], text: "Collect approvals, then update payroll on the effective date." },
        { title: "Probation check-ins", path: ["peoplebase", "murmur"], text: "Remind managers at 30, 60 and 90 days, with the form attached." },
      ] },
    { id: "it", name: "IT", image: "team-it",
      line: "Spend less time on tickets that are really just approvals.",
      text: "Access, devices and account changes are approved by the right people, granted with an end date and logged without anyone copying rows by hand.",
      flows: [
        { title: "Access requests", path: ["deskline", "murmur", "keyring", "sheetwise"], text: "Approve, grant for 90 days and log it.", page: "workflow-access-requests" },
        { title: "Quarterly access review", path: ["keyring", "murmur", "sheetwise"], text: "Send each app owner their list and record every keep or remove." },
        { title: "Lost or stolen device", path: ["deskline", "gatepass", "keyring"], text: "Lock the device and sign the person out everywhere in one go." },
        { title: "Software requests", path: ["deskline", "murmur", "fieldnote"], text: "Check for an approved alternative before anything is bought." },
      ] },
  ],

  security: {
    lede: "Your IT team will want to know how Relaypoint handles your data before anyone connects a tool. Here are the answers in plain words; the review pack has the detail.",
    items: [
      { icon: "database", q: "What does Relaypoint store?", a: "The workflow you built, a log of each run, and the fields a step needs to do its job. Attachments like invoice PDFs are passed through, not kept, unless you turn on run archives." },
      { icon: "key-round", q: "How are connections to our tools protected?", a: "Each connection uses the narrowest permission the tool offers. Credentials are encrypted and never shown again after you connect, not even to admins." },
      { icon: "eye-off", q: "Who at Relaypoint can see our data?", a: "No one by default. If you open a support case, you can grant a named engineer access to one workflow for a set number of hours, and every view is logged." },
      { icon: "user-cog", q: "Can we control who changes workflows?", a: "Yes. Builders edit, approvers only approve, and viewers only read. Every published change keeps a version you can compare and roll back." },
      { icon: "history", q: "How long are run logs kept?", a: "Ninety days by default. You can shorten that to seven days or extend it to two years, per workflow." },
      { icon: "log-out", q: "What happens if we leave?", a: "Export your workflows and run history as files at any time. When you close the account, your data is deleted within 30 days." },
    ],
    pack: ["Architecture and data-flow diagram", "Data handling and retention summary", "Completed standard security questionnaire", "Subprocessor list", "Incident response summary"],
  },

  pricing: {
    base: 200, included: 2000,
    tiers: [[20000, 0.04], [100000, 0.025], [Infinity, 0.015]],
    volumes: [1000, 5000, 25000, 100000, 250000],
    defaultVolume: 5000,
    annual: 0.1,
    notes: [
      "A run is one trip through a workflow, however many steps it has.",
      "Unlimited builders, approvers and viewers.",
      "Test runs and failed runs aren't counted.",
    ],
  },

  demo: {
    sizes: ["50–99 people", "100–249 people", "250–499 people", "500–1,000 people", "More than 1,000 people", "Fewer than 50 people"],
    windows: [
      { value: "morning", label: "Morning", desc: "9:00 AM – 12:00 PM" },
      { value: "midday", label: "Midday", desc: "12:00 – 2:00 PM" },
      { value: "afternoon", label: "Afternoon", desc: "2:00 – 5:00 PM" },
    ],
    zones: ["Eastern (ET)", "Central (CT)", "Mountain (MT)", "Pacific (PT)", "UK and Ireland (GMT)", "Central Europe (CET)"],
    covers: [
      ["Your workflow, not a script", "Tell us which process hurts most and we'll build it live in a sandbox with your kind of data."],
      ["The tools you already use", "We'll connect the integrations you pick below, so you see the real setup screens."],
      ["Cost for your volume", "We'll walk through an estimate based on how many runs you'd expect each month."],
    ],
  },

  workflows,
  tools,
  toolById,

  images: {
    "team-finance": { alt: "Two finance colleagues review a printed vendor ledger beside a laptop during month-end close", brief: "Finance ops pair at a desk during month-end close: printed ledger, highlighter, laptop with a spreadsheet, late-afternoon light", search: "accountants month end close desk", focal: "50% 45%", ratio: "4/3", ratioSm: "16/10", placement: "Home: Teams tab, Finance ops" },
    "team-people": { alt: "A people operations manager lays out a welcome kit with a laptop box and badge on a desk", brief: "People ops desk staged for a new starter: laptop box, ID badge, notebook, welcome card; hands arranging items, faces optional", search: "new employee welcome kit desk", focal: "50% 50%", ratio: "4/3", ratioSm: "16/10", placement: "Home: Teams tab, People ops" },
    "team-it": { alt: "An IT technician images a row of laptops on a workbench with labeled shelves behind", brief: "IT bench with several open laptops being set up, cable management, labeled shelving; technician in profile", search: "it technician laptop setup workbench", focal: "45% 50%", ratio: "4/3", ratioSm: "16/10", placement: "Home: Teams tab, IT" },
    "wf-invoice-approval": { alt: "An accounts payable specialist compares a paper invoice with a purchase order on a second monitor", brief: "AP specialist at a two-monitor desk holding a paper invoice, PO visible on screen (no readable real brands)", search: "accounts payable invoice office monitor", focal: "55% 45%", ratio: "21/9", ratioSm: "4/3", placement: "Invoice approval page, below the header" },
    "wf-new-hire-onboarding": { alt: "A manager hands a new hire their laptop on their first morning in a bright office", brief: "First-day handover: manager passing a laptop to a smiling new hire at a desk, morning light, candid", search: "new hire first day laptop office", focal: "50% 40%", ratio: "21/9", ratioSm: "4/3", placement: "New-hire onboarding page, below the header" },
    "wf-access-requests": { alt: "An IT administrator reviews an access request on a laptop while holding a hardware security key", brief: "Close crop: hands on a laptop keyboard, hardware security key on a lanyard, screen softly out of focus", search: "security key laptop it admin", focal: "50% 55%", ratio: "21/9", ratioSm: "4/3", placement: "Access requests page, below the header" },
    "demo-call": { alt: "A solutions engineer on a video call points to a workflow diagram on a large monitor", brief: "Solutions engineer with headset mid-explanation, large monitor showing an abstract flow diagram, calm home office", search: "video call screen share headset office", focal: "50% 45%", ratio: "16/10", placement: "Demo page, sidebar" },
  },
};
