/**
 * Idempotent Sanity seed script.
 *
 * Populates a fresh dataset with the verified `siteSettings` document (mirroring
 * `FALLBACK_SITE` in `src/lib/site.ts`), the six confirmed `service` documents,
 * and the two `agent` documents. Every document uses a fixed `_id` and is written
 * with `createOrReplace`, so running the script any number of times converges to
 * the same dataset state.
 *
 * Usage:  npm run seed
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
      "Sanity seed skipped — write credentials are not configured.",
      "",
      "To seed a real dataset, set these (in .env.local or the shell):",
      "",
      "  NEXT_PUBLIC_SANITY_PROJECT_ID=<your real Sanity project id>",
      "  NEXT_PUBLIC_SANITY_DATASET=production        # or your dataset",
      "  SANITY_API_WRITE_TOKEN=<token with Editor write access>",
      "",
      "Create the token at https://www.sanity.io/manage → API → Tokens.",
      "Then re-run:  npm run seed",
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

const ADDRESS_LINE1 = "R-37, Block 15, Near Taal Stop";
const ADDRESS_AREA = "F.B Area, Dastagir Society";
const ADDRESS_CITY = "Karachi";
const ADDRESS_POSTAL = "75590";
const FULL_ADDRESS = `${ADDRESS_LINE1}, ${ADDRESS_AREA}, ${ADDRESS_CITY}, ${ADDRESS_POSTAL}`;
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  FULL_ADDRESS,
)}`;

/** Deterministic `_key` for array members so re-seeding produces no diff. */
function keyed<T extends Record<string, unknown>>(
  prefix: string,
  items: T[],
): (T & { _key: string })[] {
  return items.map((item, i) => ({ _key: `${prefix}-${i}`, ...item }));
}

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  phones: keyed("phone", [
    { label: "Syed Mustafa Rehman", number: "0313 3694904", whatsapp: true },
    { label: "Mohammad Salman", number: "0345 4569090", whatsapp: true },
  ]),
  primaryWhatsapp: "923133694904",
  email: "f.f.realestate333@gmail.com",
  address: {
    _type: "addressObject",
    line1: ADDRESS_LINE1,
    area: ADDRESS_AREA,
    city: ADDRESS_CITY,
    postalCode: ADDRESS_POSTAL,
    mapsUrl: MAPS_URL,
  },
  hours: [],
  socials: keyed("social", [
    { platform: "facebook", url: "https://www.facebook.com/F.F.REBAD/" },
    {
      platform: "facebook_group",
      url: "https://www.facebook.com/groups/397312108831460/",
    },
  ]),
  hero: {
    heading: "Find the Right Property. Make the Right Move.",
    subheading:
      "F.F Real Estate Builder & Developers helps clients navigate property opportunities in Karachi with a straightforward, professional approach.",
    primaryCtaLabel: "Explore Properties",
    primaryCtaHref: "/properties",
  },
  trustBarItems: [
    "Karachi-Based Real Estate Professionals",
    "Buying • Selling • Renting",
    "Renovation & Documentation",
    "F.B Area & Dastagir Local Expertise",
  ],
  whyFF: keyed("why", [
    {
      title: "Local Market Knowledge",
      body: "We work day to day in F.B Area, Dastagir Society and the surrounding Karachi neighbourhoods, so we know these streets, buildings and price expectations first-hand.",
    },
    {
      title: "Straightforward Property Guidance",
      body: "We explain each option plainly and let you decide at your own pace, without pressure or inflated promises.",
    },
    {
      title: "Sale, Purchase, Rent, Renovation & Documentation",
      body: "Buying, selling, renting, renovation and property documentation are handled by one team, so you have a single point of contact throughout.",
    },
    {
      title: "Personalised Assistance",
      body: "You deal directly with Syed Mustafa Rehman and Mohammad Salman, who stay involved from the first enquiry to handover.",
    },
  ]),
};

interface ServiceSeed {
  slug: string;
  title: string;
  order: number;
  summary: string;
  whatYouGet: string[];
}

const services: ServiceSeed[] = [
  {
    slug: "property-buying",
    title: "Property Buying",
    order: 1,
    summary:
      "Shortlisted options that match your budget, area and purpose, with viewings arranged and paperwork handled.",
    whatYouGet: [
      "A shortlist filtered to your budget, preferred areas and intended use",
      "Viewings scheduled and accompanied so you can compare options in person",
      "Help checking ownership documents and negotiating the price",
      "Support through the sale agreement and transfer paperwork",
    ],
  },
  {
    slug: "property-selling",
    title: "Property Selling",
    order: 2,
    summary:
      "Your property priced against current local sales, listed to buyers, and guided through to a completed transfer.",
    whatYouGet: [
      "A price recommendation based on recent sales in your area",
      "Your listing shared with our buyer contacts and on our channels",
      "Enquiries screened and viewings arranged around your schedule",
      "Coordination of the buyer's payment, agreement and transfer",
    ],
  },
  {
    slug: "property-rentals",
    title: "Property Rentals",
    order: 3,
    summary:
      "Rental homes and units matched to tenants, and landlords connected with screened renters on a clear agreement.",
    whatYouGet: [
      "Available rentals matched to your budget, family size and location",
      "For landlords: tenant enquiries screened before viewings",
      "A written tenancy agreement covering rent, deposit and term",
      "Handover with a documented inventory and meter readings",
    ],
  },
  {
    slug: "renovation",
    title: "Renovation",
    order: 4,
    summary:
      "Repair and renovation work organised with trusted local tradespeople, from a single room to a full property refresh.",
    whatYouGet: [
      "A walkthrough to agree the scope and a written cost estimate",
      "Vetted electricians, plumbers, masons and painters arranged for you",
      "One point of contact coordinating the trades and schedule",
      "Progress updates and a final check before you sign off",
    ],
  },
  {
    slug: "documentation",
    title: "Documentation",
    order: 5,
    summary:
      "Property paperwork prepared and processed correctly — sale deeds, transfers, mutation and related records.",
    whatYouGet: [
      "A checklist of the documents your transaction needs",
      "Sale deed and transfer papers drafted and reviewed",
      "Submission and follow-up for mutation and record updates",
      "Copies of every completed document organised for your records",
    ],
  },
  {
    slug: "property-consultation",
    title: "Property Consultation",
    order: 6,
    summary:
      "A sit-down to talk through your options, timing and budget before you commit to buying, selling or renting.",
    whatYouGet: [
      "A discussion of your goals, timeline and budget",
      "Current price and demand context for the areas you're considering",
      "Clear next steps, whether or not you proceed with us",
      "Answers to your questions on process, costs and paperwork",
    ],
  },
];

// Document ids must NOT contain a "." — Sanity's Content Lake treats any
// non-`drafts.` dotted id as a *private* document that the tokenless public
// API/CDN will not return, which hides the doc from the live website.
const serviceDocs = services.map((s) => ({
  _id: `service-${s.slug}`,
  _type: "service",
  title: s.title,
  slug: { _type: "slug", current: s.slug },
  summary: s.summary,
  whatYouGet: s.whatYouGet,
  order: s.order,
}));

const agentDocs = [
  {
    _id: "agent-mustafa",
    _type: "agent",
    name: "Syed Mustafa Rehman",
    role: "Property Consultant",
    phone: "0313 3694904",
    whatsapp: "923133694904",
  },
  {
    _id: "agent-salman",
    _type: "agent",
    name: "Mohammad Salman",
    role: "Property Consultant",
    phone: "0345 4569090",
    whatsapp: "923454569090",
  },
];

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

  const docs = [siteSettings, ...serviceDocs, ...agentDocs];

  console.log(
    `Seeding ${docs.length} documents to project ${projectId} / dataset ${dataset}…`,
  );

  let tx = client.transaction();
  for (const doc of docs) {
    tx = tx.createOrReplace(doc as Parameters<typeof tx.createOrReplace>[0]);
  }
  await tx.commit({ visibility: "async" });

  for (const doc of docs) {
    console.log(`  ✓ ${doc._id}`);
  }
  console.log("Seed complete. All documents are idempotent (createOrReplace).");
}

main().catch((err) => {
  console.error("\nSeed failed:");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
