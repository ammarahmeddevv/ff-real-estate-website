/**
 * Idempotent Sanity seed for DRAFT property listings.
 *
 * Turns four genuine F.F Real Estate Facebook posts (facebook.com/F.F.REBAD)
 * into `property` documents that land in the Studio as **drafts** — their
 * `_id` is prefixed `drafts.`, which Sanity treats as unpublished. The client
 * opens each one under Properties, checks every field against their own post,
 * adds photos, sets a price (or leaves "Price on request"), then publishes.
 *
 * Nothing here is invented: no prices where the post stated none, no photos,
 * no phone numbers beyond the two seeded agents. See `docs/CONTENT-TO-VERIFY.md`.
 *
 * Usage:  npm run seed:listings
 *
 * Run `npm run seed` first if you want these listings linked to the F.F
 * contacts — it creates `agent-mustafa`. The agent reference here is weak, so
 * the order is not required, but without it the listings have no linked agent.
 *
 * Required environment (from `.env.local`, `.env`, or the shell):
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID   real Sanity project id
 *   - NEXT_PUBLIC_SANITY_DATASET      dataset name (defaults to "production")
 *   - NEXT_PUBLIC_SANITY_API_VERSION  API version  (defaults to "2024-10-01")
 *   - SANITY_API_WRITE_TOKEN          token with write access (Editor or above)
 *
 * If the write token or a real project id is missing the script prints what to
 * set and exits 0 — it never creates a project or triggers a login/OAuth flow.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@sanity/client";

/* -------------------------------------------------------------------------- */
/* Minimal .env loader (no dependency) — shell vars always win.               */
/* -------------------------------------------------------------------------- */

function loadEnvFile(file: string): void {
  let raw: string;
  try {
    raw = readFileSync(resolve(process.cwd(), file), "utf8");
  } catch {
    return; // file absent — fine
  }
  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    const key = match[1];
    if (process.env[key] !== undefined) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

// `.env.local` takes precedence over `.env` (matches Next.js resolution order).
loadEnvFile(".env.local");
loadEnvFile(".env");

/* -------------------------------------------------------------------------- */
/* Config + guard                                                            */
/* -------------------------------------------------------------------------- */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2024-10-01";
const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

const projectIdLooksReal = Boolean(
  projectId && projectId !== "placeholder" && projectId !== "your-project-id",
);

if (!projectIdLooksReal || !token) {
  console.log(
    [
      "",
      "Listings seed skipped — write credentials are not configured.",
      "",
      "To seed the draft listings, set these (in .env.local or the shell):",
      "",
      "  NEXT_PUBLIC_SANITY_PROJECT_ID=<your real Sanity project id>",
      "  NEXT_PUBLIC_SANITY_DATASET=production        # or your dataset",
      "  SANITY_API_WRITE_TOKEN=<token with Editor write access>",
      "",
      "Create the token at https://www.sanity.io/manage → API → Tokens.",
      "Then re-run:  npm run seed:listings",
      "",
      "Run `npm run seed` first if you want these listings linked to the F.F contacts.",
      "",
      "The four listings are created as DRAFTS — review and publish each one",
      "in the Studio (Properties). See docs/CONTENT-TO-VERIFY.md.",
      "",
      `Current: projectId=${projectId || "(unset)"} dataset=${dataset} ` +
        `token=${token ? "(set)" : "(unset)"}`,
      "",
    ].join("\n"),
  );
  process.exit(0);
}

/* -------------------------------------------------------------------------- */
/* Documents to seed                                                         */
/* -------------------------------------------------------------------------- */

/** One-paragraph Portable Text body with deterministic keys (no re-seed diff). */
function body(id: string, text: string) {
  return [
    {
      _type: "block",
      _key: `${id}-b0`,
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: `${id}-s0`, text, marks: [] }],
    },
  ];
}

interface ListingSeed {
  /**
   * Document id without the `drafts.` prefix (added when the doc is built).
   * Must not contain a "." — Sanity treats any non-`drafts.` dotted id as a
   * private document that the tokenless public site cannot read.
   */
  id: string;
  title: string;
  slug: string;
  purpose: "sale" | "rent";
  type: "house" | "flat" | "plot" | "commercial" | "office" | "shop" | "other";
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: { value: number; unit: "sqyd" | "sqft" | "marla" | "kanal" };
  highlights?: string[];
  description: string;
  /** ISO date of the original Facebook post. */
  publishedAt: string;
  /** For the verification doc + report — not written to Sanity. */
  source: string;
}

const listings: ListingSeed[] = [
  {
    id: "property-fb-240-portion-rent",
    title: "240 sq. yd 2nd-Floor Portion",
    slug: "240-sq-yd-2nd-floor-portion-for-rent-fb-area",
    purpose: "rent",
    type: "flat",
    location: "F.B Area, Block 15",
    bedrooms: 3,
    // inferred: 3 attached + 1 common washroom (post doesn't give a total)
    bathrooms: 4,
    area: { value: 240, unit: "sqyd" },
    highlights: [
      "West open",
      "Prime location",
      "2nd floor portion",
      "Drawing room",
      "Big lounge",
      "All meters separated",
    ],
    description:
      "A west-open 2nd-floor portion of 240 sq. yd in F.B Area, Block 15, available for rent. Three bedrooms with attached washrooms, a drawing room, a big lounge and one common washroom. All meters are separated.",
    publishedAt: "2026-05-21T00:00:00.000Z",
    source: "F.F Real Estate Facebook post, 21 May",
  },
  {
    id: "property-fb-shop-sale-block-15",
    title: "Shop — F.B Area, Block 15",
    slug: "shop-for-sale-fb-area-block-15",
    purpose: "sale",
    type: "shop",
    location: "F.B Area, Block 15",
    area: { value: 20, unit: "sqyd" },
    description:
      "A shop for sale in F.B Area, Block 15. Size approximately 8 × 5 (about 20 sq. yd).",
    publishedAt: "2026-04-25T00:00:00.000Z",
    source: "F.F Real Estate Facebook post, 25 April",
  },
  {
    id: "property-fb-ground-floor-corner-sale",
    title: "Ground-Floor Corner Portion",
    slug: "ground-floor-corner-portion-for-sale-fb-area",
    purpose: "sale",
    type: "flat",
    location: "F.B Area, Block 15",
    bedrooms: 2,
    highlights: [
      "Ground floor corner",
      "Drawing & dining room (D.D)",
      "Attached washrooms",
      "Sub-leased",
    ],
    description:
      "A sub-leased ground-floor corner portion in F.B Area, Block 15, available for sale. Two bedrooms with attached washrooms and a drawing and dining room (D.D).",
    publishedAt: "2026-04-25T00:00:00.000Z",
    source: "F.F Real Estate Facebook post, 25 April",
  },
  {
    id: "property-fb-second-floor-park-facing-sale",
    title: "Second-Floor Portion, Park-Facing",
    slug: "second-floor-portion-park-facing-for-sale-fb-area",
    purpose: "sale",
    type: "flat",
    location: "F.B Area, Block 15",
    bedrooms: 3,
    highlights: [
      "West open",
      "Park facing",
      "Second floor (with or without roof)",
      "Single belt",
      "Drawing & dining room (D.D)",
      "Attached washrooms",
    ],
    description:
      "A west-open, park-facing second-floor portion in F.B Area, Block 15, available for sale — with or without roof. Three bedrooms with attached washrooms, a drawing and dining room (D.D), on a single belt.",
    publishedAt: "2026-04-25T00:00:00.000Z",
    source: "F.F Real Estate Facebook post, 25 April",
  },
];

function buildDoc(l: ListingSeed) {
  return {
    _id: `drafts.${l.id}`,
    _type: "property",
    title: l.title,
    slug: { _type: "slug", current: l.slug },
    purpose: l.purpose,
    type: l.type,
    location: l.location,
    status: "available",
    // No price was stated in any post — always "on request", never a made-up number.
    price: { _type: "priceObject", onRequest: true },
    ...(l.bedrooms !== undefined ? { bedrooms: l.bedrooms } : {}),
    ...(l.bathrooms !== undefined ? { bathrooms: l.bathrooms } : {}),
    ...(l.area
      ? { area: { _type: "areaObject", value: l.area.value, unit: l.area.unit } }
      : {}),
    description: body(l.id, l.description),
    ...(l.highlights ? { highlights: l.highlights } : {}),
    // No gallery — the posts carried no photos we may reuse.
    // Weak reference: the seed does not require `npm run seed` (which creates
    // agent-mustafa) to have run first. Run it first to link the F.F contacts.
    agent: { _type: "reference", _ref: "agent-mustafa", _weak: true },
    featured: false,
    publishedAt: l.publishedAt,
  };
}

/* -------------------------------------------------------------------------- */
/* Write                                                                     */
/* -------------------------------------------------------------------------- */

async function main(): Promise<void> {
  const client = createClient({
    projectId: projectId as string,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const docs = listings.map(buildDoc);

  console.log(
    `Seeding ${docs.length} DRAFT property listings to project ${projectId} / dataset ${dataset}…`,
  );

  let tx = client.transaction();
  for (const doc of docs) {
    tx = tx.createOrReplace(doc as Parameters<typeof tx.createOrReplace>[0]);
  }
  await tx.commit({ visibility: "async" });

  for (const doc of docs) {
    console.log(`  ✓ ${doc._id}  (draft — review & publish in Studio)`);
  }
  console.log(
    "\nDone. Open /studio → Properties, verify each draft against the source " +
      "Facebook post, add photos, then publish. See docs/CONTENT-TO-VERIFY.md.",
  );
}

main().catch((err) => {
  console.error("\nListings seed failed:");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
