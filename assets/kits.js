/*
 * UI kit registry. Each kit lives on its own branch of desiben/UIKits;
 * main only holds the ETKits landing page and a showreel per kit in kits/<id>/.
 * To add a kit: drop a poster + short reel in kits/<id>/ and add an entry here.
 */
window.UIKITS = [
  {
    id: "facetui",
    name: "Facet UI",
    version: "v1.2",
    status: "available",
    label: "Product 01 · First release",
    tagline: "The design system with an edge.",
    description:
      "A token-driven design system for SaaS, dashboards and AI apps: a Figma library, design tokens and a framework-agnostic HTML/CSS/JS implementation.",
    accent: "#8f84ff",
    poster: "kits/facetui/facet-ui-components-reel-poster.jpg",
    reel: [
      { src: "kits/facetui/facet-ui-components-reel.webm", type: "video/webm" },
      { src: "kits/facetui/facet-ui-components-reel.mp4", type: "video/mp4" }
    ],
    stats: [
      ["144", "components"],
      ["228", "variables"],
      ["6", "AI agent demos"],
      ["10", "app templates"]
    ],
    tags: ["Figma", "Design tokens", "HTML/CSS/JS", "Tailwind preset", "Light & dark", "6 brands", "4 style themes"],
    // Never link the Figma source or the repo here: buyers get them after purchase.
    links: [
      { label: "Buy Facet UI", buy: true, primary: true },
      { label: "Live preview", href: "https://facetui.vercel.app" }
    ]
  }
];

/* PLACEHOLDER: paste each store's product URL. The first store with a URL is
 * used by every "Buy" button; stores without a URL show as "Coming soon".
 * Until any URL is set, "Buy" buttons scroll to the #get section. */
window.ETKITS_STORES = [
  { name: "Gumroad", url: "" },
  { name: "Envato Market", url: "" },
  { name: "UI8", url: "" }
];

/* Placeholder tiles shown after the real kits, so the grid reads as a growing collection. */
window.UIKITS_COMING_SOON = 2;
