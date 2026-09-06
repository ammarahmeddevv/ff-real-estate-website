"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Chip } from "@/components/ui/Chip";
import { GALLERY_CATEGORY_LABEL } from "@/lib/property-labels";
import type { GalleryCategory } from "@/lib/sanity/types";

interface GalleryFiltersProps {
  /** Categories that have at least one image, already ordered + validated. */
  categories: GalleryCategory[];
}

/**
 * URL-driven category chips for `/gallery`. "All" clears the filter; any other
 * chip sets `?category=<value>`. The URL is the single source of truth — the
 * active chip is derived from `searchParams`, never from local state.
 */
export function GalleryFilters({ categories }: GalleryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const rawCategory = searchParams.get("category");
  const activeCategory = rawCategory && categories.includes(rawCategory as GalleryCategory) ? rawCategory : null;

  const select = useCallback(
    (category: GalleryCategory | null) => {
      const qs = category ? `?category=${category}` : "";
      startTransition(() => {
        router.push(`/gallery${qs}`, { scroll: false });
      });
    },
    [router],
  );

  return (
    <div
      className={`mt-8 motion-safe:transition-opacity motion-safe:duration-200 ${
        isPending ? "motion-safe:opacity-50" : "opacity-100"
      }`}
    >
      <ul className="flex flex-wrap gap-2" aria-label="Filter photographs by category">
        <li>
          <Chip active={!activeCategory} onClick={() => select(null)}>
            All
          </Chip>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <Chip active={activeCategory === category} onClick={() => select(category)}>
              {GALLERY_CATEGORY_LABEL[category]}
            </Chip>
          </li>
        ))}
      </ul>
    </div>
  );
}
