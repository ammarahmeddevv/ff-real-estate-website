/**
 * TypeScript shapes for the GROQ projections in `queries.ts`.
 * Portable-text blocks are kept loose (`unknown[]`) — rendering is a later task.
 */

export type PortableText = unknown[];

export interface SanityImage {
  url: string | null;
  lqip: string | null;
  alt: string | null;
}

export type PropertyPurpose = "sale" | "rent";
export type PropertyType =
  | "house"
  | "flat"
  | "plot"
  | "commercial"
  | "office"
  | "shop"
  | "other";
export type PropertyStatus = "available" | "under_offer" | "sold" | "rented";
export type ProjectStatus = "upcoming" | "in_progress" | "completed";
export type NewsCategory =
  | "listing"
  | "announcement"
  | "market"
  | "advice"
  | "company";
export type GalleryCategory =
  | "exterior"
  | "interior"
  | "building"
  | "neighbourhood"
  | "commercial"
  | "construction"
  | "project";
export type SocialPlatform =
  | "facebook"
  | "facebook_group"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "other";

export interface Price {
  amount?: number | null;
  display?: string | null;
  onRequest?: boolean | null;
}

export interface Area {
  value?: number | null;
  unit?: "sqyd" | "sqft" | "marla" | "kanal" | string | null;
}

export interface MapEmbed {
  lat?: number | null;
  lng?: number | null;
  embedUrl?: string | null;
}

export interface Agent {
  _id?: string;
  name: string;
  role?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  photo?: SanityImage | null;
}

export interface PropertySummary {
  _id: string;
  title: string;
  slug: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  location: string;
  price?: Price | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: Area | null;
  status: PropertyStatus;
  featured?: boolean | null;
  publishedAt?: string | null;
  cover?: SanityImage | null;
}

export interface Property extends Omit<PropertySummary, "cover"> {
  address?: string | null;
  availability?: string | null;
  description?: PortableText | null;
  highlights?: string[] | null;
  map?: MapEmbed | null;
  gallery?: SanityImage[] | null;
  agent?: Agent | null;
}

export interface ProjectSummary {
  _id: string;
  name: string;
  slug: string;
  location: string;
  projectType?: string | null;
  status?: ProjectStatus | null;
  featured?: boolean | null;
  heroImage?: SanityImage | null;
}

export interface Project extends ProjectSummary {
  description?: PortableText | null;
  keyFeatures?: string[] | null;
  gallery?: SanityImage[] | null;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  summary?: string | null;
  whatYouGet?: string[] | null;
  order?: number | null;
}

export interface NewsSummary {
  _id: string;
  title: string;
  slug: string;
  category: NewsCategory;
  excerpt?: string | null;
  publishedAt?: string | null;
  coverImage?: SanityImage | null;
}

export interface NewsPost extends NewsSummary {
  body?: PortableText | null;
}

export interface GalleryImage {
  _id: string;
  category: GalleryCategory;
  caption?: string | null;
  image: SanityImage;
  relatedProperty?: { title: string; slug: string } | null;
  relatedProject?: { name: string; slug: string } | null;
}

export interface Testimonial {
  _id: string;
  name: string;
  context?: string | null;
  quote: string;
  photo?: SanityImage | null;
}

export interface PhoneRow {
  label: string;
  number: string;
  whatsapp?: boolean | null;
}

export interface HoursRow {
  day: string;
  open?: string | null;
  close?: string | null;
  closed?: boolean | null;
}

export interface SocialRow {
  platform: SocialPlatform;
  url: string;
}

export interface SiteAddress {
  line1: string | null;
  area: string | null;
  city: string | null;
  postalCode: string | null;
  mapsUrl: string | null;
  lat: number | null;
  lng: number | null;
}

export interface SiteHero {
  heading: string;
  subheading: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
}

export interface WhyFFItem {
  title: string;
  body: string;
}

export interface SiteSettings {
  /** Business name. Not a CMS field — always supplied by `FALLBACK_SITE`. */
  name: string;
  logo: SanityImage | null;
  phones: PhoneRow[];
  primaryWhatsapp: string;
  email: string;
  address: SiteAddress;
  hours: HoursRow[];
  socials: SocialRow[];
  hero: SiteHero;
  trustBarItems: string[];
  whyFF: WhyFFItem[];
}

/** Partial shape the CMS may return before all fields are seeded. */
export type SiteSettingsDocument = Partial<
  Omit<SiteSettings, "hero" | "address" | "name">
> & {
  hero?: Partial<SiteHero> | null;
  address?: Partial<SiteAddress> | null;
};
