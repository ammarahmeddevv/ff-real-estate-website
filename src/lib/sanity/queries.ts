/**
 * GROQ query strings. Field names and enum values match the schema types in
 * `src/sanity/schemaTypes/` exactly. Image projections expose
 * `{ "url": asset->url, "lqip": asset->metadata.lqip, alt }` so `imageProps`
 * can size the CDN URL and supply a blur placeholder.
 */

const IMAGE = `{ "url": asset->url, "lqip": asset->metadata.lqip, alt }`;

const PROPERTY_SUMMARY = `
  _id,
  title,
  "slug": slug.current,
  purpose,
  type,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  status,
  featured,
  publishedAt,
  "cover": gallery[0]${IMAGE}
`;

const PROJECT_SUMMARY = `
  _id,
  name,
  "slug": slug.current,
  location,
  projectType,
  status,
  featured,
  "heroImage": heroImage${IMAGE}
`;

const NEWS_SUMMARY = `
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  publishedAt,
  "coverImage": coverImage${IMAGE}
`;

/* -------------------------------------------------------------------------- */
/* Site settings                                                             */
/* -------------------------------------------------------------------------- */

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  "logo": logo${IMAGE},
  phones[]{ label, number, whatsapp },
  primaryWhatsapp,
  email,
  address{ line1, area, city, postalCode, mapsUrl, lat, lng },
  hours[]{ day, open, close, closed },
  socials[]{ platform, url },
  hero{ heading, subheading, primaryCtaLabel, primaryCtaHref },
  trustBarItems,
  whyFF[]{ title, body }
}`;

/* -------------------------------------------------------------------------- */
/* Properties                                                                */
/* -------------------------------------------------------------------------- */

export const FEATURED_PROPERTIES_QUERY = `*[_type == "property" && featured == true && status == "available"]
  | order(publishedAt desc)[0...6]{${PROPERTY_SUMMARY}}`;

export const ALL_PROPERTIES_QUERY = `*[_type == "property"]
  | order(featured desc, publishedAt desc){${PROPERTY_SUMMARY}}`;

/**
 * Listing query for `/properties`. `filter` comes from
 * `buildPropertyGroqFilter` in `src/lib/filters.ts` — a fixed whitelist of
 * clauses with every value bound as a GROQ parameter, so interpolating it
 * here is safe.
 */
export function propertiesQuery(filter: string): string {
  return `*[${filter}] | order(featured desc, publishedAt desc){${PROPERTY_SUMMARY}}`;
}

/** Distinct, defined `location` values across available properties. */
export const PROPERTY_LOCATIONS_QUERY = `array::unique(
  *[_type == "property" && status == "available" && defined(location)].location
)`;

export const PROPERTY_SLUGS_QUERY = `*[_type == "property" && defined(slug.current)]{ "slug": slug.current }`;

export const PROPERTY_BY_SLUG_QUERY = `*[_type == "property" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  purpose,
  type,
  location,
  address,
  price,
  bedrooms,
  bathrooms,
  area,
  status,
  availability,
  description,
  highlights,
  map{ lat, lng, embedUrl },
  featured,
  publishedAt,
  "gallery": gallery[]${IMAGE},
  agent->{ _id, name, role, phone, whatsapp, "photo": photo${IMAGE} }
}`;

/* -------------------------------------------------------------------------- */
/* Projects                                                                  */
/* -------------------------------------------------------------------------- */

export const FEATURED_PROJECTS_QUERY = `*[_type == "project" && featured == true]
  | order(_createdAt desc)[0...6]{${PROJECT_SUMMARY}}`;

export const ALL_PROJECTS_QUERY = `*[_type == "project"]
  | order(featured desc, _createdAt desc){${PROJECT_SUMMARY}}`;

export const PROJECT_SLUGS_QUERY = `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`;

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  location,
  projectType,
  status,
  description,
  keyFeatures,
  featured,
  "heroImage": heroImage${IMAGE},
  "gallery": gallery[]${IMAGE}
}`;

/* -------------------------------------------------------------------------- */
/* Services                                                                  */
/* -------------------------------------------------------------------------- */

export const SERVICES_QUERY = `*[_type == "service"]
  | order(order asc, title asc){
    _id,
    title,
    "slug": slug.current,
    summary,
    whatYouGet,
    order
  }`;

/* -------------------------------------------------------------------------- */
/* News                                                                      */
/* -------------------------------------------------------------------------- */

export const NEWS_LIST_QUERY = `*[_type == "newsPost"]
  | order(publishedAt desc){${NEWS_SUMMARY}}`;

export const NEWS_SLUGS_QUERY = `*[_type == "newsPost" && defined(slug.current)]{ "slug": slug.current }`;

export const NEWS_BY_SLUG_QUERY = `*[_type == "newsPost" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  body,
  publishedAt,
  "coverImage": coverImage${IMAGE}
}`;

/* -------------------------------------------------------------------------- */
/* Gallery                                                                   */
/* -------------------------------------------------------------------------- */

// `$category` == "all" (or empty) returns everything; otherwise filters by enum.
export const GALLERY_QUERY = `*[_type == "galleryImage" && ($category == "all" || $category == "" || category == $category)]
  | order(_createdAt desc){
    _id,
    category,
    caption,
    "image": image${IMAGE},
    "relatedProperty": relatedProperty->{ title, "slug": slug.current },
    "relatedProject": relatedProject->{ name, "slug": slug.current }
  }`;

/* -------------------------------------------------------------------------- */
/* Testimonials                                                              */
/* -------------------------------------------------------------------------- */

export const TESTIMONIALS_QUERY = `*[_type == "testimonial"]
  | order(_createdAt desc){
    _id,
    name,
    context,
    quote,
    "photo": photo${IMAGE}
  }`;
