/*! FacetUI Industry Templates · © 2026 ETKits. All rights reserved. */
// Component helpers. Every helper outputs documented Facet UI markup (FACETUI-LLMS.md §12)
// plus kit hooks (data-kit-*) that src/kit/kit.js enhances. Use these instead of writing
// Facet markup by hand so all 36 templates stay consistent.
import { html, raw, attrs, cx, esc } from "./html.mjs";

/* ------------------------------------------------------------------ icons */
export function icon(name, { size, label, className } = {}) {
  const cls = cx("icon", size && `icon-${size}`, className);
  return label
    ? html`<svg class="${cls}" role="img" aria-label="${label}"><use href="#${name}"/></svg>`
    : html`<svg class="${cls}" aria-hidden="true"><use href="#${name}"/></svg>`;
}

/* ---------------------------------------------------------------- buttons */
/**
 * btn({ label, href, variant: "primary"|"secondary"|"outline"|"ghost"|"link"|"destructive",
 *       size: "sm"|"md"|"lg", icon, iconEnd, block, type, attrs, ariaLabel })
 * href → <a>, otherwise <button>. Icon-only buttons need ariaLabel.
 */
export function btn(o) {
  const { label, href, variant = "primary", size, icon: ic, iconEnd, block, type = "button", ariaLabel, className } = o;
  const cls = cx("btn", variant !== "primary" && `btn-${variant}`, size && size !== "md" && `btn-${size}`, !label && "icon-btn", block && "btn-block", className);
  const inner = html`${ic ? icon(ic) : ""}${label || ""}${iconEnd ? icon(iconEnd) : ""}`;
  const a = { class: cls, "aria-label": ariaLabel, ...(o.attrs || {}) };
  return href ? html`<a${attrs({ href, ...a })}>${inner}</a>` : html`<button${attrs({ type, ...a })}>${inner}</button>`;
}

export const badge = (text, tone, { dot } = {}) =>
  html`<span class="${cx("badge", tone && `badge-${tone}`)}">${dot ? raw('<span class="dot"></span>') : ""}${text}</span>`;

/* ------------------------------------------------------------------ media */
/**
 * media(ctx, key, opts) — renders the image registered in content.images[key].
 * Image entry: { alt, brief, focal: "50% 40%", focalSm, ratio: "4/3", ratioSm, tone }
 *   alt ""  → decorative (alt="" / aria-hidden).
 * If build found src/templates/<slug>/images/<key>.(avif|webp|jpg|png) it renders <img>;
 * otherwise it renders an art-directed slot that is clearly marked as a pending photo.
 */
export function media(ctx, key, o = {}) {
  const im = ctx.images[key];
  if (!im) throw new Error(`[${ctx.slug}] media(): no image registered as "${key}"`);
  ctx.usedImages.add(key);
  const ratio = o.ratio || im.ratio || "4/3";
  const ratioSm = o.ratioSm || im.ratioSm || ratio;
  const style = `--k-ratio:${ratio};--k-ratio-sm:${ratioSm};--k-focal:${im.focal || "50% 50%"};--k-focal-sm:${im.focalSm || im.focal || "50% 50%"}`;
  const cls = cx("k-media", o.shape === "none" ? "" : o.shape === "sm" ? "facet-sm" : "facet", o.fill && "k-media--fill", o.className);
  const decorative = im.alt === "";
  const file = ctx.imageFiles[key];
  if (file) {
    return html`<figure class="${cls}" style="${style}"><img src="${ctx.assetImg(file)}" alt="${decorative ? "" : im.alt}" ${raw(o.priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"')} decoding="async"${attrs({ width: file.w, height: file.h })}>${o.caption ? html`<figcaption>${o.caption}</figcaption>` : ""}</figure>`;
  }
  // Pending slot: honest placeholder that still reads as part of the composition.
  return html`<figure class="${cx(cls, "k-media--pending")}" style="${style}" data-slot="${key}"${decorative ? raw(' aria-hidden="true"') : html` role="img" aria-label="${im.alt}"`}>
    <span class="k-media-art" aria-hidden="true">${icon(im.icon || "image")}</span>
    ${o.hideBrief ? "" : html`<span class="k-media-brief" aria-hidden="true">${icon("camera", { size: "sm" })}<span>Photo slot · ${im.brief}</span></span>`}
    ${o.caption ? html`<figcaption>${o.caption}</figcaption>` : ""}
  </figure>`;
}

/* ------------------------------------------------------------------ type */
export function sectionHead({ title, lede, level = 2, action, id, className, align }) {
  const H = `h${level}`;
  return html`<div class="${cx("k-section-head", align === "center" && "k-section-head--center", className)}">
    <div class="k-section-head-text">${raw(`<${H} class="k-h${level}"${id ? ` id="${esc(id)}"` : ""}>`)}${title}${raw(`</${H}>`)}${lede ? html`<p class="k-lede">${lede}</p>` : ""}</div>
    ${action || ""}
  </div>`;
}

/* ------------------------------------------------------------- navigation */
export function breadcrumb(items) {
  const parts = items.map((it, i) =>
    i === items.length - 1
      ? html`<li aria-current="page">${it.label}</li>`
      : html`<li><a href="${it.href}">${it.label}</a></li>${icon("chevron-right")}`);
  return html`<nav aria-label="Breadcrumb" class="k-breadcrumb"><ol class="breadcrumb">${parts}</ol></nav>`;
}

/** tabs({ id, label, style: "pill"|"underline", tabs: [{ id, label, panel, icon }] }) */
export function tabs({ id, label, style = "underline", tabs: list, className }) {
  const listCls = style === "pill" ? "tabs-pill" : "tabs-list";
  return html`<div class="${cx("k-tabs", className)}">
    <div class="${listCls}" role="tablist" aria-label="${label}">${list.map((t, i) =>
      html`<button class="tab" role="tab" id="${id}-tab-${t.id}" aria-controls="${id}-panel-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t.icon ? icon(t.icon, { size: "sm" }) : ""}${t.label}</button>`)}</div>
    ${list.map((t, i) => html`<div class="k-tab-panel" role="tabpanel" id="${id}-panel-${t.id}" aria-labelledby="${id}-tab-${t.id}" tabindex="0"${i ? raw(" hidden") : ""}>${t.panel}</div>`)}
  </div>`;
}

export function accordion(items, { className, openFirst } = {}) {
  return html`<div class="${cx("accordion", className)}">${items.map((it, i) =>
    html`<details${openFirst && i === 0 ? raw(" open") : ""}><summary>${it.q || it.title}${icon("chevron-down")}</summary><div>${it.a || it.body}</div></details>`)}</div>`;
}

/** stepper(["Service", "Time", "Details"], currentIndex) */
export function stepper(steps, current = 0, { id } = {}) {
  return html`<ol class="stepper k-stepper"${id ? html` id="${id}"` : ""} data-kit-stepper>${steps.map((s, i) => {
    const state = i < current ? "complete" : i === current ? "current" : "upcoming";
    return html`<li class="step" data-state="${state}"${state === "current" ? raw(' aria-current="step"') : ""}><span class="step-bar"></span><b>${s}</b><span>${state === "complete" ? "Done" : state === "current" ? "Current step" : "Next"}</span></li>`;
  })}</ol>`;
}

/* ----------------------------------------------------------------- forms */
/**
 * field({ id, label, type: text|email|tel|number|date|select|textarea|file, required, help,
 *         options: [string | {value,label}], placeholder, autocomplete, rows, value, inputmode,
 *         pattern, error, min, max, maxlength, className, span: "full" })
 * `error` is the message shown when validation fails (defaults to a sensible message).
 */
export function field(o) {
  const { id, label, type = "text", required, help, options = [], placeholder, autocomplete, rows = 4, value, inputmode, pattern, error, min, max, maxlength, multiple, accept, span } = o;
  const helpId = `${id}-help`;
  const common = { id, name: o.name || id, required, "aria-describedby": helpId, "data-error": error, autocomplete, placeholder };
  let control;
  if (type === "select") {
    control = html`<select${attrs({ class: "select", ...common, placeholder: null })}>${placeholder ? html`<option value="">${placeholder}</option>` : ""}${options.map((op) => {
      const v = typeof op === "string" ? { value: op, label: op } : op;
      return html`<option value="${v.value}"${v.value === value ? raw(" selected") : ""}>${v.label}</option>`;
    })}</select>`;
  } else if (type === "textarea") {
    control = maxlength
      ? html`<div class="textarea-wrap"><textarea${attrs({ class: "textarea", rows, maxlength, ...common })}>${value || ""}</textarea><span class="textarea-count" aria-live="polite"></span></div>`
      : html`<textarea${attrs({ class: "textarea", rows, ...common })}>${value || ""}</textarea>`;
  } else if (type === "file") {
    control = html`<label class="dropzone k-dropzone" for="${id}">${icon("upload")}<b>Choose files or drop them here</b><span class="t-caption text-tertiary">${placeholder || "PDF, JPG or PNG"}</span><input${attrs({ type: "file", class: "sr-only", ...common, placeholder: null, multiple, accept })}></label><ul class="k-file-list" data-kit-files="${id}" aria-live="polite"></ul>`;
  } else {
    control = html`<input${attrs({ class: "input", type, value, inputmode, pattern, min, max, maxlength, ...common })}>`;
  }
  return html`<div class="${cx("field", span === "full" && "k-span-full", o.className)}">
    <label class="label" for="${id}">${label}${required ? raw(' <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span>') : raw(' <span class="k-optional">Optional</span>')}</label>
    ${control}
    <span class="help" id="${helpId}" data-help="${help || ""}">${help || ""}</span>
  </div>`;
}

/**
 * choices({ name, legend, type: radio|checkbox, style: "cards"|"buttons", required, cols,
 *           options: [{ value, label, desc, icon, price, checked, disabled }] })
 */
export function choices({ name, legend, type = "radio", style = "cards", required, options, cols, help, layout, error, span }) {
  const helpId = `${name}-help`;
  return html`<fieldset class="${cx("choice-group k-fieldset", span === "full" && "k-span-full")}"${attrs({ "data-style": style === "buttons" ? "buttons" : null, "data-layout": layout, style: cols ? `--cols:${cols}` : null, "aria-describedby": helpId, "data-kit-group": name, "data-required": required ? "true" : null, "data-error": error })}>
    <legend class="label">${legend}${required ? raw(' <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span>') : ""}</legend>
    ${options.map((op) => html`<label class="choice">${op.icon && style !== "buttons" ? html`<span class="choice-icon">${icon(op.icon)}</span>` : ""}<input${attrs({ type, name, value: op.value ?? op.label, checked: op.checked, disabled: op.disabled })}>${style === "buttons" ? html`<b>${op.label}</b>` : html`<span class="choice-body"><b>${op.label}</b>${op.desc ? html`<span>${op.desc}</span>` : ""}</span>${op.price ? html`<span class="price">${op.price}</span>` : ""}`}</label>`)}
    <span class="help k-span-full" id="${helpId}" data-help="${help || ""}">${help || ""}</span>
  </fieldset>`;
}

export function checkbox({ name, label, required, checked, error, help }) {
  const helpId = `${name}-help`;
  return html`<div class="field k-span-full"><label class="check"><input${attrs({ type: "checkbox", name, id: name, required, checked, "aria-describedby": helpId, "data-error": error })}><span>${label}</span></label><span class="help" id="${helpId}" data-help="${help || ""}">${help || ""}</span></div>`;
}

/** Notice that this is a front-end demonstration. Required on every conversion flow. */
export function demoNotice(text = "This is a template demo. Nothing you enter is sent or stored.") {
  return html`<p class="k-demo-note">${icon("flask-conical", { size: "sm" })}<span>${text}</span></p>`;
}

/**
 * kitForm({ id, label, steps?: [{ title, body }], body?, submitLabel, success: { title, text, next? },
 *           error: { title, text }, summary?: Raw })
 * Validation, multi-step navigation, loading, simulated success and simulated failure
 * (append ?demo=error to the URL) are handled by kit.js.
 */
export function kitForm(o) {
  const { id, label, steps, body, submitLabel = "Submit", success, error = {}, aside, notice } = o;
  const stepTitles = steps ? steps.map((s) => s.title) : null;
  return html`<div class="k-flow" data-kit-flow>
  <form class="k-form" id="${id}" novalidate data-kit-form aria-label="${label}"${steps ? raw(' data-kit-steps') : ""}>
    ${stepTitles ? stepper(stepTitles, 0) : ""}
    <div class="alert alert-danger k-error-summary" role="alert" tabindex="-1" hidden data-kit-errors>${icon("circle-alert")}<div><div class="alert-title">Check the highlighted fields</div><ul class="alert-desc"></ul></div></div>
    <div class="alert alert-danger k-submit-error" role="alert" tabindex="-1" hidden data-kit-fail>${icon("wifi-off")}<div><div class="alert-title">${error.title || "We couldn't send your request"}</div><div class="alert-desc">${error.text || "This demo simulated a network failure. Your answers are still here. Try again."}</div></div></div>
    ${steps
      ? steps.map((s, i) => html`<fieldset class="k-step" data-step="${i}"${i ? raw(" hidden") : ""}><legend class="k-step-legend">${s.title}</legend><div class="k-form-grid">${s.body}</div></fieldset>`)
      : html`<div class="k-form-grid">${body}</div>`}
    ${notice === false ? "" : demoNotice(notice)}
    <div class="k-form-actions">
      ${steps ? html`<button type="button" class="btn btn-ghost" data-kit-back hidden>${icon("arrow-left")}Back</button>` : ""}
      <span class="grow"></span>
      ${steps ? html`<button type="button" class="btn" data-kit-next>Continue${icon("arrow-right")}</button>` : ""}
      <button type="submit" class="btn" data-kit-submit${steps ? raw(" hidden") : ""}>${submitLabel}</button>
    </div>
  </form>
  <section class="k-success" hidden tabindex="-1" data-kit-success aria-labelledby="${id}-done">
    <span class="k-success-icon">${icon("circle-check")}</span>
    <h2 class="k-h3" id="${id}-done">${success.title}</h2>
    <p class="k-lede">${success.text}</p>
    <p class="k-demo-note">${icon("flask-conical", { size: "sm" })}<span>Simulated: no request was sent. Connect this form to your own backend to go live.</span></p>
    <dl class="k-summary" data-kit-summary></dl>
    <div class="row k-success-actions">${success.next || ""}<button type="button" class="btn btn-outline" data-kit-reset>Start again</button></div>
  </section>
  ${aside || ""}
</div>`;
}

/** Calendar date + time picker, rendered by kit.js. Days in `closed` (0=Sun…6=Sat) are disabled. */
export function datePicker({ name, label, closed = [0], slots = ["9:00", "10:30", "13:00", "15:30"], required = true, timeName, timeLabel = "Time", leadDays = 1, horizon = 45 }) {
  return html`<div class="k-datepicker k-span-full" data-kit-calendar="${name}" data-closed="${closed.join(",")}" data-slots="${slots.join(",")}" data-lead="${leadDays}" data-horizon="${horizon}"${timeName ? html` data-time="${timeName}"` : ""}>
    <fieldset class="k-fieldset" data-kit-group="${name}"${required ? raw(' data-required="true"') : ""} data-error="Choose a date." aria-describedby="${name}-help">
      <legend class="label">${label}${required ? raw(' <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span>') : ""}</legend>
      <div class="card calendar k-cal" data-kit-cal-root><noscript>Turn on JavaScript to pick a date.</noscript></div>
      <input type="hidden" name="${name}" data-label="${label}">
      <span class="help" id="${name}-help" data-help=""></span>
    </fieldset>
    ${timeName ? html`<fieldset class="choice-group k-fieldset k-slots" data-style="buttons" data-kit-group="${timeName}"${required ? raw(' data-required="true"') : ""} data-error="Choose a time." aria-describedby="${timeName}-help">
      <legend class="label">${timeLabel}${required ? raw(' <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span>') : ""}</legend>
      <p class="t-body-sm text-tertiary k-slots-empty" data-kit-slots-empty>Pick a date to see open times.</p>
      <div class="k-slot-list" data-kit-slots></div>
      <span class="help k-span-full" id="${timeName}-help" data-help=""></span>
    </fieldset>` : ""}
  </div>`;
}

/* ----------------------------------------------------------- feedback */
export const emptyState = ({ icon: ic = "search-x", title, text, action }) =>
  html`<div class="empty k-empty">${raw('<span class="icon-wrap">')}${icon(ic)}${raw("</span>")}<b class="t-h5">${title}</b><p>${text}</p>${action || ""}</div>`;

export const alertBox = ({ tone = "info", icon: ic = "info", title, text, role = "status" }) =>
  html`<div class="${cx("alert", tone && `alert-${tone}`)}" role="${role}">${icon(ic)}<div><div class="alert-title">${title}</div>${text ? html`<div class="alert-desc">${text}</div>` : ""}</div></div>`;

/**
 * Filterable collection. kit.js wires chips/selects/search inside [data-kit-filter] to items
 * carrying data-* attributes. controls: Raw markup containing elements with data-filter="key"
 * (chips with data-value, <select>, or <input type=search data-filter="q">).
 */
export function filterable({ id, label, controls, items, empty, itemsClass = "", countLabel = "results" }) {
  return html`<div class="k-filter" data-kit-filter id="${id}" data-count-label="${countLabel}">
    <div class="k-filter-controls" role="group" aria-label="${label}">${controls}</div>
    <p class="k-filter-count t-label-sm text-secondary" aria-live="polite" data-kit-count></p>
    <div class="${cx("k-filter-items", itemsClass)}" data-kit-items>${items}</div>
    <div data-kit-empty hidden>${emptyState(empty)}</div>
  </div>`;
}

export const chip = (label, { filter, value, pressed = false, icon: ic } = {}) =>
  html`<button type="button" class="chip" aria-pressed="${pressed}"${attrs({ "data-filter": filter, "data-value": value })}>${ic ? icon(ic, { size: "sm" }) : ""}${label}</button>`;

/** Inline brand mark: { mark: "svg path d" | "letters" } */
export function brandMark(brand, { size = 28 } = {}) {
  if (brand.markPath) {
    return html`<svg class="k-mark" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true"><path d="${brand.markPath}"/></svg>`;
  }
  return html`<span class="logo" aria-hidden="true">${brand.markText || brand.name[0]}</span>`;
}

/** Initials avatar (Facet .avatar). tone 1–5 picks Facet's avatar color set. */
export function avatar(name, { size = "lg", tone } = {}) {
  const initials = name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/, "").split(/[\s,]+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
  const t = tone || (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % 5 + 1;
  return html`<span class="${cx("avatar", size && `avatar-${size}`, `av-${t}`)}" aria-hidden="true">${initials}</span>`;
}

/**
 * Illustrative map (Facet .map). pins: [{ x, y (percent), label, icon, popup, alt }].
 * Always pair the map with the same information as text (Facet a11y rule).
 */
export function mapFrame({ pins = [], label, height = 360, route, className, id = "map" }) {
  return html`<div class="${cx("map facet k-map", className)}" style="min-height:${height}px" role="region" aria-label="${label}">
  <div class="map-layer" style="position:absolute;inset:0"><svg class="map-base" viewBox="0 0 720 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path class="water" d="M0 300 C120 270 200 330 320 318 S540 262 720 300 V420 H0Z"/><rect class="park" x="440" y="50" width="160" height="96" rx="18"/><circle class="park" cx="128" cy="110" r="52"/>
    <path class="road" d="M-10 196 H730"/><path class="road" d="M268 -10 V430"/><path class="road minor" d="M-10 84 C200 72 420 128 730 104"/><path class="road minor" d="M530 -10 C508 150 572 250 548 430"/><path class="road minor" d="M86 -10 C118 150 64 280 126 430"/>
    ${route ? html`<path class="route" d="${route}"/>` : ""}
  </svg>
  ${pins.map((p, i) => html`<button type="button" class="${cx("map-pin", p.alt && "alt")}" style="left:${p.x}%;top:${p.y}%" data-popup="${id}-pop-${i}" aria-label="${p.label}">${icon(p.icon || "map-pin")}</button><div class="map-popup" id="${id}-pop-${i}" style="left:${p.x}%;top:${p.y}%" hidden><b>${p.label}</b>${p.popup || ""}</div>`)}
  </div>
  <div class="map-controls"><button type="button" data-zoom="in" aria-label="Zoom in">${icon("plus")}</button><button type="button" data-zoom="out" aria-label="Zoom out">${icon("minus")}</button></div>
</div>`;
}
