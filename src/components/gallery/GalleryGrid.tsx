"use client";

import Image from "next/image";
import { useState } from "react";
import { imageProps } from "@/lib/sanity/image";
import type { GalleryImage } from "@/lib/sanity/types";
import { Lightbox } from "@/components/gallery/Lightbox";

interface GalleryGridProps {
  images: GalleryImage[];
}

/**
 * CSS-columns masonry of gallery photographs. Every tile opens the shared
 * focus-trapped `<Lightbox>` at its index, across the currently filtered set.
 */
export function GalleryGrid({ images }: GalleryGridProps) {
  const usable = images.filter(
    (item): item is GalleryImage & { image: { url: string } } =>
      Boolean(item.image?.url),
  );
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  if (usable.length === 0) return null;

  return (
    <div className="mt-8">
      <ul className="gap-4 [column-gap:1rem] columns-2 sm:columns-3 lg:columns-4">
        {usable.map((item, i) => {
          const img = imageProps(item.image, { width: 800 });
          return (
            <li key={item._id} className="mb-4 break-inside-avoid">
              <figure>
                <button
                  type="button"
                  onClick={() => setLightbox({ open: true, index: i })}
                  aria-label={`View photograph ${i + 1} of ${usable.length}${
                    item.caption ? ` — ${item.caption}` : ""
                  }`}
                  className="group block w-full overflow-hidden rounded-[6px] border border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                >
                  <Image
                    src={img.src}
                    alt={item.image.alt || item.caption || "F.F Real Estate photograph"}
                    width={img.width}
                    height={img.height}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                    priority={i === 0}
                    placeholder={img.blurDataURL ? "blur" : "empty"}
                    blurDataURL={img.blurDataURL}
                    className="h-auto w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]"
                  />
                </button>
                {item.caption ? (
                  <figcaption className="mt-2 font-sans text-xs leading-relaxed text-gray-500">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            </li>
          );
        })}
      </ul>

      <Lightbox
        images={usable.map((item) => ({
          url: item.image.url,
          alt: item.image.alt || item.caption || null,
        }))}
        startIndex={lightbox.index}
        open={lightbox.open}
        onClose={() => setLightbox((s) => ({ ...s, open: false }))}
      />
    </div>
  );
}
