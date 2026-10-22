/*! FacetUI Industry Templates · Gaming & Esports · © 2026 ETKits. Demo content; Nightforge, its teams, players and games are fictional. */

const games = [
  { id: "vanta", name: "Vanta Arena", short: "Vanta", format: "5v5 tactical shooter", team: 5 },
  { id: "riftbound", name: "Riftbound", short: "Riftbound", format: "3v3 arena brawler", team: 3 },
  { id: "hollowstar", name: "Hollowstar", short: "Hollowstar", format: "5v5 battle arena", team: 5 },
];

const teams = [
  { id: "ember", name: "Emberline", tag: "EMB", color: 1 }, { id: "halcyon", name: "Halcyon Six", tag: "HX6", color: 2 },
  { id: "tidal", name: "Tidal Static", tag: "TDS", color: 3 }, { id: "wraith", name: "Wraithmark", tag: "WRM", color: 4 },
  { id: "nova", name: "Nova Circuit", tag: "NVC", color: 5 }, { id: "basalt", name: "Basalt Club", tag: "BSL", color: 1 },
  { id: "ghostlight", name: "Ghostlight", tag: "GHL", color: 2 }, { id: "kestrel", name: "Kestrel Union", tag: "KSU", color: 3 },
];

const tournaments = [
  { id: "winter-forge-cup", name: "Winter Forge Cup", game: "vanta", status: "open", statusLabel: "Registration open", dates: "Dec 5–14", start: "Saturday, December 5", region: "North America", format: "Swiss stage into 8-team playoffs", prize: "$12,000", slots: 64, filled: 41, entry: "Free", checkin: "60 minutes before your first match",
    prizes: [["1st", "$6,000"], ["2nd", "$3,000"], ["3rd–4th", "$1,000 each"], ["5th–8th", "$250 each"]] },
  { id: "riftbound-rookie-series", name: "Rookie Series: Riftbound", game: "riftbound", status: "open", statusLabel: "Registration open", dates: "Nov 21–22", start: "Saturday, November 21", region: "North America", format: "Double elimination, best of 3", prize: "$2,500", slots: 32, filled: 29, entry: "Free", checkin: "45 minutes before your first match",
    prizes: [["1st", "$1,250"], ["2nd", "$750"], ["3rd", "$500"]] },
  { id: "hollowstar-night-league", name: "Hollowstar Night League", game: "hollowstar", status: "live", statusLabel: "Playoffs live", dates: "Oct 3 – Nov 28", start: "Saturday, October 3", region: "North America", format: "Eight-week league, top 8 to playoffs", prize: "$8,000", slots: 16, filled: 16, entry: "$50 per team", checkin: "30 minutes before each match",
    prizes: [["1st", "$4,000"], ["2nd", "$2,000"], ["3rd–4th", "$1,000 each"]] },
  { id: "vanta-open-qualifier", name: "Vanta Open Qualifier", game: "vanta", status: "soon", statusLabel: "Opens Nov 30", dates: "Jan 9–10", start: "Saturday, January 9", region: "Europe", format: "Single elimination, best of 1 until semis", prize: "$5,000", slots: 128, filled: 0, entry: "Free", checkin: "60 minutes before your first match",
    prizes: [["1st", "$2,500"], ["2nd", "$1,500"], ["3rd–4th", "$500 each"]] },
];

export default {
  slug: "gaming",
  business: "esports organization and tournament operator",
  description: "Nightforge runs open esports tournaments for amateur and semi-pro teams. Follow live matches, browse brackets and register your team.",
  brand: { name: "Nightforge", tagline: "Open tournaments for teams that want to compete", markPath: "M16 2 4 9v14l12 7 12-7V9L16 2Zm0 5.2 7 4.1v8.4l-7 4.1-7-4.1v-8.4l7-4.1Zm0 4.3-3.3 1.9v4.2l3.3 1.9 3.3-1.9v-4.2L16 11.5Z" },
  theme: { mode: "dark", brand: "nightforge", custom: { hex: "#b623d8" }, style: "glass", density: "compact", themeColor: "#0b0b12" },
  header: { variant: "bar", secondary: { label: "Watch live", page: "home", hash: "live" }, cta: { label: "Register a team", page: "register" } },
  nav: [
    { label: "Live", page: "home", hash: "live" },
    { label: "Tournaments", page: "home", hash: "tournaments" },
    { label: "Standings", page: "home", hash: "standings" },
    { label: "Roster", page: "home", hash: "roster" },
    { label: "Rules", page: "tournament-winter-forge-cup", hash: "rules" },
  ],
  footer: {
    variant: "columns", theme: "dark",
    blurb: "Open tournaments and a small pro roster, run by players. Every event is free to watch and most are free to enter.",
    contact: [{ icon: "mail", label: "ops@nightforge.example", href: "mailto:ops@nightforge.example" }, { icon: "message-circle", label: "Community server: nightforge.example/join", href: "#live" }],
    columns: [
      { title: "Compete", links: tournaments.slice(0, 3).map((t) => ({ label: t.name, page: `tournament-${t.id}` })) },
      { title: "Follow", links: [{ label: "Live matches", page: "home", hash: "live" }, { label: "Standings", page: "home", hash: "standings" }, { label: "Pro roster", page: "home", hash: "roster" }] },
      { title: "Teams", links: [{ label: "Register a team", page: "register" }, { label: "Tournament rules", page: "tournament-winter-forge-cup", hash: "rules" }, { label: "How it works", page: "home", hash: "how" }] },
    ],
  },
  live: {
    event: "Hollowstar Night League · Playoffs, upper semifinal",
    a: "ember", b: "wraith", series: "Best of 3", map: "Game 2 of 3", seriesScore: [1, 0], score: [14, 11], clock: "18:42",
    viewers: "3,412",
  },
  schedule: [
    { time: "7:30 PM", a: "nova", b: "halcyon", event: "Night League · Upper semifinal", state: "Up next" },
    { time: "9:00 PM", a: "tidal", b: "basalt", event: "Night League · Lower round 2", state: "Tonight" },
    { time: "Sat 2:00 PM", a: "ghostlight", b: "kestrel", event: "Rookie Series · Showmatch", state: "Saturday" },
  ],
  standings: [
    { team: "ember", w: 7, l: 1, diff: "+11", pts: 21, trend: "up" },
    { team: "nova", w: 6, l: 2, diff: "+7", pts: 18, trend: "up" },
    { team: "wraith", w: 6, l: 2, diff: "+5", pts: 18, trend: "flat" },
    { team: "halcyon", w: 5, l: 3, diff: "+3", pts: 15, trend: "down" },
    { team: "tidal", w: 4, l: 4, diff: "0", pts: 12, trend: "up" },
    { team: "basalt", w: 3, l: 5, diff: "−4", pts: 9, trend: "down" },
    { team: "ghostlight", w: 1, l: 7, diff: "−10", pts: 3, trend: "flat" },
    { team: "kestrel", w: 0, l: 8, diff: "−12", pts: 0, trend: "down" },
  ],
  bracket: {
    rounds: ["Quarterfinals", "Semifinals", "Final"],
    matches: [
      [["ember", 2, "kestrel", 0], ["tidal", 1, "wraith", 2], ["nova", 2, "basalt", 1], ["halcyon", 2, "ghostlight", 0]],
      [["ember", 1, "wraith", 0, "live"], ["nova", null, "halcyon", null, "next"]],
      [[null, null, null, null, "tbd"]],
    ],
  },
  roster: [
    { handle: "Quill", name: "Maya Torres", role: "Captain · Vanta", country: "USA" },
    { handle: "Lowtide", name: "Jonas Becker", role: "Entry · Vanta", country: "Germany" },
    { handle: "Sable", name: "Aiko Mori", role: "Support · Hollowstar", country: "Japan" },
    { handle: "Rook", name: "Dev Patel", role: "Jungle · Hollowstar", country: "Canada" },
    { handle: "Fenn", name: "Lucía Herrera", role: "Riftbound", country: "Mexico" },
    { handle: "Halvard", name: "Erik Lund", role: "Coach", country: "Norway" },
  ],
  how: [
    ["Create your team", "Register a team name, tag and roster. Captains can edit the roster until check-in closes."],
    ["Check in", "Check in on match day from the team page. Missed check-ins forfeit the first match."],
    ["Play your matches", "Lobby codes appear on your team page. Report scores with a screenshot; admins verify every result."],
    ["Get paid", "Prize money is paid to the captain within 30 days of the final, after identity checks."],
  ],
  rules: [
    { q: "Who can enter?", a: "Players must be 16 or older. Players under 18 need a parent or guardian to approve their entry by email before check-in. Each player can be on one team per tournament." },
    { q: "Roster size and substitutes", a: "Rosters need the full starting lineup plus up to two substitutes. Substitutions are allowed between games in a series, not during a game." },
    { q: "Disconnects and pauses", a: "Each team has five minutes of technical pause per game. If a player can't reconnect, the team may continue or forfeit the game." },
    { q: "Fair play", a: "Cheating, account sharing or abuse of other players means removal from the event and a ban from future Nightforge tournaments." },
    { q: "Disputes", a: "Open a ticket from your team page within 15 minutes of the end of a game. An admin decision is final." },
  ],
  games,
  teams,
  tournaments,
  images: {
    live: { alt: "Two teams of players at stage computers under colored lighting during a live match", brief: "Esports stage, players at PCs with headsets, magenta and blue stage lights, crowd silhouettes", search: "esports tournament stage players lights", focal: "50% 45%", ratio: "16/9", ratioSm: "16/10", placement: "Home: live match broadcast frame", tone: "dark" },
    "game-vanta": { alt: "", brief: "Abstract key art for a tactical shooter: dark city rooftop at night, neon accents (licensed or original art only)", search: "neon city night rooftop", focal: "50% 50%", ratio: "16/9", icon: "crosshair", placement: "Tournament card art: Vanta Arena" },
    "game-riftbound": { alt: "", brief: "Abstract key art for an arena brawler: glowing energy rift, dramatic colors (original art only)", search: "abstract energy glow purple", focal: "50% 50%", ratio: "16/9", icon: "swords", placement: "Tournament card art: Riftbound" },
    "game-hollowstar": { alt: "", brief: "Abstract key art for a battle arena game: starfield over a dark landscape (original art only)", search: "starry night landscape dramatic", focal: "50% 50%", ratio: "16/9", icon: "sparkles", placement: "Tournament card art: Hollowstar" },
    venue: { alt: "Audience watching a match on a large screen in a dark arena", brief: "Crowd in a dark venue facing a giant screen, backs to camera", search: "esports arena crowd screen", focal: "50% 40%", ratio: "21/9", ratioSm: "4/3", placement: "Tournament page header" },
  },
};
