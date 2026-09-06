import type { Property } from "@/lib/sanity/types";
import { formatArea } from "@/lib/format";
import { STATUS_LABEL, TYPE_LABEL } from "@/lib/property-labels";

interface PropertyQuickDetailsProps {
  property: Property;
}

/**
 * Labelled facts grid: 2 columns on mobile, 4 on desktop. Any row without a
 * value is omitted entirely — never a dangling "Bedrooms: —".
 */
export function PropertyQuickDetails({ property }: PropertyQuickDetailsProps) {
  const area = property.area
    ? formatArea({
        value: property.area.value ?? NaN,
        unit: property.area.unit ?? "",
      })
    : null;

  const rows: { label: string; value: string }[] = [];

  rows.push({ label: "Type", value: TYPE_LABEL[property.type] ?? "Property" });
  if (area) rows.push({ label: "Area", value: area });
  if (typeof property.bedrooms === "number" && property.bedrooms > 0) {
    rows.push({ label: "Bedrooms", value: String(property.bedrooms) });
  }
  if (typeof property.bathrooms === "number" && property.bathrooms > 0) {
    rows.push({ label: "Bathrooms", value: String(property.bathrooms) });
  }
  if (property.status && STATUS_LABEL[property.status]) {
    rows.push({ label: "Status", value: STATUS_LABEL[property.status] });
  }
  if (property.availability?.trim()) {
    rows.push({ label: "Availability", value: property.availability.trim() });
  }

  if (rows.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-gray-200 py-6 md:grid-cols-4">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="u-micro-label">{row.label}</dt>
          <dd className="mt-1.5 font-sans text-base text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
