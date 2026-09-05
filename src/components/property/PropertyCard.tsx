import Image from "next/image";
import Link from "next/link";
import type { PropertySummary, PropertyType } from "@/lib/sanity/types";
import { formatArea, formatPrice } from "@/lib/format";
import { ImagelessPanel } from "@/components/ui/ImagelessPanel";

const TYPE_LABEL: Record<PropertyType, string> = {
  house: "House",
  flat: "Flat / Apartment",
  plot: "Plot",
  commercial: "Commercial",
  office: "Office",
  shop: "Shop",
  other: "Property",
};

function priceLabel(price: PropertySummary["price"]): string {
  return formatPrice({
    amount: price?.amount ?? undefined,
    display: price?.display ?? undefined,
    onRequest: price?.onRequest ?? undefined,
  });
}

function metaChips(property: PropertySummary): string[] {
  const chips: (string | null)[] = [TYPE_LABEL[property.type] ?? "Property"];
  if (property.area && typeof property.area.value === "number") {
    chips.push(
      formatArea({ value: property.area.value, unit: property.area.unit ?? "" }),
    );
  }
  if (typeof property.bedrooms === "number" && property.bedrooms > 0) {
    chips.push(`${property.bedrooms} Bed`);
  }
  return chips.filter((c): c is string => Boolean(c)).slice(0, 3);
}

interface PropertyCardProps {
  property: PropertySummary;
}

/**
 * Links to `/properties/<slug>`. Two media states, both 4:3: a real cover
 * photo (zoom on hover) or a composed ink panel with the property type set
 * in Fraunces and a gold corner mark — never a broken/grey placeholder.
 */
export function PropertyCard({ property }: PropertyCardProps) {
  const purposeLabel = property.purpose === "rent" ? "For Rent" : "For Sale";
  const typeLabel = TYPE_LABEL[property.type] ?? "Property";
  const chips = metaChips(property);
  const cover = property.cover;

  return (
    <article className="group">
      <Link
        href={`/properties/${property.slug}`}
        aria-label={`View ${property.title}, ${property.location}`}
        className="block rounded-[6px] border border-gray-200 bg-paper p-3 transition-colors duration-200 hover:border-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-0.5"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[4px]">
          {cover?.url ? (
            <Image
              src={cover.url}
              alt={cover.alt || property.title}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
              placeholder={cover.lqip ? "blur" : "empty"}
              blurDataURL={cover.lqip ?? undefined}
            />
          ) : (
            <ImagelessPanel label={typeLabel} />
          )}
        </div>

        <div className="px-1 pb-1 pt-4">
          <p className="u-micro-label">{purposeLabel}</p>
          <h3 className="mt-1.5 font-display text-lg leading-snug text-ink">
            {property.title}
          </h3>
          <p className="mt-1 font-sans text-sm text-gray-500">
            {property.location}
          </p>
          <p className="mt-2.5 font-sans text-lg font-medium tabular-nums text-ink">
            {priceLabel(property.price)}
          </p>

          {chips.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-gray-200 px-2.5 py-0.5 font-sans text-xs text-gray-500"
                >
                  {chip}
                </li>
              ))}
            </ul>
          )}

          <span className="mt-4 inline-flex items-center gap-1 font-sans text-sm text-gray-500 transition-colors group-hover:text-gold-deep">
            View property
            <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
