"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface LazyMapProps {
  /** Free-text place query, e.g. the full office address. Preferred over coords. */
  query?: string;
  /** Latitude — used only when `query` is absent. */
  lat?: number | null;
  /** Longitude — used only when `query` is absent. */
  lng?: number | null;
  /** Human label for the place, used in the iframe title. */
  title: string;
  className?: string;
}

function resolveLocation(
  query?: string,
  lat?: number | null,
  lng?: number | null,
): string | null {
  if (query && query.trim()) return query.trim();
  if (typeof lat === "number" && typeof lng === "number") return `${lat},${lng}`;
  return null;
}

/**
 * A Google Maps embed that never ships an `<iframe>` in the initial DOM. The
 * placeholder is a token-styled panel; the embed is injected only after the
 * visitor clicks "View map" (click-to-load — the lightest way to satisfy the
 * "lazy map" requirement). With no query or coordinates it renders nothing.
 */
export function LazyMap({ query, lat, lng, title, className }: LazyMapProps) {
  const [shown, setShown] = useState(false);
  const location = resolveLocation(query, lat, lng);

  if (!location) return null;

  const embedSrc = `https://www.google.com/maps?output=embed&q=${encodeURIComponent(
    location,
  )}`;

  const wrapClass = ["overflow-hidden rounded-[8px]", className]
    .filter(Boolean)
    .join(" ");

  if (shown) {
    return (
      <div className={wrapClass}>
        <div className="u-fade-in relative aspect-[16/9] w-full">
          <iframe
            src={embedSrc}
            title={`Map — ${title}`}
            loading="lazy"
            referrerPolicy="origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-4 border border-gold/25 bg-ink px-6 text-center text-ivory">
        <p className="font-display text-lg leading-snug">{title}</p>
        <Button
          as="button"
          type="button"
          tone="dark"
          variant="solid"
          onClick={() => setShown(true)}
        >
          View map
        </Button>
        <p className="font-sans text-xs uppercase tracking-[0.14em] text-ivory/55">
          Loads an embedded map
        </p>
      </div>
    </div>
  );
}
