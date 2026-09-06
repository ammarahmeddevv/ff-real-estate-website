import { describe, it, expect } from "vitest";
import {
  parsePropertyFilters,
  buildPropertyGroqFilter,
  filtersToSearchParams,
  activeFilterChips,
} from "@/lib/filters";

describe("parsePropertyFilters", () => {
  it("returns an empty object for no params", () => {
    expect(parsePropertyFilters({})).toEqual({});
  });

  it("parses purpose, type and bedrooms", () => {
    expect(
      parsePropertyFilters({ purpose: "rent", type: "flat", bedrooms: "3" }),
    ).toEqual({ purpose: "rent", type: "flat", bedrooms: 3 });
  });

  it("drops an unknown type", () => {
    expect(parsePropertyFilters({ type: "castle" })).toEqual({});
  });

  it("drops an unknown purpose", () => {
    expect(parsePropertyFilters({ purpose: "lease" })).toEqual({});
  });

  it("drops non-numeric price values", () => {
    expect(
      parsePropertyFilters({ minPrice: "abc", maxPrice: "" }),
    ).toEqual({});
  });

  it("coerces numeric strings and clamps negatives to zero", () => {
    expect(
      parsePropertyFilters({ minPrice: "5000000", minArea: "-40" }),
    ).toEqual({ minPrice: 5000000, minArea: 0 });
  });

  it("ignores unknown keys and takes the first value of an array", () => {
    expect(
      parsePropertyFilters({ sort: "price", purpose: ["sale", "rent"] }),
    ).toEqual({ purpose: "sale" });
  });

  it("trims location and drops it when blank", () => {
    expect(parsePropertyFilters({ location: "  F.B Area  " })).toEqual({
      location: "F.B Area",
    });
    expect(parsePropertyFilters({ location: "   " })).toEqual({});
  });
});

describe("buildPropertyGroqFilter", () => {
  it("always constrains to available properties", () => {
    const { filter, params } = buildPropertyGroqFilter({});
    expect(filter).toBe(
      '_type == "property" && status == "available"',
    );
    expect(params).toEqual({});
  });

  it("adds a clause and param per set field", () => {
    const { filter, params } = buildPropertyGroqFilter({
      purpose: "sale",
      bedrooms: 2,
    });
    expect(filter).toContain('_type == "property" && status == "available"');
    expect(filter).toContain("purpose == $purpose");
    expect(filter).toContain("bedrooms >= $bedrooms");
    expect(params).toEqual({ purpose: "sale", bedrooms: 2 });
  });

  it("maps price and area to the nested fields", () => {
    const { filter, params } = buildPropertyGroqFilter({
      minPrice: 1000000,
      maxPrice: 9000000,
      minArea: 200,
      type: "house",
      location: "Gulshan",
    });
    expect(filter).toContain("price.amount >= $minPrice");
    expect(filter).toContain("price.amount <= $maxPrice");
    expect(filter).toContain("area.value >= $minArea");
    expect(filter).toContain("type == $type");
    expect(filter).toContain("location == $location");
    expect(params).toEqual({
      minPrice: 1000000,
      maxPrice: 9000000,
      minArea: 200,
      type: "house",
      location: "Gulshan",
    });
  });
});

describe("filtersToSearchParams", () => {
  it("round-trips through parsePropertyFilters", () => {
    const state = {
      purpose: "rent" as const,
      type: "flat" as const,
      location: "F.B Area",
      minPrice: 50000,
      bedrooms: 3,
    };
    const sp = filtersToSearchParams(state);
    expect(sp.get("purpose")).toBe("rent");
    expect(sp.get("minPrice")).toBe("50000");
    expect(parsePropertyFilters(Object.fromEntries(sp))).toEqual(state);
  });

  it("omits unset fields", () => {
    expect(filtersToSearchParams({}).toString()).toBe("");
  });
});

describe("activeFilterChips", () => {
  it("returns nothing when no filters are set", () => {
    expect(activeFilterChips({})).toEqual([]);
  });

  it("returns one entry per set field with a human label", () => {
    const chips = activeFilterChips({
      purpose: "rent",
      type: "flat",
      location: "F.B Area",
      minPrice: 5000000,
      maxPrice: 12000000,
      bedrooms: 3,
      minArea: 240,
    });
    expect(chips.map((c) => c.key)).toEqual([
      "purpose",
      "type",
      "location",
      "minPrice",
      "maxPrice",
      "bedrooms",
      "minArea",
    ]);
    expect(chips.find((c) => c.key === "purpose")?.label).toBe("For rent");
    expect(chips.find((c) => c.key === "bedrooms")?.label).toBe("3+ beds");
    expect(chips.find((c) => c.key === "minPrice")?.label).toBe(
      "From PKR 50,00,000",
    );
    expect(chips.find((c) => c.key === "location")?.label).toBe("F.B Area");
  });
});
