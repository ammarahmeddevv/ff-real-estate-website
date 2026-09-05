import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PropertyCard } from "@/components/property/PropertyCard";
import type { PropertySummary } from "@/lib/sanity/types";

const property: PropertySummary = {
  _id: "p1",
  title: "2nd Floor Portion, West Open",
  slug: "2nd-floor-portion-fb-area-block-15",
  purpose: "rent",
  type: "flat",
  location: "F.B Area, Block 15",
  price: { onRequest: true },
  bedrooms: 3,
  bathrooms: 3,
  area: { value: 240, unit: "sqyd" },
  status: "available",
  featured: true,
  publishedAt: null,
  cover: null,
};

describe("PropertyCard", () => {
  it("renders an on-request price, the title, a slug link and the rent tag with no image", () => {
    const { container } = render(<PropertyCard property={property} />);

    expect(screen.getByText("Price on request")).toBeInTheDocument();
    expect(screen.getByText(property.title)).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe(`/properties/${property.slug}`);

    expect(screen.getByText("For Rent")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });
});
