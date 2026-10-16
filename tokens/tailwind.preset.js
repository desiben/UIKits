/** Facet UI — Tailwind CSS preset (generated). Usage: presets: [require('./tokens/tailwind.preset.js')] */
module.exports = {
  "darkMode": [
    "selector",
    "[data-theme=\"dark\"]"
  ],
  "theme": {
    "extend": {
      "colors": {
        "background": "var(--bg-canvas)",
        "foreground": "var(--text-primary)",
        "card": {
          "DEFAULT": "var(--bg-surface)",
          "foreground": "var(--text-primary)"
        },
        "popover": {
          "DEFAULT": "var(--bg-elevated)",
          "foreground": "var(--text-primary)"
        },
        "primary": {
          "DEFAULT": "var(--bg-primary)",
          "foreground": "var(--text-on-primary)",
          "hover": "var(--bg-primary-hover)"
        },
        "secondary": {
          "DEFAULT": "var(--bg-secondary)",
          "foreground": "var(--text-primary)"
        },
        "muted": {
          "DEFAULT": "var(--bg-muted)",
          "foreground": "var(--text-tertiary)"
        },
        "accent": {
          "DEFAULT": "var(--bg-accent)",
          "foreground": "var(--text-on-accent)"
        },
        "destructive": {
          "DEFAULT": "var(--bg-danger)",
          "foreground": "var(--text-on-primary)"
        },
        "border": "var(--border-default)",
        "input": "var(--border-input)",
        "ring": "var(--border-focus)",
        "bg": {
          "canvas": "var(--bg-canvas)",
          "surface": "var(--bg-surface)",
          "subtle": "var(--bg-subtle)",
          "muted": "var(--bg-muted)",
          "elevated": "var(--bg-elevated)",
          "inverse": "var(--bg-inverse)",
          "hover": "var(--bg-hover)",
          "active": "var(--bg-active)",
          "selected": "var(--bg-selected)",
          "disabled": "var(--bg-disabled)",
          "primary": "var(--bg-primary)",
          "primary-hover": "var(--bg-primary-hover)",
          "primary-active": "var(--bg-primary-active)",
          "primary-subtle": "var(--bg-primary-subtle)",
          "secondary": "var(--bg-secondary)",
          "secondary-hover": "var(--bg-secondary-hover)",
          "danger": "var(--bg-danger)",
          "danger-hover": "var(--bg-danger-hover)",
          "danger-subtle": "var(--bg-danger-subtle)",
          "success-subtle": "var(--bg-success-subtle)",
          "warning-subtle": "var(--bg-warning-subtle)",
          "info-subtle": "var(--bg-info-subtle)",
          "accent": "var(--bg-accent)",
          "overlay": "var(--bg-overlay)",
          "control-off": "var(--bg-control-off)"
        },
        "fg": {
          "primary": "var(--text-primary)",
          "secondary": "var(--text-secondary)",
          "tertiary": "var(--text-tertiary)",
          "placeholder": "var(--text-placeholder)",
          "disabled": "var(--text-disabled)",
          "inverse": "var(--text-inverse)",
          "on-primary": "var(--text-on-primary)",
          "on-accent": "var(--text-on-accent)",
          "brand": "var(--text-brand)",
          "link": "var(--text-link)",
          "danger": "var(--text-danger)",
          "success": "var(--text-success)",
          "warning": "var(--text-warning)",
          "info": "var(--text-info)"
        },
        "line": {
          "default": "var(--border-default)",
          "subtle": "var(--border-subtle)",
          "strong": "var(--border-strong)",
          "input": "var(--border-input)",
          "focus": "var(--border-focus)",
          "brand": "var(--border-brand)",
          "danger": "var(--border-danger)",
          "success": "var(--border-success)",
          "warning": "var(--border-warning)"
        },
        "icon": {
          "primary": "var(--icon-primary)",
          "secondary": "var(--icon-secondary)",
          "brand": "var(--icon-brand)",
          "on-primary": "var(--icon-on-primary)",
          "danger": "var(--icon-danger)",
          "success": "var(--icon-success)",
          "warning": "var(--icon-warning)",
          "info": "var(--icon-info)"
        },
        "chart": {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
          "6": "var(--chart-6)"
        },
        "brand": {
          "50": "var(--brand-50)",
          "100": "var(--brand-100)",
          "200": "var(--brand-200)",
          "300": "var(--brand-300)",
          "400": "var(--brand-400)",
          "500": "var(--brand-500)",
          "600": "var(--brand-600)",
          "700": "var(--brand-700)",
          "800": "var(--brand-800)",
          "900": "var(--brand-900)",
          "950": "var(--brand-950)"
        }
      },
      "borderRadius": {
        "none": "var(--radius-none)",
        "xs": "var(--radius-xs)",
        "sm": "var(--radius-sm)",
        "md": "var(--radius-md)",
        "lg": "var(--radius-lg)",
        "xl": "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "full": "var(--radius-full)"
      },
      "spacing": {
        "0": "var(--space-0)",
        "0.5": "var(--space-0-5)",
        "1": "var(--space-1)",
        "1.5": "var(--space-1-5)",
        "2": "var(--space-2)",
        "2.5": "var(--space-2-5)",
        "3": "var(--space-3)",
        "4": "var(--space-4)",
        "5": "var(--space-5)",
        "6": "var(--space-6)",
        "8": "var(--space-8)",
        "10": "var(--space-10)",
        "12": "var(--space-12)",
        "16": "var(--space-16)",
        "20": "var(--space-20)"
      },
      "fontFamily": {
        "sans": [
          "var(--font-sans)"
        ],
        "mono": [
          "var(--font-mono)"
        ]
      },
      "boxShadow": {
        "0": "var(--shadow-0)",
        "1": "var(--shadow-1)",
        "2": "var(--shadow-2)",
        "3": "var(--shadow-3)",
        "4": "var(--shadow-4)",
        "5": "var(--shadow-5)",
        "ring": "var(--ring)"
      },
      "height": {
        "control-sm": "var(--control-height-sm)",
        "control-md": "var(--control-height-md)",
        "control-lg": "var(--control-height-lg)"
      }
    }
  }
};
