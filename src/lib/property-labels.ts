/**
 * Friendly, visitor-facing labels for the property enums.
 *
 * Single source of truth for the property detail page and the property cards.
 * (`src/lib/filters.ts` keeps its own `PROPERTY_TYPE_LABELS` for the filter
 * dropdown / chips, where an unspecified type reads better as "Other".)
 */

import type {
  GalleryCategory,
  NewsCategory,
  ProjectStatus,
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
} from "@/lib/sanity/types";

export const TYPE_LABEL: Record<PropertyType, string> = {
  house: "House",
  flat: "Flat / Apartment",
  plot: "Plot",
  commercial: "Commercial",
  office: "Office",
  shop: "Shop",
  other: "Property",
};

export const STATUS_LABEL: Record<PropertyStatus, string> = {
  available: "Available",
  under_offer: "Under offer",
  sold: "Sold",
  rented: "Rented",
};

/** "For Sale" / "For Rent" — `rent` is the only non-sale purpose. */
export function purposeLabel(purpose: PropertyPurpose | null | undefined): string {
  return purpose === "rent" ? "For Rent" : "For Sale";
}

/** Visitor-facing labels for the project `status` enum. */
export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  upcoming: "Upcoming",
  in_progress: "In progress",
  completed: "Completed",
};

/**
 * Gallery categories in display order, and their visitor-facing labels.
 * Must stay in sync with `src/sanity/schemaTypes/galleryImage.ts`.
 */
export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  "exterior",
  "interior",
  "building",
  "neighbourhood",
  "commercial",
  "construction",
  "project",
];

export const GALLERY_CATEGORY_LABEL: Record<GalleryCategory, string> = {
  exterior: "Exterior",
  interior: "Interior",
  building: "Building",
  neighbourhood: "Neighbourhood",
  commercial: "Commercial",
  construction: "Construction",
  project: "Project",
};

/** Visitor-facing labels for the news post `category` enum. */
export const NEWS_CATEGORY_LABEL: Record<NewsCategory, string> = {
  listing: "New listing",
  announcement: "Announcement",
  market: "Market update",
  advice: "Property advice",
  company: "Company news",
};
