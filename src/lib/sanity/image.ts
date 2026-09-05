import {
  createImageUrlBuilder,
  type ImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Returns a chainable @sanity/image-url builder for a Sanity image source
 * (a raw image object with `asset._ref`, or an asset id string).
 * Callers add `.width()` / `.height()` / `.url()` etc.
 */
export function urlForImage(source: SanityImageSource): ImageUrlBuilder {
  return builder.image(source);
}

/**
 * The projected image shape used by the GROQ queries in `queries.ts`:
 * `{ "url": asset->url, "lqip": asset->metadata.lqip, alt }`.
 */
export interface SanityImageLike {
  url?: string | null;
  lqip?: string | null;
  alt?: string | null;
  asset?: { _ref?: string; _id?: string; url?: string } | null;
}

export interface ImageProps {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL?: string;
}

const REF_DIMENSIONS = /-(\d+)x(\d+)(?:-[a-z]+|\.[a-z]+)?$/i;

/**
 * Pulls intrinsic `{ width, height }` from a Sanity asset ref, id, or CDN URL:
 * `image-abc123-1920x1080-jpg` or `.../abc123-1920x1080.jpg`.
 */
export function dimensionsFromRef(
  ref: string | null | undefined,
): { width: number; height: number } | null {
  if (!ref) return null;
  const withoutQuery = ref.split("?")[0];
  const match = withoutQuery.match(REF_DIMENSIONS);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!width || !height) return null;
  return { width, height };
}

function sizedUrlFromCdn(
  url: string,
  width: number,
  height: number | undefined,
): string {
  try {
    const u = new URL(url);
    u.searchParams.set("w", String(width));
    if (typeof height === "number") u.searchParams.set("h", String(height));
    u.searchParams.set("fit", "max");
    u.searchParams.set("auto", "format");
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Builds `next/image` props from a projected Sanity image
 * (`{ url, lqip, alt }`) or a raw Sanity image object.
 *
 * - `src` is a CDN URL sized to the requested `width` (and `height` if given).
 * - `width` / `height` are the rendered dimensions: the requested width and a
 *   height derived from the asset's intrinsic aspect ratio, or the requested
 *   height when supplied, or a 3:2 fallback when no dimensions can be read.
 * - `blurDataURL` is the projected `lqip` when present.
 */
export function imageProps(
  source: SanityImageLike | SanityImageSource,
  { width, height }: { width: number; height?: number },
): ImageProps {
  const img = source as SanityImageLike;
  const ref = img.asset?._ref ?? img.asset?._id ?? img.url ?? undefined;
  const intrinsic = dimensionsFromRef(typeof ref === "string" ? ref : undefined);

  let resolvedHeight: number;
  if (typeof height === "number") {
    resolvedHeight = height;
  } else if (intrinsic) {
    resolvedHeight = Math.round((width * intrinsic.height) / intrinsic.width);
  } else {
    resolvedHeight = Math.round((width * 2) / 3);
  }

  let src: string;
  if (typeof img.url === "string" && img.url) {
    src = sizedUrlFromCdn(img.url, width, height);
  } else {
    let b = urlForImage(source as SanityImageSource)
      .width(width)
      .fit("max")
      .auto("format");
    if (typeof height === "number") b = b.height(height);
    src = b.url();
  }

  const props: ImageProps = {
    src,
    width,
    height: resolvedHeight,
    alt: img.alt ?? "",
  };
  if (img.lqip) props.blurDataURL = img.lqip;
  return props;
}
