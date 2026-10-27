/*
 * UI kit registry. Kit sources live in kits/<id>/; the storefront only publishes the
 * showcase media listed in build-storefront.mjs.
 * To add a kit: add its poster + short reel, list them in build-storefront.mjs, add an entry here,
 * and add the product to api/_lib/products.js so its purchase codes work on the claim page.
 */
window.UIKITS = [
  {
    id: "facetui",
    name: "Facet UI",
    version: "v1.3",
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
      ["158", "components"],
      ["246", "variables"],
      ["6", "AI agent demos"],
      ["10", "app templates"]
    ],
    tags: ["Figma", "Design tokens", "HTML/CSS/JS", "Tailwind preset", "Light & dark", "6 brands", "4 style themes"],
    // Never link the Figma source or the repo here: buyers get them after purchase.
    links: [
      { label: "Buy Facet UI", buy: true, primary: true },
      { label: "Live preview", href: "https://facet.etkits.us" }
    ]
  },
  {
    id: "satinui",
    name: "Satin UI",
    version: "v1.0",
    status: "available",
    label: "Product 02 · New",
    tagline: "A softer edge for your next idea.",
    description:
      "Glossy details and thoughtful depth: a Figma UI kit in light and dark, set in Barlow, with Sanoa, a collection of workspace templates built with Satin.",
    accent: "#1f7a57",
    mediaBg: "linear-gradient(#f5f5f3, #e2e3e6)", // light slides: fill around the reel to match
    poster: "kits/satinui/showcase/satin-reel-poster.jpg",
    reel: [
      { src: "kits/satinui/showcase/satin-reel.webm", type: "video/webm" },
      { src: "kits/satinui/showcase/satin-reel.mp4", type: "video/mp4" }
    ],
    stats: [
      ["109", "component families"],
      ["61", "block examples"],
      ["10", "page templates"],
      ["6", "AI agent examples"]
    ],
    tags: ["Figma", "Light & dark", "Barlow", "Glossy surfaces", "Sanoa templates", "Web preview"],
    // PLACEHOLDER: paste Satin UI's Gumroad product URL. Until then "Buy" opens the live preview.
    buyUrl: "",
    links: [
      { label: "Buy Satin UI", buy: "satinui", primary: true },
      { label: "Live preview", href: "https://satin.etkits.us" }
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
window.UIKITS_COMING_SOON = 1;
