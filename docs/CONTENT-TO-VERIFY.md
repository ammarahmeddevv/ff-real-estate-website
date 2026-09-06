# Content to verify before / soon after go-live

This is a plain-language checklist for the F.F Real Estate team. Everything below is
either **content we drafted from your own Facebook page for you to confirm**, or a
**setting you can fill in yourself** in the Studio (`/studio` on the site).

Nothing here is urgent enough to block launch — but the four property listings and the
business hours are the two things worth doing first.

---

## 1. The four draft property listings — review, then publish

We turned four genuine posts from your Facebook page (facebook.com/F.F.REBAD) into
**draft** listings. They are **not live** yet. You decide what goes public.

> **For the developer — seed run order:** run `npm run seed` first (it creates the
> agent/contact records), then `npm run seed:listings`. The listings' agent link is
> a weak reference, so the reverse order also works, but running `seed` first is
> what links each draft to the F.F contacts.

| # | Listing (as it will appear) | What the site will show | Source post |
|---|------------------------------|--------------------------|-------------|
| 1 | **240 sq. yd 2nd-Floor Portion — For Rent** | For rent · Flat/portion · 240 sq. yd · 3 bed · F.B Area, Block 15 · "Price on request" | Your Facebook post, 21 May |
| 2 | **Shop for Sale — F.B Area, Block 15** | For sale · Shop · approx. 20 sq. yd (8 × 5) · F.B Area, Block 15 · "Price on request" | Your Facebook post, 25 April |
| 3 | **Ground-Floor Corner Portion — For Sale** | For sale · Flat/portion · 2 bed · F.B Area, Block 15 · "Price on request" | Your Facebook post, 25 April |
| 4 | **Second-Floor Portion, Park-Facing — For Sale** | For sale · Flat/portion · 3 bed · F.B Area, Block 15 · "Price on request" | Your Facebook post, 25 April |

Notes on what we did and did not assume:

- **No prices.** None of these posts stated a price, so every listing shows
  "Price on request". Add a real figure only where you want one public.
- **No photos.** We did not attach any images. Each listing needs your own photos
  before it will look complete.
- **Listing 1 — bathrooms.** The post said "3 Bed Attached Washroom" plus
  "1 common washroom", so we entered **4** bathrooms. Correct this if that reading
  is wrong.
- **Listing 2 — size.** The post said "Size 8*5/20". We read the "/20" as roughly
  20 sq. yd, entered **20 sq. yd**, and the description reads "Size approximately
  8 × 5 (about 20 sq. yd)". Fix the number if it should be different.
- **Post dates.** We recorded these as **2026** (Facebook showed no year, which
  usually means the current year). If a post is actually from 2025, correct the
  "Published" date on that listing in the Studio.
- **Agent.** All four are attached to **Syed Mustafa Rehman**. Change to Mohammad
  Salman on any listing if that is who handles it.
- We did **not** use the phone number `0334 4890901` that appears on some of these
  posts — see section 4.

**To publish each one:**

1. Open `/studio` on the site and sign in.
2. Go to **Properties**. The four drafts are listed (marked as drafts / unpublished).
3. Open a listing and check every field against your original post.
4. Correct anything that is wrong.
5. **Add photos** (drag them into the Gallery; each photo needs a short alt text).
6. Set a **price**, or leave "Price on request" on.
7. Turn on **Featured** if you want it on the homepage.
8. Click **Publish**.

- [ ] Listing 1 reviewed and published (or deliberately kept as a draft)
- [ ] Listing 2 reviewed and published
- [ ] Listing 3 reviewed and published
- [ ] Listing 4 reviewed and published

---

## 2. Business hours

Right now the site shows **no opening hours anywhere** — this is deliberate, because
we were not given them.

- [ ] In **Studio → Site Settings → Hours**, add your opening hours (per day, or
      just the days you want shown). Once saved, an hours block appears on the
      Contact page. Leave it empty to keep hours hidden.

---

## 3. What kind of property F.F handles — wording check

The site currently says, in general terms, that F.F helps people **buy, sell and rent
property** in Karachi (plus renovation and documentation).

Your Facebook page mostly shows **portions, flats and shops in F.B Area, Block 15**.
If you also regularly handle:

- plots, houses, commercial units or offices,
- other areas (older posts mentioned Scheme 33 / Scheme 45),

then the About page and the "Why F.F" points can say so.

- [ ] Confirm the areas and property types you want the site to claim, and either
      edit the About / "Why F.F" text in Studio or tell the developer the exact
      wording.

---

## 4. Phone numbers

The site publishes two numbers:

- **0313 3694904** — Syed Mustafa Rehman
- **0345 4569090** — Mohammad Salman

A third number, **0334 4890901**, appears on some of your Facebook posts. We have
**not** put it on the site.

- [ ] If that number should be public, add it in **Studio → Site Settings → Phones**
      (with a label and whether it is on WhatsApp). Otherwise, no action needed.

---

## 5. Google Map

The Contact page and each property page show a Google map. It uses a **keyless
Google embed**, which is free but can occasionally be slow or fail to load.

- [ ] After the site is deployed, open the Contact page a few times. If the map
      loads reliably, nothing to do. If it is flaky, get a **free Google Maps Embed
      API key** and add it — the steps are in `SETUP.md` (the handover guide).

---

## 6. Reduced motion — 30-second check

The site has gentle animations. They should switch off automatically for anyone
whose device is set to reduce motion.

- [ ] Turn on your operating system's **"Reduce motion"** setting, reload the site,
      and confirm the animations stop. (Windows: Settings → Accessibility → Visual
      effects. iPhone: Settings → Accessibility → Motion. Android: Settings →
      Accessibility.)

---

## 7. Facebook links

The site links to your Facebook **page** (facebook.com/F.F.REBAD) and your Facebook
**group**.

- [ ] Confirm both links are current. Update them in **Studio → Site Settings →
      Socials** if either has changed.

---

## 8. Projects, News and Gallery pages

These three sections are **empty** until you add content in the Studio. Until then,
each page shows a tidy "coming soon / follow us on Facebook" message — it does not
look broken.

- [ ] Add projects, news posts and gallery images in Studio whenever you have them.
      No rush; the pages are fine empty.

---

## 9. Logo

The site uses a **redrawn "FF" monogram** we created for it.

- [ ] If F.F has an official logo file you would rather use, upload it in
      **Studio → Site Settings** (logo field) or send it to the developer.

---

## 10. Service descriptions & staff titles

The Services pages describe *how* F.F carries out each service (e.g. renovation,
documentation, valuation) in specific terms, and both contacts are listed with the
title **"Property Consultant"**. These were drafted from general practice, not
supplied by F.F.

- [ ] Read each service summary and "what you get" list, and the two staff titles.
      Change any wording that promises something F.F does not do, or a title F.F
      does not use. The copy lives in `src/lib/services.ts` (fallback) and
      `scripts/seed.ts` (the services block and the agent roles) — keep the two in
      step, or ask the developer to.

---

## 11. Testimonials

There are **no testimonials on the site** — none were supplied, and we do not invent
them.

- [ ] If you collect genuine customer reviews later, a testimonials section can be
      added. Keep a few (with the customer's permission to publish their name).
