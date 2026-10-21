// Resolves Facet UI tokens (styleguide/assets/tokens.css) into the shadcn theme variables
// used by the registry's facet-theme item. Run: node scripts/gen-theme.mjs
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync(new URL("../../styleguide/assets/tokens.css", import.meta.url), "utf8");
// shadcn name -> Facet semantic token
const MAP = {
  background: "--bg-canvas", foreground: "--text-primary",
  card: "--bg-surface", "card-foreground": "--text-primary",
  popover: "--bg-elevated", "popover-foreground": "--text-primary",
  primary: "--bg-primary", "primary-foreground": "--text-on-primary",
  secondary: "--bg-secondary", "secondary-foreground": "--text-primary",
  muted: "--bg-muted", "muted-foreground": "--text-tertiary",
  accent: "--bg-hover", "accent-foreground": "--text-primary",
  destructive: "--bg-danger", "destructive-foreground": "--text-on-primary",
  border: "--border-default", input: "--border-input", ring: "--border-focus",
  "chart-1": "--chart-1", "chart-2": "--chart-2", "chart-3": "--chart-3", "chart-4": "--chart-4", "chart-5": "--chart-5",
  sidebar: "--bg-surface", "sidebar-foreground": "--text-primary", "sidebar-primary": "--bg-primary",
  "sidebar-primary-foreground": "--text-on-primary", "sidebar-accent": "--bg-hover",
  "sidebar-accent-foreground": "--text-primary", "sidebar-border": "--border-subtle", "sidebar-ring": "--border-focus",
  // Facet extras
  subtle: "--bg-subtle", "foreground-secondary": "--text-secondary", placeholder: "--text-placeholder",
  "border-subtle": "--border-subtle", "border-strong": "--border-strong",
  "primary-hover": "--bg-primary-hover", "primary-subtle": "--bg-primary-subtle", brand: "--text-brand",
  success: "--text-success", "success-subtle": "--bg-success-subtle", "success-solid": "--icon-success",
  warning: "--text-warning", "warning-subtle": "--bg-warning-subtle", "warning-solid": "--icon-warning",
  info: "--text-info", "info-subtle": "--bg-info-subtle",
  danger: "--text-danger", "danger-subtle": "--bg-danger-subtle",
  highlight: "--bg-accent", "highlight-foreground": "--text-on-accent",
  inverse: "--bg-inverse", "inverse-foreground": "--text-inverse",
  overlay: "--bg-overlay", "control-off": "--bg-control-off",
};
const RAMP = Array.from({ length: 11 }, (_, i) => [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950][i]);

const b = await chromium.launch();
const p = await b.newPage();
await p.setContent(`<html data-brand="cobalt"><head><style>${css}</style></head><body></body></html>`);
const read = (theme) => p.evaluate(([theme, MAP, RAMP]) => {
  document.documentElement.dataset.theme = theme;
  const cs = getComputedStyle(document.documentElement);
  const out = {};
  for (const [k, v] of Object.entries(MAP)) out[k] = cs.getPropertyValue(v).trim();
  for (const n of RAMP) out[`brand-${n}`] = cs.getPropertyValue(`--brand-${n}`).trim();
  return out;
}, [theme, MAP, RAMP]);
const light = await read("light"), dark = await read("dark");
const radius = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--radius-md").trim());
await b.close();
const missing = Object.entries(light).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) throw new Error("Unresolved tokens: " + missing.join(", "));
writeFileSync(new URL("../registry/facet/theme/tokens.json", import.meta.url), JSON.stringify({ radius, light, dark }, null, 2) + "\n");
console.log("radius", radius, "| light vars", Object.keys(light).length, "| sample primary", light.primary, dark.primary);
