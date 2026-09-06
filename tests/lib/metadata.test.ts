import { describe, it, expect } from "vitest";
import {
  SITE_URL,
  buildMetadata,
  realEstateAgentJsonLd,
  residenceJsonLd,
  articleJsonLd,
} from "@/lib/metadata";
import { FALLBACK_SITE } from "@/lib/site";
import type { NewsPost, Property } from "@/lib/sanity/types";

describe("buildMetadata", () => {
  const meta = buildMetadata({
    title: "Properties",
    description: "d",
    path: "/properties",
  });

  it("keeps the <title> bare but brands the og/twitter titles", () => {
    expect(meta.title).toBe("Properties");
    expect(meta.openGraph?.title).toBe("Properties | F.F Real Estate");
    expect(meta.twitter?.title).toBe("Properties | F.F Real Estate");
  });

  it("builds an absolute canonical URL ending with the path", () => {
    const canonical = meta.alternates?.canonical as string;
    expect(canonical.startsWith("http")).toBe(true);
    expect(canonical.endsWith("/properties")).toBe(true);
    expect(canonical).toBe(`${SITE_URL}/properties`);
  });

  it("mirrors the canonical URL into openGraph.url (absolute)", () => {
    const ogUrl = meta.openGraph?.url as string;
    expect(String(ogUrl).startsWith("http")).toBe(true);
    expect(String(ogUrl)).toBe(`${SITE_URL}/properties`);
  });

  it("sets a summary_large_image twitter card and og/twitter defaults", () => {
    expect(meta.openGraph?.siteName).toBe(
      "F.F Real Estate Builder & Developers",
    );
    expect(meta.openGraph?.locale).toBe("en_PK");
    expect(meta.twitter?.card).toBe("summary_large_image");
  });

  it("falls back to the generated OG image route", () => {
    const images = meta.openGraph?.images as string[];
    expect(images[0]).toContain("/opengraph-image");
  });

  it("uses a supplied image when given", () => {
    const withImage = buildMetadata({
      title: "T",
      description: "d",
      path: "/x",
      image: "https://cdn.example/pic.jpg",
    });
    expect((withImage.openGraph?.images as string[])[0]).toBe(
      "https://cdn.example/pic.jpg",
    );
  });
});

describe("realEstateAgentJsonLd", () => {
  const jsonLd = realEstateAgentJsonLd(FALLBACK_SITE);

  it("is a RealEstateAgent with contact + address", () => {
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("RealEstateAgent");
    expect(jsonLd.telephone).toBe("+923133694904");
    expect(jsonLd.email).toBe(FALLBACK_SITE.email);
    const address = jsonLd.address as Record<string, unknown>;
    expect(address["@type"]).toBe("PostalAddress");
    expect(address.addressLocality).toBe("Karachi");
    expect(address.postalCode).toBe("75590");
    expect(address.addressCountry).toBe("PK");
  });

  it("links the Facebook page and group via sameAs", () => {
    expect(jsonLd.sameAs).toContain("https://www.facebook.com/F.F.REBAD/");
    expect(jsonLd.sameAs).toContain(
      "https://www.facebook.com/groups/397312108831460/",
    );
  });

  it("advertises the Karachi areas served", () => {
    expect(jsonLd.areaServed).toContain("F.B Area");
    expect(jsonLd.areaServed).toContain("Karachi");
  });

  it("omits geo when no coordinates are set", () => {
    expect(jsonLd.geo).toBeUndefined();
  });

  it("includes geo only when lat and lng are numbers", () => {
    const withGeo = realEstateAgentJsonLd({
      ...FALLBACK_SITE,
      address: { ...FALLBACK_SITE.address, lat: 24.94, lng: 67.06 },
    });
    expect(withGeo.geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: 24.94,
      longitude: 67.06,
    });
  });

  it("carries NO fabricated ratings, reviews, awards or founding date", () => {
    const keys = Object.keys(jsonLd);
    expect(keys).not.toContain("aggregateRating");
    expect(keys).not.toContain("review");
    expect(keys).not.toContain("award");
    expect(keys).not.toContain("foundingDate");
    expect(keys).not.toContain("priceRange");
  });
});

const baseProperty: Property = {
  _id: "p1",
  title: "2nd Floor Portion",
  slug: "2nd-floor-portion-fb-area",
  purpose: "sale",
  type: "flat",
  location: "F.B Area, Block 15",
  status: "available",
  description: [
    {
      _type: "block",
      children: [{ text: "A bright portion near Taal Stop." }],
    },
  ] as unknown as Property["description"],
  gallery: [{ url: "https://cdn.example/1.jpg", lqip: null, alt: null }],
};

describe("residenceJsonLd", () => {
  it("describes the residence with the first gallery image", () => {
    const jsonLd = residenceJsonLd(baseProperty, `${SITE_URL}/properties/x`);
    expect(jsonLd["@type"]).toBe("RealEstateListing");
    expect(jsonLd.name).toBe("2nd Floor Portion");
    expect(jsonLd.url).toBe(`${SITE_URL}/properties/x`);
    expect(jsonLd.image).toBe("https://cdn.example/1.jpg");
    expect(jsonLd.description).toContain("bright portion");
  });

  it("adds an Offer only when a real price amount exists", () => {
    const noPrice = residenceJsonLd(baseProperty, "u");
    expect(noPrice.offers).toBeUndefined();

    const priced = residenceJsonLd(
      { ...baseProperty, price: { amount: 25000000 } },
      "u",
    );
    expect(priced.offers).toMatchObject({
      "@type": "Offer",
      price: 25000000,
      priceCurrency: "PKR",
    });
  });

  it("does not add an Offer for price-on-request", () => {
    const onRequest = residenceJsonLd(
      { ...baseProperty, price: { onRequest: true } },
      "u",
    );
    expect(onRequest.offers).toBeUndefined();
  });
});

describe("articleJsonLd", () => {
  const post: NewsPost = {
    _id: "n1",
    title: "New listing in Dastagir",
    slug: "new-listing-dastagir",
    category: "listing",
    publishedAt: "2026-08-01T00:00:00Z",
    coverImage: { url: "https://cdn.example/cover.jpg", lqip: null, alt: null },
  };

  it("is an Article attributed to the organization", () => {
    const jsonLd = articleJsonLd(post, `${SITE_URL}/news/x`);
    expect(jsonLd["@type"]).toBe("Article");
    expect(jsonLd.headline).toBe("New listing in Dastagir");
    expect(jsonLd.datePublished).toBe("2026-08-01T00:00:00Z");
    expect(jsonLd.image).toBe("https://cdn.example/cover.jpg");
    expect(jsonLd.author).toMatchObject({
      "@type": "Organization",
      name: "F.F Real Estate Builder & Developers",
    });
    expect(jsonLd.publisher).toMatchObject({ "@type": "Organization" });
  });
});
