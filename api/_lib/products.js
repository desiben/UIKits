// ETKits product catalog. One entry per product sold; secrets stay in environment variables.
// Each env list is checked in order, so a product can have its own variable (…_FACETUI) or use
// the shared one. To add a product: add an entry here, set its variables in Vercel, redeploy.
const PRODUCTS = {
  facetui: {
    name: "Facet UI",
    gumroadProductId: ["GUMROAD_PRODUCT_ID_FACETUI", "GUMROAD_PRODUCT_ID"],
    envatoItemIds: ["ENVATO_ITEM_ID_FACETUI", "ENVATO_ITEM_ID"],
    // Figma sale copy, per store first (so a leaked link can be traced and swapped per store).
    figmaUrl: { gumroad: ["FIGMA_DELIVERY_URL_FACETUI_GUMROAD", "FIGMA_DELIVERY_URL_GUMROAD"], envato: ["FIGMA_DELIVERY_URL_FACETUI_ENVATO", "FIGMA_DELIVERY_URL_ENVATO"], any: ["FIGMA_DELIVERY_URL_FACETUI", "FIGMA_DELIVERY_URL"] },
    downloadUrl: ["DOWNLOAD_URL_FACETUI", "DOWNLOAD_URL"],
    deviceLimit: ["DEVICE_LIMIT_FACETUI", "DEVICE_LIMIT"], // browsers + machines per key (style guide, npx facetui)
    claimLimit: ["CLAIM_MAX_USES_FACETUI", "CLAIM_MAX_USES"], // Figma claims per key
    defaults: { deviceLimit: 5, claimLimit: 3 },
  },
  satinui: {
    name: "Satin UI",
    gumroadProductId: ["GUMROAD_PRODUCT_ID_SATINUI"],
    envatoItemIds: ["ENVATO_ITEM_ID_SATINUI"],
    figmaUrl: { gumroad: ["FIGMA_DELIVERY_URL_SATINUI_GUMROAD"], envato: ["FIGMA_DELIVERY_URL_SATINUI_ENVATO"], any: ["FIGMA_DELIVERY_URL_SATINUI"] },
    downloadUrl: ["DOWNLOAD_URL_SATINUI"],
    deviceLimit: ["DEVICE_LIMIT_SATINUI", "DEVICE_LIMIT"],
    claimLimit: ["CLAIM_MAX_USES_SATINUI", "CLAIM_MAX_USES"],
    defaults: { deviceLimit: 5, claimLimit: 3 },
  },
}

const env = (names) => { for (const n of [].concat(names || [])) { const v = process.env[n]; if (v && String(v).trim()) return String(v).trim() } return null }
const int = (names, d) => { const n = parseInt(env(names) || "", 10); return n > 0 ? n : d }

function product(slug) {
  const p = PRODUCTS[slug]
  if (!p) return null
  return {
    slug, name: p.name,
    gumroadProductId: env(p.gumroadProductId),
    envatoItemIds: String(env(p.envatoItemIds) || "").split(",").map((s) => s.trim()).filter(Boolean),
    figmaUrl: (store) => env(p.figmaUrl[store] || []) || env(p.figmaUrl.any),
    downloadUrl: env(p.downloadUrl),
    deviceLimit: int(p.deviceLimit, p.defaults.deviceLimit),
    claimLimit: int(p.claimLimit, p.defaults.claimLimit),
  }
}
const slugs = () => Object.keys(PRODUCTS)
const byEnvatoItem = (itemId) => slugs().map(product).find((p) => p.envatoItemIds.includes(String(itemId))) || null

module.exports = { product, slugs, byEnvatoItem }
