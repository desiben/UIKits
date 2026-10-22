/*! FacetUI Industry Templates · Healthcare & Medical · © 2026 ETKits. Demo content; Harbor Lane Health is fictional. */
// Edit this file to rebrand: brand, theme, navigation, copy, images and demo data live here.
// Page structure lives in pages.mjs; composition styles in template.css.

const services = [
  { id: "primary-care", name: "Primary care", icon: "stethoscope", ages: "All ages", short: "Checkups, chronic conditions and everyday illness, with one clinician who knows your history.", intents: ["physical", "sick"], visit: ["In person", "Video"], length: "30 min",
    about: "Your primary care clinician is your first call for almost anything: annual physicals, blood pressure and diabetes follow-ups, colds that won't clear, referrals and prescription renewals.",
    expect: [
      ["Before your visit", "Fill in the health history form in the patient portal and bring a list of the medicines you take, including supplements."],
      ["During the visit", "A medical assistant checks your vitals first. Your clinician then reviews concerns with you; there's time to ask questions."],
      ["After the visit", "Your visit summary, lab orders and any referrals appear in the portal the same day."],
    ],
    prepare: ["Photo ID and insurance card", "List of current medicines", "Questions you want answered"] },
  { id: "pediatrics", name: "Pediatrics", icon: "baby", ages: "Newborn to 18", short: "Well-child visits, vaccines and same-day sick visits, with rooms set up for small patients.", intents: ["child", "sick"], visit: ["In person", "Video"], length: "30 min",
    about: "Our pediatric team sees children from their first newborn checkup through high school sports physicals. Sick-visit slots are held back every morning for kids who woke up unwell.",
    expect: [
      ["Before your visit", "Bring your child's vaccine record if you're new to Harbor Lane. For newborns, bring the hospital discharge papers."],
      ["During the visit", "We measure growth, check development milestones and talk through sleep, feeding and behavior, whatever is on your mind."],
      ["After the visit", "Vaccine records and growth charts update in the portal so you can share them with schools and camps."],
    ],
    prepare: ["Vaccine record (new patients)", "Comfort item for younger children", "School or camp forms that need signing"] },
  { id: "womens-health", name: "Women's health", icon: "heart-pulse", ages: "Teens and adults", short: "Annual exams, contraception, pregnancy care and menopause support.", intents: ["pregnancy", "physical"], visit: ["In person", "Video"], length: "40 min",
    about: "From first gynecology visits to prenatal care and menopause, our women's health clinicians offer unhurried appointments and a chaperone on request.",
    expect: [
      ["Before your visit", "Note the first day of your last period and any symptoms you've tracked."],
      ["During the visit", "You choose what's examined. You can pause or stop at any point, and a chaperone can join if you'd like."],
      ["After the visit", "Results are released to the portal with a note from your clinician explaining what they mean."],
    ],
    prepare: ["Date of last period", "Any symptom notes", "Questions about contraception or pregnancy"] },
  { id: "physical-therapy", name: "Physical therapy", icon: "activity", ages: "12 and up", short: "Hands-on treatment and exercise plans for back, joint and sports injuries.", intents: ["pain"], visit: ["In person"], length: "50 min",
    about: "Our physical therapists assess how you move, find what's driving the pain and build a plan you can follow at home between sessions.",
    expect: [
      ["Before your visit", "Wear clothes you can move in. Shorts help for knee and hip assessments."],
      ["During the visit", "We test strength and range of motion, then start treatment in the first session."],
      ["After the visit", "Your home exercise plan, with short demo videos, is shared in the portal."],
    ],
    prepare: ["Comfortable clothes", "Any imaging reports", "Referral, if your plan requires one"] },
  { id: "behavioral-health", name: "Behavioral health", icon: "brain", ages: "12 and up", short: "Counseling and medication support for stress, anxiety, low mood and sleep.", intents: ["mood"], visit: ["In person", "Video"], length: "50 min",
    about: "Behavioral health clinicians work alongside primary care, so you can get support for anxiety, low mood or sleep without starting over somewhere new.",
    expect: [
      ["Before your visit", "You'll get a short questionnaire in the portal. Answer what you're comfortable with."],
      ["During the visit", "The first session is about understanding what's going on and what you'd like to change."],
      ["After the visit", "Together you'll agree on next steps: regular sessions, a check-in with primary care, or both."],
    ],
    prepare: ["A quiet space if you choose video", "Current medicines", "Anything you'd like to focus on"] },
  { id: "lab", name: "Lab and imaging", icon: "test-tube", ages: "All ages", short: "Blood draws, urine tests and X-ray on site, with results in the portal.", intents: ["lab"], visit: ["In person"], length: "15 min",
    about: "Most tests your clinician orders can be done in the same building. Walk in during lab hours or book a time to skip the line.",
    expect: [
      ["Before your visit", "Check your lab order in the portal. Some tests ask you to fast for 8 to 12 hours; water is fine."],
      ["During the visit", "Most draws take under five minutes. Tell us if you feel faint with needles; you can lie down."],
      ["After the visit", "Most results are ready in the portal within two working days."],
    ],
    prepare: ["Lab order (in the portal)", "Water if fasting", "Photo ID"] },
];

const locations = [
  { id: "harbor", name: "Harbor Street", address: "214 Harbor Street, Bayside", phone: "(555) 010-4200", transit: "Bus 12 and 40 stop outside. Free patient parking behind the building.", services: ["primary-care", "pediatrics", "womens-health", "lab"],
    week: [null, [450, 1140], [450, 1140], [450, 1140], [450, 1140], [450, 1140], [480, 840]], hours: [["Monday–Friday", "7:30 AM – 7:00 PM"], ["Saturday", "8:00 AM – 2:00 PM"], ["Sunday", "Closed"]], pin: { x: 62, y: 48 } },
  { id: "northgate", name: "Northgate", address: "88 Northgate Avenue, Suite 3", phone: "(555) 010-4300", transit: "Five minutes' walk from Northgate station. Garage parking validated for 2 hours.", services: ["primary-care", "physical-therapy", "behavioral-health", "lab"],
    week: [null, [480, 1080], [480, 1080], [480, 1080], [480, 1080], [480, 1080], null], hours: [["Monday–Friday", "8:00 AM – 6:00 PM"], ["Saturday", "Closed"], ["Sunday", "Closed"]], pin: { x: 38, y: 22 } },
  { id: "millbrook", name: "Millbrook", address: "5 Millbrook Commons, Millbrook", phone: "(555) 010-4400", transit: "Ample free parking. Step-free entrance from the main lot.", services: ["primary-care", "pediatrics", "physical-therapy"],
    week: [null, [480, 1020], [480, 1020], [480, 1020], [480, 1020], [480, 780], null], hours: [["Monday–Thursday", "8:00 AM – 5:00 PM"], ["Friday", "8:00 AM – 1:00 PM"], ["Weekends", "Closed"]], pin: { x: 22, y: 70 } },
];

const clinicians = [
  { name: "Dr. Amara Okafor", role: "Family medicine physician", service: "primary-care", location: "harbor", languages: "English, Igbo", accepting: true },
  { name: "Dr. Lucas Brandt", role: "Pediatrician", service: "pediatrics", location: "harbor", languages: "English, German", accepting: true },
  { name: "Priya Raman, NP", role: "Pediatric nurse practitioner", service: "pediatrics", location: "millbrook", languages: "English, Tamil", accepting: true },
  { name: "Dr. Helena Ruiz", role: "Obstetrician-gynecologist", service: "womens-health", location: "harbor", languages: "English, Spanish", accepting: false },
  { name: "Marcus Lee, DPT", role: "Physical therapist", service: "physical-therapy", location: "northgate", languages: "English", accepting: true },
  { name: "Dr. Naomi Feld", role: "Internal medicine physician", service: "primary-care", location: "northgate", languages: "English, Hebrew", accepting: false },
  { name: "Jordan Ellis, LCSW", role: "Licensed clinical social worker", service: "behavioral-health", location: "northgate", languages: "English, ASL", accepting: true },
  { name: "Sofia Marin, PA-C", role: "Physician assistant", service: "primary-care", location: "millbrook", languages: "English, Portuguese", accepting: true },
];

export default {
  slug: "healthcare",
  business: "multi-specialty community clinic",
  description: "Harbor Lane Health: primary care, pediatrics and specialist services at three neighborhood clinics. Find the right care and request an appointment online.",
  brand: { name: "Harbor Lane Health", tagline: "Neighborhood care, booked in minutes", markPath: "M16 3c-5.5 4.4-9 8.6-9 13.4C7 22 11 26.6 16 29c5-2.4 9-7 9-12.6C25 11.6 21.5 7.4 16 3Zm-1.6 8h3.2v4h4v3.2h-4v4h-3.2v-4h-4V15h4v-4Z" },
  theme: { mode: "light", brand: "lagoon", style: "soft", density: "comfortable", themeColor: "#ffffff" },
  header: {
    variant: "bar",
    utility: [
      { icon: "siren", label: "Life-threatening emergency? Call 911" },
      { icon: "phone", label: "24/7 nurse line (555) 010-4100", href: "tel:+15550104100" },
      { icon: "log-in", label: "Patient portal", page: "home", hash: "patients" },
    ],
    nav: null,
    secondary: { label: "Pay a bill", page: "home", hash: "patients" },
    cta: { label: "Book a visit", page: "book" },
  },
  nav: [
    { label: "Services", page: "home", hash: "services" },
    { label: "Clinicians", page: "home", hash: "clinicians" },
    { label: "Locations", page: "home", hash: "locations" },
    { label: "Insurance", page: "home", hash: "insurance" },
    { label: "New patients", page: "home", hash: "patients" },
  ],
  footer: {
    variant: "columns",
    blurb: "Three neighborhood clinics offering primary care, pediatrics and specialist services under one patient record.",
    contact: [
      { icon: "phone", label: "(555) 010-4200", href: "tel:+15550104200" },
      { icon: "mail", label: "hello@harborlane.example", href: "mailto:hello@harborlane.example" },
    ],
    columns: [
      { title: "Care", links: services.slice(0, 5).map((s) => ({ label: s.name, page: `service-${s.id}` })) },
      { title: "Patients", links: [{ label: "Book a visit", page: "book" }, { label: "New patients", page: "home", hash: "patients" }, { label: "Insurance and billing", page: "home", hash: "insurance" }, { label: "Locations and hours", page: "home", hash: "locations" }] },
      { title: "Harbor Lane", links: [{ label: "Our clinicians", page: "home", hash: "clinicians" }, { label: "Accessibility", page: "home", hash: "patients" }, { label: "Privacy practices", page: "home", hash: "patients" }] },
    ],
  },
  hero: {
    title: "The right care, often the same day.",
    lede: "Tell us what's going on and we'll point you to the right service and the next open appointment at your nearest clinic.",
    intents: [
      { id: "sick", label: "Feeling unwell", icon: "thermometer" },
      { id: "child", label: "My child needs care", icon: "baby" },
      { id: "physical", label: "Checkup or physical", icon: "clipboard-check" },
      { id: "pain", label: "Back or joint pain", icon: "bone" },
      { id: "mood", label: "Stress, anxiety or low mood", icon: "brain" },
      { id: "pregnancy", label: "Pregnancy or contraception", icon: "heart-pulse" },
      { id: "lab", label: "Lab work or X-ray", icon: "test-tube" },
    ],
    note: "Chest pain, trouble breathing or signs of stroke? Call 911 now.",
  },
  tasks: [
    { icon: "pill", title: "Renew a prescription", text: "Requests reviewed within one working day", hash: "patients" },
    { icon: "file-text", title: "Fill in forms before you arrive", text: "New patient, consent and history forms", hash: "patients" },
    { icon: "receipt", title: "Pay a bill", text: "Card or payment plan, no login needed", hash: "insurance" },
    { icon: "folder-open", title: "Request your records", text: "Sent to you or another provider", hash: "patients" },
  ],
  services,
  locations,
  clinicians,
  insurance: {
    plans: ["Bayview Health Plan", "Cedar Mutual PPO", "Cedar Mutual HMO", "Northstar Community Care", "Pinecrest Employer Plans", "Tidewater Medicaid Partners", "Summit Senior Advantage", "Wayfare Marketplace Silver"],
    outOfNetwork: ["Wayfare Marketplace Silver"],
    selfPay: "No insurance? A standard primary care visit is $145 for self-pay patients, and we offer interest-free payment plans.",
  },
  newPatients: [
    ["Request an appointment", "Book online or call the clinic. Tell us if you're transferring from another practice."],
    ["Complete your forms", "We'll send a portal invitation by email with health history and consent forms."],
    ["Bring ID and your insurance card", "Arrive 15 minutes early for your first visit so we can scan your documents."],
    ["Meet your care team", "Your clinician reviews your history and agrees a care plan with you."],
  ],
  faqs: [
    { q: "Do you take walk-ins?", a: "Lab draws are walk-in during lab hours. For sick visits, book online; same-day slots open at 7:00 AM each weekday." },
    { q: "Can I see the same clinician every time?", a: "Yes. You choose a primary care clinician and we book you with them whenever they're available." },
    { q: "Do you offer video visits?", a: "Many follow-ups, behavioral health sessions and minor concerns can be handled by video. The booking form shows which visit types each service offers." },
    { q: "How do I cancel or move an appointment?", a: "Use the link in your confirmation email or call the clinic. Please give 24 hours' notice so someone else can take the slot." },
  ],
  images: {
    hero: { alt: "A pediatrician kneels to talk with a young patient sitting on an exam table while a parent looks on", brief: "Clinician kneeling at eye level with a child on an exam table, parent beside them, warm daylight", search: "pediatrician child exam room parent", focal: "55% 40%", ratio: "4/5", ratioSm: "4/3", placement: "Home hero, right column" },
    "svc-primary-care": { alt: "A doctor reviews blood pressure results with an older patient", brief: "Doctor and older patient reviewing results together at a desk", search: "doctor older patient consultation", focal: "50% 40%", ratio: "16/9", placement: "Primary care page header" },
    "svc-pediatrics": { alt: "A nurse gives a toddler a sticker after a checkup", brief: "Nurse handing a toddler a sticker, child smiling on parent's lap", search: "nurse toddler checkup sticker", focal: "50% 45%", ratio: "16/9", placement: "Pediatrics page header" },
    "svc-womens-health": { alt: "A clinician talks with a pregnant patient in a consultation room", brief: "Clinician and pregnant patient talking, seated, calm consultation room", search: "prenatal consultation doctor pregnant patient", focal: "50% 45%", ratio: "16/9", placement: "Women's health page header" },
    "svc-physical-therapy": { alt: "A physical therapist guides a patient through a knee strengthening exercise", brief: "Therapist supporting a patient's knee during an exercise on a treatment table", search: "physical therapist knee exercise patient", focal: "50% 50%", ratio: "16/9", placement: "Physical therapy page header" },
    "svc-behavioral-health": { alt: "Two people talk in armchairs in a calm counseling room", brief: "Counselor and client seated in armchairs, soft light, plants, faces not the focus", search: "counseling session armchairs calm room", focal: "50% 50%", ratio: "16/9", placement: "Behavioral health page header" },
    "svc-lab": { alt: "A phlebotomist prepares to draw blood from a patient's arm", brief: "Gloved hands preparing a blood draw, tidy lab station", search: "phlebotomist blood draw clinic", focal: "50% 55%", ratio: "16/9", placement: "Lab page header" },
    "loc-harbor": { alt: "Harbor Street clinic entrance with a glass front and bike racks", brief: "Two-story neighborhood clinic with glass entrance, street trees", search: "modern medical clinic entrance street", focal: "50% 60%", ratio: "3/2", placement: "Locations tab: Harbor Street" },
    "loc-northgate": { alt: "Northgate clinic reception desk with seating area", brief: "Bright clinic reception with seating and wayfinding signs", search: "clinic reception waiting room bright", focal: "50% 50%", ratio: "3/2", placement: "Locations tab: Northgate" },
    "loc-millbrook": { alt: "Millbrook clinic building beside its parking lot", brief: "Single-story suburban clinic with accessible ramp and parking", search: "suburban medical office building", focal: "50% 60%", ratio: "3/2", placement: "Locations tab: Millbrook" },
  },
};
