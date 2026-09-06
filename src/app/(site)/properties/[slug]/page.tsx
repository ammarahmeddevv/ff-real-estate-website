import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PROPERTY_BY_SLUG_QUERY,
  PROPERTY_SLUGS_QUERY,
  getSiteSettings,
  sanityFetch,
} from "@/lib/sanity";
import type { Property } from "@/lib/sanity/types";
import { formatPrice } from "@/lib/format";
import { TYPE_LABEL, purposeLabel } from "@/lib/property-labels";
import { excerptFromPortableText } from "@/lib/portable-text-excerpt";
import { propertyWhatsAppMessage } from "@/lib/whatsapp";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ImagelessPanel } from "@/components/ui/ImagelessPanel";
import { PortableText } from "@/components/content/PortableText";
import { MediaGallery } from "@/components/gallery/MediaGallery";
import { LazyMap } from "@/components/layout/LazyMap";
import { PropertyQuickDetails } from "@/components/property/PropertyQuickDetails";
import { InquiryPanel } from "@/components/property/InquiryPanel";

export const revalidate = 60;
export const dynamicParams = true;

type Params = { slug: string };

function priceText(price: Property["price"]): string {
  return formatPrice({
    amount: price?.amount ?? undefined,
    display: price?.display ?? undefined,
    onRequest: price?.onRequest ?? undefined,
  });
}

function directionsHref(property: Property): string {
  const query = [property.address, property.location, "Karachi"]
    .filter((s): s is string => Boolean(s && s.trim()))
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Deduped per request: called by both `generateMetadata` and the page component.
const getProperty = cache(
  async (slug: string): Promise<Property | null> =>
    sanityFetch<Property | null>({
      query: PROPERTY_BY_SLUG_QUERY,
      params: { slug },
      tags: ["property"],
      fallback: null,
    }),
);

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
      description:
        "Browse the property F.F Real Estate is representing across Karachi.",
    };
  }

  const purpose = purposeLabel(property.purpose);
  const title = `${property.title} — ${purpose} in ${property.location}`;
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

  const agent = property.agent ?? null;
  const whatsappPhone = agent?.whatsapp?.trim() || settings.primaryWhatsapp;
  const callNumber =
    agent?.phone?.trim() ||
    settings.phones[0]?.number ||
    settings.primaryWhatsapp;
  const inquiryMessage = propertyWhatsAppMessage(
    property.title,
    property.location,
  );

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

        <MediaGallery
          images={property.gallery ?? []}
          title={property.title}
          priority
          wide
          leadSizes="(min-width: 1024px) 1160px, 100vw"
          emptyState={
            <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] border border-gray-200 sm:aspect-[16/9] lg:aspect-[21/9]">
              <ImagelessPanel label={TYPE_LABEL[property.type] ?? "Property"} />
            </div>
          }
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
              {property.map?.lat != null && property.map?.lng != null ? (
                <LazyMap
                  lat={property.map.lat}
                  lng={property.map.lng}
                  title={property.title}
                  className="mt-6"
                />
              ) : property.address?.trim() ? (
                <LazyMap
                  query={[property.address, property.location, "Karachi"]
                    .filter((s): s is string => Boolean(s && s.trim()))
                    .join(", ")}
                  title={property.title}
                  className="mt-6"
                />
              ) : null}
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
            <InquiryPanel
              heading="Interested in this property?"
              whatsappNumber={whatsappPhone}
              whatsappMessage={inquiryMessage}
              whatsappCta="WhatsApp about this property"
              callNumber={callNumber}
              inquirySource={`property:${property.slug}`}
              relatedPropertyId={property._id}
              agent={agent ? { name: agent.name, role: agent.role } : null}
            />
          </div>
        </div>
      </Container>
    </article>
  );
}
