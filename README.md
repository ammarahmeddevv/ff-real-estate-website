# F.F Real Estate Builder & Developers — Website

Marketing and lead-generation website for F.F Real Estate Builder & Developers
(buying, selling, renting, renovation and property documentation in F.B Area,
Dastagir and across Karachi).

Built with **Next.js 15 (App Router)** and an **embedded Sanity CMS** (Sanity
Studio mounted inside the same app), styled with Tailwind CSS v3, tested with
Vitest.

## Key commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local dev server on http://localhost:3000 |
| `npm test` | Run the Vitest test suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run build` | Production build (type-checks and prerenders) |
| `npm run seed` | Seed the Sanity dataset with initial content |

Install dependencies with `npm install --legacy-peer-deps` (see below).

## Local development

This project folder name contains an `&` (`F&F REAL ESTATE`). npm runs `npm`
scripts through the platform shell, and on Windows cmd.exe / PowerShell treat `&`
as a command separator, which breaks the path and makes every `npm` script fail.
To work around this, `.npmrc` sets `script-shell=bash`, so **a bash shell must be
on your PATH** to run `npm` scripts in this folder. On Windows, install
[Git for Windows](https://git-scm.com/download/win) — it ships Git Bash — and
ensure it is on PATH. macOS/Linux already have bash; the deploy target
(Vercel/Linux) is unaffected.

Dependency installs currently require the `--legacy-peer-deps` flag due to a
transitive peer-dependency mismatch in the Sanity toolchain:

```bash
npm install --legacy-peer-deps
```

## Documentation

- Specs: `docs/superpowers/specs/`
- Plans: `docs/superpowers/plans/`
- `SETUP.md` — environment and Sanity project setup (added in a later task)

## Contributing

**No fabricated content** — properties, prices, projects, testimonials,
credentials. Use only real assets the business supplies.
