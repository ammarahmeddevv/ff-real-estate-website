import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PROPERTY_BY_SLUG_QUERY,
  PROPERTY_SLUGS_QUERY,
  getSiteSettings,
  sanityFetch,
} from "@/lib/sanity";
import type { Property, PortableText as PortableTextValue } from "@/lib/sanity/types";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PortableText } from "@/components/content/PortableText";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyQuickDetails } from "@/components/property/PropertyQuickDetails";
import { PropertyInquiryPanel } from "@/components/property/PropertyInquiryPanel";

export const revalidate = 60;
export const dynamicParams = true;

const TYPE_LABEL: Record<string, string> = {
  house: "House",
  flat: "Flat / Apartment",
  plot: "Plot",
  commercial: "Commercial",
  office: "Office",
  shop: "Shop",
  other: "Property",
};

type Params = { slug: string };

function purposeLabel(purpose: Property["purpose"]): string {
  return purpose === "rent" ? "For Rent" : "For Sale";
}

function priceText(price: Property["price"]): string {
  return formatPrice({
    amount: price?.amount ?? undefined,
    display: price?.display ?? undefined,
    onRequest: price?.onRequest ?? undefined,
  });
}

/** First ~160 chars of plain text pulled from portable-text blocks. */
function excerptFromPortableText(
  value: PortableTextValue | null | undefined,
  max = 160,
): string | null {
  if (!Array.isArray(value)) return null;
  const text = value
    .filter((b): b is { _type?: string; children?: { text?: string }[] } =>
      Boolean(b && typeof b === "object"),
    )
    .filter((b) => b._type === "block")
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function directionsHref(property: Property): string {
  const query = [property.address, property.location, "Karachi"]
    .filter((s): s is string => Boolean(s && s.trim()))
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

async function getProperty(slug: string): Promise<Property | null> {
  return sanityFetch<Property | null>({
    query: PROPERTY_BY_SLUG_QUERY,
    params: { slug },
    tags: ["property"],
    fallback: null,
  });
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: PROPERTY_SLUGS_QUERY,
    tags: ["property"],
    fallback: [],
  });
  return slugs
    .filter((s) => Boolean(s?.slug))
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return {
      title: "Property | F.F Real Estate",
      description:
        "Browse houses, flats, plots and commercial space represented by F.F Real Estate across Karachi.",
    };
  }

  const purpose = purposeLabel(property.purpose);
  const title = `${property.title} — ${purpose} in ${property.location} | F.F Real Estate`;
  const description =
    excerptFromPortableText(property.description) ??
    `${TYPE_LABEL[property.type] ?? "Property"} ${purpose.toLowerCase()} in ${property.location}, Karachi. ${priceText(property.price)}. Contact F.F Real Estate for details.`;

  const ogImage = property.gallery?.find((img) => img?.url)?.url ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [property, settings] = await Promise.all([
    getProperty(slug),
    getSiteSettings(),
  ]);

  if (!property) notFound();

  const purpose = purposeLabel(property.purpose);
  const highlights = (property.highlights ?? []).filter(
    (h): h is string => Boolean(h && h.trim()),
  );
  const hasOverview =
    Array.isArray(property.description) && property.description.length > 0;

  return (
    <article className="pb-20 pt-8 md:pt-12">
      {/* Task 17: JSON-LD (Residence / offers) */}
      <Container>
        <nav className="mb-6 font-sans text-sm text-gray-500">
          <Link
            href="/properties"
            className="transition-colors hover:text-gold-deep"
          >
            &larr; All properties
          </Link>
        </nav>

        <PropertyGallery
          images={property.gallery ?? []}
          typeLabel={TYPE_LABEL[property.type] ?? "Property"}
          title={property.title}
        />

        <header className="mt-8 max-w-3xl">
          <p className="u-micro-label">{purpose}</p>
          <h1 className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl">
            {property.title}
          </h1>
          <p className="mt-2 font-sans text-base text-gray-500">
            {property.location}
          </p>
          <p className="mt-4 font-sans text-2xl font-medium tabular-nums text-ink">
            {priceText(property.price)}
          </p>
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PropertyQuickDetails property={property} />

            {hasOverview && (
              <section className="mt-12">
                <h2 className="font-display text-2xl leading-snug text-ink">
                  Property overview
                </h2>
                <div className="mt-4">
                  <PortableText value={property.description} />
                </div>
              </section>
            )}

            {highlights.length > 0 && (
              <section className="mt-12">
                <h2 className="font-display text-2xl leading-snug text-ink">
                  Property highlights
                </h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-2.5 font-sans text-base leading-relaxed text-ink"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-12">
              <h2 className="font-display text-2xl leading-snug text-ink">
                Location
              </h2>
              <p className="mt-4 font-sans text-base leading-relaxed text-ink">
                {property.location}
              </p>
              {property.address?.trim() && (
                <p className="mt-1 font-sans text-base leading-relaxed text-gray-500">
                  {property.address}
                </p>
              )}
              {/* Task 14: <LazyMap map={property.map} /> when property.map is set */}
              <div className="mt-5">
                <Button
                  as="a"
                  href={directionsHref(property)}
                  variant="outline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions
                </Button>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <PropertyInquiryPanel property={property} settings={settings} />
          </div>
        </div>
      </Container>
    </article>
  );
}
