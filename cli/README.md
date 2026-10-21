# facetui

The installer for **Facet UI** animated React components, made by **ETKits**.

```bash
npx facetui@latest init          # Tailwind CSS v4, the @/ alias, the Facet theme and base files
npx facetui@latest add button    # any component, with everything it needs
npx facetui@latest add --all     # every component
npx facetui@latest list          # see them all
```

Works with Next.js, Vite, React Router, Astro and TanStack Start, and with npm, pnpm, yarn and bun (`pnpm dlx facetui@latest …`, `yarn dlx facetui@latest …`, `bunx facetui@latest …`).

Components are downloaded from the Facet registry with your license key (from your Gumroad receipt). `init` asks for it once and saves it to `.env.local` as `FACET_LICENSE_KEY`. The code is copied into your project, so you own it.

| Option | |
|---|---|
| `--overwrite`, `-o` | replace files you already have (use it to update) |
| `--dry-run` | show what would change |
| `--css <file>` | your global stylesheet, if `init` can't find it |
| `--cwd <dir>` | run in another directory |

Docs and live demos: https://facetui.vercel.app/react/
