import { describe, it, expect } from "vitest";
import { formatPrice, formatArea } from "@/lib/format";

describe("formatPrice", () => {
  it("prefers an explicit display string", () => {
    expect(formatPrice({ display: "PKR 2.4 Crore", amount: 24000000 })).toBe("PKR 2.4 Crore");
  });
  it("returns 'Price on request' when flagged", () => {
    expect(formatPrice({ onRequest: true })).toBe("Price on request");
  });
  it("returns 'Price on request' when nothing is provided", () => {
    expect(formatPrice({})).toBe("Price on request");
  });
  it("formats a numeric amount with grouping", () => {
    expect(formatPrice({ amount: 8500000 })).toBe("PKR 85,00,000");
  });
});

describe("formatArea", () => {
  it("formats square yards", () => {
    expect(formatArea({ value: 240, unit: "sqyd" })).toBe("240 sq. yd");
  });
  it("returns null when absent", () => {
    expect(formatArea(undefined)).toBeNull();
  });
});
