import type { Service } from "@/lib/sanity/types";

/**
 * The six confirmed F.F Real Estate services. Copy is kept verbatim in step with
 * `scripts/seed.ts` so the site reads identically whether or not the CMS is
 * connected. Used by `/services` (full detail) and the home `ServicesStrip`
 * (title + summary only).
 *
 * Content is limited to verified facts — no invented scope, guarantees or scale.
 */
export const FALLBACK_SERVICES: Service[] = [
  {
    _id: "service.property-buying",
    slug: "property-buying",
    title: "Property Buying",
    order: 1,
    summary:
      "Shortlisted options that match your budget, area and purpose, with viewings arranged and paperwork handled.",
    whatYouGet: [
      "A shortlist filtered to your budget, preferred areas and intended use",
      "Viewings scheduled and accompanied so you can compare options in person",
      "Help checking ownership documents and negotiating the price",
      "Support through the sale agreement and transfer paperwork",
    ],
  },
  {
    _id: "service.property-selling",
    slug: "property-selling",
    title: "Property Selling",
    order: 2,
    summary:
      "Your property priced against current local sales, listed to buyers, and guided through to a completed transfer.",
    whatYouGet: [
      "A price recommendation based on recent sales in your area",
      "Your listing shared with our buyer contacts and on our channels",
      "Enquiries screened and viewings arranged around your schedule",
      "Coordination of the buyer's payment, agreement and transfer",
    ],
  },
  {
    _id: "service.property-rentals",
    slug: "property-rentals",
    title: "Property Rentals",
    order: 3,
    summary:
      "Rental homes and units matched to tenants, and landlords connected with screened renters on a clear agreement.",
    whatYouGet: [
      "Available rentals matched to your budget, family size and location",
      "For landlords: tenant enquiries screened before viewings",
      "A written tenancy agreement covering rent, deposit and term",
      "Handover with a documented inventory and meter readings",
    ],
  },
  {
    _id: "service.renovation",
    slug: "renovation",
    title: "Renovation",
    order: 4,
    summary:
      "Repair and renovation work organised with trusted local tradespeople, from a single room to a full property refresh.",
    whatYouGet: [
      "A walkthrough to agree the scope and a written cost estimate",
      "Vetted electricians, plumbers, masons and painters arranged for you",
      "One point of contact coordinating the trades and schedule",
      "Progress updates and a final check before you sign off",
    ],
  },
  {
    _id: "service.documentation",
    slug: "documentation",
    title: "Documentation",
    order: 5,
    summary:
      "Property paperwork prepared and processed correctly — sale deeds, transfers, mutation and related records.",
    whatYouGet: [
      "A checklist of the documents your transaction needs",
      "Sale deed and transfer papers drafted and reviewed",
      "Submission and follow-up for mutation and record updates",
      "Copies of every completed document organised for your records",
    ],
  },
  {
    _id: "service.property-consultation",
    slug: "property-consultation",
    title: "Property Consultation",
    order: 6,
    summary:
      "A sit-down to talk through your options, timing and budget before you commit to buying, selling or renting.",
    whatYouGet: [
      "A discussion of your goals, timeline and budget",
      "Current price and demand context for the areas you're considering",
      "Clear next steps, whether or not you proceed with us",
      "Answers to your questions on process, costs and paperwork",
    ],
  },
];
