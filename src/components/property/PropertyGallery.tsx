"use client";

import Image from "next/image";
import { useState } from "react";
import type { SanityImage } from "@/lib/sanity/types";
import { ImagelessPanel } from "@/components/ui/ImagelessPanel";
import { Lightbox } from "@/components/gallery/Lightbox";

interface PropertyGalleryProps {
  images: SanityImage[];
  /** Friendly property type, shown large when there are no photos. */
  typeLabel: string;
  title: string;
}

/**
 * Lead image plus a thumbnail strip; any thumbnail opens the focus-trapped
 * `<Lightbox>` at that index. With no gallery photos it falls back to the
 * composed ink panel at a hero ratio — never a broken grey box.
 */
export function PropertyGallery({ images, typeLabel, title }: PropertyGalleryProps) {
  const usable = images.filter((img): img is SanityImage & { url: string } =>
    Boolean(img?.url),
  );
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  if (usable.length === 0) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] sm:aspect-[16/9] lg:aspect-[21/9]">
        <ImagelessPanel label={typeLabel} />
      </div>
    );
  }

  const lead = usable[0];
  const rest = usable.slice(1);

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox({ open: true, index: 0 })}
        aria-label={`Open ${title} gallery, image 1 of ${usable.length}`}
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[6px] border border-gray-200 sm:aspect-[16/9] lg:aspect-[21/9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      >
        <Image
          src={lead.url}
          alt={lead.alt || title}
          fill
          priority
          sizes="(min-width: 1024px) 1160px, 100vw"
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
