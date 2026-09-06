import { describe, it, expect } from "vitest";
import { formatPrice, formatArea, formatDate } from "@/lib/format";

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

describe("formatDate", () => {
  it("formats an ISO datetime as a UK long date", () => {
    expect(formatDate("2026-08-12T09:30:00.000Z")).toBe("12 August 2026");
  });
  it("is timezone-stable: a late-UTC timestamp keeps its UTC calendar day", () => {
    // 23:30 UTC would roll to the next day in +hours locales; UTC pins it.
    expect(formatDate("2026-01-01T23:30:00.000Z")).toBe("1 January 2026");
  });
  it("accepts a plain date string", () => {
    expect(formatDate("2025-12-31")).toBe("31 December 2025");
  });
  it("returns an empty string for an invalid date", () => {
    expect(formatDate("not-a-date")).toBe("");
  });
});
