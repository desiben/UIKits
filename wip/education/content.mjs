/*! FacetUI Industry Templates · Education & Learning · © 2026 ETKits. Demo content; Brightfield Academy, its courses and instructors are fictional. */
// Edit this file to rebrand: brand, theme, navigation, copy, images and demo data live here.
// Page structure lives in pages.mjs; composition styles in template.css.

// Days are indexed Monday = 0 … Sunday = 6. Times are decimal hours (18.5 = 6:30 PM).
const subjects = [
  { id: "data", label: "Data", icon: "database" },
  { id: "design", label: "Design", icon: "pen-tool" },
  { id: "trades", label: "Trades", icon: "hammer" },
  { id: "languages", label: "Languages", icon: "languages" },
];

// Terms: the Monday each term's first week begins.
const terms = [
  { id: "winter", label: "Winter term", monday: "2027-01-11", closes: "January 4" },
  { id: "spring", label: "Spring term", monday: "2027-04-05", closes: "March 29" },
  { id: "summer", label: "Summer term", monday: "2027-06-21", closes: "June 14" },
];

const courses = [
  {
    id: "data-sql", subject: "data", name: "Data analysis with SQL and spreadsheets", short: "SQL and spreadsheets", level: "Beginner",
    when: "evenings", format: ["online"], formatLabel: "Online, live", days: [1, 3], start: 18.5, end: 21, weeks: 10, tuition: 1240, materials: 0,
    seats: [4, 14, 18],
    blurb: "Go from copy-pasting reports to writing your own queries. Pivot tables first, then SQL against a real sales database.",
    about: "For people who already live in spreadsheets at work and want to answer their own questions. You'll clean messy exports, build pivot tables that hold up, then write SQL against a sample retail database until joins and grouping feel routine.",
    outcomes: ["Clean and reshape a messy export without breaking it", "Write SELECT queries with joins, grouping and filters", "Build a one-page weekly report your manager can read", "Explain where a number came from, step by step"],
    syllabus: [
      ["Weeks 1–2", "Spreadsheets that don't lie", "Tables versus ranges, lookups, data types and the five cleaning habits that prevent most reporting errors."],
      ["Weeks 3–4", "Pivot tables and charts", "Summaries by month, region and product; choosing a chart that answers the question asked."],
      ["Weeks 5–6", "First SQL", "SELECT, WHERE, ORDER BY and aggregate functions against the course database, using a browser-based editor."],
      ["Weeks 7–8", "Joins and grouping", "Combining orders, customers and products; inner and left joins; GROUP BY with HAVING."],
      ["Weeks 9–10", "Your own report", "Pick a question from your job or the sample data, query it, and present a one-page report in the final session."],
    ],
    needs: "A laptop with a current web browser. No software to install.",
    instructor: { name: "Renée Castillo", role: "Analytics lead, regional logistics", bio: "Renée has spent eleven years turning warehouse and delivery data into weekly reports for operations teams. She teaches the way she onboards new analysts: one real question per session." },
  },
  {
    id: "python", subject: "data", name: "Python for everyday automation", short: "Python automation", level: "Beginner",
    when: "evenings", format: ["online", "campus"], formatLabel: "On campus or online", days: [0, 2], start: 18.5, end: 21, weeks: 12, tuition: 1480, materials: 0,
    seats: [0, 9, 16],
    blurb: "Automate the dull parts of your week: renaming files, merging spreadsheets, sending the same email forty times.",
    about: "A first programming course for people who have a specific chore in mind. Each session is taught in Room 204 and streamed live, so you can switch between campus and home week to week. By the end you'll have written three small scripts that save you real time.",
    outcomes: ["Read and write short Python scripts with confidence", "Automate file renaming, sorting and folder clean-up", "Merge and summarize spreadsheets with pandas", "Schedule a script to run on its own"],
    syllabus: [
      ["Weeks 1–3", "Python basics", "Variables, lists, loops and functions, written in a notebook so you see results line by line."],
      ["Weeks 4–5", "Working with files", "Reading folders, renaming in bulk, handling dates in file names and avoiding accidental overwrites."],
      ["Weeks 6–8", "Spreadsheets with pandas", "Loading, filtering and merging workbooks; exporting a clean summary sheet."],
      ["Weeks 9–10", "Talking to the web", "Calling a simple web service, reading JSON and filling a template email."],
      ["Weeks 11–12", "Your automation project", "Build, test and demo a script for a task from your own work or home life."],
    ],
    needs: "A laptop you can install software on (Windows, macOS or Linux). Campus loaner laptops are available on request.",
    instructor: { name: "Owen Achterberg", role: "Software engineer, payroll systems", bio: "Owen writes payroll software by day and has been teaching beginners at Brightfield for six years. He keeps a running list of the chores past students automated, and it's long." },
  },
  {
    id: "interface-design", subject: "design", name: "Interface design foundations", short: "Interface design", level: "Beginner",
    when: "weekends", format: ["campus"], formatLabel: "On campus", days: [5], start: 9, end: 13, weeks: 8, tuition: 990, materials: 0,
    seats: [7, 12, 15],
    blurb: "Layout, type and hierarchy for screens. Sketch on paper, then build a clickable prototype of a real app idea.",
    about: "Saturday mornings in the design studio, working on paper first and screen second. You'll learn the layout and type decisions behind usable apps and websites, test your ideas on classmates, and finish with a clickable prototype you can show.",
    outcomes: ["Plan a screen with a clear visual hierarchy", "Choose and pair type for readability", "Build a clickable prototype in a free design tool", "Run a five-person hallway usability test"],
    syllabus: [
      ["Week 1", "Seeing interfaces", "Critique of everyday apps: what draws the eye, what gets lost, and why."],
      ["Weeks 2–3", "Layout and grids", "Spacing systems, alignment and grouping, practiced with paper wireframes."],
      ["Weeks 4–5", "Type and color", "Readable sizes, contrast for accessibility and a restrained color palette."],
      ["Weeks 6–7", "Prototyping", "Turning wireframes into linked screens in a free browser-based design tool."],
      ["Week 8", "Test and present", "Usability testing with classmates, revisions and a short portfolio walkthrough."],
    ],
    needs: "A sketchbook and pencils. Studio computers are provided; bring a laptop if you prefer your own.",
    instructor: { name: "Hana Vu", role: "Product designer, public-sector services", bio: "Hana designs forms and service pages people actually finish. She brings printouts of real redesigns, before and after, to almost every session." },
  },
  {
    id: "residential-wiring", subject: "trades", name: "Residential wiring fundamentals", short: "Residential wiring", level: "Beginner",
    when: "evenings", format: ["campus"], formatLabel: "On campus, workshop", days: [1, 3], start: 18, end: 21, weeks: 14, tuition: 1620, materials: 240,
    seats: [2, 10, 12],
    blurb: "Circuits, code basics and safe practice on full-size practice walls in our ground-floor workshop.",
    about: "A hands-on introduction for career changers and homeowners who want to understand residential electrical work properly. Most of every session is spent at the practice walls, wiring switches, outlets and light fixtures under supervision. This course prepares you for an apprenticeship conversation; it does not license you to do electrical work.",
    outcomes: ["Explain how a residential circuit works, panel to fixture", "Wire switches, outlets and fixtures on a practice wall", "Use a multimeter to test and troubleshoot safely", "Read a simple residential wiring plan"],
    syllabus: [
      ["Weeks 1–2", "Safety and theory", "Voltage, current and resistance; lockout habits; personal protective equipment."],
      ["Weeks 3–5", "Tools and materials", "Cable types, boxes, connectors and the hand tools you'll use every session."],
      ["Weeks 6–9", "Circuits on the wall", "Single-pole and three-way switching, receptacles and lighting circuits."],
      ["Weeks 10–12", "Testing and troubleshooting", "Multimeter practice, finding faults the instructor has planted, and fixing them."],
      ["Weeks 13–14", "Plans and pathways", "Reading plans, an overview of local code, and how apprenticeships work."],
    ],
    needs: "Closed-toe work boots and long trousers. Your tool and materials kit is included in the materials fee.",
    instructor: { name: "Marcus Delgado", role: "Licensed electrician, residential contractor", bio: "Marcus has run his own small residential electrical business for fifteen years. He teaches the safety routines first and repeats them until they're automatic." },
  },
  {
    id: "finish-carpentry", subject: "trades", name: "Finish carpentry and trim", short: "Finish carpentry", level: "Some experience",
    when: "weekends", format: ["campus"], formatLabel: "On campus, workshop", days: [5, 6], start: 9, end: 14, weeks: 6, tuition: 1180, materials: 160,
    seats: [5, 8, 10],
    blurb: "Six weekends of baseboard, casing, crown and a small built-in shelf, with clean miters and tight joints.",
    about: "For people who are comfortable with basic tools and want to do finish work that looks professional. Over six weekends you'll cut and install trim on the workshop's practice rooms, then build and fit a small built-in shelf to take home.",
    outcomes: ["Measure and cut accurate miters and copes", "Install baseboard, door casing and crown", "Fill, caulk and prepare trim for paint", "Build and scribe a small built-in shelf"],
    syllabus: [
      ["Weekend 1", "Setup and accuracy", "Miter saw setup, measuring habits and test cuts until joints close."],
      ["Weekend 2", "Baseboard", "Inside and outside corners, coping and dealing with walls that aren't straight."],
      ["Weekend 3", "Door and window casing", "Reveals, mitered casing and fixing gaps without starting over."],
      ["Weekend 4", "Crown molding", "Nested cuts, layout and installing crown on the practice ceiling."],
      ["Weekends 5–6", "Built-in shelf", "Building a small shelf unit, scribing it to an uneven wall and finishing it."],
    ],
    needs: "Safety glasses and hearing protection (loaners available). Comfort with a tape measure and drill is expected.",
    instructor: { name: "Ingrid Solberg", role: "Finish carpenter, renovation crews", bio: "Ingrid has fitted trim in old houses where nothing is square. She'll show you how to make a joint look right when the wall is wrong." },
  },
  {
    id: "workplace-spanish", subject: "languages", name: "Workplace Spanish, level 1", short: "Workplace Spanish", level: "Beginner",
    when: "evenings", format: ["online"], formatLabel: "Online, live", days: [0, 2], start: 19, end: 20.5, weeks: 10, tuition: 640, materials: 45,
    seats: [11, 16, 18],
    blurb: "Greet, explain and ask for help in Spanish at work. Small live groups, lots of speaking, very little grammar drilling.",
    about: "For people who work with Spanish-speaking customers, patients or colleagues and want to hold a simple conversation. Classes are capped at 12 and spent mostly speaking in pairs and small groups, with short practice tasks between sessions.",
    outcomes: ["Introduce yourself and your role clearly", "Ask and answer everyday workplace questions", "Give simple directions and instructions", "Handle a short phone call or front-desk exchange"],
    syllabus: [
      ["Weeks 1–2", "Introductions", "Greetings, names, roles and numbers; the sounds that trip English speakers up."],
      ["Weeks 3–4", "Where and when", "Times, days, directions around a building and making appointments."],
      ["Weeks 5–6", "Asking for help", "Polite requests, clarifying questions and what to say when you don't understand."],
      ["Weeks 7–8", "Instructions", "Giving and following simple step-by-step instructions."],
      ["Weeks 9–10", "Real conversations", "Role-played customer and colleague conversations, recorded for feedback."],
    ],
    needs: "A laptop or tablet with a camera and headset. The workbook is included in the materials fee.",
    instructor: { name: "Lucía Ferraro", role: "Interpreter and language coach", bio: "Lucía works as a community interpreter and has coached hotel, clinic and warehouse teams in workplace Spanish. Her classes are noisy, in a good way." },
  },
];

export default {
  slug: "education",
  business: "adult education school",
  description: "Brightfield Academy: part-time evening and weekend courses in data, design, the trades and languages for working adults. Search the catalog and apply online.",
  brand: { name: "Brightfield Academy", tagline: "Evening and weekend courses for working adults", markPath: "M16 3 3 9.5l13 6.5 13-6.5L16 3Zm-8.5 10.3v6.4c0 2.9 3.9 5.3 8.5 5.3s8.5-2.4 8.5-5.3v-6.4L16 17.6l-8.5-4.3ZM27 11.5v9.2h2v-10.2l-2 1Z" },
  theme: { mode: "light", brand: "ember", density: "comfortable", themeColor: "#ffffff" },
  header: {
    variant: "bar",
    utility: [
      { icon: "calendar-days", label: "Winter term starts January 11. Applications close January 4." },
      { icon: "phone", label: "Advising (555) 014-2200", href: "tel:+15550142200" },
    ],
    secondary: { label: "Talk to an advisor", page: "home", hash: "faq" },
    cta: { label: "Apply", page: "enroll" },
  },
  nav: [
    { label: "Courses", page: "home", hash: "catalog" },
    { label: "Timetable", page: "home", hash: "week" },
    { label: "Term dates", page: "home", hash: "term" },
    { label: "Tuition", page: "home", hash: "tuition" },
    { label: "Campus", page: "home", hash: "campus" },
  ],
  footer: {
    variant: "columns",
    blurb: "Part-time courses taught by working practitioners, on weeknights and weekends, on campus and online.",
    contact: [
      { icon: "map-pin", label: "400 Foundry Street, Riverton" },
      { icon: "phone", label: "(555) 014-2200", href: "tel:+15550142200" },
      { icon: "mail", label: "advising@brightfield.example", href: "mailto:advising@brightfield.example" },
    ],
    columns: [
      { title: "Courses", links: courses.map((c) => ({ label: c.short, page: `course-${c.id}` })) },
      { title: "Plan your term", links: [{ label: "Weekly timetable", page: "home", hash: "week" }, { label: "Term dates", page: "home", hash: "term" }, { label: "Tuition and payment", page: "home", hash: "tuition" }, { label: "Apply to enroll", page: "enroll" }] },
      { title: "Brightfield", links: [{ label: "Instructors", page: "home", hash: "instructors" }, { label: "Campus and access", page: "home", hash: "campus" }, { label: "Questions", page: "home", hash: "faq" }] },
    ],
  },
  hero: {
    title: "Learn a new skill after work.",
    lede: "Part-time courses on weeknights and weekends, taught by people who do the job by day. Pick a subject and a schedule that fits your week.",
  },
  subjects,
  terms,
  courses,
  term: [
    ["Now – January 4", "Apply", "Choose a course and cohort and tell us a little about yourself. It takes about ten minutes."],
    ["Within two working days", "Advising call", "A 15-minute call to check the course fits your goals and schedule, and to answer questions about payment."],
    ["Week of January 11", "First classes", "Every course starts in the same week. First sessions cover setup, so nobody falls behind on night one."],
    ["Week of February 22", "Catch-up week", "No new material in any course. Instructors hold open sessions for anyone who missed a class."],
    ["Final week", "Project night", "You present what you built or practiced and leave with a certificate of completion from Brightfield."],
  ],
  payment: [
    { id: "full", icon: "wallet", label: "Pay in full", text: "Pay tuition and materials when your seat is confirmed. Saves 5% on tuition." },
    { id: "monthly", icon: "calendar-days", label: "Three monthly payments", text: "Split the total into three equal payments, no interest or fees. The first is due a week before class." },
    { id: "employer", icon: "briefcase", label: "Invoice my employer", text: "We invoice your employer directly. Bring their purchase order or a signed approval form." },
    { id: "reduction", icon: "receipt", label: "Request a tuition reduction", text: "Brightfield sets aside seats each term at reduced tuition, based on household income. An advisor will walk you through it." },
  ],
  campus: {
    name: "Foundry Street campus",
    address: "400 Foundry Street, Riverton",
    floors: [
      ["Ground floor", "Electrical and carpentry workshops, tool crib, front desk"],
      ["Second floor", "Computer labs 201–204, quiet study room"],
      ["Third floor", "Design studio, language rooms, student lounge with kettle and microwave"],
    ],
    hours: [["Monday–Thursday", "5:00 PM – 9:30 PM"], ["Friday", "Closed"], ["Saturday–Sunday", "8:30 AM – 3:00 PM"]],
    transit: "Riverton Line to Foundry station, a three-minute walk. Free parking in the rear lot after 5:00 PM on weeknights and all day on weekends. Step-free entrance and elevator from the Foundry Street door.",
  },
  faqs: [
    { q: "I've never taken a course like this. Is a beginner course really for beginners?", a: "Yes. Courses marked Beginner assume no prior experience. The only course that expects some background is Finish carpentry, which asks that you're comfortable with a tape measure and a drill." },
    { q: "What if I miss a class?", a: "Every session has notes and practice tasks posted the same night, and online sessions are recorded. Catch-up week gives you a second chance with the instructor. You'll need to attend at least 80% of sessions to receive a certificate of completion." },
    { q: "Can I switch between campus and online?", a: "Only Python for everyday automation is taught both ways at once, so you can switch week to week. Other courses are either online or on campus for the whole term." },
    { q: "What's your refund policy?", a: "Withdraw before the second session for a full refund of tuition. After that, tuition is refunded pro rata until the halfway point. Materials kits that have been handed out aren't refundable." },
    { q: "Do these courses lead to a license?", a: "No. Brightfield awards its own certificate of completion. The trades courses prepare you for apprenticeship conversations, but licensing is handled by your state, not by us." },
  ],
  images: {
    "course-data-sql": { alt: "An adult learner at a laptop in an evening class, a spreadsheet and query results on screen", brief: "Adult learner (30s–50s) at laptop after dark, spreadsheet on screen, warm desk lamp, classmates soft in background", search: "adult evening class laptop spreadsheet", focal: "50% 45%", ratio: "4/3", icon: "database", placement: "Course page header: Data analysis with SQL" },
    "course-python": { alt: "Two adult students look at code on a shared screen in a computer lab at night", brief: "Two adults pairing on code at one monitor, computer lab, windows dark outside", search: "adults learning coding computer lab night", focal: "50% 45%", ratio: "4/3", icon: "code", placement: "Course page header: Python for everyday automation" },
    "course-interface-design": { alt: "Paper wireframe sketches of phone screens spread across a studio table", brief: "Overhead: hand-drawn phone wireframes, pencils, sticky notes on a big studio table, hands visible", search: "ux wireframe sketches paper table", focal: "50% 50%", ratio: "4/3", icon: "pen-tool", placement: "Course page header: Interface design foundations" },
    "course-residential-wiring": { alt: "A student in safety glasses wires an outlet on a practice wall in a workshop", brief: "Adult student in safety glasses wiring a receptacle on a plywood practice wall, instructor's hand pointing", search: "electrical training practice wall student", focal: "50% 40%", ratio: "4/3", icon: "plug", placement: "Course page header: Residential wiring fundamentals" },
    "course-finish-carpentry": { alt: "Hands fitting a mitered corner of trim against a workshop wall", brief: "Close-up of hands fitting a mitered baseboard corner, sawdust, natural workshop light", search: "carpenter fitting trim miter corner", focal: "50% 55%", ratio: "4/3", icon: "hammer", placement: "Course page header: Finish carpentry and trim" },
    "course-workplace-spanish": { alt: "An adult learner with a headset speaking in a live online language class", brief: "Adult at kitchen table with headset and laptop, mid-sentence, video grid of classmates on screen", search: "online language class adult headset", focal: "45% 45%", ratio: "4/3", icon: "languages", placement: "Course page header: Workplace Spanish" },
    evening: { alt: "Adults of different ages in a classroom at night, listening to an instructor at a whiteboard", brief: "Wide shot: mixed-age adult class at 7 PM, dark windows, instructor at whiteboard, coffee cups on desks", search: "adult night class classroom instructor", focal: "50% 45%", ratio: "3/2", ratioSm: "4/3", icon: "school", placement: "Home: campus section, main photo" },
    workshop: { alt: "The ground-floor workshop with practice walls, workbenches and tool storage", brief: "Clean teaching workshop: plywood practice walls, workbenches, pegboard tools, no people", search: "trade school workshop workbenches", focal: "50% 55%", ratio: "4/5", ratioSm: "4/3", icon: "wrench", placement: "Home: campus section, secondary photo" },
  },
};
