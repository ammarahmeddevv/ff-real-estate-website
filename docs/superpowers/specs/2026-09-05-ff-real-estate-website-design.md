# F.F Real Estate Builder & Developers — Website Design Spec

**Date:** 2026-09-05
**Status:** Approved for planning
**Owner deliverable:** Premium, conversion-focused real-estate website with a self-service CMS.

---

## 1. Purpose

Build the professional online home for **F.F Real Estate Builder & Developers**, a
Karachi-based property business (F.B Area / Dastagir, Block 15). The business
currently operates mainly through a Facebook page (~2.2K followers) with no
dedicated website.

The site must, in priority order:

1. **Establish trust immediately** — look legitimate and established within five seconds.
2. **Showcase properties and developments** professionally.
3. **Convert visitors into WhatsApp, phone, and inquiry leads** with minimum friction.
4. Give F.F a credible presence that makes its Facebook feel like the social arm of a real company.

The core journey to optimise for:

> Facebook / Google / referral → website → "this is a real company" → browse property →
> find something → view details → WhatsApp / call → lead.

Priority ordering for every design trade-off: **Trust → Properties → Proof → Conversion → WhatsApp.**

---

## 2. Verified business information

Only the following is confirmed (from the official Facebook page
`facebook.com/F.F.REBAD` and the client). **Nothing else may be invented** —
no years of experience, project counts, completed developments, approvals,
certifications, awards, ratings, testimonials, or client statistics.

| Field | Value |
|---|---|
| Legal / display name | F.F Real Estate Builder & Developers |
| Category | Property service |
| Facebook page | https://www.facebook.com/F.F.REBAD/ (~2.2K followers) |
| Facebook group | https://www.facebook.com/groups/397312108831460/ |
| Services (from their own cover art) | Sale, Purchase, Rent, Renovation, Documentation |
| Address | R-37, Block 15, Near Taal Stop, F.B Area, Dastagir Society, Karachi, Pakistan, 75590 |
| Phone 1 | 0313 3694904 (Syed Mustafa Rehman) |
| Phone 2 | 0345 4569090 (Mohammad Salman) — client-approved for publication |
| Email | f.f.realestate333@gmail.com |
| Areas they actively post about | F.B Area, Dastagir Society, Scheme 33, Scheme 45 |
| Brand identity | Circular gold-gradient "FF" monogram on black; brand colours gold + black + white |
| Business hours | **Unknown — not published.** Ready CMS field, hidden on site until client confirms. |

### Numbers explicitly NOT to publish (unconfirmed / belong to other businesses)

- 0345 2913531, 0334 4890901 — appear in third-party search results, unconfirmed.
- 0334 1360110 — belongs to an unrelated agency ("F&F REAL ESTATE", Shop #7 Sadaf
  Terrace, Block 7, Naseerabad — 5.0 Google reviews). Not this client. Do not conflate.

### Assets

- **Real logo:** the gold "FF" monogram, redrawn as a crisp SVG (Facebook raster is low-res).
- **Real brand colours:** gold + black, refined into the palette in §7.
- **No stock or AI photography anywhere.** Hero and section backgrounds are
  typographic / material (charcoal fields, gold rule lines, large editorial type)
  until F.F supplies real photos. Property and project imagery comes only from
  what the client provides via the CMS.

---

## 3. Tech stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | Next.js 15, App Router, TypeScript | SSR/ISR, image pipeline, SEO, one deploy target |
| Styling | Tailwind CSS + a small design-token layer (CSS variables) | Consistent premium system, fast |
| CMS | Sanity v3, Studio embedded at `/studio` | One repo, one deploy, one owner login; strong image CDN; free tier |
| Content fetch | `next-sanity` + GROQ, tag-based revalidation | Fast, cache-friendly |
| Images | Sanity image CDN + `next/image` | WebP/AVIF, responsive `srcset`, lazy load, blur-up |
| Animation | Framer Motion | Scroll reveals, hover, transitions — all `prefers-reduced-motion` gated |
| Forms / email | Next.js route handler → Sanity `lead` doc + email via Nodemailer over Gmail SMTP (app password) | Owner already has the Gmail account; leads also visible in CMS. Email is best-effort — a failed send never blocks the lead being saved. |
| Maps | Lazy-loaded Google Maps embed (iframe), rendered on scroll/click | No map JS on initial load |
| Fonts | Fraunces (display serif) + Inter (body/UI), self-hosted via `next/font` | No render-blocking external fonts |
| Deploy target | Vercel (free) + Sanity (free) — done by client using `SETUP.md` | Handover model |

Single repository. Studio and site share the Sanity client config.

---

## 4. Content model (Sanity schema)

### `siteSettings` (singleton)
- `logo` (image, optional — SVG shipped in repo is the default)
- `phones` (array of `{ label, number, whatsapp: bool }`) — seeded with the two confirmed numbers
- `primaryWhatsapp` (string, E.164 e.g. `923133694904`)
- `email` (string)
- `address` (object: `line1`, `area`, `city`, `postalCode`, `mapsUrl`, `lat`, `lng`)
- `hours` (array of `{ day, open, close, closed: bool }`) — empty by default, section hidden when empty
- `socials` (array of `{ platform, url }`) — seeded with Facebook page + group
- `hero` (object: `heading`, `subheading`, `primaryCtaLabel`, `primaryCtaHref`)
- `trustBarItems` (array of strings) — seeded: "Karachi-Based Real Estate Professionals",
  "Buying • Selling • Renting", "Renovation & Documentation", "F.B Area & Dastagir Local Expertise"
- `whyFF` (array of `{ title, body }`) — editorial trust points, seeded from verified positioning only

### `property`
- `title` (string), `slug`
- `purpose` (string: `sale` | `rent`)
- `type` (string: `house` | `flat` | `plot` | `commercial` | `office` | `shop` | `other`)
- `location` (string — area name, e.g. "F.B Area, Block 15")
- `address` (string, optional)
- `price` (object: `amount` number optional, `display` string e.g. "PKR 2.4 Crore" or null, `onRequest` bool)
- `bedrooms` (number, optional), `bathrooms` (number, optional)
- `area` (object: `value` number, `unit` string: `sqyd` | `sqft` | `marla` | `kanal`)
- `status` (string: `available` | `under_offer` | `sold` | `rented`)
- `availability` (string, optional — e.g. "Immediate")
- `description` (Portable Text)
- `highlights` (array of strings)
- `gallery` (array of images with `alt`, hotspot enabled)
- `map` (object: `lat`, `lng`, `embedUrl`) optional
- `agent` (reference → `agent`) optional
- `featured` (bool)
- `publishedAt` (datetime)

### `project`
- `name` (string), `slug`
- `location` (string)
- `projectType` (string — free text, e.g. "Residential portion project")
- `status` (string: `upcoming` | `in_progress` | `completed`) — only what client confirms
- `heroImage` (image)
- `description` (Portable Text)
- `keyFeatures` (array of strings)
- `gallery` (array of images)
- `featured` (bool)

### `service`
- `title` (string), `slug`
- `summary` (string — one line, benefit-focused)
- `whatYouGet` (array of strings)
- `order` (number)
- Seeded from confirmed services only: Property Buying, Property Selling, Property Rentals,
  Renovation, Documentation, Property Consultation.

### `agent`
- `name` (string), `role` (string), `phone` (string), `whatsapp` (string), `photo` (image, optional)
- Seeded: Syed Mustafa Rehman, Mohammad Salman.

### `newsPost`
- `title`, `slug`, `category` (string: `listing` | `announcement` | `market` | `advice` | `company`)
- `coverImage` (image, optional)
- `excerpt` (string)
- `body` (Portable Text)
- `publishedAt` (datetime)

### `galleryImage`
- `image` (image with `alt`)
- `category` (string: `exterior` | `interior` | `building` | `neighbourhood` | `commercial` | `construction` | `project`)
- `caption` (string, optional)
- `relatedProperty` / `relatedProject` (reference, optional)

### `testimonial`
- `name` (string), `context` (string), `quote` (text), `photo` (image, optional)
- **Section renders only when ≥1 published testimonial exists.** Otherwise the homepage
  shows the factual "Why Clients Contact F.F" block instead.

### `lead` (created by form submissions, read-only-ish in Studio)
- `name`, `phone`, `email` (optional), `preferredContact` (string: `whatsapp` | `call` | `email`)
- `purpose` (string: `buy` | `rent` | `sell` | other)
- `propertyInterest` (string), `budget` (string)
- `message` (text)
- `relatedProperty` (reference, optional)
- `source` (string — page path / "hero" / "property:<slug>" / "contact")
- `submittedAt` (datetime), `status` (string: `new` | `contacted` | `closed`)

---

## 5. Pages & routes

| Route | Contents |
|---|---|
| `/` | Hero + hero inquiry panel · trust bar · featured properties · featured projects · services strip · Why F.F (editorial) · About teaser · Latest from F.F (news + Facebook link) · location · contact CTA |
| `/properties` | Filter bar (purpose, type, location, price range, bedrooms, area) + responsive card grid. Filters via URL `searchParams`, server-rendered. Empty state when no matches / no inventory. |
| `/properties/[slug]` | Image gallery + lightbox · title / location / price · quick-details row (type, area, beds, baths, status, availability) · Overview · Highlights · Location (lazy map) · sticky "Interested in this property?" panel: WhatsApp (prefilled), Call agent, Request information (form) |
| `/projects` | Card grid of developments. Empty state when none. |
| `/projects/[slug]` | Hero image · description · key features · gallery + lightbox · inquiry CTA panel |
| `/about` | Editorial About — "Real Estate, Handled Professionally." Verified info only. |
| `/services` | Service cards, each with "what you get" + WhatsApp/contact CTA |
| `/why-ff` | Large-type editorial trust section (Local Market Knowledge, Straightforward Guidance, Personalised Assistance, Sale/Purchase/Rent/Renovation/Documentation under one roof) — claims limited to verified positioning |
| `/contact` | Phone CTA (both numbers) · Email CTA · prominent WhatsApp CTA · contact form · office address + lazy map + "Get Directions" · business hours (only if set) |
| `/news` | Editorial list/grid of `newsPost`. Nav link hidden until ≥1 post. |
| `/news/[slug]` | Article layout |
| `/gallery` | Masonry/justified grid with category filter + full lightbox |
| `/studio` | Sanity Studio (owner login) |
| `sitemap.xml`, `robots.txt`, `not-found`, `opengraph-image` | Generated |

### Global UI
- **Sticky nav:** logo left; links Home / Properties / Projects / About Us / Services / Why F.F / Contact; primary CTA "WhatsApp Us", secondary "Call Now". Becomes compact + elevated on scroll.
- **Mobile:** clean slide-out menu, WhatsApp CTA pinned and always reachable.
- **Floating WhatsApp button** on every page (bottom-right, above mobile bar).
- **Mobile sticky bottom bar:** WhatsApp + Call, visible site-wide, especially on property pages.
- **Footer:** name, quick links, both phone numbers, email, full address, Facebook (page + group), prominent "WhatsApp Us" CTA.

---

## 6. Conversion & WhatsApp behaviour

- Every WhatsApp link is a `https://wa.me/<number>?text=<prefilled>` deep link.
- Property pages prefill: `Hello, I am interested in [PROPERTY TITLE] ([location]). Please send me more details.`
- Hero / generic prefill: `Hello F.F Real Estate, I'd like to ask about a property.`
- Hero inquiry panel fields (short): Name · Phone · Property Interest · Budget · Buy/Rent/Sell · Message. Primary button "Request Property Details"; secondary "Continue on WhatsApp" (composes a WhatsApp message from whatever fields are filled).
- Property inquiry form: Name · Phone · Preferred contact method · Message · (hidden) property ref. Button "Send Inquiry". On success: inline confirmation + "Chat on WhatsApp" button.
- All form submissions: create `lead` in Sanity + send email to `f.f.realestate333@gmail.com`. Never block the user behind a form when they just want to chat.
- Basic spam protection: honeypot field + time-to-submit check (no external CAPTCHA).

---

## 7. Visual design system

### Palette (design tokens)
| Token | Value | Use |
|---|---|---|
| `--ink` | `#111113` | primary background (dark sections), text on light |
| `--ink-soft` | `#1B1B1E` | raised dark surfaces |
| `--ivory` | `#F5F1E8` | primary light background |
| `--paper` | `#FBFAF6` | cards on ivory |
| `--gold` | `#C7A253` | accent — flat, never gradient; rules, small labels, focus, hover underlines |
| `--gold-deep` | `#A6863F` | accent hover / text-on-ivory when gold text needed |
| `--gray-500` | `#6B6B70` | metadata |
| `--gray-200` | `#E4E1D8` | hairlines on light |
| `--line-dark` | `rgba(255,255,255,0.12)` | hairlines on dark |

Gold is used **sparingly** — hairline rules, uppercase micro-labels, focus states,
active filter chips, small CTA accents. Never a gold gradient, never large gold fills.

### Typography
- **Display:** Fraunces (self-hosted). Large, confident, editorial. Used for h1–h3 and pull quotes.
- **Body / UI:** Inter (self-hosted). Highly readable. Used for body, nav, buttons, forms.
- **Prices:** Inter, larger weight/size, tabular numerals, prominent.
- **Metadata:** Inter, small, `--gray-500`.
- **Micro-labels:** Inter, uppercase, `letter-spacing: 0.14em`, `--gold` — used sparingly.

### Layout & components
- Max content width ~1240px; generous vertical rhythm; strong left-aligned editorial headings.
- **Restraint:** subtle borders over big shadows; small radii (4–8px), not pill-cards everywhere;
  no glassmorphism; no cartoon icons (use a thin consistent line-icon set, minimally).
- Property card: image (4:3, zoom-on-hover), purpose tag, title, location, price, 2–3 meta chips, "View Property".
- Filter bar: quiet, premium; active filters as small gold-outlined chips; results count; cross-fade on change.

### Motion (all gated by `prefers-reduced-motion: reduce` → no transforms, instant)
- Hero: staggered reveal of heading / subcopy / CTAs on load.
- Subtle parallax on hero material layer only.
- Scroll-triggered fade-and-rise for section blocks and cards (intersection observer).
- Property/project card: image scale 1→1.04, caption lift on hover.
- Filter results: 150–200ms cross-fade.
- Lightbox: fade + slight scale.
- Page transitions: quick fade.
- Nav: height/shadow transition on scroll.
- Animation language = calm, expensive. No bounce, no spin, no neon.

---

## 8. Performance

- `next/image` everywhere; explicit sizes; `priority` only on the hero.
- Sanity CDN transforms for responsive sizes; AVIF/WebP negotiation.
- Lazy-load: maps (on view), news images, gallery below the fold, any video.
- Self-hosted fonts via `next/font`, `display: swap`, preload display face only.
- Minimal client JS: Framer Motion used narrowly; filter logic server-side where possible.
- Route-level code splitting; Studio bundle isolated to `/studio`.
- Targets: Lighthouse mobile Performance ≥ 90, LCP < 2.5s on 4G, CLS < 0.1.

---

## 9. SEO

- Per-page `<title>` + meta description; templated for property/project/news detail.
- Open Graph + Twitter card; `opengraph-image` generated (brand card; property/project use first gallery image when present).
- JSON-LD:
  - Site-wide: `RealEstateAgent` (name, address, geo, telephone, email, sameAs → Facebook).
  - Property detail: `Residence` / `Product`-style with `offers` when a price exists.
  - News detail: `Article`.
- `sitemap.ts` (all static + dynamic routes from Sanity), `robots.ts`.
- Clean, human URLs: `/properties/2nd-floor-portion-fb-area-block-15`.
- Sensible internal linking (home → sections → detail → related).
- Local-SEO copy woven naturally (Karachi, F.B Area, Dastagir, Scheme 33/45) — **no keyword stuffing**.
- No fabricated review/aggregate-rating schema.

---

## 10. Accessibility

- Semantic landmarks, one `h1` per page, logical heading order.
- Colour contrast ≥ WCAG AA (gold-on-ink and ink-on-ivory verified; gold text on light only in `--gold-deep`).
- Visible focus rings (gold), full keyboard nav, focus-trapped lightbox and mobile menu.
- All images require `alt` in the CMS (validation).
- Forms: labels, error text tied via `aria-describedby`, success announced via `aria-live`.
- Respects `prefers-reduced-motion`.

---

## 11. Content seeding (post-build, client verifies before publish)

- Extract genuine property details from F.F's actual Facebook posts (e.g. "240 sq yd West
  Open, Prime Location, 2nd Floor Portion for Rent, 3 bed attached, drawing room, big lounge").
- Enter as **draft** `property` docs. **No invented prices** — `price.onRequest = true`
  where the post doesn't state one. No invented photos.
- Seed `service`, `agent`, `siteSettings`, `trustBarItems`, `socials` with verified data.
- Client reviews all drafts in Studio and publishes.

---

## 12. Handover

- Full project in the repo, running locally (`npm run dev`).
- `SETUP.md`:
  1. Create free Sanity account + project; paste project ID / dataset into `.env`.
  2. Create free Vercel account; import repo; set env vars; deploy.
  3. Point a domain (optional).
  4. Configure the Gmail app password for lead emails.
  5. **Using the CMS** — plain-language walkthrough: add a property, add photos, mark
     featured, add a project, write news, update phone/address/hours, read leads.
- `.env.example` with every required variable documented.

---

## 13. Explicitly out of scope / forbidden

- No fabricated properties, prices, project names, approvals, NOCs, government
  affiliations, certifications, awards, "No. 1" / "most trusted" / "market leader" claims.
- No fabricated experience ("X years"), completed-project counts, client counts, or statistics.
- No fabricated testimonials or reviewer names.
- No stock or AI photography presented as F.F's work; none added "to fill space".
- No CAPTCHA, no heavy third-party Facebook SDK/widget (link out instead).
- No second/third unconfirmed phone numbers.
- Online payments, account systems, user logins (beyond the single CMS login), and
  multi-language are not in this build.

---

## 14. Build phases (for the implementation plan)

1. Project scaffold: Next.js + TS + Tailwind + tokens + fonts + base layout/nav/footer/floating CTAs.
2. Sanity: schema types, embedded Studio, client config, seed `siteSettings`/`service`/`agent`.
3. Data layer: GROQ queries, typed fetchers, revalidation.
4. Home page (all sections) with empty-state handling.
5. Properties: list + filters + detail + gallery/lightbox + inquiry panel + WhatsApp prefill.
6. Projects: list + detail.
7. About, Services, Why F.F.
8. Contact + form pipeline (lead doc + email + WhatsApp continuation) + reused inquiry forms.
9. News: list + detail.
10. Gallery page + lightbox + category filter.
11. Motion pass (Framer Motion, reduced-motion gating).
12. SEO pass (metadata, JSON-LD, sitemap, robots, OG images).
13. Performance + accessibility pass.
14. Content seeding from real Facebook posts (draft).
15. `SETUP.md` + `.env.example` + final local run-through.
