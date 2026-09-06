import type { SiteSettings } from "@/lib/sanity/types";

const ADDRESS_LINE1 = "R-37, Block 15, Near Taal Stop";
const ADDRESS_AREA = "F.B Area, Dastagir Society";
const ADDRESS_CITY = "Karachi";
const ADDRESS_POSTAL = "75590";

const FULL_ADDRESS = `${ADDRESS_LINE1}, ${ADDRESS_AREA}, ${ADDRESS_CITY}, ${ADDRESS_POSTAL}`;

/**
 * Verified, static site settings. `getSiteSettings()` merges any CMS document
 * over this object so every page has complete, non-null settings even before
 * a Sanity project is connected or seeded.
 *
 * Content here is limited to verified facts — never invent opening hours,
 * statistics, or experience claims.
 */
export const FALLBACK_SITE: SiteSettings = {
  logo: null,
  name: "F.F Real Estate Builder & Developers",
  phones: [
    { label: "Syed Mustafa Rehman", number: "0313 3694904", whatsapp: true },
    { label: "Mohammad Salman", number: "0345 4569090", whatsapp: true },
  ],
  primaryWhatsapp: "923133694904",
  email: "f.f.realestate333@gmail.com",
  address: {
    line1: ADDRESS_LINE1,
    area: ADDRESS_AREA,
    city: ADDRESS_CITY,
    postalCode: ADDRESS_POSTAL,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      FULL_ADDRESS,
    )}`,
    lat: null,
    lng: null,
  },
  hours: [],
  socials: [
    { platform: "facebook", url: "https://www.facebook.com/F.F.REBAD/" },
    {
      platform: "facebook_group",
      url: "https://www.facebook.com/groups/397312108831460/",
    },
  ],
  hero: {
    heading: "Find the Right Property. Make the Right Move.",
    subheading:
      "F.F Real Estate Builder & Developers helps clients navigate property opportunities in Karachi with a straightforward, professional approach.",
    primaryCtaLabel: "Explore Properties",
    primaryCtaHref: "/properties",
  },
  trustBarItems: [
    "Karachi-Based Real Estate Professionals",
    "Buying • Selling • Renting",
    "Renovation & Documentation",
    "F.B Area & Dastagir Local Expertise",
  ],
  whyFF: [
    {
      title: "Local Market Knowledge",
      body: "We work day to day in F.B Area, Dastagir Society and the surrounding Karachi neighbourhoods, so we know these streets, buildings and price expectations first-hand.",
    },
    {
      title: "Straightforward Property Guidance",
      body: "We explain each option plainly and let you decide at your own pace, without pressure or inflated promises.",
    },
    {
      title: "Sale, Purchase, Rent, Renovation & Documentation",
      body: "Buying, selling, renting, renovation and property documentation are handled by one team, so you have a single point of contact throughout.",
    },
    {
      title: "Personalised Assistance",
      body: "You deal directly with Syed Mustafa Rehman and Mohammad Salman, who stay involved from the first enquiry to handover.",
    },
  ],
};
