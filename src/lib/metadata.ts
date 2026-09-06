import type { Metadata } from "next";
import type { NewsPost, Property, SiteSettings } from "@/lib/sanity/types";
import { excerptFromPortableText } from "@/lib/portable-text-excerpt";

/**
 * Canonical site origin. Prefer the explicit `NEXT_PUBLIC_SITE_URL`; if the
 * SETUP step that sets it was missed, fall back to Vercel's own deployment URL
 * (`NEXT_PUBLIC_VERCEL_URL` — exposed to the client build, unlike the
 * server-only `VERCEL_URL`) so production never silently uses localhost. Only
 * local dev with no `.env.local` lands on the final localhost default.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000");

/** OpenGraph siteName + JSON-LD organisation name. */
const SITE_NAME = "F.F Real Estate Builder & Developers";

/** The generated brand OG card (see `src/app/opengraph-image.tsx`). */
const DEFAULT_OG_IMAGE = new URL("/opengraph-image", SITE_URL).toString();

/** Local `03xx xxxxxxx` → E.164 `+92XXXXXXXXXX`. */
function toE164(input: string | undefined | null): string | undefined {
  if (!input) return undefined;
  const digits = input.replace(/[^\d]/g, "");
  if (!digits) return undefined;
  return `+${digits.startsWith("0") ? `92${digits.slice(1)}` : digits}`;
}

interface BuildMetadataInput {
  /** BARE page title — the root layout template appends " | F.F Real Estate". */
  title: string;
  description: string;
  /** Absolute path from the site root, e.g. `/properties`. */
  path: string;
  /** Absolute image URL; defaults to the generated brand OG card. */
  image?: string;
}

/**
 * Per-page `Metadata`: bare title (template adds the brand suffix once),
 * description, a canonical URL, and matching OpenGraph + Twitter cards.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
}: BuildMetadataInput): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  const images = [image ?? DEFAULT_OG_IMAGE];

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | F.F Real Estate`,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_PK",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | F.F Real Estate`,
      description,
      images,
    },
  };
}

type JsonLd = Record<string, unknown>;

/**
 * Site-wide `RealEstateAgent` structured data. Verified facts only — no
 * `aggregateRating`, `review`, `award`, `foundingDate` or speculative
 * `priceRange` (see spec §2 / §9).
 */
export function realEstateAgentJsonLd(settings: SiteSettings): JsonLd {
  const { address, phones, email, socials, name } = settings;
  const telephone = toE164(phones[0]?.number);
  const streetAddress = [address.line1, address.area]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(", ");
  const sameAs = socials
    .map((social) => social.url)
    .filter((url): url is string => Boolean(url && url.trim()));

  const jsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name,
    image: DEFAULT_OG_IMAGE,
    url: SITE_URL,
    email,
    address: {
      "@type": "PostalAddress",
      ...(streetAddress ? { streetAddress } : {}),
      addressLocality: "Karachi",
      ...(address.postalCode ? { postalCode: address.postalCode } : {}),
      addressCountry: "PK",
    },
    areaServed: [
      "F.B Area",
      "Dastagir Society",
      "Scheme 33",
      "Scheme 45",
      "Karachi",
    ],
    sameAs,
  };

  if (telephone) jsonLd.telephone = telephone;

  if (typeof address.lat === "number" && typeof address.lng === "number") {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: address.lat,
      longitude: address.lng,
    };
  }

  return jsonLd;
}

const AVAILABILITY: Record<Property["status"], string> = {
  available: "https://schema.org/InStock",
  under_offer: "https://schema.org/LimitedAvailability",
  sold: "https://schema.org/SoldOut",
  rented: "https://schema.org/SoldOut",
};

/**
 * Property-detail structured data. An `offers` block is added only when a real
 * numeric price exists — never for price-on-request.
 */
export function residenceJsonLd(property: Property, url: string): JsonLd {
  const image = property.gallery?.find((img) => img?.url)?.url ?? undefined;
  const description = excerptFromPortableText(property.description) ?? undefined;

  const jsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    url,
  };

  if (description) jsonLd.description = description;
  if (image) jsonLd.image = image;

  if (typeof property.price?.amount === "number") {
    jsonLd.offers = {
      "@type": "Offer",
      price: property.price.amount,
      priceCurrency: "PKR",
      availability: AVAILABILITY[property.status] ?? AVAILABILITY.available,
    };
  }

  return jsonLd;
}

/** News-article structured data, attributed to the business as organisation. */
export function articleJsonLd(post: NewsPost, url: string): JsonLd {
  const organisation = { "@type": "Organization", name: SITE_NAME };

  const jsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    url,
    author: organisation,
    publisher: organisation,
  };

  if (post.publishedAt) jsonLd.datePublished = post.publishedAt;
  if (post.coverImage?.url) jsonLd.image = post.coverImage.url;

  return jsonLd;
}
