import { Suspense } from "react";
import type { Metadata } from "next";
import {
  PROPERTY_LOCATIONS_QUERY,
  getSiteSettings,
  propertiesQuery,
  sanityFetch,
} from "@/lib/sanity";
import type { PropertySummary } from "@/lib/sanity/types";
import {
  activeFilterChips,
  buildPropertyGroqFilter,
  parsePropertyFilters,
} from "@/lib/filters";
import { GENERAL_ENQUIRY_MESSAGE, buildWhatsAppLink } from "@/lib/whatsapp";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/EmptyState";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { PropertyGrid } from "@/components/property/PropertyGrid";

export const revalidate = 60;

export function generateMetadata(): Metadata {
  return {
    title: "Properties for Sale & Rent in Karachi",
    description:
      "Browse houses, flats, plots and commercial space represented by F.F Real Estate across Karachi — F.B Area, Dastagir, Gulshan and Scheme 33. Filter by purpose, budget, size and area.",
  };
}

type SearchParams = Record<string, string | string[] | undefined>;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const state = parsePropertyFilters(resolved);
  const { filter, params } = buildPropertyGroqFilter(state);

  const [settings, properties, locations] = await Promise.all([
    getSiteSettings(),
    sanityFetch<PropertySummary[]>({
      query: propertiesQuery(filter),
      params,
      tags: ["property"],
      fallback: [],
    }),
    sanityFetch<string[]>({
      query: PROPERTY_LOCATIONS_QUERY,
      tags: ["property"],
      fallback: [],
    }),
  ]);

  const sortedLocations = [...new Set(locations.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
  const hasActiveFilters = activeFilterChips(state).length > 0;
  const whatsappHref = buildWhatsAppLink({
    phone: settings.primaryWhatsapp,
    message: GENERAL_ENQUIRY_MESSAGE,
  });

  return (
    <Container className="py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="u-micro-label">Browse</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          Properties
        </h1>
        <p className="mt-4 font-sans text-base leading-relaxed text-gray-500">
          Homes, plots and commercial space we&rsquo;re representing across
          Karachi. Filter by purpose, budget, size and area to find the right
          fit.
        </p>
      </header>

      <Suspense fallback={<div className="mt-8 h-48" />}>
        <PropertyFilters
          locations={sortedLocations}
          resultCount={properties.length}
        >
          {properties.length > 0 ? (
            <PropertyGrid properties={properties} />
          ) : hasActiveFilters ? (
            <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-paper px-8 py-14 text-center">
              <p className="u-micro-label">No matches</p>
              <h2 className="mt-3 font-display text-2xl">
                No properties match these filters
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Try widening your budget or filters &mdash; or clear them to
                see everything currently available.
              </p>
              <div className="mt-6">
                <Button as="a" href="/properties" variant="outline">
                  Clear all filters
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Listings are being added"
              body="Our latest properties are being prepared for the site. Message us on WhatsApp and we'll share what's available right now."
              ctaHref={whatsappHref}
              ctaLabel="Ask on WhatsApp"
            />
          )}
        </PropertyFilters>
      </Suspense>
    </Container>
  );
}
