import type { PropertySummary } from "@/lib/sanity/types";
import { PropertyCard } from "./PropertyCard";

interface PropertyGridProps {
  properties: PropertySummary[];
}

/** Responsive 1 / 2 / 3-column grid of property cards. */
export function PropertyGrid({ properties }: PropertyGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}
