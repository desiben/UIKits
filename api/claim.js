// POST /api/claim  { "key": "<Gumroad license key or Envato purchase code>" }
//
// Verifies a purchase and, only for a valid, paid, non-refunded sale,
// returns the private delivery links. Links live in Vercel environment
// variables, never in the site code.
//
// Gumroad (license keys, e.g. 1A2B3C4D-5E6F7A8B-9C0D1E2F-3A4B5C6D):
//   GUMROAD_PRODUCT_ID          product ID (Product → Content → License key)
//   CLAIM_MAX_USES              optional: claims per key (default 3)
// Envato Market (purchase codes, a UUID like 1a2b3c4d-1a2b-1a2b-1a2b-1a2b3c4d5e6f):
//   ENVATO_TOKEN                personal token with "View your items' sales history"
//   ENVATO_ITEM_ID              item ID(s), comma separated
// Delivery (shared, or per store; the per-store value wins):
//   FIGMA_DELIVERY_URL          Figma duplicate link for the sale copy
//   FIGMA_DELIVERY_URL_GUMROAD / FIGMA_DELIVERY_URL_ENVATO
//   DOWNLOAD_URL                optional: code + tokens download
// Revocation:
//   BLOCKED_KEYS                optional: comma-separated codes to refuse
//
// UI8 has no public verification API: UI8 buyers download from UI8 directly.
//
// Gumroad: https://gumroad.com/api#licenses   Envato: https://build.envato.com/api/

const GUMROAD_VERIFY_URL = "https://api.gumroad.com/v2/licenses/verify";
const ENVATO_SALE_URL = "https://api.envato.com/v3/market/author/sale";
const ENVATO_CODE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const KEY_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function readKey(req) {
  const body = req.body;
  if (body && typeof body === "object") return body.key;
  if (typeof body === "string") {
    try { return JSON.parse(body).key; } catch (e) { return undefined; }
  }
  return undefined;
}

function deliveryFor(store) {
  const figmaUrl = process.env["FIGMA_DELIVERY_URL_" + store.toUpperCase()] || process.env.FIGMA_DELIVERY_URL;
  return figmaUrl ? { figmaUrl, downloadUrl: process.env.DOWNLOAD_URL || null } : null;
}

/* ---------- Gumroad ---------- */

async function gumroadVerify(productId, key, increment) {
  const res = await fetch(GUMROAD_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      product_id: productId,
      license_key: key,
      increment_uses_count: increment ? "true" : "false",
    }),
  });
  let data = null;
  try { data = await res.json(); } catch (e) { /* non-JSON error page */ }
  return data;
}

async function claimGumroad(key) {
  const productId = process.env.GUMROAD_PRODUCT_ID;
  const delivery = deliveryFor("gumroad");
  if (!productId || !delivery) return [503, { ok: false, error: "Claiming isn't available yet. Please contact support." }];
  const maxUses = parseInt(process.env.CLAIM_MAX_USES || "3", 10);

  // Check without counting a use, so invalid or refunded keys never burn a claim.
  const data = await gumroadVerify(productId, key, false);
  if (!data || data.success !== true || !data.purchase) {
    return [403, { ok: false, error: "This purchase code isn't valid for this product." }];
  }
  const p = data.purchase;
  if (p.refunded || p.chargebacked || p.disputed) {
    return [403, { ok: false, error: "This purchase was refunded or disputed, so it can no longer be claimed." }];
  }
  if (p.subscription_ended_at || p.subscription_cancelled_at || p.subscription_failed_at) {
    return [403, { ok: false, error: "This subscription is no longer active." }];
  }
  if (typeof data.uses === "number" && data.uses >= maxUses) {
    return [403, { ok: false, error: "This purchase code has already been claimed the maximum number of times. Contact support if you need help." }];
  }
  try { await gumroadVerify(productId, key, true); } catch (e) { /* valid key: don't block on the counter */ }

  return [200, { ok: true, store: "Gumroad", license: p.variants || null, usesLeft: Math.max(0, maxUses - ((data.uses || 0) + 1)), ...delivery }];
}

/* ---------- Envato Market ---------- */

async function claimEnvato(code) {
  const token = process.env.ENVATO_TOKEN;
  const itemIds = String(process.env.ENVATO_ITEM_ID || "").split(",").map((s) => s.trim()).filter(Boolean);
  const delivery = deliveryFor("envato");
  if (!token || !itemIds.length || !delivery) return [503, { ok: false, error: "Claiming isn't available yet. Please contact support." }];

  const res = await fetch(ENVATO_SALE_URL + "?code=" + encodeURIComponent(code), {
    headers: { Authorization: "Bearer " + token, "User-Agent": "ETKits purchase claim" },
  });
  if (res.status === 404) return [403, { ok: false, error: "This purchase code isn't valid for this product." }];
  if (!res.ok) throw new Error("Envato API " + res.status);

  let sale = null;
  try { sale = await res.json(); } catch (e) { /* fall through */ }
  if (!sale || !sale.item || !itemIds.includes(String(sale.item.id))) {
    return [403, { ok: false, error: "This purchase code isn't valid for this product." }];
  }
  return [200, { ok: true, store: "Envato", license: sale.license || null, usesLeft: null, ...delivery }];
}

/* ---------- handler ---------- */

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, error: "Use POST." });
  }

  const key = String(readKey(req) || "").trim();
  if (!KEY_PATTERN.test(key)) {
    return send(res, 400, { ok: false, error: "That doesn't look like a purchase code. Please check it and try again." });
  }
  // Keys you have revoked yourself (e.g. one shared publicly), comma separated.
  const blocked = String(process.env.BLOCKED_KEYS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (blocked.includes(key.toLowerCase())) {
    return send(res, 403, { ok: false, error: "This purchase code has been disabled. Contact support if you think this is a mistake." });
  }

  try {
    const [status, payload] = ENVATO_CODE.test(key) ? await claimEnvato(key) : await claimGumroad(key);
    return send(res, status, payload);
  } catch (e) {
    return send(res, 502, { ok: false, error: "We couldn't verify your purchase right now. Please try again in a minute." });
  }
};
