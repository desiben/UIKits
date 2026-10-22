/*! FacetUI Industry Templates · Space & Astronomy · © 2026 ETKits. Demo content; Meridian Orbital, its missions, vehicles, customers and launch site are fictional. */
// Edit this file to rebrand: brand, theme, navigation, copy, images and demo data live here.
// Page structure lives in pages.mjs; composition styles in template.css.

const orbits = {
  sso: { id: "sso", name: "Sun-synchronous orbit", short: "SSO", band: [500, 600], text: "Polar, 97 to 98 degrees. Passes over the same spot at the same local time every day, so lighting is consistent for imaging." },
  leo: { id: "leo", name: "Mid-inclination LEO", short: "Mid-inc LEO", band: [400, 480], text: "45 or 53 degrees. More passes over populated mid-latitudes and a shorter orbital life, which suits tech demos and student missions." },
};

// Missions with a detail page. Every rideshare flies on the fictional Arcline 2 vehicle.
const missions = [
  {
    id: "tidewatch", code: "MO-08", name: "Tidewatch", status: "flown", statusLabel: "Flown", orbit: "sso", altitude: 535, inclination: "97.5°", ltan: "10:30 descending node",
    date: "March 18, 2026", dateShort: "Mar 18, 2026", window: "05:47 UTC liftoff, first attempt", backup: "Not needed", pad: "Pad 2, Halvard Point", payloads: 12, booked: 12, slots: 12,
    lede: "Twelve payloads to a mid-morning sun-synchronous orbit, most of them earth-observation pathfinders that needed consistent lighting for their first images.",
    story: [
      "Tidewatch was our first mission with the second-generation dispenser plate, which carries up to sixteen cubesats and two microsatellites on a single ring. It flew with twelve aboard.",
      "Liftoff came at the opening of the window. The upper stage reached a 535 km circular orbit after two burns, and deployments ran in eight timed pairs so no two satellites left the plate in the same direction.",
    ],
    result: "All 12 payloads separated cleanly. Eleven operators reported first contact within 36 hours; the twelfth, a student 3U, made contact on day four after a ground-station software fix.",
    milestones: [
      ["done", "Manifest closed", "June 2025"], ["done", "Fit checks at Halvard Point", "January 2026"], ["done", "Dispenser integration", "February 2026"],
      ["done", "Liftoff", "March 18, 05:47 UTC"], ["done", "Last deployment", "T+2 h 14 min"], ["done", "Handover to operators", "March 20, 2026"],
    ],
    manifest: [
      ["Fernlight-1", "Fernlight Imaging", "16U", "28.4 kg", "Multispectral crop monitoring"],
      ["Tessel-A", "Tessellate Earth", "12U", "21.0 kg", "Synthetic aperture radar demonstration"],
      ["Kestrel Sat", "Carrow Institute of Technology", "3U", "4.1 kg", "Student-built radiation monitor"],
      ["Graywater-2", "Graywater Analytics", "6U", "11.2 kg", "Inland water quality imaging"],
      ["BSU-Cube 3", "Bellmont State University", "3U", "3.8 kg", "Deorbit sail experiment"],
      ["Lumen Acre P1", "Lumen Acre", "6U", "9.6 kg", "Thermal imaging of irrigated fields"],
    ],
    image: "mission-tidewatch",
  },
  {
    id: "long-field", code: "MO-09", name: "Long Field", status: "flown", statusLabel: "Flown", orbit: "leo", altitude: 450, inclination: "45.0°", ltan: "Not sun-synchronous",
    date: "August 6, 2026", dateShort: "Aug 6, 2026", window: "14:22 UTC liftoff, second attempt", backup: "First attempt scrubbed for upper-level winds", pad: "Pad 2, Halvard Point", payloads: 9, booked: 9, slots: 12,
    lede: "A lower, mid-inclination ride for student teams and short technology demonstrations that want to come home within three years.",
    story: [
      "At 450 km and 45 degrees, Long Field's payloads see the mid-latitudes several times a day and decay naturally in two to four years, without needing a propulsion system.",
      "The first attempt on August 5 was scrubbed eleven minutes before the window opened because of upper-level winds. The second attempt flew on time the following afternoon.",
    ],
    result: "All 9 payloads separated. Three university teams used the mission to qualify flight software they plan to reuse on future spacecraft.",
    milestones: [
      ["done", "Manifest closed", "November 2025"], ["done", "Fit checks at Halvard Point", "May 2026"], ["done", "Dispenser integration", "July 2026"],
      ["done", "Scrub: upper-level winds", "August 5"], ["done", "Liftoff", "August 6, 14:22 UTC"], ["done", "Handover to operators", "August 7, 2026"],
    ],
    manifest: [
      ["Ardena-Sat 2", "Ardena Polytechnic", "3U", "4.0 kg", "Low-cost star tracker test"],
      ["PAC-1", "Port Avery Community College", "1U", "1.3 kg", "Amateur radio beacon and student outreach"],
      ["Brightwell R1", "Brightwell Radio", "6U", "10.8 kg", "Ship-tracking receiver demo"],
      ["Kessling Pathfinder", "Kessling University", "6U", "12.1 kg", "Electrospray thruster test"],
      ["Northmere H0", "Northmere Hydro", "3U", "4.6 kg", "Snowpack measurement prototype"],
    ],
    image: "mission-long-field",
  },
  {
    id: "quiet-harbor", code: "MO-10", name: "Quiet Harbor", status: "upcoming", statusLabel: "Next launch", orbit: "sso", altitude: 550, inclination: "97.6°", ltan: "10:30 descending node",
    date: "November 14, 2026", dateShort: "Nov 14, 2026", target: "2026-11-14T06:12:00Z", window: "06:12 to 06:41 UTC", backup: "November 15, 06:10 to 06:39 UTC", pad: "Pad 2, Halvard Point", payloads: 14, booked: 14, slots: 14,
    lede: "Fourteen payloads to a 550 km sun-synchronous orbit. Integration is complete and the vehicle rolls out to the pad on November 9.",
    story: [
      "Quiet Harbor is fully booked. Its fourteen payloads include two microsatellites on the outer ring and a first flight for three university teams.",
      "All dispensers were closed out and mated to the plate on October 16. From here, the operators' only job is to keep batteries topped up through the access ports until two days before launch.",
    ],
    result: null,
    milestones: [
      ["done", "Manifest closed", "April 2026"], ["done", "Fit checks at Halvard Point", "August 2026"], ["done", "Dispenser integration", "October 16, 2026"],
      ["current", "Vehicle rollout to pad", "November 9, 2026"], ["next", "Liftoff", "November 14, 06:12 UTC"], ["next", "Handover to operators", "November 16, 2026"],
    ],
    manifest: [
      ["Tessel-B", "Tessellate Earth", "Microsat", "48.0 kg", "Radar imaging, second pathfinder"],
      ["Fernlight-2", "Fernlight Imaging", "16U", "29.1 kg", "Multispectral crop monitoring"],
      ["Skyfold One", "Skyfold Labs", "12U", "19.5 kg", "Deployable antenna test"],
      ["BSU-Cube 4", "Bellmont State University", "3U", "3.9 kg", "Wildfire smoke sensor"],
      ["Carrow-Sat 2", "Carrow Institute of Technology", "6U", "8.7 kg", "Inter-satellite link test"],
      ["Coastline Lab 1", "Pacific Coast Weather Lab", "6U", "10.4 kg", "Sea-surface temperature radiometer"],
    ],
    image: "mission-quiet-harbor",
  },
  {
    id: "second-light", code: "MO-11", name: "Second Light", status: "upcoming", statusLabel: "Booking open", orbit: "sso", altitude: 600, inclination: "97.8°", ltan: "13:30 ascending node",
    date: "No earlier than February 19, 2027", dateShort: "NET Feb 19, 2027", window: "Opens at 21:05 UTC, 30 minutes", backup: "Following day, same window", pad: "Pad 2, Halvard Point", payloads: 11, booked: 11, slots: 16,
    lede: "An afternoon sun-synchronous ride at 600 km, the highest orbit we fly. Five cubesat slots are still open, up to 16U.",
    story: [
      "An afternoon local time suits thermal imaging and missions that want to pair with morning satellites for twice-daily revisits.",
      "At 600 km, payloads without propulsion typically stay in orbit for more than five years. We review every customer's deorbit plan during the interface review, before a slot is confirmed.",
    ],
    result: null,
    milestones: [
      ["done", "Booking opened", "May 2026"], ["current", "Interface reviews", "Through November 2026"], ["next", "Manifest closes", "December 4, 2026"],
      ["next", "Fit checks at Halvard Point", "January 2027"], ["next", "Liftoff", "No earlier than February 19, 2027"],
    ],
    manifest: [
      ["Lumen Acre P2", "Lumen Acre", "12U", "20.2 kg", "Thermal imaging of irrigated fields"],
      ["Graywater-3", "Graywater Analytics", "6U", "11.0 kg", "Inland water quality imaging"],
      ["Ardena-Sat 3", "Ardena Polytechnic", "3U", "4.2 kg", "Star tracker, second iteration"],
      ["Northmere H1", "Northmere Hydro", "6U", "10.5 kg", "Snowpack measurement"],
    ],
    image: "mission-second-light",
  },
];

// Full manifest: missions above plus archived and future flights that have no page of their own.
const manifest = [
  { code: "MO-06", name: "First Gate", status: "flown", orbit: "leo", date: "Jul 2025", altitude: 480, inclination: "53.0°", payloads: "7 payloads deployed" },
  { code: "MO-07", name: "Harrow", status: "flown", orbit: "sso", date: "Nov 2025", altitude: 525, inclination: "97.5°", payloads: "10 payloads deployed" },
  { mission: "tidewatch" },
  { mission: "long-field" },
  { mission: "quiet-harbor", next: true },
  { mission: "second-light" },
  { code: "MO-12", name: "Ember Line", status: "upcoming", orbit: "leo", date: "May 2027", altitude: 525, inclination: "53.0°", payloads: "6 of 18 slots booked", open: true, id: "mo-12" },
];

const classes = [
  { id: "3u", name: "1U to 3U cubesat", mass: "Up to 6 kg", envelope: "10 × 10 × 34 cm", dispenser: "Shared 3U dispenser", from: "$92,000", u: 3 },
  { id: "6u", name: "6U cubesat", mass: "Up to 14 kg", envelope: "10 × 22.6 × 36.6 cm", dispenser: "6U dispenser", from: "$178,000", u: 6 },
  { id: "12u", name: "12U cubesat", mass: "Up to 24 kg", envelope: "22.6 × 22.6 × 36.6 cm", dispenser: "12U dispenser", from: "$296,000", u: 12 },
  { id: "16u", name: "16U cubesat", mass: "Up to 32 kg", envelope: "22.6 × 22.6 × 45.4 cm", dispenser: "16U dispenser", from: "$368,000", u: 16 },
  { id: "microsat", name: "Microsatellite", mass: "Up to 60 kg", envelope: "60 × 60 × 80 cm", dispenser: "Separation ring, outer plate", from: "$6,400 per kg", u: 0 },
];

export default {
  slug: "space",
  business: "small-satellite rideshare launch provider",
  description: "Meridian Orbital flies cubesats and microsatellites for universities and earth-observation startups on four rideshare missions a year. See the manifest and reserve a payload slot.",
  brand: { name: "Meridian Orbital", tagline: "Rideshare launch for small satellites",
    markPath: "M16 2a14 14 0 1 0 0 28 14 14 0 0 0 0-28Zm0 2.5a11.5 11.5 0 1 1 0 23 11.5 11.5 0 0 1 0-23ZM16 10.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM26.5 3.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" },
  theme: { mode: "dark", brand: "meridian", custom: { hex: "#4058d6" }, style: "glass", density: "comfortable", themeColor: "#070a18" },
  header: { variant: "bar", cta: { label: "Reserve a slot", page: "inquire" } },
  nav: [
    { label: "Manifest", page: "home", hash: "manifest" },
    { label: "Orbits", page: "home", hash: "orbits" },
    { label: "Payload classes", page: "home", hash: "classes" },
    { label: "Integration", page: "home", hash: "integration" },
    { label: "Next launch", page: "mission-quiet-harbor" },
  ],
  footer: {
    variant: "statement", theme: "dark",
    statement: "Four rides to orbit a year. Bring the satellite; we handle the rest of the way up.",
    blurb: "Rideshare launch for cubesats and microsatellites, from manifest to separation. Mission management office at Halvard Point.",
    contact: [
      { icon: "mail", label: "manifest@meridianorbital.example", href: "mailto:manifest@meridianorbital.example" },
      { icon: "phone", label: "(555) 014-2290", href: "tel:+15550142290" },
      { icon: "map-pin", label: "Building 4, Halvard Point Launch Complex" },
    ],
    columns: [
      { title: "Missions", links: missions.map((m) => ({ label: `${m.code} ${m.name}`, page: `mission-${m.id}` })) },
      { title: "Fly with us", links: [{ label: "Reserve a payload slot", page: "inquire" }, { label: "Payload classes", page: "home", hash: "classes" }, { label: "Integration timeline", page: "home", hash: "integration" }] },
      { title: "Learn", links: [{ label: "Orbits we fly", page: "home", hash: "orbits" }, { label: "Launch manifest", page: "home", hash: "manifest" }, { label: "For university teams", page: "home", hash: "who" }] },
    ],
  },
  hero: {
    mission: "quiet-harbor",
    lede: "Fourteen cubesats and microsatellites, one sun-synchronous orbit. Meridian Orbital flies four rideshare missions a year for universities and earth-observation startups.",
  },
  integration: [
    ["T–9 months", "Reserve a slot", "Tell us the payload class, mass and orbit. We hold a slot on the mission that fits and send the interface control document."],
    ["T–6 months", "Interface review", "Our mission engineers check your mass properties, deployables, batteries and deorbit plan against the dispenser and the orbit."],
    ["T–10 weeks", "Fit check", "Bring a flight-like unit to Halvard Point. We load it into a dispenser, check clearances and run a separation test."],
    ["T–5 weeks", "Final integration", "Your flight unit is loaded and the dispenser closed out in our cleanroom. Battery charging stays available through access ports."],
    ["T–0", "Launch and separation", "Each payload deploys on a timed sequence. You get separation confirmation and a first state vector within an hour."],
  ],
  audiences: [
    { id: "universities", icon: "graduation-cap", title: "University teams", text: "Student satellites fly at reduced rates on two slots per mission. Your team gets a named integration engineer, a fit-check rehearsal and a review of your deorbit plan written for first-time teams.", points: ["Reduced rate on 1U to 6U slots", "Fit-check rehearsal with your students", "Paperwork help for spectrum filings"] },
    { id: "startups", icon: "satellite", title: "Earth-observation startups", text: "Fly a pathfinder this year and keep a place for the next satellites. Repeat customers can hold slots on up to three future missions, with sun-synchronous options in the morning and afternoon.", points: ["Hold slots on up to three missions", "Morning and afternoon SSO", "Microsat ring for spacecraft up to 60 kg"] },
  ],
  faq: [
    { q: "What happens if the launch slips?", a: "Your slot moves with the mission. If the new date no longer works for you, you can move to the next mission with the same orbit at no extra cost, as long as there is room." },
    { q: "Can we fly a payload with propulsion?", a: "Yes. Cold gas, electrospray and other non-pyrotechnic systems are reviewed case by case during the interface review. Propellant must be loaded before you arrive at Halvard Point." },
    { q: "Do you handle export and spectrum paperwork?", a: "We don't file for you, but we tell you exactly which documents we need and when. Most teams start their spectrum filing at the same time they reserve a slot." },
    { q: "How long do payloads stay in orbit?", a: "It depends on altitude, mass and drag area. At 450 km most cubesats decay within four years; at 600 km they can stay more than five. We check every deorbit plan before confirming a slot." },
  ],
  orbits,
  missions,
  manifest,
  classes,
  images: {
    "hero-launch": { alt: "A small orbital rocket lifting off from a coastal launch pad at dawn, with a bright exhaust plume and steam clouds", brief: "Rocket liftoff at blue-hour dawn, wide frame, plume lighting the steam cloud, pad tower on the left, lots of dark sky for text", search: "rocket launch dawn plume", focal: "62% 55%", focalSm: "70% 50%", ratio: "16/9", ratioSm: "3/4", icon: "rocket", placement: "Home hero, full-bleed behind the countdown" },
    cleanroom: { alt: "Two engineers in cleanroom gowns sliding a cubesat into an open dispenser", brief: "Cleanroom integration: gloved hands loading a cubesat into a satellite dispenser, white gowns, cool light", search: "cubesat cleanroom engineers integration", focal: "50% 45%", ratio: "4/5", ratioSm: "4/3", icon: "satellite", placement: "Home: integration timeline" },
    students: { alt: "A group of university students gathered around a small satellite on a test bench", brief: "Student team around a 3U cubesat on a lab bench with laptops and test cables, candid", search: "students cubesat lab bench", focal: "50% 50%", ratio: "3/2", icon: "graduation-cap", placement: "Home: who flies with us, universities" },
    "ground-station": { alt: "A satellite ground station dish pointed at the evening sky", brief: "Tracking antenna dish at dusk, deep blue sky, first stars", search: "satellite dish antenna dusk", focal: "50% 60%", ratio: "3/2", icon: "satellite-dish", placement: "Home: who flies with us, startups" },
    "mission-tidewatch": { alt: "A rocket climbing on a long exhaust trail over the ocean before sunrise", brief: "Long-exposure arc of a launch over the sea before sunrise", search: "rocket launch long exposure ocean", focal: "50% 50%", ratio: "21/9", ratioSm: "4/3", icon: "rocket", placement: "Mission page header: MO-08 Tidewatch" },
    "mission-long-field": { alt: "A rideshare dispenser plate with several closed cubesat dispensers mounted in a ring", brief: "Payload plate with rows of closed dispensers before encapsulation, cleanroom lighting", search: "satellite payload adapter cleanroom", focal: "50% 50%", ratio: "21/9", ratioSm: "4/3", icon: "layers", placement: "Mission page header: MO-09 Long Field" },
    "mission-quiet-harbor": { alt: "A rocket standing vertical on its launch pad under floodlights at night", brief: "Vehicle vertical on the pad at night, floodlights, low angle, tower and clouds", search: "rocket launch pad night floodlights", focal: "50% 40%", ratio: "21/9", ratioSm: "4/3", icon: "rocket", placement: "Mission page header: MO-10 Quiet Harbor" },
    "mission-second-light": { alt: "A 12U cubesat with deployed solar panels on a cleanroom stand", brief: "Flight-ready cubesat with solar panels unfolded, on a stand, dark background", search: "cubesat solar panels deployed", focal: "50% 50%", ratio: "21/9", ratioSm: "4/3", icon: "satellite", placement: "Mission page header: MO-11 Second Light" },
    "fit-check": { alt: "An engineer measuring the clearance of a cubesat inside a test dispenser with calipers", brief: "Close-up of calipers checking a cubesat rail inside a dispenser, shallow depth of field", search: "engineer calipers satellite hardware", focal: "45% 50%", ratio: "4/3", icon: "ruler", placement: "Inquiry page: what happens next" },
  },
};
