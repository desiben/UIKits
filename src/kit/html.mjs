/*! FacetUI Industry Templates · © 2026 ETKits. All rights reserved. */
// Tiny HTML templating: tagged template that escapes interpolations unless they
// are already-rendered fragments (Raw). Arrays are joined. null/false/undefined render nothing.

export class Raw {
  constructor(s) { this.s = String(s); }
  toString() { return this.s; }
}

export const raw = (s) => new Raw(s);

export function esc(v) {
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function part(v) {
  if (v === null || v === undefined || v === false || v === true) return "";
  if (v instanceof Raw) return v.s;
  if (Array.isArray(v)) return v.map(part).join("");
  return esc(v);
}

export function html(strings, ...vals) {
  let out = "";
  strings.forEach((s, i) => { out += s + (i < vals.length ? part(vals[i]) : ""); });
  return new Raw(out);
}

/** Render an attribute map: { id: "x", hidden: true, "aria-label": "y", skip: null } */
export function attrs(map = {}) {
  const out = [];
  for (const [k, v] of Object.entries(map)) {
    if (v === null || v === undefined || v === false) continue;
    out.push(v === true ? k : `${k}="${esc(v)}"`);
  }
  return raw(out.length ? " " + out.join(" ") : "");
}

/** Join class names, skipping falsy entries. */
export const cx = (...c) => c.flat().filter(Boolean).join(" ");

/** URL-safe slug. */
export const slug = (s) => String(s).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
