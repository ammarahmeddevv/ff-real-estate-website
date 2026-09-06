# F.F Real Estate Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, conversion-focused website for F.F Real Estate Builder & Developers (Karachi) with a self-service Sanity CMS, deployable by a non-technical owner.

**Architecture:** A single Next.js 15 (App Router, TypeScript) application. Content lives in Sanity; the Sanity Studio is embedded at `/studio` in the same app. Pages are server-rendered and fetch content through typed GROQ helpers with tag-based revalidation. Presentational components are plain React Server Components; interactivity (nav, filters, lightbox, forms, motion) is isolated to small Client Components. Lead capture writes a `lead` document to Sanity and sends an email; WhatsApp deep links are the primary conversion path everywhere.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v3, Sanity v3 (`sanity`, `next-sanity`, `@sanity/image-url`, `@sanity/client`), Framer Motion, Nodemailer, Zod, Vitest + @testing-library/react, `next/font`.

**Spec:** `docs/superpowers/specs/2026-09-05-ff-real-estate-website-design.md`

## Global Constraints

- **Node:** 20.x or later. **Package manager:** npm.
- **Next.js:** `^15`. **React:** `^19`. **App Router only** (no `pages/`).
- **Sanity:** `sanity@^3`, `next-sanity@^9`. Studio embedded at `/studio`, not a separate project.
- **No fabricated content.** Never invent properties, prices, project names, approvals, NOCs, certifications, awards, experience claims ("X years"), completed-project counts, client counts, statistics, testimonials, or reviewer names. Never add "No. 1", "most trusted", or "market leader" copy.
- **No stock or AI photography.** Section/hero backgrounds are typographic/material until the client supplies real photos. Images only ever come from the CMS.
- **Verified facts only** (copy verbatim where shown):
  - Name: `F.F Real Estate Builder & Developers`
  - Address: `R-37, Block 15, Near Taal Stop, F.B Area, Dastagir Society, Karachi, Pakistan, 75590`
  - Phone 1: `0313 3694904` (Syed Mustafa Rehman) — WhatsApp E.164 `923133694904`
  - Phone 2: `0345 4569090` (Mohammad Salman) — WhatsApp E.164 `923454569090`
  - Email: `f.f.realestate333@gmail.com`
  - Facebook page: `https://www.facebook.com/F.F.REBAD/`
  - Facebook group: `https://www.facebook.com/groups/397312108831460/`
  - Services (confirmed): Property Buying, Property Selling, Property Rentals, Renovation, Documentation, Property Consultation.
  - Areas: F.B Area, Dastagir Society, Scheme 33, Scheme 45.
  - **Business hours: unknown — never display hours unless `siteSettings.hours` is non-empty.**
  - **Never publish** phone numbers `0345 2913531`, `0334 4890901`, `0334 1360110`.
- **Palette tokens:** `--ink #111113`, `--ink-soft #1B1B1E`, `--ivory #F5F1E8`, `--paper #FBFAF6`, `--gold #C7A253`, `--gold-deep #A6863F`, `--gray-500 #6B6B70`, `--gray-200 #E4E1D8`, `--line-dark rgba(255,255,255,0.12)`. Gold is used only for hairlines, uppercase micro-labels, focus rings, active chips, small CTA accents. No gold gradients, no large gold fills.
- **Fonts:** Fraunces (display, headings + pull quotes), Inter (body, UI, prices). Self-hosted via `next/font/google`.
- **Motion:** every animation must be disabled (no transforms, immediate final state) under `prefers-reduced-motion: reduce`.
- **Accessibility:** WCAG AA contrast, one `<h1>` per page, visible gold focus rings, keyboard-operable menus/lightbox/forms, every CMS image requires `alt`.
- **Tests:** Vitest. `npm test` must pass at the end of every task. Commit at the end of every task.

---

## File Structure

```
package.json, next.config.mjs, tsconfig.json, tailwind.config.ts, postcss.config.mjs,
vitest.config.ts, vitest.setup.ts, .env.example, .gitignore, sanity.config.ts, sanity.cli.ts, SETUP.md

src/
  app/
    layout.tsx                     root shell: fonts, <Nav>, <Footer>, <FloatingWhatsApp>, <MobileActionBar>
    globals.css                    design tokens + Tailwind layers
    page.tsx                       home
    sitemap.ts, robots.ts, not-found.tsx, opengraph-image.tsx
    properties/page.tsx            list + filters
    properties/[slug]/page.tsx     detail
    projects/page.tsx
    projects/[slug]/page.tsx
    about/page.tsx
    services/page.tsx
    why-ff/page.tsx
    contact/page.tsx
    news/page.tsx
    news/[slug]/page.tsx
    gallery/page.tsx
    studio/[[...tool]]/page.tsx     embedded Sanity Studio
    api/lead/route.ts              lead submission handler
  components/
    nav/Nav.tsx, nav/MobileMenu.tsx
    layout/Footer.tsx, layout/FloatingWhatsApp.tsx, layout/MobileActionBar.tsx,
      layout/Container.tsx, layout/Section.tsx
    ui/Button.tsx, ui/MicroLabel.tsx, ui/Chip.tsx, ui/Field.tsx, ui/WhatsAppButton.tsx
    motion/Reveal.tsx, motion/useReducedMotionSafe.ts
    home/Hero.tsx, home/HeroInquiryPanel.tsx, home/TrustBar.tsx, home/FeaturedProperties.tsx,
      home/FeaturedProjects.tsx, home/ServicesStrip.tsx, home/WhyFF.tsx, home/AboutTeaser.tsx,
      home/LatestFromFF.tsx, home/LocationBlock.tsx, home/ContactCta.tsx
    property/PropertyCard.tsx, property/PropertyGrid.tsx, property/PropertyFilters.tsx,
      property/PropertyGallery.tsx, property/PropertyQuickDetails.tsx, property/PropertyInquiryPanel.tsx
    project/ProjectCard.tsx, project/ProjectGrid.tsx
    gallery/GalleryGrid.tsx, gallery/GalleryFilters.tsx, gallery/Lightbox.tsx
    news/NewsCard.tsx, news/NewsGrid.tsx
    content/PortableText.tsx
    forms/InquiryForm.tsx, forms/FormStatus.tsx
    seo/JsonLd.tsx
    EmptyState.tsx
  lib/
    sanity/client.ts, sanity/image.ts, sanity/queries.ts, sanity/fetch.ts, sanity/types.ts
    whatsapp.ts, format.ts, filters.ts, leads.ts, email.ts, site.ts, metadata.ts
  sanity/
    env.ts, structure.ts
    schemaTypes/index.ts + siteSettings.ts, property.ts, project.ts, service.ts, agent.ts,
      newsPost.ts, galleryImage.ts, testimonial.ts, lead.ts, objects.ts
  styles/fonts.ts
scripts/seed.ts
tests/
  lib/whatsapp.test.ts, lib/format.test.ts, lib/filters.test.ts, lib/leads.test.ts, lib/metadata.test.ts
  api/lead.test.ts
  sanity/schema.test.ts
  components/PropertyCard.test.tsx, components/Nav.test.tsx
```

---

## Task 1: Project scaffold, tokens, fonts, test runner

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `.gitignore`, `.env.example`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/styles/fonts.ts`
- Create: `tests/lib/smoke.test.ts`

**Interfaces:**
- Produces: `fonts` export from `src/styles/fonts.ts` → `{ fraunces: NextFont, inter: NextFont }` with CSS variables `--font-fraunces`, `--font-inter`.
- Produces: Tailwind theme colors keyed to the palette tokens (`ink`, `ink-soft`, `ivory`, `paper`, `gold`, `gold-deep`, `gray-500`, `gray-200`); font families `display` → Fraunces, `sans` → Inter.

- [ ] **Step 1: Initialise the project**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint --no-turbopack --import-alias "@/*"
```
Accept overwrite of the empty repo. If it refuses because the directory is non-empty, move `docs/` aside, run, then move it back.

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm i sanity@^3 next-sanity@^9 @sanity/image-url @sanity/client @sanity/vision styled-components framer-motion zod nodemailer
npm i -D vitest @vitejs/plugin-react vite-tsconfig-paths @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/nodemailer
```

- [ ] **Step 3: Configure Vitest**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
```

Create `vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`, `"seed": "npx tsx scripts/seed.ts"`.

- [ ] **Step 4: Write the smoke test**

Create `tests/lib/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("test runner", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run the smoke test — expect PASS**

Run: `npm test`
Expected: 1 passed.

- [ ] **Step 6: Define design tokens**

Replace `src/app/globals.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --ink: #111113;
  --ink-soft: #1B1B1E;
  --ivory: #F5F1E8;
  --paper: #FBFAF6;
  --gold: #C7A253;
  --gold-deep: #A6863F;
  --gray-500: #6B6B70;
  --gray-200: #E4E1D8;
  --line-dark: rgba(255, 255, 255, 0.12);
}

@layer base {
  html { scroll-behavior: smooth; }
  body { background: var(--ivory); color: var(--ink); font-family: var(--font-inter), system-ui, sans-serif; }
  h1, h2, h3, h4 { font-family: var(--font-fraunces), Georgia, serif; font-weight: 400; }
  ::selection { background: var(--gold); color: var(--ink); }
  :focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}

.u-micro-label { font-family: var(--font-inter), sans-serif; text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; color: var(--gold-deep); }
```

- [ ] **Step 7: Configure fonts**

Create `src/styles/fonts.ts`:
```ts
import { Fraunces, Inter } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
```

- [ ] **Step 8: Configure Tailwind theme**

In `tailwind.config.ts`, set `content` to `["./src/**/*.{ts,tsx}"]` and extend theme:
```ts
extend: {
  colors: {
    ink: "var(--ink)", "ink-soft": "var(--ink-soft)", ivory: "var(--ivory)",
    paper: "var(--paper)", gold: "var(--gold)", "gold-deep": "var(--gold-deep)",
    "gray-500": "var(--gray-500)", "gray-200": "var(--gray-200)",
  },
  fontFamily: {
    display: ["var(--font-fraunces)", "Georgia", "serif"],
    sans: ["var(--font-inter)", "system-ui", "sans-serif"],
  },
  maxWidth: { content: "1240px" },
}
```

- [ ] **Step 9: Root layout + placeholder home**

Replace `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { fraunces, inter } from "@/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "F.F Real Estate Builder & Developers", template: "%s | F.F Real Estate" },
  description:
    "F.F Real Estate Builder & Developers — buying, selling, renting, renovation and property documentation in F.B Area, Dastagir and across Karachi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Replace `src/app/page.tsx` with a temporary `<main>` containing an `<h1>F.F Real Estate Builder &amp; Developers</h1>`.

- [ ] **Step 10: Configure `.gitignore` and `.env.example`**

Append to `.gitignore`: `.env.local`, `.env`, `/.sanity`.
Create `.env.example`:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
SANITY_API_WRITE_TOKEN=
GMAIL_USER=f.f.realestate333@gmail.com
GMAIL_APP_PASSWORD=
LEAD_NOTIFICATION_EMAIL=f.f.realestate333@gmail.com
```

- [ ] **Step 11: Verify build and dev server**

Run: `npm run build` — expect success.
Run: `npm run dev`, load `http://localhost:3000`, confirm the heading renders in the serif font. Stop the server.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app, design tokens, fonts, Vitest

"
```

---

## Task 2: Core utilities — WhatsApp links and formatting (TDD)

**Files:**
- Create: `src/lib/whatsapp.ts`, `src/lib/format.ts`
- Test: `tests/lib/whatsapp.test.ts`, `tests/lib/format.test.ts`

**Interfaces:**
- Produces: `buildWhatsAppLink({ phone, message }: { phone: string; message?: string }): string` — returns `https://wa.me/<digits>?text=<encoded>` (no `?text=` when message is empty). `phone` may contain spaces, `+`, or leading `0`; non-digits are stripped and a leading `0` is replaced with `92`.
- Produces: `propertyWhatsAppMessage(title: string, location?: string): string` → `Hello, I am interested in <title>[ (<location>)]. Please send me more details.`
- Produces: `formatPrice(price: { amount?: number; display?: string; onRequest?: boolean }): string` → `display` if set, else `"Price on request"` if `onRequest` or no amount, else `"PKR " + Intl.NumberFormat("en-PK").format(amount)`.
- Produces: `formatArea(area?: { value: number; unit: string }): string | null` → e.g. `"240 sq. yd"` (`sqyd`→`sq. yd`, `sqft`→`sq. ft`, `marla`→`Marla`, `kanal`→`Kanal`); `null` when no area.

- [ ] **Step 1: Write failing tests for `whatsapp.ts`**

Create `tests/lib/whatsapp.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { buildWhatsAppLink, propertyWhatsAppMessage } from "@/lib/whatsapp";

describe("buildWhatsAppLink", () => {
  it("strips formatting and normalises a local 03xx number", () => {
    expect(buildWhatsAppLink({ phone: "0313 3694904" })).toBe("https://wa.me/923133694904");
  });
  it("keeps an already-international number", () => {
    expect(buildWhatsAppLink({ phone: "+92 345 4569090" })).toBe("https://wa.me/923454569090");
  });
  it("encodes the prefilled message", () => {
    expect(buildWhatsAppLink({ phone: "923133694904", message: "Hello F.F Real Estate" }))
      .toBe("https://wa.me/923133694904?text=Hello%20F.F%20Real%20Estate");
  });
});

describe("propertyWhatsAppMessage", () => {
  it("includes the location when present", () => {
    expect(propertyWhatsAppMessage("2nd Floor Portion", "F.B Area, Block 15"))
      .toBe("Hello, I am interested in 2nd Floor Portion (F.B Area, Block 15). Please send me more details.");
  });
  it("omits the parenthetical when no location", () => {
    expect(propertyWhatsAppMessage("Corner Plot"))
      .toBe("Hello, I am interested in Corner Plot. Please send me more details.");
  });
});
```

- [ ] **Step 2: Run — expect FAIL** (`Cannot find module '@/lib/whatsapp'`). Run: `npm test -- whatsapp`.

- [ ] **Step 3: Implement `src/lib/whatsapp.ts`**

```ts
export function buildWhatsAppLink({ phone, message }: { phone: string; message?: string }): string {
  let digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) digits = "92" + digits.slice(1);
  const base = `https://wa.me/${digits}`;
  const text = message?.trim();
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function propertyWhatsAppMessage(title: string, location?: string): string {
  const where = location?.trim() ? ` (${location.trim()})` : "";
  return `Hello, I am interested in ${title}${where}. Please send me more details.`;
}
```

- [ ] **Step 4: Run — expect PASS.** Run: `npm test -- whatsapp`.

- [ ] **Step 5: Write failing tests for `format.ts`**

Create `tests/lib/format.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { formatPrice, formatArea } from "@/lib/format";

describe("formatPrice", () => {
  it("prefers an explicit display string", () => {
    expect(formatPrice({ display: "PKR 2.4 Crore", amount: 24000000 })).toBe("PKR 2.4 Crore");
  });
  it("returns 'Price on request' when flagged", () => {
    expect(formatPrice({ onRequest: true })).toBe("Price on request");
  });
  it("returns 'Price on request' when nothing is provided", () => {
    expect(formatPrice({})).toBe("Price on request");
  });
  it("formats a numeric amount with grouping", () => {
    expect(formatPrice({ amount: 8500000 })).toBe("PKR 85,00,000");
  });
});

describe("formatArea", () => {
  it("formats square yards", () => {
    expect(formatArea({ value: 240, unit: "sqyd" })).toBe("240 sq. yd");
  });
  it("returns null when absent", () => {
    expect(formatArea(undefined)).toBeNull();
  });
});
```

- [ ] **Step 6: Run — expect FAIL.** Run: `npm test -- format`.

- [ ] **Step 7: Implement `src/lib/format.ts`**

```ts
export function formatPrice(price: { amount?: number; display?: string; onRequest?: boolean }): string {
  if (price.display?.trim()) return price.display.trim();
  if (price.onRequest || typeof price.amount !== "number") return "Price on request";
  return `PKR ${new Intl.NumberFormat("en-PK").format(price.amount)}`;
}

const AREA_UNITS: Record<string, string> = {
  sqyd: "sq. yd", sqft: "sq. ft", marla: "Marla", kanal: "Kanal",
};

export function formatArea(area?: { value: number; unit: string }): string | null {
  if (!area || typeof area.value !== "number") return null;
  return `${area.value} ${AREA_UNITS[area.unit] ?? area.unit}`;
}
```

- [ ] **Step 8: Run — expect PASS.** Run: `npm test`.

- [ ] **Step 9: Commit**

```bash
git add src/lib/whatsapp.ts src/lib/format.ts tests/lib/whatsapp.test.ts tests/lib/format.test.ts
git commit -m "feat: WhatsApp link builder and price/area formatters

"
```

---

## Task 3: Sanity schema and embedded Studio

**Files:**
- Create: `sanity.config.ts`, `sanity.cli.ts`, `src/sanity/env.ts`, `src/sanity/structure.ts`
- Create: `src/sanity/schemaTypes/index.ts`, `objects.ts`, `siteSettings.ts`, `property.ts`, `project.ts`, `service.ts`, `agent.ts`, `newsPost.ts`, `galleryImage.ts`, `testimonial.ts`, `lead.ts`
- Create: `src/app/studio/[[...tool]]/page.tsx`
- Test: `tests/sanity/schema.test.ts`

**Interfaces:**
- Produces: default export from `src/sanity/schemaTypes/index.ts` → `{ types: SchemaTypeDefinition[] }` containing exactly these `name`s: `siteSettings`, `property`, `project`, `service`, `agent`, `newsPost`, `galleryImage`, `testimonial`, `lead`, plus objects `priceObject`, `areaObject`, `addressObject`, `hoursRow`, `phoneRow`, `socialRow`.
- Produces: `src/sanity/env.ts` exports `projectId`, `dataset`, `apiVersion` (throw at import if the two `NEXT_PUBLIC_SANITY_*` are missing).
- Field enums (used verbatim by later tasks):
  - `property.purpose`: `sale | rent`
  - `property.type`: `house | flat | plot | commercial | office | shop | other`
  - `property.status`: `available | under_offer | sold | rented`
  - `areaObject.unit`: `sqyd | sqft | marla | kanal`
  - `project.status`: `upcoming | in_progress | completed`
  - `newsPost.category`: `listing | announcement | market | advice | company`
  - `galleryImage.category`: `exterior | interior | building | neighbourhood | commercial | construction | project`
  - `lead.preferredContact`: `whatsapp | call | email`
  - `lead.purpose`: `buy | rent | sell | consult | other`
  - `lead.status`: `new | contacted | closed`

- [ ] **Step 1: Environment module**

Create `src/sanity/env.ts`:
```ts
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
export const dataset = assert(process.env.NEXT_PUBLIC_SANITY_DATASET, "NEXT_PUBLIC_SANITY_DATASET");
export const projectId = assert(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, "NEXT_PUBLIC_SANITY_PROJECT_ID");

function assert(v: string | undefined, name: string): string {
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}
```

- [ ] **Step 2: Shared object types**

Create `src/sanity/schemaTypes/objects.ts` defining (using `defineType`/`defineField` from `sanity`):
- `priceObject` (name `priceObject`, type `object`): `amount` number (optional), `display` string (optional, description "e.g. PKR 2.4 Crore — leave blank to show the number or 'Price on request'"), `onRequest` boolean (default true).
- `areaObject`: `value` number, `unit` string with list options `sqyd, sqft, marla, kanal`.
- `addressObject`: `line1`, `area`, `city` (default "Karachi"), `postalCode`, `mapsUrl` (url), `lat` number, `lng` number.
- `phoneRow`: `label` string, `number` string, `whatsapp` boolean (default true).
- `hoursRow`: `day` string (list Monday…Sunday), `open` string, `close` string, `closed` boolean.
- `socialRow`: `platform` string (list `facebook, facebook_group, instagram, youtube, tiktok, other`), `url` url.

- [ ] **Step 3: Document types**

Create one file per document type per the spec §4. Requirements:
- Every image field: add a nested `alt` string field marked `validation: (r) => r.required()`.
- `siteSettings`: `__experimental_actions` unchanged but treat as singleton via structure (Step 6). Fields: `logo` (image, optional), `phones` (array of `phoneRow`, min 1), `primaryWhatsapp` string, `email` string, `address` (`addressObject`), `hours` (array of `hoursRow`), `socials` (array of `socialRow`), `hero` (object: `heading` string, `subheading` text, `primaryCtaLabel` string, `primaryCtaHref` string), `trustBarItems` (array of string), `whyFF` (array of object `{ title string, body text }`).
- `property`: `title`, `slug` (source `title`), `purpose` (list `sale,rent`), `type` (list per enum), `location` string, `address` string optional, `price` (`priceObject`), `bedrooms` number optional, `bathrooms` number optional, `area` (`areaObject`) optional, `status` (list per enum, default `available`), `availability` string optional, `description` (array `block`), `highlights` (array string), `gallery` (array image, each with `alt`), `map` (object `lat,lng,embedUrl`) optional, `agent` (reference to `agent`) optional, `featured` boolean, `publishedAt` datetime (default now). Preview: title + location subtitle + first gallery image.
- `project`: `name`, `slug`, `location`, `projectType` string, `status` (list per enum) optional, `heroImage` image, `description` blocks, `keyFeatures` array string, `gallery` array image, `featured` boolean.
- `service`: `title`, `slug`, `summary` string, `whatYouGet` array string, `order` number.
- `agent`: `name`, `role`, `phone`, `whatsapp`, `photo` image optional.
- `newsPost`: `title`, `slug`, `category` (list per enum), `coverImage` image optional, `excerpt` string, `body` blocks, `publishedAt` datetime.
- `galleryImage`: `image` image (with `alt`), `category` (list per enum), `caption` string optional, `relatedProperty` reference optional, `relatedProject` reference optional.
- `testimonial`: `name`, `context` string, `quote` text, `photo` image optional.
- `lead`: `name`, `phone`, `email` optional, `preferredContact` (list per enum), `purpose` (list per enum), `propertyInterest` string, `budget` string, `message` text, `relatedProperty` reference optional, `source` string, `submittedAt` datetime, `status` (list per enum, default `new`). Add `readOnly: false` but order fields so `status` is prominent; preview shows `name` + `phone` + `submittedAt`.

- [ ] **Step 4: Schema barrel**

Create `src/sanity/schemaTypes/index.ts`:
```ts
import { type SchemaTypeDefinition } from "sanity";
import { priceObject, areaObject, addressObject, phoneRow, hoursRow, socialRow } from "./objects";
import siteSettings from "./siteSettings";
/* ...import the rest... */

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    priceObject, areaObject, addressObject, phoneRow, hoursRow, socialRow,
    siteSettings, property, project, service, agent, newsPost, galleryImage, testimonial, lead,
  ],
};
export default schema;
```

- [ ] **Step 5: Write the schema test**

Create `tests/sanity/schema.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import schema from "@/sanity/schemaTypes";

const names = schema.types.map((t) => t.name);

describe("sanity schema", () => {
  it("registers every document type", () => {
    for (const n of ["siteSettings","property","project","service","agent","newsPost","galleryImage","testimonial","lead"]) {
      expect(names).toContain(n);
    }
  });
  it("property.purpose offers sale and rent", () => {
    const property = schema.types.find((t) => t.name === "property") as any;
    const purpose = property.fields.find((f: any) => f.name === "purpose");
    const values = purpose.options.list.map((o: any) => (typeof o === "string" ? o : o.value));
    expect(values).toEqual(["sale", "rent"]);
  });
});
```

- [ ] **Step 6: Studio config + singleton structure**

Create `src/sanity/structure.ts` exporting a `structure` that renders `siteSettings` as a single editable document (`S.listItem().title("Site Settings").child(S.document().schemaType("siteSettings").documentId("siteSettings"))`) and lists all other types, with `lead` in its own "Leads" group.

Create `sanity.config.ts`:
```ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { projectId, dataset, apiVersion } from "@/sanity/env";
import { schema } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId, dataset,
  schema,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
```

Create `sanity.cli.ts` with `projectId`/`dataset` from env.

- [ ] **Step 7: Studio route**

Create `src/app/studio/[[...tool]]/page.tsx`:
```tsx
"use client";
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";
export default function StudioPage() {
  return <NextStudio config={config} />;
}
```
Add `src/app/studio/[[...tool]]/layout.tsx` that renders `{children}` only (bypasses the site chrome).

- [ ] **Step 8: Run tests + typecheck**

Run: `npm test` — expect all pass.
Run: `npx tsc --noEmit` — expect no errors.

- [ ] **Step 9: Manual Studio check (requires a Sanity project)**

If `NEXT_PUBLIC_SANITY_PROJECT_ID` is set in `.env.local`: run `npm run dev`, open `/studio`, sign in, confirm all types appear and Site Settings opens as a single document. If no project yet, note this is deferred to Task 21 verification and continue.

- [ ] **Step 10: Commit**

```bash
git add sanity.config.ts sanity.cli.ts src/sanity tests/sanity src/app/studio
git commit -m "feat: Sanity schema and embedded Studio at /studio

"
```

---

## Task 4: Sanity data layer — client, image URLs, queries, typed fetch

**Files:**
- Create: `src/lib/sanity/client.ts`, `image.ts`, `queries.ts`, `fetch.ts`, `types.ts`
- Create: `src/lib/site.ts`
- Test: `tests/lib/sanity-image.test.ts` (rename of scope — image URL builder only)

**Interfaces:**
- Produces: `client` (read-only `@sanity/client` instance, `useCdn: true`, `perspective: "published"`).
- Produces: `urlForImage(source): ImageUrlBuilder` and `imageProps(source, { width, height? })` → `{ src, width, height, blurDataURL? }` for `next/image`.
- Produces: `sanityFetch<T>({ query, params?, tags?, revalidate? }): Promise<T>` — wraps `client.fetch` with `next: { revalidate: revalidate ?? 60, tags }`.
- Produces from `queries.ts` (GROQ string consts): `SITE_SETTINGS_QUERY`, `FEATURED_PROPERTIES_QUERY`, `ALL_PROPERTIES_QUERY`, `PROPERTY_BY_SLUG_QUERY`, `PROPERTY_SLUGS_QUERY`, `FEATURED_PROJECTS_QUERY`, `ALL_PROJECTS_QUERY`, `PROJECT_BY_SLUG_QUERY`, `PROJECT_SLUGS_QUERY`, `SERVICES_QUERY`, `NEWS_LIST_QUERY`, `NEWS_BY_SLUG_QUERY`, `NEWS_SLUGS_QUERY`, `GALLERY_QUERY`, `TESTIMONIALS_QUERY`.
- Produces from `types.ts`: TS interfaces `SiteSettings`, `Property`, `PropertySummary`, `Project`, `ProjectSummary`, `Service`, `NewsPost`, `NewsSummary`, `GalleryImage`, `Testimonial`, `Agent` matching the GROQ projections.
- Produces: `getSiteSettings(): Promise<SiteSettings>` — merges CMS result over `FALLBACK_SITE` from `site.ts` so pages never crash pre-seed.
- Produces from `site.ts`: `FALLBACK_SITE: SiteSettings` populated from Global Constraints (both phones, email, address, Facebook links, default hero copy, trust-bar items, empty `hours`).

- [ ] **Step 1: Client + image builders**

`client.ts`:
```ts
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId, dataset, apiVersion, useCdn: true, perspective: "published",
});
```
`image.ts`: wrap `@sanity/image-url`; `imageProps` returns width/height from the asset ref (`-<w>x<h>-`) and uses `metadata.lqip` as `blurDataURL` when the projection includes it.

- [ ] **Step 2: Fetch helper**

`fetch.ts`:
```ts
import { client } from "./client";

export async function sanityFetch<T>({
  query, params = {}, tags = [], revalidate,
}: { query: string; params?: Record<string, unknown>; tags?: string[]; revalidate?: number }): Promise<T> {
  return client.fetch<T>(query, params, { next: { revalidate: revalidate ?? 60, tags } });
}
```

- [ ] **Step 3: Queries**

Write every GROQ const in `queries.ts`. Projections must include `alt` for images and `"lqip": asset->metadata.lqip` for hero/card images. Example:
```ts
export const FEATURED_PROPERTIES_QUERY = `*[_type == "property" && featured == true && status == "available"]
  | order(publishedAt desc)[0...6]{
    _id, title, "slug": slug.current, purpose, type, location, price, bedrooms, bathrooms, area, status,
    "cover": gallery[0]{ "url": asset->url, "lqip": asset->metadata.lqip, alt }
  }`;

export const PROPERTY_BY_SLUG_QUERY = `*[_type == "property" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, purpose, type, location, address, price, bedrooms, bathrooms, area,
  status, availability, description, highlights, map,
  "gallery": gallery[]{ "url": asset->url, "lqip": asset->metadata.lqip, alt },
  agent->{ name, role, phone, whatsapp }
}`;
```
Repeat for all listed consts (list, slugs, projects, services, news, gallery with `$category` filter, testimonials).

- [ ] **Step 4: Types + `getSiteSettings`**

Define interfaces in `types.ts`. In `fetch.ts` or a new `settings.ts`, implement `getSiteSettings` merging over `FALLBACK_SITE`.

- [ ] **Step 5: Image-builder test**

`tests/lib/sanity-image.test.ts`: mock a Sanity asset ref string, assert `urlForImage(ref).width(800).url()` contains `w=800` and the project ID. (Pure string assertion; no network.)

- [ ] **Step 6: Run tests + typecheck.** `npm test`; `npx tsc --noEmit`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/sanity src/lib/site.ts tests/lib/sanity-image.test.ts
git commit -m "feat: Sanity client, image helpers, GROQ queries, typed fetch with fallback

"
```

---

## Task 5: Seed script

**Files:**
- Create: `scripts/seed.ts`
- Modify: `package.json` (add `tsx` dev dep)

**Interfaces:**
- Consumes: schema type names from Task 3, `SANITY_API_WRITE_TOKEN`.
- Produces: an idempotent script (`createOrReplace` with fixed `_id`s) seeding `siteSettings` (id `siteSettings`), six `service` docs, two `agent` docs (`agent.mustafa`, `agent.salman`), and `siteSettings.socials` with the Facebook page + group.

- [ ] **Step 1:** `npm i -D tsx`.
- [ ] **Step 2:** Write `scripts/seed.ts` using `@sanity/client` with `token: process.env.SANITY_API_WRITE_TOKEN`, `useCdn: false`. Seed content from Global Constraints verbatim. Services in spec order with concrete `summary` + `whatYouGet` written from the confirmed service list only (no invented claims). `hours: []`.
- [ ] **Step 3:** Add a guard: exit with a clear message if `SANITY_API_WRITE_TOKEN` is missing.
- [ ] **Step 4: Manual run (deferred if no project):** `npm run seed`; confirm in Studio. If no project, note deferred to Task 21.
- [ ] **Step 5: Commit**

```bash
git add scripts/seed.ts package.json package-lock.json
git commit -m "feat: idempotent Sanity seed script for settings, services, agents

"
```

---

## Task 6: Global layout shell — nav, footer, floating + mobile CTAs, primitives

**Files:**
- Create: `src/components/layout/Container.tsx`, `Section.tsx`, `Footer.tsx`, `FloatingWhatsApp.tsx`, `MobileActionBar.tsx`
- Create: `src/components/nav/Nav.tsx`, `nav/MobileMenu.tsx`
- Create: `src/components/ui/Button.tsx`, `MicroLabel.tsx`, `Chip.tsx`, `WhatsAppButton.tsx`
- Create: `src/components/EmptyState.tsx`
- Modify: `src/app/layout.tsx` (mount Nav/Footer/FloatingWhatsApp/MobileActionBar around `{children}`)
- Test: `tests/components/Nav.test.tsx`

**Interfaces:**
- Consumes: `getSiteSettings`, `buildWhatsAppLink`.
- Produces: `<Nav settings={SiteSettings} />` (Server Component that renders a Client `<NavShell>` for scroll state), `<MobileMenu links phones whatsappHref />`, `<Button variant="solid"|"outline"|"ghost" as="a"|"button" tone="dark"|"light">`, `<WhatsAppButton phone message children />`, `<Container>`, `<Section id label? title? tone?>`, `<EmptyState title body ctaHref? ctaLabel?>`.
- Nav links (label → href), in order: `Home /`, `Properties /properties`, `Projects /projects`, `About Us /about`, `Services /services`, `Why F.F /why-ff`, `Contact /contact`.

- [ ] **Step 1: Primitives.** Implement `Container` (`mx-auto max-w-content px-5 md:px-8`), `Section` (vertical padding, optional `u-micro-label` eyebrow + serif `h2`, `tone` sets ink/ivory background), `MicroLabel`, `Chip` (gold-outline when `active`), `Button` (solid = ink bg / ivory text; outline = 1px gold border; ghost = underline-on-hover; `tone` flips for dark sections; focus-visible ring).
- [ ] **Step 2: WhatsAppButton.** Client component; builds href with `buildWhatsAppLink`; renders a WhatsApp glyph (inline SVG, `currentColor`) + label; `target="_blank" rel="noopener"`.
- [ ] **Step 3: Nav.** Server `<Nav>` fetches nothing (receives `settings`); renders `<NavShell>` (Client) that toggles a `scrolled` class after 24px (`IntersectionObserver` on a sentinel, not scroll listener) → reduces padding, adds bottom hairline + `bg-ivory/90 backdrop-blur`. Left: logo (SVG monogram from Step 8) + wordmark. Right (desktop ≥`lg`): text links + `WhatsApp Us` (solid) + `Call Now` (outline, `href="tel:+923133694904"`). Below `lg`: hamburger → `<MobileMenu>`.
- [ ] **Step 4: MobileMenu.** Client; full-height slide-in panel, focus-trapped, `Esc` closes, background scroll locked; lists links large; pins a `WhatsApp Us` solid button at the bottom, always visible; both phone numbers as call links.
- [ ] **Step 5: Footer.** Ink background. Columns: brand blurb (name + one factual line) · Quick links (Home, Properties, Projects, Services, About, Contact) · Contact (both phones as `tel:` + WhatsApp, email as `mailto:`, full address) · a prominent `WhatsApp Us` block. Bottom row: `© <year> F.F Real Estate Builder & Developers` + Facebook page + group links. Hours block renders only if `settings.hours.length`.
- [ ] **Step 6: FloatingWhatsApp.** Client; fixed bottom-right, above `MobileActionBar` on mobile (`bottom-20 md:bottom-6`); circular, ink bg, gold ring on focus; `aria-label="Chat with F.F Real Estate on WhatsApp"`; subtle idle pulse disabled under reduced motion.
- [ ] **Step 7: MobileActionBar.** Client; fixed bottom, `md:hidden`; two equal buttons: `WhatsApp` (solid) and `Call` (outline). Adds `pb-[env(safe-area-inset-bottom)]`. Body gets `pb-16 md:pb-0` via layout so content clears it.
- [ ] **Step 8: Logo asset.** Create `src/components/ui/Logo.tsx` — a hand-built inline SVG of the "FF" monogram (two mirrored serif "F" forms inside a thin circle), `currentColor`, `role="img"`, `<title>F.F Real Estate</title>`. Gold on ink in the footer, ink on ivory in the nav.
- [ ] **Step 9: Wire layout.** In `src/app/layout.tsx`, fetch `getSiteSettings()`, wrap children: `<Nav settings/>` `<main>{children}</main>` `<Footer settings/>` `<FloatingWhatsApp .../>` `<MobileActionBar .../>`.
- [ ] **Step 10: Test.** `tests/components/Nav.test.tsx` (render `<MobileMenu>` with fixture props): asserts all seven link labels present and the WhatsApp button has an `href` starting `https://wa.me/923133694904`.
- [ ] **Step 11:** `npm test`; `npm run build`.
- [ ] **Step 12: Commit**

```bash
git add src/components src/app/layout.tsx tests/components/Nav.test.tsx
git commit -m "feat: global shell — nav, footer, floating WhatsApp, mobile action bar, UI primitives

"
```

---

## Task 7: Motion primitives

**Files:**
- Create: `src/components/motion/useReducedMotionSafe.ts`, `src/components/motion/Reveal.tsx`
- Test: `tests/components/Reveal.test.tsx`

**Interfaces:**
- Produces: `useReducedMotionSafe(): boolean` — wraps Framer's `useReducedMotion`, SSR-safe (returns `true` on the server so first paint is the final state).
- Produces: `<Reveal as? delay? y? children>` — fades/rises children in on first viewport entry via `whileInView`; when reduced motion is on, renders a plain element with no `initial`/`animate` (final state immediately).

- [ ] **Step 1:** Write test: render `<Reveal>` inside a container; with `matchMedia` mocked to `prefers-reduced-motion: reduce`, assert the child text is in the document and the wrapper has no inline `opacity: 0`.
- [ ] **Step 2:** Run — expect FAIL.
- [ ] **Step 3:** Implement both files. `Reveal` uses `motion.div` with `initial={{opacity:0,y}}`, `whileInView={{opacity:1,y:0}}`, `viewport={{ once: true, margin: "0px 0px -10% 0px" }}`, `transition={{ duration: 0.5, delay }}`; early-returns a plain wrapper when `useReducedMotionSafe()` is true.
- [ ] **Step 4:** Run — expect PASS. `npm test`.
- [ ] **Step 5: Commit**

```bash
git add src/components/motion tests/components/Reveal.test.tsx
git commit -m "feat: reduced-motion-safe Reveal primitive

"
```

---

## Task 8: Home page

**Files:**
- Create: `src/components/home/*` (Hero, HeroInquiryPanel, TrustBar, FeaturedProperties, FeaturedProjects, ServicesStrip, WhyFF, AboutTeaser, LatestFromFF, LocationBlock, ContactCta)
- Create: `src/components/property/PropertyCard.tsx`, `PropertyGrid.tsx`; `src/components/project/ProjectCard.tsx`, `ProjectGrid.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/components/PropertyCard.test.tsx`

**Interfaces:**
- Consumes: `getSiteSettings`, `sanityFetch` + `FEATURED_PROPERTIES_QUERY`, `FEATURED_PROJECTS_QUERY`, `SERVICES_QUERY`, `NEWS_LIST_QUERY` (first 3), `TESTIMONIALS_QUERY`, `formatPrice`, `formatArea`, `buildWhatsAppLink`, `propertyWhatsAppMessage`.
- Produces: `<PropertyCard property={PropertySummary} />` — links to `/properties/<slug>`; shows purpose tag (`For Sale`/`For Rent`), title, location, `formatPrice`, up to three meta chips (type, `formatArea`, `<n> Bed`), `View Property` affordance. Image is `next/image` 4:3 with `sizes` and blur placeholder; scales to 1.04 on hover (reduced-motion safe via CSS `motion-safe:`).
- Produces: `<ProjectCard project={ProjectSummary} />`.
- Produces: `<HeroInquiryPanel />` — client; compact form (Name, Phone, Property Interest, Budget, Buy/Rent/Sell select, Message); primary `Request Property Details` posts to `/api/lead`; secondary `Continue on WhatsApp` builds a message from filled fields and opens `wa.me`.

- [ ] **Step 1: PropertyCard test.** Fixture `PropertySummary` with `price.onRequest`; assert card renders `Price on request`, the title, `/properties/<slug>` href, and `For Rent` when `purpose==="rent"`.
- [ ] **Step 2:** Run — expect FAIL.
- [ ] **Step 3:** Implement `PropertyCard`, `PropertyGrid` (responsive `grid` 1/2/3 cols), `ProjectCard`, `ProjectGrid`.
- [ ] **Step 4:** Run — expect PASS.
- [ ] **Step 5: Hero.** Full-viewport-height (`min-h-[86vh]`) ink section. No photo. Layered: large Fraunces headline from `settings.hero.heading` (fallback `"Find the Right Property. Make the Right Move."`), subcopy `settings.hero.subheading` (fallback from spec §1), CTAs: `Explore Properties` (solid → `/properties`), `Talk to an Agent` (outline → `/contact`), and a `WhatsAppButton` ("Get Property Details on WhatsApp"). Thin gold rule accents; a faint oversized "FF" monogram watermark at low opacity. Staggered `Reveal` on load.
- [ ] **Step 6: HeroInquiryPanel.** Render on the home hero (side panel on desktop `lg`, stacked below on mobile) titled `Looking for a Property?`. Uses shared `Field` components (built here in `src/components/ui/Field.tsx`: label + input/select/textarea + error slot). Client-side: on submit, POST JSON to `/api/lead` with `source: "hero"`; show inline success ("Thank you — we'll contact you shortly.") + a WhatsApp button. Keep it to the six fields; no validation beyond required Name + Phone and a valid-looking phone.
- [ ] **Step 7: TrustBar.** Directly under hero, ivory, one restrained row: `settings.trustBarItems` separated by thin gold dividers. Falls back to the four items in Global Constraints. No numeric stats.
- [ ] **Step 8: FeaturedProperties.** `Section` eyebrow `Featured Properties`; `PropertyGrid` of up to 6; if empty → `<EmptyState title="New listings are on the way" body="Message us on WhatsApp to hear about current opportunities." ctaHref={whatsappHref} ctaLabel="Ask on WhatsApp" />`. Footer link `View all properties → /properties`.
- [ ] **Step 9: FeaturedProjects.** Same pattern with `Projects & Developments` eyebrow; empty state copy: `"Project details are added as developments progress."`.
- [ ] **Step 10: ServicesStrip.** Pulls `SERVICES_QUERY`; compact list/grid of service titles + one-line summaries; each links to `/services`. If none, hide the section.
- [ ] **Step 11: WhyFF.** Large editorial typography (no icon cards). Renders `settings.whyFF` (fallback: four items written from verified positioning only — Local Market Knowledge; Straightforward Property Guidance; Sale, Purchase, Rent, Renovation & Documentation under one roof; Personalised Assistance). Each item = big serif number + serif title + short body.
- [ ] **Step 12: AboutTeaser.** Short editorial paragraph + `About F.F Real Estate → /about`. Copy uses only verified facts (Karachi-based property service in F.B Area / Dastagir; buying, selling, renting, renovation, documentation).
- [ ] **Step 13: LatestFromFF.** Heading `Latest From F.F Real Estate`. If `newsPosts.length` → 3 `NewsCard`s (built in Task 15; for now render a minimal inline card and refactor in Task 15). Always show a `Follow F.F Real Estate` button → Facebook page. **No Facebook SDK/iframe** — plain link only.
- [ ] **Step 14: LocationBlock.** Address in full (from `settings.address`), `Get Directions` button → `settings.address.mapsUrl` (fallback: a Google Maps search URL for the address string). Lazy map is added in Task 14's shared `<LazyMap>` — here just render the address + button; embed added when `LazyMap` exists (Task 14 Step 4 wires it back).
- [ ] **Step 15: ContactCta.** Full-width ink band: `Talk to F.F Real Estate` + WhatsApp (prominent) + Call + `Contact` page link.
- [ ] **Step 16: Assemble `page.tsx`.** Server Component: parallel `Promise.all` for the fetches; compose sections in order: Hero (+ HeroInquiryPanel) → TrustBar → FeaturedProperties → FeaturedProjects → ServicesStrip → WhyFF → AboutTeaser → LatestFromFF → LocationBlock → ContactCta. Add `export const revalidate = 60`.
- [ ] **Step 17:** `npm test`; `npm run build`; `npm run dev` and eyeball the homepage with an empty dataset (every section must look intentional).
- [ ] **Step 18: Commit**

```bash
git add src/components/home src/components/property src/components/project src/app/page.tsx src/components/ui/Field.tsx tests/components/PropertyCard.test.tsx
git commit -m "feat: home page with all sections and graceful empty states

"
```

---

## Task 9: Properties listing + filtering

**Files:**
- Create: `src/lib/filters.ts`
- Create: `src/components/property/PropertyFilters.tsx`
- Create: `src/app/properties/page.tsx`
- Test: `tests/lib/filters.test.ts`

**Interfaces:**
- Produces: `parsePropertyFilters(searchParams: Record<string,string|string[]|undefined>): PropertyFilterState` where `PropertyFilterState = { purpose?: "sale"|"rent"; type?: PropertyType; location?: string; minPrice?: number; maxPrice?: number; bedrooms?: number; minArea?: number }`.
- Produces: `buildPropertyGroqFilter(state: PropertyFilterState): { filter: string; params: Record<string, unknown> }` — a GROQ predicate string (without the leading `*[`), e.g. `_type == "property" && status == "available" && purpose == $purpose && ...`.
- Produces: `filtersToSearchParams(state): URLSearchParams` and `activeFilterChips(state): {key:string,label:string}[]`.
- Produces: `<PropertyFilters state locations />` — client; updates the URL via `router.push` (shallow) with debounced numeric inputs; renders active filters as removable gold `Chip`s.

- [ ] **Step 1: Write `tests/lib/filters.test.ts`** covering: empty params → `{}`; `?purpose=rent&type=flat&bedrooms=3` parses correctly; invalid `type=castle` is dropped; `minPrice`/`maxPrice` non-numeric dropped; `buildPropertyGroqFilter({purpose:"sale",bedrooms:2})` returns a string containing `purpose == $purpose` and `bedrooms >= $bedrooms` and params `{purpose:"sale",bedrooms:2}`; `activeFilterChips` returns one chip per set field.
- [ ] **Step 2:** Run — expect FAIL.
- [ ] **Step 3:** Implement `src/lib/filters.ts`. Validate `type` against the enum from Task 3; clamp numbers ≥ 0; ignore unknown keys.
- [ ] **Step 4:** Run — expect PASS. `npm test -- filters`.
- [ ] **Step 5: PropertyFilters component.** Controls: Purpose (All / Buy / Rent segmented), Type (select from enum), Location (select built from distinct `location` values passed in), Price min/max (number), Bedrooms (select 1–6+), Area min (number). "Clear all" link. Mobile: collapse into a `Filters` disclosure. Cross-fade the result grid on change (CSS, motion-safe).
- [ ] **Step 6: Page.** `src/app/properties/page.tsx` is a Server Component reading `searchParams`. Steps: `parsePropertyFilters` → `buildPropertyGroqFilter` → `sanityFetch(ALL_PROPERTIES_QUERY built from the filter, params, tags:["property"])`. Also fetch distinct locations (`array::unique(*[_type=="property"].location)`). Render page `<h1>Properties</h1>`, `<PropertyFilters>`, results count, `<PropertyGrid>`, and `<EmptyState>` when zero (differentiate "no properties yet" from "no matches — clear filters").
- [ ] **Step 7:** `generateMetadata` → title `Properties for Sale & Rent in Karachi`, description from spec §9.
- [ ] **Step 8:** `npm test`; `npm run build`; dev-server check with `?purpose=rent`.
- [ ] **Step 9: Commit**

```bash
git add src/lib/filters.ts src/components/property/PropertyFilters.tsx src/app/properties/page.tsx tests/lib/filters.test.ts
git commit -m "feat: property listing with URL-driven premium filters

"
```

---

## Task 10: Individual property page

**Files:**
- Create: `src/components/property/PropertyGallery.tsx`, `PropertyQuickDetails.tsx`, `PropertyInquiryPanel.tsx`
- Create: `src/components/gallery/Lightbox.tsx`
- Create: `src/components/content/PortableText.tsx`
- Create: `src/app/properties/[slug]/page.tsx`
- Test: `tests/components/Lightbox.test.tsx`

**Interfaces:**
- Consumes: `PROPERTY_BY_SLUG_QUERY`, `PROPERTY_SLUGS_QUERY`, `formatPrice`, `formatArea`, `buildWhatsAppLink`, `propertyWhatsAppMessage`, `getSiteSettings`.
- Produces: `<Lightbox images={{url,alt}[]} startIndex open onClose />` — focus-trapped dialog, arrow-key + swipe nav, `Esc` closes, counter, body scroll lock.
- Produces: `<PropertyGallery images />` — lead image + thumbnail strip; click opens `<Lightbox>`.
- Produces: `<PropertyQuickDetails property />` — labelled grid: Type, Area, Bedrooms, Bathrooms, Status, Availability (omit rows with no value).
- Produces: `<PropertyInquiryPanel property agentPhone whatsappNumber />` — sticky on desktop; buttons: `WhatsApp About This Property` (prefilled via `propertyWhatsAppMessage`), `Call Agent` (`tel:` — agent phone or `settings.phones[0]`), `Request Information` (opens `<InquiryForm>` from Task 11 with `relatedProperty` + `source: "property:<slug>"`).
- Produces: `generateStaticParams` from `PROPERTY_SLUGS_QUERY`; `dynamicParams = true`.

- [ ] **Step 1: Lightbox test.** Render open with 3 images; assert `role="dialog"`, `aria-modal="true"`, pressing `ArrowRight` advances the counter, `Escape` calls `onClose`.
- [ ] **Step 2:** Run — expect FAIL.
- [ ] **Step 3:** Implement `Lightbox` (Client). Use `next/image` with `sizes="100vw"`. Trap focus; restore focus to the trigger on close.
- [ ] **Step 4:** Run — expect PASS.
- [ ] **Step 5:** Implement `PortableText` renderer (`@portabletext/react` — `npm i @portabletext/react`) with styled `block`, `h3`, `ul`, `strong`, `link` (external links get `rel="noopener"`).
- [ ] **Step 6:** Implement `PropertyGallery`, `PropertyQuickDetails`, `PropertyInquiryPanel`.
- [ ] **Step 7: Page.** Layout order per spec §10: gallery → title / location / `formatPrice` → `PropertyQuickDetails` → `Property Overview` (PortableText) → `Property Highlights` (list, only if present) → `Location` (`<LazyMap>` when `map` present — component from Task 14; until then render address text) → `Interested in this property?` panel. Two-column on desktop (content + sticky panel), stacked on mobile. `notFound()` when no doc.
- [ ] **Step 8:** `generateMetadata` per property: title = `<title> — <For Sale|For Rent> in <location>`; OG image = first gallery image URL when present.
- [ ] **Step 9:** `npm test`; `npm run build`.
- [ ] **Step 10: Commit**

```bash
git add src/components/property src/components/gallery/Lightbox.tsx src/components/content/PortableText.tsx src/app/properties/[slug] tests/components/Lightbox.test.tsx package.json package-lock.json
git commit -m "feat: individual property page with gallery, lightbox, WhatsApp-first inquiry panel

"
```

---

## Task 11: Lead capture — API route, email, shared inquiry form (TDD)

**Files:**
- Create: `src/lib/leads.ts`, `src/lib/email.ts`
- Create: `src/app/api/lead/route.ts`
- Create: `src/components/forms/InquiryForm.tsx`, `src/components/forms/FormStatus.tsx`
- Modify: `src/components/home/HeroInquiryPanel.tsx` (use shared submit helper)
- Test: `tests/lib/leads.test.ts`, `tests/api/lead.test.ts`

**Interfaces:**
- Produces: `leadSchema` (Zod) → `{ name: string(min 2); phone: string(min 7, digits/space/+/-); email?: string.email; preferredContact?: enum; purpose?: enum; propertyInterest?: string; budget?: string; message?: string; relatedPropertyId?: string; source: string; website?: string /* honeypot */ }`.
- Produces: `parseLead(input: unknown): { ok: true; data: LeadInput } | { ok: false; errors: Record<string,string> }`.
- Produces: `isSpam(data: LeadInput, submittedAtMs: number, startedAtMs?: number): boolean` — true if `website` non-empty OR (`startedAtMs` present AND elapsed < 2000ms).
- Produces: `createLead(data: LeadInput): Promise<{ _id: string }>` — writes a `lead` doc via a server-only `@sanity/client` (token `SANITY_API_WRITE_TOKEN`), `submittedAt = now`, `status = "new"`.
- Produces: `sendLeadEmail(data: LeadInput): Promise<void>` — Nodemailer Gmail transport; subject `New website lead — <name>`; plain-text body of all fields; never throws to the caller (logs and resolves).
- Produces: `POST /api/lead` → `202 { ok: true }` on success (even if email fails), `400 { ok: false, errors }` on validation failure, `200 { ok: true }` silently for detected spam (no write).
- Produces: `<InquiryForm source relatedPropertyId? compact? onDone? />` — client; renders fields, honeypot `website` (visually hidden, `tabindex=-1`, `autocomplete=off`), records mount time, POSTs JSON, renders `<FormStatus>` (loading / success + WhatsApp button / error). Success copy: `"Thank you — F.F Real Estate will contact you shortly."`

- [ ] **Step 1: `tests/lib/leads.test.ts`.** Cover: valid payload passes `parseLead`; missing `name` → error keyed `name`; bad email → error keyed `email`; `isSpam` true when `website:"x"`; `isSpam` true when elapsed 500ms; `isSpam` false when elapsed 5000ms and no honeypot.
- [ ] **Step 2:** Run — expect FAIL.
- [ ] **Step 3:** Implement `src/lib/leads.ts` (schema, `parseLead`, `isSpam`). Put `createLead` in the same file but import `@sanity/client` lazily inside the function so tests don't need the token.
- [ ] **Step 4:** Run — expect PASS. `npm test -- leads`.
- [ ] **Step 5: `tests/api/lead.test.ts`.** Import the route handler directly; mock `@/lib/leads` `createLead` and `@/lib/email` `sendLeadEmail` with `vi.mock`. Cases: valid body → 202 and `createLead` called once; invalid body → 400 with `errors.name`; honeypot filled → 200 and `createLead` NOT called; `createLead` rejects → 500 `{ ok:false }`; `sendLeadEmail` rejects but `createLead` resolves → still 202.
- [ ] **Step 6:** Run — expect FAIL.
- [ ] **Step 7:** Implement `src/lib/email.ts` and `src/app/api/lead/route.ts` (`export async function POST(req: Request)`), `export const runtime = "nodejs"`.
- [ ] **Step 8:** Run — expect PASS. `npm test`.
- [ ] **Step 9:** Implement `<FormStatus>` and `<InquiryForm>`; refactor `HeroInquiryPanel` and property `Request Information` to use `InquiryForm` (or a shared `submitLead` helper). Ensure every success state offers a WhatsApp continuation built from entered fields.
- [ ] **Step 10:** `npm run build`; dev check: submit the contact form with a fake project ID unset — expect graceful error text, no crash.
- [ ] **Step 11: Commit**

```bash
git add src/lib/leads.ts src/lib/email.ts src/app/api/lead src/components/forms src/components/home/HeroInquiryPanel.tsx tests/lib/leads.test.ts tests/api/lead.test.ts
git commit -m "feat: lead capture API with Sanity write, email notify, spam guard, shared inquiry form

"
```

---

## Task 12: Projects listing + detail

**Files:**
- Create: `src/app/projects/page.tsx`, `src/app/projects/[slug]/page.tsx`
- Reuse: `ProjectGrid`, `ProjectCard`, `Lightbox`, `PortableText`, `InquiryForm`

**Interfaces:**
- Consumes: `ALL_PROJECTS_QUERY`, `PROJECT_BY_SLUG_QUERY`, `PROJECT_SLUGS_QUERY`.
- Produces: `/projects` (grid + empty state) and `/projects/[slug]` (hero image → description → key features → gallery + lightbox → `Inquire About This Project` panel with WhatsApp prefilled `"Hello, I would like details about the <name> project."`). `generateStaticParams` + `dynamicParams`.

- [ ] **Step 1:** Build `/projects/page.tsx` — `<h1>Projects & Developments</h1>`, intro line (verified: "F.F Real Estate Builder & Developers undertakes construction and development projects in Karachi."), `ProjectGrid`, `EmptyState` ("Project details are published as developments progress. Message us on WhatsApp to discuss current work.").
- [ ] **Step 2:** Build `/projects/[slug]/page.tsx` per spec §9 order. `notFound()` on missing.
- [ ] **Step 3:** `generateMetadata` for both.
- [ ] **Step 4:** `npm test`; `npm run build`.
- [ ] **Step 5: Commit**

```bash
git add src/app/projects
git commit -m "feat: projects listing and detail pages

"
```

---

## Task 13: About, Services, Why F.F pages

**Files:**
- Create: `src/app/about/page.tsx`, `src/app/services/page.tsx`, `src/app/why-ff/page.tsx`

**Interfaces:**
- Consumes: `SERVICES_QUERY`, `getSiteSettings`.
- Produces: three static-content pages. Copy limited to verified facts only.

- [ ] **Step 1: About.** `<h1>Real Estate, Handled Professionally.</h1>` Editorial layout: what F.F does (buying, selling, renting, renovation, documentation, consultation), where (R-37 Block 15, Near Taal Stop, F.B Area, Dastagir; active across F.B Area, Scheme 33, Scheme 45), and how to reach them. Named contacts: Syed Mustafa Rehman, Mohammad Salman. **No founding year, team size, project counts, awards, or experience claims.** End with WhatsApp + Contact CTAs.
- [ ] **Step 2: Services.** `<h1>Services</h1>` Render `SERVICES_QUERY`; each service = title, one-line `summary`, `whatYouGet` bullets, and a `Discuss on WhatsApp` button (prefill `"Hello, I would like to ask about your <service title> service."`). If the CMS has none, render the six confirmed services from a local constant as fallback.
- [ ] **Step 3: Why F.F.** `<h1>Why F.F</h1>` Large-type editorial (no icon cards) from `settings.whyFF` with the verified fallback set from Task 8 Step 11. Add a closing factual line + WhatsApp CTA. No fabricated advantages.
- [ ] **Step 4:** `generateMetadata` for each (titles: `About Us`, `Our Services`, `Why Choose F.F`).
- [ ] **Step 5:** `npm run build`; eyeball all three.
- [ ] **Step 6: Commit**

```bash
git add src/app/about src/app/services src/app/why-ff
git commit -m "feat: About, Services, Why F.F pages (verified content only)

"
```

---

## Task 14: Contact page + lazy map

**Files:**
- Create: `src/components/layout/LazyMap.tsx`
- Create: `src/app/contact/page.tsx`
- Modify: `src/components/home/LocationBlock.tsx`, `src/app/properties/[slug]/page.tsx`, `src/app/projects/[slug]/page.tsx` (wire `<LazyMap>` where noted earlier)
- Test: `tests/components/LazyMap.test.tsx`

**Interfaces:**
- Produces: `<LazyMap query? lat? lng? title />` — renders a click-to-load / in-view-to-load placeholder (ink panel + `View map` button); only injects the Google Maps embed `<iframe loading="lazy">` after intersection or click. No API key (uses `https://www.google.com/maps?output=embed&q=...`).
- Produces: `/contact` page.

- [ ] **Step 1: Test.** Render `<LazyMap>`; assert no `<iframe>` initially; after clicking `View map`, an `<iframe>` with `src` containing the encoded address appears.
- [ ] **Step 2:** Run — expect FAIL.
- [ ] **Step 3:** Implement `LazyMap`.
- [ ] **Step 4:** Run — expect PASS. Wire `LazyMap` into `LocationBlock`, property detail `Location`, project detail (optional).
- [ ] **Step 5: Contact page.** `<h1>Contact F.F Real Estate</h1>`. Blocks: prominent WhatsApp CTA (both numbers as separate WhatsApp buttons, labelled with the person's name) · Call buttons (`tel:`) · Email button (`mailto:f.f.realestate333@gmail.com`) · full address + `Get Directions` + `<LazyMap>` · business hours **only if `settings.hours.length`** · `<InquiryForm source="contact">`. Mobile keeps the sticky action bar.
- [ ] **Step 6:** `generateMetadata` → title `Contact`, description with address + Karachi.
- [ ] **Step 7:** `npm test`; `npm run build`.
- [ ] **Step 8: Commit**

```bash
git add src/components/layout/LazyMap.tsx src/app/contact src/components/home/LocationBlock.tsx src/app/properties src/app/projects tests/components/LazyMap.test.tsx
git commit -m "feat: contact page and lazy-loaded map embed

"
```

---

## Task 15: News / market updates

**Files:**
- Create: `src/components/news/NewsCard.tsx`, `NewsGrid.tsx`
- Create: `src/app/news/page.tsx`, `src/app/news/[slug]/page.tsx`
- Modify: `src/components/nav/Nav.tsx` + `Footer.tsx` (conditionally show a `News` link when posts exist), `src/components/home/LatestFromFF.tsx` (use real `NewsCard`)

**Interfaces:**
- Consumes: `NEWS_LIST_QUERY`, `NEWS_BY_SLUG_QUERY`, `NEWS_SLUGS_QUERY`.
- Produces: `<NewsCard post={NewsSummary} />`, `/news` (editorial grid), `/news/[slug]` (`Article` layout: category micro-label, title, date, cover, PortableText body, back link, WhatsApp CTA). `generateStaticParams` + `dynamicParams`.
- Produces: `hasNews(): Promise<boolean>` helper in `queries.ts`/`fetch.ts` used by Nav/Footer to decide whether to show the link.

- [ ] **Step 1:** Implement `NewsCard`, `NewsGrid`.
- [ ] **Step 2:** Implement `/news/page.tsx` — `<h1>News & Market Updates</h1>`; grid; `EmptyState` ("Updates and new listings will be posted here. Follow F.F Real Estate on Facebook for the latest.") + Facebook button.
- [ ] **Step 3:** Implement `/news/[slug]/page.tsx`; `notFound()` on missing; `generateMetadata` (title = post title, description = excerpt, OG = coverImage).
- [ ] **Step 4:** Add `hasNews()` and conditionally render the `News` nav/footer link. Refactor `LatestFromFF` to use `NewsCard`; keep the section hidden when there are zero posts (Facebook button stays on the homepage `ContactCta`/footer regardless).
- [ ] **Step 5:** JSON-LD `Article` on the detail page (via `<JsonLd>` from Task 17 — if Task 17 not done yet, add a local script tag and refactor later).
- [ ] **Step 6:** `npm test`; `npm run build`.
- [ ] **Step 7: Commit**

```bash
git add src/components/news src/app/news src/components/nav src/components/layout/Footer.tsx src/components/home/LatestFromFF.tsx
git commit -m "feat: news section with conditional nav link and editorial article layout

"
```

---

## Task 16: Gallery page

**Files:**
- Create: `src/components/gallery/GalleryGrid.tsx`, `GalleryFilters.tsx`
- Create: `src/app/gallery/page.tsx`
- Reuse: `Lightbox`

**Interfaces:**
- Consumes: `GALLERY_QUERY` (accepts optional `$category`), `parse` of `?category=` from `searchParams`.
- Produces: `/gallery` — category filter chips (`All` + the eight `galleryImage.category` values that have images), justified/masonry grid, `Lightbox` across the currently filtered set, `EmptyState` when empty ("Photographs of properties and developments will appear here.").

- [ ] **Step 1:** Implement `GalleryGrid` (CSS columns masonry or `grid` with varied row spans; each item opens `Lightbox` at its index) and `GalleryFilters` (URL-driven chips, reusing the `Chip` primitive).
- [ ] **Step 2:** Implement `/gallery/page.tsx`; validate `category` against the enum; fetch counts per category to build the chip list.
- [ ] **Step 3:** `generateMetadata` → title `Gallery`.
- [ ] **Step 4:** `npm test`; `npm run build`.
- [ ] **Step 5: Commit**

```bash
git add src/components/gallery src/app/gallery
git commit -m "feat: filterable gallery page with lightbox

"
```

---

## Task 17: SEO — metadata helpers, JSON-LD, sitemap, robots, OG image, 404

**Files:**
- Create: `src/lib/metadata.ts`, `src/components/seo/JsonLd.tsx`
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/not-found.tsx`, `src/app/opengraph-image.tsx`
- Modify: page files to use `buildMetadata` and render `<JsonLd>`
- Test: `tests/lib/metadata.test.ts`

**Interfaces:**
- Produces: `buildMetadata({ title, description, path, image? }): Metadata` — sets `title`, `description`, `alternates.canonical` (`NEXT_PUBLIC_SITE_URL + path`), `openGraph`, `twitter`.
- Produces: `<JsonLd data={object} />` — renders `<script type="application/ld+json">`.
- Produces: `realEstateAgentJsonLd(settings)`, `residenceJsonLd(property, url)`, `articleJsonLd(post, url)` builders in `metadata.ts`.
- Produces: `sitemap()` listing static routes + all property/project/news slugs (from `*_SLUGS_QUERY`); `robots()` allowing all, pointing to the sitemap, disallowing `/studio`.

- [ ] **Step 1: `tests/lib/metadata.test.ts`.** Assert `buildMetadata({title:"Properties",description:"d",path:"/properties"})` → `alternates.canonical` ends `/properties`, `openGraph.title` is `"Properties | F.F Real Estate"` shape, `openGraph.url` is absolute. Assert `realEstateAgentJsonLd` output has `@type: "RealEstateAgent"`, `telephone`, `address.postalCode: "75590"`, `sameAs` including the Facebook page.
- [ ] **Step 2:** Run — expect FAIL.
- [ ] **Step 3:** Implement `metadata.ts` + `JsonLd.tsx`.
- [ ] **Step 4:** Run — expect PASS.
- [ ] **Step 5:** Implement `sitemap.ts`, `robots.ts`, `not-found.tsx` (branded 404 with links home + to properties + WhatsApp), `opengraph-image.tsx` (ink background, gold "FF" monogram, wordmark — `ImageResponse`, 1200×630).
- [ ] **Step 6:** Refactor pages: root layout renders site-wide `<JsonLd data={realEstateAgentJsonLd(settings)} />`; property detail renders `residenceJsonLd`; news detail renders `articleJsonLd`; swap ad-hoc `generateMetadata` bodies to `buildMetadata`.
- [ ] **Step 7:** `npm test`; `npm run build`; check `/sitemap.xml` and `/robots.txt` in dev.
- [ ] **Step 8: Commit**

```bash
git add src/lib/metadata.ts src/components/seo src/app/sitemap.ts src/app/robots.ts src/app/not-found.tsx src/app/opengraph-image.tsx src/app tests/lib/metadata.test.ts
git commit -m "feat: SEO — metadata helpers, local-business + property JSON-LD, sitemap, robots, OG image

"
```

---

## Task 18: Motion pass

**Files:**
- Modify: home sections, `PropertyCard`, `ProjectCard`, `PropertyFilters`, `PropertyGallery`, `Lightbox`, `Nav`, page headers

**Interfaces:**
- Consumes: `<Reveal>`, `useReducedMotionSafe`.

- [ ] **Step 1:** Wrap section blocks on every page in `<Reveal>` with small staggered `delay`s. Hero: stagger heading/subcopy/CTAs.
- [ ] **Step 2:** Card hover: image `scale` 1→1.04 + caption lift, CSS `motion-safe:` only.
- [ ] **Step 3:** Filter results: 150–200ms cross-fade on `key` change (motion-safe).
- [ ] **Step 4:** Lightbox: fade + slight scale on open/close.
- [ ] **Step 5:** Nav: animate height/shadow on the `scrolled` state.
- [ ] **Step 6: Manual reduced-motion check.** DevTools → Rendering → "Emulate prefers-reduced-motion: reduce"; reload every page type; confirm content appears immediately with no transforms and no hidden (opacity:0) content.
- [ ] **Step 7:** `npm test`; `npm run build`.
- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: restrained scroll + hover motion, fully reduced-motion safe

"
```

---

## Task 19: Performance and accessibility pass

**Files:**
- Modify: image components (add explicit `sizes`), any eager map/video, focus management, color usages

- [ ] **Step 1:** Audit every `next/image`: hero `priority`; all others lazy with correct `sizes`; card images `fill` with aspect-ratio wrappers; blur placeholders from `lqip`.
- [ ] **Step 2:** Confirm no map iframe or video loads before interaction/intersection (grep for `output=embed` and `<iframe`).
- [ ] **Step 3:** Keyboard pass: Tab through home, properties, property detail, contact. Menus and lightbox trap focus and restore it; skip-to-content link added to layout.
- [ ] **Step 4:** Contrast check the gold usages: `--gold` text only on `--ink`; on light backgrounds use `--gold-deep`. Fix any failing instance.
- [ ] **Step 5:** Add `aria-live="polite"` to `FormStatus`; verify form errors link via `aria-describedby`.
- [ ] **Step 6:** Run a production build and Lighthouse (mobile) on `/` and `/properties/<slug>` (seed one property first, or use a dev fixture). Record scores in the commit body. Target Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95. Fix regressions.
- [ ] **Step 7:** `npm test`; `npm run build`.
- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "perf+a11y: image sizing, lazy media, focus management, contrast, Lighthouse pass

"
```

---

## Task 20: Seed real listings from F.F's Facebook posts (draft, client-verified)

**Files:**
- Create: `scripts/seed-listings.ts`

**Interfaces:**
- Consumes: `SANITY_API_WRITE_TOKEN`.
- Produces: a script that creates **draft** `property` documents (`_id` prefixed `drafts.`) from genuine post content, with `price.onRequest = true` unless a price is explicitly stated in the post, and **no images**.

- [ ] **Step 1:** Using the operator's logged-in browser session, open `https://www.facebook.com/F.F.REBAD/` and read the most recent genuine property posts (portion/flat/plot/shop for sale or rent). For each, capture only what the post literally states: purpose, type, location/area, size, bedrooms/bathrooms, notable features, and price *only if written*.
- [ ] **Step 2:** Encode 3–8 of them as objects in `scripts/seed-listings.ts`. No invented prices, no invented photos, no invented approvals. `status: "available"`, `featured: false`.
- [ ] **Step 3:** Run the script against the project; confirm the drafts appear in Studio under Properties (as drafts).
- [ ] **Step 4:** Write `docs/CONTENT-TO-VERIFY.md` listing each seeded draft and the source post date, with a checkbox for the client to confirm/publish.
- [ ] **Step 5: Commit**

```bash
git add scripts/seed-listings.ts docs/CONTENT-TO-VERIFY.md
git commit -m "chore: draft property listings seeded from real Facebook posts for client verification

"
```

---

## Task 21: Handover — SETUP.md, .env.example, full run-through

**Files:**
- Create: `SETUP.md`
- Modify: `.env.example` (final), `README.md`

- [ ] **Step 1:** Finalise `.env.example` with a one-line comment per variable.
- [ ] **Step 2:** Write `SETUP.md`:
  - **Part A — Go live:** create a free Sanity account → `npx sanity login` → `npx sanity init --project` (or create in the web console) → copy Project ID → set env vars locally → `npm run seed` → create a free Vercel account → import the Git repo → paste env vars → deploy → add the deployed URL to `NEXT_PUBLIC_SITE_URL` and redeploy → in Sanity manage console add the Vercel domain to CORS origins → generate a **write token** and set `SANITY_API_WRITE_TOKEN` in Vercel.
  - **Part B — Gmail for lead emails:** enable 2FA on `f.f.realestate333@gmail.com` → create an App Password → set `GMAIL_USER` / `GMAIL_APP_PASSWORD` in Vercel.
  - **Part C — Using the CMS** (screenshots optional): log in at `/studio`; add a property (fields explained in plain words, especially price "on request", `featured`, and image `alt`); add a project; write a news post; edit phone/address/**hours**/social links in Site Settings; where to read incoming **Leads** and how to mark them contacted/closed.
  - **Part D — Publishing the verified draft listings** from `docs/CONTENT-TO-VERIFY.md`.
- [ ] **Step 3:** Update `README.md`: stack, `npm i` / `npm run dev` / `npm test` / `npm run build` / `npm run seed`, link to `SETUP.md`, and the "no fabricated content" rule for future contributors.
- [ ] **Step 4: Full local run-through** (with a real Sanity project + `.env.local`): `npm run seed`; add one property, one project, one gallery image, one news post via Studio; visit every route; submit the contact form and confirm a `lead` appears in Studio and (if Gmail configured) an email arrives; toggle `siteSettings.hours` and confirm the hours block appears/disappears; run `npm run build`.
- [ ] **Step 5:** `npm test` (full suite green) and `npx tsc --noEmit`.
- [ ] **Step 6: Commit**

```bash
git add SETUP.md README.md .env.example
git commit -m "docs: SETUP.md handover guide, env reference, README

"
```

---

## Self-Review (completed)

**Spec coverage:** Nav/hero/hero-capture/trust-bar/property-discovery/filtering/projects/property-page/services/about/why-FF/location/contact/WhatsApp-first/Facebook-link/gallery/testimonials(conditional)/news/inquiry-system/CMS/animations/typography/mobile/performance/SEO/footer/trust-rules/content-strategy → Tasks 6, 8, 8, 8, 8–9, 9, 12, 10, 13, 13, 13, 8+14, 14, all pages + Task 6/10/11, 8+15, 16, 8 (renders only when `testimonial` docs exist — schema in Task 3), 15, 11, 3–5+21, 18, 1, 6, 19, 17, 6, Global Constraints + Tasks 13/20, 20. All mapped.

**Placeholder scan:** No "TBD"/"handle edge cases"/"write tests for the above" left; test code and implementation code shown for every TDD step; presentational components carry explicit responsibilities, states, and manual verification steps.

**Type consistency:** `PropertyFilterState`, `parsePropertyFilters`, `buildPropertyGroqFilter`, `buildWhatsAppLink`, `propertyWhatsAppMessage`, `formatPrice`, `formatArea`, `leadSchema`/`parseLead`/`isSpam`/`createLead`/`sendLeadEmail`, `buildMetadata`, `getSiteSettings`/`FALLBACK_SITE`, and all enum values are defined once (Tasks 2–4, 9, 11, 17) and referenced consistently. Field enums are pinned in Task 3's Interfaces block and reused verbatim.
