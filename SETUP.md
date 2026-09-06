# F.F Real Estate — Setup & Handover Guide

This guide takes the website from the code you have now to a live site that
F.F Real Estate can update without a developer. Work through the parts in
order. You do **not** need to understand the code to follow this.

**What you will end up with:**

- The public website, live on the internet on a free plan.
- A content editor at `yoursite.com/studio` where staff log in and add
  properties, projects, news posts, photos, and edit the phone numbers,
  address, hours and social links.
- Contact-form enquiries ("leads") landing both in that editor **and** in the
  F.F Gmail inbox.

**Roughly how long:** 60–90 minutes for a first-time setup, most of it waiting
on account sign-ups and one deploy.

---

## Table of contents

- [Part 0 — Run it on your own computer first](#part-0--run-it-on-your-own-computer-first)
- [Part A — Go live](#part-a--go-live)
- [Part B — Gmail for lead emails](#part-b--gmail-for-lead-emails)
- [Part C — Using the content editor (Studio)](#part-c--using-the-content-editor-studio)
- [Part D — Publish the four draft listings](#part-d--publish-the-four-draft-listings)
- [Part E — Things to check or decide (from CONTENT-TO-VERIFY.md)](#part-e--things-to-check-or-decide)
- [Environment variables reference](#environment-variables-reference)
- [Open items handed to you](#open-items-handed-to-you)

---

## Part 0 — Run it on your own computer first

Do this once to confirm the code runs before you touch any online accounts.

### 0.1 Install the tools

1. **Node.js 20 or newer** — <https://nodejs.org> (the "LTS" download).
2. **Git for Windows** — <https://git-scm.com/download/win>. This ships
   "Git Bash", which this project needs (see the note below). On macOS/Linux
   you already have everything.

> **Why Git Bash is required:** the project folder name contains an `&`
> (`F&F REAL ESTATE`). Windows Command Prompt and PowerShell treat `&` as a
> separator and every `npm` command in the folder fails. The file `.npmrc`
> tells npm to use `bash` instead, so a bash shell must be installed and on
> your PATH. The live site on Vercel (Linux) is not affected. The simplest
> long-term fix is to keep the project in a folder **without** an `&` in the
> name — but that is optional.

### 0.2 Install the project

Open a terminal in the project folder and run:

```bash
npm install --legacy-peer-deps
```

> **Why `--legacy-peer-deps`:** one package in the Sanity toolchain declares a
> stricter React version than it actually needs. The flag tells npm to install
> anyway. It is safe here and is also set for the Vercel build.

### 0.3 Start it

```bash
npm run dev
```

Open <http://localhost:3000>. The whole site works right now with **no
database** — every page loads, using the built-in fallback contact details and
"coming soon" placeholders where content has not been added yet. The contact
form will accept a submission and quietly do nothing useful until Part A is
done.

Useful commands:

| Command | What it does |
| --- | --- |
| `npm run dev` | Local site at <http://localhost:3000> |
| `npm run build` | Production build — run this to check nothing is broken |
| `npm test` | Run the test suite |
| `npm run typecheck` | Check TypeScript types |
| `npm run seed` | Load starter content into Sanity (needs Part A done) |
| `npm run seed:listings` | Load the four draft property listings (needs Part A) |

---

## Part A — Go live

### A.1 Create a free Sanity project (the content database + editor)

1. Go to <https://www.sanity.io> and sign up (Google login is fine). The free
   plan is enough for this site.
2. In a terminal in the project folder:

   ```bash
   npx sanity login
   npx sanity init
   ```

   When prompted:
   - **Create new project** → name it `F.F Real Estate`.
   - **Use the default dataset configuration** → yes (this creates a dataset
     called `production`).
   - If it asks to overwrite files or add a config, **decline** — the project
     already has its Sanity config.
3. Find your **Project ID**: <https://www.sanity.io/manage> → your project →
   it is shown at the top (looks like `a1b2c3d4`).

### A.2 Point the local site at your Sanity project

Create a file named `.env.local` in the project folder (copy `.env.example`
and fill it in):

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
```

### A.3 Create a write token and seed starter content

1. <https://www.sanity.io/manage> → your project → **API** → **Tokens** →
   **Add API token**. Name it `seed`, permission **Editor**. Copy the token
   (you only see it once).
2. Add it to `.env.local` as a new line:

   ```
   SANITY_API_WRITE_TOKEN=paste-the-token-here
   ```
3. Seed the starter content, then the draft listings:

   ```bash
   npm run seed
   npm run seed:listings
   ```

   `npm run seed` creates the site settings (phones, address, socials, hero
   text) and the two staff contact records. `npm run seed:listings` adds the
   four Facebook posts as **draft** properties. Run them in that order — see
   Part D.
4. Restart `npm run dev`, open <http://localhost:3000/studio>, sign in with the
   same Sanity account. You should see **Site Settings**, **Properties**,
   **Projects**, **News**, **Gallery**, **Leads** and the two contacts.

### A.4 Create a free Vercel project (the hosting)

1. Push this project to a Git repository (GitHub is easiest and free). If it is
   not already on GitHub: create an empty repo there, then in the project
   folder:

   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/ff-real-estate.git
   # Push whichever branch holds the finished code. If that is `build/website`:
   git push -u origin build/website
   # (Or merge it into `main` first and push `main`.) In Vercel's import step,
   # set the Production Branch to whichever branch you pushed.
   ```
2. Go to <https://vercel.com>, sign up with GitHub, **Add New… → Project**,
   import the repo.
3. On the configure screen, open **Environment Variables** and add each of
   these (values from your `.env.local`):

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | your project id |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-10-01` |
   | `SANITY_API_WRITE_TOKEN` | the Editor token (needed so the contact form can save leads) |
   | `NEXT_PUBLIC_SITE_URL` | your intended final URL, `https://`, no trailing slash — e.g. `https://ff-real-estate.vercel.app` or F.F's domain |

   Set `NEXT_PUBLIC_SITE_URL` **before this first deploy** so SEO tags, the
   sitemap and `robots.txt` point at the real domain. If you genuinely don't
   know the URL yet, you may leave it unset for the very first deploy — the site
   falls back to Vercel's own `*.vercel.app` deployment URL (never localhost) —
   then set it properly in step A.6 and redeploy.

   Add the Gmail variables now too if you have done Part B, otherwise add them
   later.
4. **Deploy.** Wait for it to finish and note the URL Vercel gives you
   (e.g. `ff-real-estate.vercel.app`), or connect F.F's own domain under
   **Settings → Domains**.
5. **Verify the site URL took effect:** open `https://your-site/robots.txt` and
   confirm the `Sitemap:` line shows your real domain, not `localhost`. If it
   still says localhost, fix `NEXT_PUBLIC_SITE_URL` (step A.6) and redeploy.

### A.5 Allow the live site to talk to Sanity (CORS)

<https://www.sanity.io/manage> → your project → **API** → **CORS origins** →
**Add CORS origin**. Add your live URL (e.g. `https://ff-real-estate.vercel.app`
and the custom domain if you added one). Tick **Allow credentials**.

### A.6 Set the site URL and redeploy

1. In Vercel → your project → **Settings → Environment Variables**, set
   `NEXT_PUBLIC_SITE_URL` to the final public URL, **with** `https://` and
   **no** trailing slash (e.g. `https://ff-real-estate.vercel.app`). This is
   used for SEO tags, the sitemap, and social-share previews.
2. **Deployments** tab → latest deployment → **⋯ → Redeploy**.

The site is now live. Visit `/studio` on the live URL to edit content from
anywhere.

---

## Part B — Gmail for lead enquiry emails

The contact form always saves enquiries into Studio (**Leads**). It can
**also** email them to F.F. To turn that on:

1. Sign in to `f.f.realestate333@gmail.com`.
2. Turn on **2-Step Verification**: <https://myaccount.google.com/security>.
   (App passwords are only available once 2FA is on.)
3. Create an **App Password**: <https://myaccount.google.com/apppasswords> →
   name it `F.F Website` → Google shows a 16-character password. Copy it.
4. In Vercel → **Settings → Environment Variables**, add:

   | Name | Value |
   | --- | --- |
   | `GMAIL_USER` | `f.f.realestate333@gmail.com` |
   | `GMAIL_APP_PASSWORD` | the 16-character app password (spaces don't matter) |
   | `LEAD_NOTIFICATION_EMAIL` | where alerts go — `f.f.realestate333@gmail.com`, or another address |
5. Redeploy (Part A.6, step 2).

If these are not set, the form still works — enquiries just appear in Studio
only, never lost.

---

## Part C — Using the content editor (Studio)

Go to `yoursite.com/studio` and sign in. Changes **appear on the site within
about a minute of pressing Publish** (pages refresh on a short timer). A
document stays a grey "draft" until you press Publish.

### Site Settings (edit once, update as things change)

One document. Controls site-wide details:

- **Phone numbers** — each row has a label (the person's name), the number, and
  an "On WhatsApp" switch. These show in the header, footer and contact page.
- **Primary WhatsApp number** — the number the floating WhatsApp button and
  "Message on WhatsApp" buttons use. Digits only, with country code, no `+`
  (e.g. `923133694904`).
- **Opening hours** — **leave empty and no hours are shown anywhere.** Only add
  rows once F.F has confirmed real hours. Each row is a day + opens/closes, or
  tick "Closed".
- **Social links** — Facebook page and Facebook group are already set. Add
  Instagram/YouTube/TikTok only if F.F actually has them.
- **Homepage hero** — the big headline, sub-text and the two button labels/links
  at the top of the home page.
- **Trust bar items** and **Why F.F Real Estate** — the short points shown on
  the home page.
- **Logo** — see Part E.

### Add a property

**Properties → Create → Property.**

- **Title** — how it appears everywhere, e.g. "240 sq. yd 2nd-Floor Portion".
- **Slug** — the web address piece; click **Generate** from the title.
- **Purpose** — For Sale / For Rent.
- **Type** — House, Flat / Apartment, Plot, Commercial, Office, Shop, Other.
- **Location** — free text, e.g. "F.B Area, Block 15".
- **Price** — three fields:
  - Leave **Price on request** ticked to show "Price on request" (safe default;
    F.F has not given public prices).
  - Or untick it and fill **Amount (PKR)** for a formatted number,
  - Or type **Display text** for an exact phrase like "PKR 2.4 Crore".
- **Status** — Available / Under Offer / Sold / Rented. Non-available ones are
  shown but clearly marked.
- **Description** — a short paragraph.
- **Highlights** — bullet points (west open, corner, park facing, …).
- **Gallery** — upload photos. **For every image fill in "Alt text"** — a
  one-line description of the photo, used for accessibility and Google. If there
  are no photos, leave it empty; the page shows a clean text-only layout.
- **Map** — optional. Add **latitude and longitude** for a pin; otherwise the
  map falls back to the address / location text. (A pasted Google Maps URL is
  stored but not currently shown on the page.)
- **Agent** — link to Syed Mustafa Rehman or Mohammad Salman (created by
  `npm run seed`).
- **Featured** — tick to feature it on the home page.
- **Published at** — the date shown on the listing.

Press **Publish**.

### Add a project (development)

**Projects → Create → Project.** Name, slug, location, **Status** (Upcoming /
In Progress / Completed), hero image (+ alt text), description, key features,
gallery (+ alt text on each), Featured. Publish.

### Write a news post

**News → Create → News Post.** Title, slug, **Category** (Listing /
Announcement / Market / Advice / Company), cover image (+ alt text), body,
Published at. Publish. The "News" link only appears in the site menu once at
least one post is published.

### Add gallery images

**Gallery → Create → Gallery Image.** Upload, set a caption/alt, choose a
category. These feed the `/gallery` page.

### Read and manage leads

**Leads.** Every contact-form submission lands here with name, phone, email,
what they want, budget, message, and which page/property it came from. Set
**Status** to **Contacted** or **Closed** as you work through them. Nothing is
ever deleted automatically.

---

## Part D — Publish the four draft listings

`npm run seed:listings` created four **draft** properties from real F.F
Facebook posts. They are **not public** until someone reviews and publishes
each one. The full checklist — what was assumed, what was not, and the exact
wording — is in **`docs/CONTENT-TO-VERIFY.md`, section 1**.

Run order, if you re-run the seed:

```bash
npm run seed          # creates the agent/contact records first
npm run seed:listings # then the draft listings
```

To publish: **Studio → Properties →** open each draft → check the details
against the Facebook post → add photos if F.F wants them → fix anything wrong →
**Publish**. Delete any you do not want to list.

Key things flagged for F.F's confirmation (see the doc for the rest):

- **No prices** are set — all show "Price on request".
- **No photos** — the posts' images were not reused.
- Listing 1's **bathroom count (4)** is inferred from "3 bed attached + 1
  common". Correct if wrong.
- Post **dates are recorded as 2026** (Facebook showed no year). Fix the
  "Published at" date if a post is actually older.

---

## Part E — Things to check or decide

`docs/CONTENT-TO-VERIFY.md` is the full list. Summary:

| # | Item |
| --- | --- |
| 1 | The four draft listings — review and publish (Part D). |
| 2 | **Business hours** — currently not shown anywhere. Add them in Site Settings only once F.F confirms real hours. |
| 3 | Wording check: the site describes F.F's work in general terms ("property in F.B Area, Dastagir and Karachi"). Confirm that matches what F.F does. |
| 4 | A third phone number (`0334 4890901`) appears on some Facebook posts but was **not** added. Add it in Site Settings only if F.F confirms it. |
| 5 | **Google Map** — the property/contact maps use a keyless Google embed, which Google has made unreliable. If maps show a "can't load" box, create a free **Maps Embed API** key in Google Cloud and the developer wires it in (about 15 minutes). |
| 6 | **Reduced motion** — 30-second check: turn on "reduce motion" in your OS display settings, reload the site, confirm animations are calm/off. |
| 7 | Facebook page and group links — confirm both are correct in Site Settings. |
| 8 | Projects / News / Gallery show tasteful "coming soon" states until content is added. |
| 9 | **Logo** — the site currently uses a text wordmark. Upload a real logo in Site Settings if F.F has one. |
| 10 | **Testimonials** — the site has **no testimonials section**. If F.F wants one later, that is a development change — do not enter testimonials expecting them to appear, and never invent them. |

---

## Environment variables reference

Copy `.env.example` to `.env.local` for local work; set the same values in
Vercel for the live site. `NEXT_PUBLIC_` values are visible in the browser
(that is expected for these); the token and Gmail password are server-only.

| Variable | Required? | What it is |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Live site | Full public URL, `https://`, no trailing slash. Used for SEO, sitemap, social previews. Local: `http://localhost:3000`. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes for content | Your Sanity project id from sanity.io/manage. Without it the site runs on built-in fallback content. |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes for content | `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Yes for content | `2024-10-01`. Leave as-is unless the developer changes it. |
| `SANITY_API_WRITE_TOKEN` | Yes for the contact form + seeding | Sanity **Editor** token. Lets the contact form save leads and lets `npm run seed` write. Server-only — never put it in a `NEXT_PUBLIC_` variable. |
| `GMAIL_USER` | Optional | Gmail address that sends lead emails. |
| `GMAIL_APP_PASSWORD` | Optional | 16-char Google App Password (needs 2FA on that account). |
| `LEAD_NOTIFICATION_EMAIL` | Optional | Where lead emails are delivered. Defaults to `GMAIL_USER` if unset. |

---

## Open items handed to you

These were identified during the build and left for F.F / the developer to
close after go-live:

1. **Populated-page visual review.** Pages were built and tested without a live
   database. After Part A, add one real property, project, gallery image and
   news post, then click through every page once to confirm they look right
   with real content.
2. **Google Maps Embed API key** (Part E item 5) — needed if the keyless map
   embed fails in production.
3. **Reduced-motion spot check** (Part E item 6) — 30 seconds with OS
   "reduce motion" on.
4. **`npm audit`** currently reports about 12 findings (moderate/high),
   including advisories against `next` and `postcss` — not only Sanity tooling.
   The runtime site is not affected: the `postcss` advisories are build-time
   issues affecting attacker-supplied CSS, and all CSS here is first-party.
   Clearing them fully requires a Next.js major-version upgrade, which a
   developer should schedule as separate work — it is not a blocker for launch.
5. **Custom domain** — connect F.F's domain in Vercel → Settings → Domains, then
   update `NEXT_PUBLIC_SITE_URL` and the Sanity CORS origins to match.

---

### The one rule for anyone editing this site

**Never add content F.F did not provide.** No invented properties, prices,
project names, approvals, years of experience, completed developments,
certifications, awards, statistics, or testimonials. No stock or AI photos —
only real images F.F supplies. When in doubt, leave it out and ask F.F.
