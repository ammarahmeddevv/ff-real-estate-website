"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";
import type { SanityImage } from "@/lib/sanity/types";
import { Lightbox } from "@/components/gallery/Lightbox";

interface MediaGalleryProps {
  images: SanityImage[];
  /** Used for the lead-image alt fallback and the viewer aria-labels. */
  title: string;
  /**
   * Rendered in place of the gallery when there are no usable images.
   * When omitted, nothing is rendered (the caller guards the section).
   */
  emptyState?: ReactNode;
  /** Mark the lead image as LCP-priority (detail pages where it is above the fold). */
  priority?: boolean;
  /** `sizes` for the lead image; thumbnails use a fixed value. */
  leadSizes?: string;
  /** Adds the wide `lg:aspect-[21/9]` lead ratio (used on the property page). */
  wide?: boolean;
}

/**
 * Lead image plus a thumbnail strip; any thumbnail opens the focus-trapped
 * `<Lightbox>` at that index. Shared by the property and project detail pages —
 * the only difference is the empty state, which each page supplies.
 */
export function MediaGallery({
  images,
  title,
  emptyState,
  priority = false,
  leadSizes = "(min-width: 1024px) 760px, 100vw",
  wide = false,
}: MediaGalleryProps) {
  const usable = images.filter((img): img is SanityImage & { url: string } =>
    Boolean(img?.url),
  );
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  if (usable.length === 0) return <>{emptyState ?? null}</>;

  const lead = usable[0];
  const rest = usable.slice(1);

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox({ open: true, index: 0 })}
        aria-label={`Open ${title} gallery, image 1 of ${usable.length}`}
        className={`group relative block aspect-[16/10] w-full overflow-hidden rounded-[6px] border border-gray-200 sm:aspect-[16/9]${
          wide ? " lg:aspect-[21/9]" : ""
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory`}
      >
        <Image
          src={lead.url}
          alt={lead.alt || title}
          fill
          priority={priority}
          sizes={leadSizes}
          placeholder={lead.lqip ? "blur" : "empty"}
          blurDataURL={lead.lqip ?? undefined}
          className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]"
        />
        {usable.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 font-sans text-xs text-ivory">
            {usable.length} photos
          </span>
        )}
      </button>

      {rest.length > 0 && (
        <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {rest.map((img, i) => (
            <li key={`${img.url}-${i}`}>
              <button
                type="button"
                onClick={() => setLightbox({ open: true, index: i + 1 })}
                aria-label={`View image ${i + 2} of ${usable.length}`}
                className="relative block aspect-square w-full overflow-hidden rounded-[4px] border border-gray-200 transition-colors hover:border-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${title} — image ${i + 2}`}
                  fill
                  sizes="(min-width: 640px) 180px, 25vw"
                  placeholder={img.lqip ? "blur" : "empty"}
                  blurDataURL={img.lqip ?? undefined}
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        images={usable.map((img) => ({ url: img.url, alt: img.alt }))}
        startIndex={lightbox.index}
        open={lightbox.open}
        onClose={() => setLightbox((s) => ({ ...s, open: false }))}
      />
    </div>
  );
}
