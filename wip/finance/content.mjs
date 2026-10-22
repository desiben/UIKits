/*! FacetUI Industry Templates · Finance & Investment · © 2026 ETKits. Demo content; Clearwater Advisory is fictional. */
// Edit this file to rebrand: brand, theme, navigation, copy, fees, images and demo data live here.
// Page structure lives in pages.mjs; composition styles in template.css.
// Fees below are sample figures for the template. They are illustrative, not a quote.

const fees = {
  hourly: 250,
  plans: [
    { id: "once", label: "One-time plan", desc: "A written plan and two follow-up meetings over 90 days", billing: "Half when you sign, half when your plan is delivered" },
    { id: "ongoing", label: "Ongoing planning", desc: "Twice-yearly reviews, plus email questions any time", billing: "Billed quarterly, cancel with 30 days' notice" },
  ],
  households: [
    { id: "single", label: "Just me" },
    { id: "couple", label: "Two of us" },
  ],
  base: { once: { single: 2800, couple: 3400 }, ongoing: { single: 3600, couple: 4400 } },
  factors: [
    { id: "business", label: "I own a business or I'm self-employed", once: 1200, ongoing: 1200 },
    { id: "equity", label: "Stock options or RSUs from an employer", once: 800, ongoing: 600 },
    { id: "retire", label: "Retiring within the next five years", once: 700, ongoing: 600 },
    { id: "transition", label: "A recent inheritance, divorce or loss of a partner", once: 900, ongoing: 500 },
    { id: "property", label: "A rental or second property", once: 500, ongoing: 400 },
    { id: "college", label: "Saving for a child's college", once: 400, ongoing: 300 },
  ],
  tiers: [
    { max: 1, label: "Standard", text: "One main goal and a fairly simple tax picture." },
    { max: 3, label: "Involved", text: "A few moving parts that affect each other, like a sale and a retirement date." },
    { max: 99, label: "Complex", text: "Several income sources, entities or life changes to plan around at once." },
  ],
  paid: [
    { way: "A flat fee you agree to in writing", us: true, why: "You know the cost before any work starts, and it doesn't rise when markets do." },
    { way: "Hourly sessions for a single question", us: true, why: "Useful when you need one answer, such as whether to refinance, not a full plan." },
    { way: "A percentage of the money you invest", us: false, why: "Your fee never depends on your balance, so we have no reason to keep more money in the market." },
    { way: "Commissions on insurance, annuities or funds", us: false, why: "Nobody pays us to recommend a product, so we can tell you when you don't need one." },
    { way: "Referral fees from lawyers, accountants or lenders", us: false, why: "We introduce professionals we've worked alongside. No money changes hands." },
    { way: "A share of investment gains", us: false, why: "We don't take performance bonuses of any kind." },
  ],
};

const services = [
  {
    id: "retirement", name: "Retirement planning", icon: "sunset", forWho: "People 5 to 15 years from retiring, or recently retired",
    short: "When you can stop working, how to turn savings into a paycheck, and when to claim Social Security.",
    about: "We work out what your retirement can realistically look like: the earliest date the numbers hold up, which accounts to draw from first, and how to sequence Social Security, pensions and savings so taxes don't eat the difference.",
    presets: [["couple", "retire"], ["couple", "retire", "property"]],
    questions: [
      "When can I actually afford to retire?",
      "Should I claim Social Security at 62, 67 or 70?",
      "Which accounts should we spend from first?",
      "Can we afford to help our kids and still retire on time?",
    ],
    deliverables: ["A year-by-year retirement income map", "A Social Security claiming comparison for both of you", "A withdrawal order that accounts for taxes", "A list of the three decisions to make this year"],
    bring: ["Your most recent Social Security statements", "Account statements for retirement and savings accounts", "Pension or annuity paperwork, if any", "Last year's tax return"],
    example: "A couple, 61 and 59, want to know whether one of them can stop working next spring. We'd compare two or three retirement dates side by side, show how each changes the Social Security decision, and flag the years when a Roth conversion might be worth discussing with their accountant.",
    faqs: [
      { q: "Do you tell us exactly when to retire?", a: "We show you what each date means for your spending and taxes, and say which one we'd lean toward and why. The decision is yours." },
      { q: "Will you move our retirement accounts?", a: "No. Your accounts stay where they are. If we suggest changes, you make them, or we walk you through doing it on a call." },
    ] },
  {
    id: "home-family", name: "Home and family", icon: "house", forWho: "Households buying a home, starting a family or saving for college",
    short: "How much house you can carry, how big a down payment makes sense, and how to save for college without stalling retirement.",
    about: "Big family decisions compete for the same dollars. We look at them together: a home you can afford in a lean year, a college savings target that's honest about costs, and an emergency fund that lets you sleep.",
    presets: [["couple", "college"], ["couple", "college", "equity"]],
    questions: [
      "Can we afford to buy a home, and how much should we put down?",
      "How much should we save for college, and where?",
      "Should we pay down the mortgage or invest the difference?",
      "How much life and disability insurance do we really need?",
    ],
    deliverables: ["A home budget built from your real spending", "A down payment and cash reserve plan", "A college savings target with a monthly amount", "A plain checklist for insurance and wills"],
    bring: ["Two or three recent pay stubs", "A rough monthly budget, or three months of bank statements", "Current savings and debt balances", "Any employer benefits summary"],
    example: "A couple renting in the city want to buy within two years and have a toddler. We'd test three price ranges against their budget, show what each down payment leaves in reserve, and set a college savings amount they can start now and raise later.",
    faqs: [
      { q: "Do you work with mortgage lenders?", a: "We don't take referral fees from anyone. We can explain your options and the questions to ask a lender, then you choose who to work with." },
      { q: "Is it worth planning if we don't have much saved yet?", a: "Often it's the best time. Early decisions about debt, savings rates and insurance tend to matter more than later ones." },
    ] },
  {
    id: "business", name: "Business owners", icon: "store", forWho: "Owners of small companies and self-employed professionals",
    short: "How to pay yourself, set up a retirement plan for you and your staff, and get ready for a sale or succession.",
    about: "When your business is your biggest asset, personal and company finances are tangled. We sort out how you take money out of the business, how to save for retirement through it, and what a future sale would really mean for your household.",
    presets: [["single", "business"], ["couple", "business", "property", "retire"]],
    questions: [
      "I'm thinking about selling my business. What would it mean for us?",
      "How should I pay myself from my company?",
      "Which retirement plan makes sense for me and my staff?",
      "How much cash should the business keep on hand?",
    ],
    deliverables: ["An owner pay and draw plan you can share with your accountant", "A comparison of retirement plan options for your company", "A household plan that works with or without a sale", "Questions to ask a business broker or buyer"],
    bring: ["Two years of business and personal tax returns", "A recent profit and loss statement", "Any buy-sell or partnership agreement", "Your current payroll setup"],
    example: "The owner of a 12-person print shop has an informal offer from a competitor. We'd show what the household needs from a sale to keep its current lifestyle, compare taking the offer now with staying three more years, and list what to clarify with a tax professional before signing anything.",
    faqs: [
      { q: "Do you value businesses?", a: "No. We plan around a range of possible sale prices and can refer you to independent valuation specialists. We don't take referral fees." },
      { q: "Will you work with my accountant?", a: "Yes, with your permission. Most owner plans go better when your accountant sees the numbers too." },
    ] },
  {
    id: "transitions", name: "Inheritance and life changes", icon: "compass", forWho: "Anyone facing an inheritance, divorce, or the loss of a partner",
    short: "What to do first, what can wait, and how to take over finances that someone else used to handle.",
    about: "After a death, divorce or sudden windfall, everything feels urgent. Very little is. We help you separate the deadlines that matter from the decisions that can wait, and build a plan at a pace that suits you.",
    presets: [["single", "transition"], ["couple", "transition", "property"]],
    questions: [
      "I've inherited money. What should I do first?",
      "My partner always handled the money. Where do I start?",
      "How do we divide retirement accounts in a divorce?",
      "Should I keep the house?",
    ],
    deliverables: ["A first-90-days checklist with real deadlines", "A full picture of accounts, debts and policies", "A spending plan for the next year", "A decision list, sorted into now, soon and later"],
    bring: ["Whatever paperwork you have, in any order", "Any letters from banks, insurers or the estate's lawyer", "A list of the questions keeping you up at night"],
    example: "A widow in her late sixties is now handling bills, accounts and a small rental for the first time. We'd meet more often at the start, list every account and deadline in one place, and hold off on any investment changes until she's ready.",
    faqs: [
      { q: "Can we take this slowly?", a: "Yes. We can spread a one-time plan over a longer period at the same fee, and meet more often in the first months." },
      { q: "Do you handle the estate itself?", a: "No. Estates are handled by an executor and usually a lawyer. We coordinate with them and plan for what comes after." },
    ] },
];

const questions = [
  { q: "When can I actually afford to retire?", service: "retirement", first: "We start by matching what you spend now against income you can count on." },
  { q: "Should I claim Social Security at 62, 67 or 70?", service: "retirement", first: "We compare claiming ages for both of you, including what a survivor would receive." },
  { q: "Can we afford to buy a home, and how much should we put down?", service: "home-family", first: "We test a few price ranges against your budget in a lean year, not a good one." },
  { q: "How much should we save for college, and where?", service: "home-family", first: "We set a realistic target, then a monthly amount you can start now." },
  { q: "I'm thinking about selling my business. What would it mean for us?", service: "business", first: "We work out what your household needs from a sale before anyone names a price." },
  { q: "How should I pay myself from my company?", service: "business", first: "We look at salary, draws and retirement contributions together with your accountant." },
  { q: "I've inherited money. What should I do first?", service: "transitions", first: "Usually very little. We list the real deadlines and park the rest somewhere safe." },
  { q: "My partner always handled the money. Where do I start?", service: "transitions", first: "With one list of every account, bill and policy, at a pace that suits you." },
];

const planners = [
  { name: "Dana Whitfield", role: "Founder and lead planner", focus: "Retirement income and Social Security timing", note: "Started Clearwater after a decade explaining fees other firms didn't want to talk about." },
  { name: "Marcus Oyelaran", role: "Planner", focus: "Business owners, owner pay and business sales", note: "Grew up behind the counter of his parents' hardware store." },
  { name: "Priya Castellanos", role: "Planner", focus: "Young families, home buying and college savings", note: "Runs our free first-home workshop at the Lakeview library each spring." },
  { name: "Ellen Ruiz", role: "Client service lead", focus: "Scheduling, document checklists and secure uploads", note: "Your first point of contact, and the reason meetings start on time." },
];

export default {
  slug: "finance",
  business: "fee-only financial planning firm",
  description: "Clearwater Advisory: fee-only financial planning for households and small business owners. Plain-language answers, flat fees agreed in writing, and a free 30-minute intro call.",
  brand: { name: "Clearwater Advisory", tagline: "Fee-only financial planning in plain language", markPath: "M4 15a12 12 0 0 1 24 0Zm1 3.5h22V21H5Zm3 5h16V26H8Z" },
  theme: { mode: "light", brand: "forest", density: "comfortable", themeColor: "#ffffff" },
  header: {
    variant: "bar",
    utility: [
      { icon: "shield-check", label: "Fee-only: paid by clients, never by product companies" },
      { icon: "phone", label: "(555) 014-2280", href: "tel:+15550142280" },
      { icon: "map-pin", label: "410 Alder Street, Lakeview", page: "home", hash: "team" },
    ],
    secondary: { label: "Fee calculator", page: "home", hash: "fees" },
    cta: { label: "Book an intro call", page: "book" },
  },
  nav: [
    { label: "Questions", page: "home", hash: "questions" },
    { label: "Services", page: "home", hash: "services" },
    { label: "Fees", page: "home", hash: "fees" },
    { label: "How it works", page: "home", hash: "process" },
    { label: "Planners", page: "home", hash: "team" },
  ],
  footer: {
    variant: "statement",
    statement: "Paid by you, a flat fee, and nobody else.",
    blurb: "Fee-only financial planning for households and small business owners, by video or at our Lakeview office.",
    contact: [
      { icon: "phone", label: "(555) 014-2280", href: "tel:+15550142280" },
      { icon: "mail", label: "hello@clearwater.example", href: "mailto:hello@clearwater.example" },
      { icon: "map-pin", label: "410 Alder Street, Suite 300, Lakeview" },
    ],
    columns: [
      { title: "Planning", links: services.map((s) => ({ label: s.name, page: `service-${s.id}` })) },
      { title: "Working with us", links: [{ label: "Fees and calculator", page: "home", hash: "fees" }, { label: "How we're paid", page: "home", hash: "paid" }, { label: "How it works", page: "home", hash: "process" }, { label: "Book an intro call", page: "book" }] },
      { title: "Clearwater", links: [{ label: "Our planners", page: "home", hash: "team" }, { label: "Common questions", page: "home", hash: "faq" }, { label: "Office and directions", page: "home", hash: "team" }] },
    ],
  },
  hero: {
    title: "What do you need help with?",
    lede: "Pick the question closest to yours. Each one leads to the planning work that answers it, and to exactly what that work costs.",
    other: "Not on the list? Most people's questions aren't. Bring yours to a free 30-minute intro call.",
  },
  facts: [
    { k: "Intro call", v: "Free, 30 minutes" },
    { k: "One-time plans", v: "From $2,800" },
    { k: "Ongoing planning", v: "From $3,600 a year" },
    { k: "Single questions", v: "$250 an hour" },
  ],
  process: [
    { title: "Intro call", time: "30 minutes, free", text: "Tell us what's on your mind. We'll say whether we're a good fit and roughly what the work would cost. No forms beforehand." },
    { title: "Engagement letter", time: "Within 2 business days", text: "A one-page agreement with your flat fee, what's included and what isn't. Nothing starts until you sign it." },
    { title: "Discovery meeting", time: "90 minutes", text: "We go through your accounts, goals and worries. You upload documents to a secure folder; we never ask for logins." },
    { title: "Your written plan", time: "About 4 to 6 weeks later", text: "A plan in plain language with the numbers behind it, walked through together on a call, so every recommendation makes sense." },
    { title: "Follow-through", time: "90 days, or ongoing", text: "Help putting the plan into action. Ongoing clients meet twice a year and email questions in between." },
  ],
  office: { address: "410 Alder Street, Suite 300, Lakeview", hours: "Monday to Friday, 8:30 AM to 5:30 PM", note: "Most meetings happen by video. If you'd rather meet in person, our office is two blocks from Lakeview station, with street parking on Alder." },
  faqs: [
    { q: "What does fee-only mean?", a: "It means the only money we receive comes from the clients we work for. We don't earn commissions, referral fees or a percentage of your investments." },
    { q: "Do you hold or manage our money?", a: "No. Your accounts stay at the bank or brokerage you already use. We recommend what to do, and you or your existing provider make the changes." },
    { q: "Is there a minimum amount of savings?", a: "No. Because our fee is flat, we work with people at very different stages, from first-time home buyers to recent retirees." },
    { q: "What happens on the intro call?", a: "You talk, we listen and ask a few questions. By the end you'll know whether we can help and roughly what it would cost. There's nothing to sign." },
    { q: "Can I stop ongoing planning?", a: "Yes, with 30 days' notice. Any fee for a quarter we haven't started is refunded." },
  ],
  generalNote: "This is general information, not advice. Every household is different; a planner can only make recommendations once we understand your situation.",
  fees,
  services,
  questions,
  planners,
  topics: [
    { value: "retirement", label: "Retirement timing or income", icon: "sunset" },
    { value: "home-family", label: "Buying a home or saving for college", icon: "house" },
    { value: "business", label: "My business, or selling it", icon: "store" },
    { value: "transitions", label: "An inheritance, divorce or loss", icon: "compass" },
    { value: "investments", label: "A second look at how we're invested", icon: "scale" },
    { value: "not-sure", label: "Not sure yet", icon: "circle-help" },
  ],
  images: {
    "plan-table": { alt: "A printed financial plan open on a kitchen table, with a pen and two coffee mugs beside it", brief: "Printed plan pages with simple charts on a wooden kitchen table, two mugs, morning light, no faces", search: "financial plan paperwork kitchen table", focal: "45% 55%", ratio: "4/5", ratioSm: "4/3", placement: "Home: fee statement band" },
    "svc-retirement": { alt: "An older couple reviews printed pages together at their dining table", brief: "Couple in their sixties at a dining table reading a printed plan, relaxed, natural window light", search: "retired couple reviewing papers home", focal: "50% 40%", ratio: "16/10", ratioSm: "4/3", icon: "sunset", placement: "Services grid and retirement page header" },
    "svc-home-family": { alt: "A young family carries moving boxes into the front door of a small house", brief: "Parents and a small child carrying boxes into a modest house, front porch, daytime", search: "family moving into new house boxes", focal: "50% 50%", ratio: "16/10", ratioSm: "4/3", icon: "house", placement: "Services grid and home and family page header" },
    "svc-business": { alt: "A print shop owner checks figures on a tablet beside a large printer", brief: "Owner of a small print or woodworking shop reviewing a tablet in the workshop, staff blurred behind", search: "small business owner workshop tablet", focal: "40% 45%", ratio: "16/10", ratioSm: "4/3", icon: "store", placement: "Services grid and business owners page header" },
    "svc-transitions": { alt: "A woman sorts letters and folders into piles on a desk by a window", brief: "Person in their sixties organizing folders and letters at a desk, calm, soft daylight", search: "woman organizing documents desk window", focal: "55% 45%", ratio: "16/10", ratioSm: "4/3", icon: "compass", placement: "Services grid and life changes page header" },
    office: { alt: "A small meeting room with a round wooden table, four chairs and a large window", brief: "Small planning office meeting room, round table, plants, window onto a tree-lined street, empty", search: "small office meeting room round table", focal: "50% 55%", ratio: "4/3", placement: "Home: planners and office section" },
    "video-call": { alt: "A planner talks with a client on a video call from a tidy desk", brief: "Planner at a desk smiling at a laptop video call, notebook open, bookshelf behind, screen not legible", search: "advisor video call laptop desk", focal: "50% 40%", ratio: "3/2", icon: "video", placement: "Intro call page sidebar" },
  },
};
