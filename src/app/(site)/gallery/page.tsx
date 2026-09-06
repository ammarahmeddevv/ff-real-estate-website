import {
  GALLERY_CATEGORIES_QUERY,
  GALLERY_QUERY,
  getSiteSettings,
  sanityFetch,
} from "@/lib/sanity";
import { buildMetadata } from "@/lib/metadata";
import type { GalleryCategory, GalleryImage } from "@/lib/sanity/types";
import { GALLERY_CATEGORIES } from "@/lib/property-labels";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/EmptyState";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Gallery",
  description:
    "Photographs of the properties, developments and neighbourhoods F.F Real Estate Builder & Developers works with across Karachi.",
  path: "/gallery",
});

type SearchParams = Record<string, string | string[] | undefined>;

function parseCategory(value: string | string[] | undefined): GalleryCategory | null {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && (GALLERY_CATEGORIES as readonly string[]).includes(raw)
    ? (raw as GalleryCategory)
    : null;
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const category = parseCategory(resolved.category);

  const [settings, images, rawCategories] = await Promise.all([
    getSiteSettings(),
    sanityFetch<GalleryImage[]>({
      query: GALLERY_QUERY,
      params: { category: category ?? null },
      tags: ["galleryImage"],
      fallback: [],
    }),
    sanityFetch<(GalleryCategory | null)[]>({
      query: GALLERY_CATEGORIES_QUERY,
      tags: ["galleryImage"],
      fallback: [],
    }),
  ]);

  // Keep only real enum values, in canonical display order.
  const categories = GALLERY_CATEGORIES.filter((c) => rawCategories.includes(c));
  const facebookUrl =
    settings.socials.find((s) => s.platform === "facebook")?.url ??
    "https://www.facebook.com/F.F.REBAD/";

  return (
    <Container className="py-16 md:py-24">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl leading-tight md:text-5xl">
          Gallery
        </h1>
        <p className="mt-4 font-sans text-base leading-relaxed text-gray-500">
          Photographs of the properties, developments and neighbourhoods F.F Real
          Estate works with.
        </p>
      </header>

      {categories.length > 0 && <GalleryFilters categories={categories} />}

      {images.length > 0 ? (
        <GalleryGrid images={images} />
      ) : category && categories.length > 0 ? (
        <div className="mx-auto mt-10 max-w-xl rounded-lg border border-gray-200 bg-paper px-8 py-12 text-center">
          <p className="u-micro-label">No photos here yet</p>
          <h2 className="mt-3 font-display text-2xl">
            Nothing in this category yet
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            There are no photographs in this category at the moment.{" "}
            <a
              href="/gallery"
              className="text-ink underline decoration-gold decoration-1 underline-offset-4 transition-colors hover:text-gold-deep"
            >
              View all photographs
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            headingLevel={2}
            title="Photographs coming soon"
            body="Images of the properties, developments and areas F.F Real Estate works with will appear here."
            ctaHref={facebookUrl}
            ctaLabel="See photos on Facebook"
          />
        </div>
      )}
    </Container>
  );
}
