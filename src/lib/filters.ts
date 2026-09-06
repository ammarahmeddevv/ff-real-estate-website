/**
 * URL-driven property filtering.
 *
 * The listing page (`/properties`) is server-rendered from `searchParams`, so
 * this module is the single source of truth for:
 *   - reading + validating the query string   (`parsePropertyFilters`)
 *   - turning a state into a GROQ predicate    (`buildPropertyGroqFilter`)
 *   - writing state back to the URL            (`filtersToSearchParams`)
 *   - describing the active filters as chips   (`activeFilterChips`)
 *
 * Every value that reaches GROQ is bound as a parameter; the predicate string
 * itself is assembled from a fixed whitelist of clauses, so interpolating it
 * into a query is safe.
 */

import type { PropertyType } from "@/lib/sanity/types";
import { formatPrice } from "@/lib/format";

export type PropertyPurpose = "sale" | "rent";

export type PropertyFilterState = {
  purpose?: PropertyPurpose;
  type?: PropertyType;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  minArea?: number;
};

type SearchParamsInput = Record<string, string | string[] | undefined>;

/** Enum values — must stay in sync with `src/sanity/schemaTypes/property.ts`. */
export const PROPERTY_PURPOSES: readonly PropertyPurpose[] = ["sale", "rent"];

export const PROPERTY_TYPES: readonly PropertyType[] = [
  "house",
  "flat",
  "plot",
  "commercial",
  "office",
  "shop",
  "other",
];

/** Friendly labels for the type <select> and the active-filter chips. */
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  house: "House",
  flat: "Flat / Apartment",
  plot: "Plot",
  commercial: "Commercial",
  office: "Office",
  shop: "Shop",
  other: "Other",
};

const NUMERIC_KEYS = [
  "minPrice",
  "maxPrice",
  "bedrooms",
  "minArea",
] as const satisfies readonly (keyof PropertyFilterState)[];

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Parse `searchParams` into a validated filter state:
 *   - `purpose` / `type` must be a known enum value, else dropped
 *   - numerics are coerced; non-numeric / blank values are dropped;
 *     negatives are clamped to 0; `bedrooms` is floored to an integer
 *   - `location` is trimmed; blank is dropped
 *   - unknown keys are ignored
 */
export function parsePropertyFilters(
  searchParams: SearchParamsInput,
): PropertyFilterState {
  const state: PropertyFilterState = {};

  const purpose = firstValue(searchParams.purpose);
  if (purpose && (PROPERTY_PURPOSES as readonly string[]).includes(purpose)) {
    state.purpose = purpose as PropertyPurpose;
  }

  const type = firstValue(searchParams.type);
  if (type && (PROPERTY_TYPES as readonly string[]).includes(type)) {
    state.type = type as PropertyType;
  }

  const location = firstValue(searchParams.location)?.trim();
  if (location) state.location = location;

  for (const key of NUMERIC_KEYS) {
    const raw = firstValue(searchParams[key])?.trim();
    if (!raw) continue;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) continue;
    const clamped = Math.max(0, parsed);
    state[key] = key === "bedrooms" ? Math.floor(clamped) : clamped;
  }

  return state;
}

/**
 * Build the GROQ predicate (without the leading `*[` and without a projection).
 *
 * Always starts `_type == "property" && status == "available"`, then appends
 * one `&& <field> <op> $param` clause per set filter.
 *
 * NOTE: `minPrice` / `maxPrice` compare against `price.amount`, so properties
 * with no numeric amount (price-on-request) are excluded whenever a price
 * bound is set. That is intentional — a visitor filtering by budget is asking
 * for priced listings.
 */
export function buildPropertyGroqFilter(state: PropertyFilterState): {
  filter: string;
  params: Record<string, unknown>;
} {
  const clauses = ['_type == "property"', 'status == "available"'];
  const params: Record<string, unknown> = {};

  if (state.purpose) {
    clauses.push("purpose == $purpose");
    params.purpose = state.purpose;
  }
  if (state.type) {
    clauses.push("type == $type");
    params.type = state.type;
  }
  if (state.location) {
    clauses.push("location == $location");
    params.location = state.location;
  }
  if (state.minPrice !== undefined) {
    clauses.push("price.amount >= $minPrice");
    params.minPrice = state.minPrice;
  }
  if (state.maxPrice !== undefined) {
    clauses.push("price.amount <= $maxPrice");
    params.maxPrice = state.maxPrice;
  }
  if (state.bedrooms !== undefined) {
    clauses.push("bedrooms >= $bedrooms");
    params.bedrooms = state.bedrooms;
  }
  if (state.minArea !== undefined) {
    clauses.push("area.value >= $minArea");
    params.minArea = state.minArea;
  }

  return { filter: clauses.join(" && "), params };
}

/** Serialise a state back to a query string (stable key order). */
export function filtersToSearchParams(
  state: PropertyFilterState,
): URLSearchParams {
  const sp = new URLSearchParams();
  if (state.purpose) sp.set("purpose", state.purpose);
  if (state.type) sp.set("type", state.type);
  if (state.location) sp.set("location", state.location);
  if (state.minPrice !== undefined) sp.set("minPrice", String(state.minPrice));
  if (state.maxPrice !== undefined) sp.set("maxPrice", String(state.maxPrice));
  if (state.bedrooms !== undefined) sp.set("bedrooms", String(state.bedrooms));
  if (state.minArea !== undefined) sp.set("minArea", String(state.minArea));
  return sp;
}

export interface FilterChip {
  key: keyof PropertyFilterState;
  label: string;
}

/** One chip per set field, in display order, with a human-readable label. */
export function activeFilterChips(state: PropertyFilterState): FilterChip[] {
  const chips: FilterChip[] = [];

  if (state.purpose) {
    chips.push({
      key: "purpose",
      label: state.purpose === "rent" ? "For rent" : "For sale",
    });
  }
  if (state.type) {
    chips.push({ key: "type", label: PROPERTY_TYPE_LABELS[state.type] });
  }
  if (state.location) {
    chips.push({ key: "location", label: state.location });
  }
  if (state.minPrice !== undefined) {
    chips.push({
      key: "minPrice",
      label: `From ${formatPrice({ amount: state.minPrice })}`,
    });
  }
  if (state.maxPrice !== undefined) {
    chips.push({
      key: "maxPrice",
      label: `Up to ${formatPrice({ amount: state.maxPrice })}`,
    });
  }
  if (state.bedrooms !== undefined) {
    chips.push({ key: "bedrooms", label: `${state.bedrooms}+ beds` });
  }
  if (state.minArea !== undefined) {
    chips.push({ key: "minArea", label: `${state.minArea}+ sq. yd` });
  }

  return chips;
}
