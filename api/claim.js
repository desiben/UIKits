// POST /api/claim  { "key": "<gumroad license key>" }
//
// Verifies a Gumroad license key and, only for a valid, paid, non-refunded
// purchase that has not been over-used, returns the private delivery links.
// The links live in Vercel environment variables, never in the site code:
//
//   GUMROAD_PRODUCT_ID   Gumroad product ID (Product → Content → License key section)
//   FIGMA_DELIVERY_URL   Figma duplicate link for the sale copy of the kit
//   DOWNLOAD_URL         optional: link to the code + tokens download
//   CLAIM_MAX_USES       optional: claims allowed per key (default 3)
//
// Gumroad docs: https://gumroad.com/api#licenses (POST /v2/licenses/verify)

const VERIFY_URL = "https://api.gumroad.com/v2/licenses/verify";
const KEY_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

async function verify(productId, key, increment) {
  const body = new URLSearchParams({
    product_id: productId,
    license_key: key,
    increment_uses_count: increment ? "true" : "false",
  });
  const res = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  let data = null;
  try { data = await res.json(); } catch (e) { /* non-JSON error page */ }
  return { status: res.status, data };
}

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

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, error: "Use POST." });
  }

  const productId = process.env.GUMROAD_PRODUCT_ID;
  const figmaUrl = process.env.FIGMA_DELIVERY_URL;
  if (!productId || !figmaUrl) {
    return send(res, 503, { ok: false, error: "Claiming is not set up yet. Please contact support." });
  }
  const maxUses = parseInt(process.env.CLAIM_MAX_USES || "3", 10);

  const key = String(readKey(req) || "").trim();
  if (!KEY_PATTERN.test(key)) {
    return send(res, 400, { ok: false, error: "That doesn't look like a license key. Copy it from your Gumroad receipt." });
  }

  let check;
  try {
    // Check first without counting a use, so invalid or refunded keys never burn a claim.
    check = await verify(productId, key, false);
  } catch (e) {
    return send(res, 502, { ok: false, error: "Couldn't reach Gumroad. Please try again in a minute." });
  }

  const data = check.data;
  if (!data || data.success !== true || !data.purchase) {
    return send(res, 403, { ok: false, error: "This license key isn't valid for this product." });
  }
  const p = data.purchase;
  if (p.refunded || p.chargebacked || p.disputed) {
    return send(res, 403, { ok: false, error: "This purchase was refunded or disputed, so the license is no longer active." });
  }
  if (p.subscription_ended_at || p.subscription_cancelled_at || p.subscription_failed_at) {
    return send(res, 403, { ok: false, error: "This subscription is no longer active." });
  }
  if (typeof data.uses === "number" && data.uses >= maxUses) {
    return send(res, 403, { ok: false, error: "This license key has already been claimed the maximum number of times. Contact support if you need help." });
  }

  try {
    await verify(productId, key, true); // record this claim
  } catch (e) {
    // The key is valid; don't block the buyer if counting the use fails.
  }

  return send(res, 200, {
    ok: true,
    figmaUrl,
    downloadUrl: process.env.DOWNLOAD_URL || null,
    license: p.variants || null,
    usesLeft: Math.max(0, maxUses - ((data.uses || 0) + 1)),
  });
};
