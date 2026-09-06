import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * `getSiteSettings()` merges the CMS `siteSettings` document over
 * `FALLBACK_SITE`, keeping only CMS keys that carry a usable value. This locks
 * the "hours are never shown unless a real value exists" invariant at the merge
 * layer: an empty CMS array must NOT wipe the fallback, a populated one must.
 */

const fetchMock = vi.fn();

vi.mock("@/lib/sanity/fetch", () => ({
  sanityFetch: (...args: unknown[]) => fetchMock(...args),
}));

import { getSiteSettings } from "@/lib/sanity/settings";
import { FALLBACK_SITE } from "@/lib/site";

beforeEach(() => {
  fetchMock.mockReset();
});

describe("getSiteSettings — merge behaviour", () => {
  it("returns the fallback untouched when there is no CMS document", async () => {
    fetchMock.mockResolvedValue(null);
    const settings = await getSiteSettings();
    expect(settings).toBe(FALLBACK_SITE);
  });

  it("empty CMS arrays do NOT override the fallback", async () => {
    fetchMock.mockResolvedValue({
      hours: [],
      phones: [],
      socials: [],
    });

    const settings = await getSiteSettings();

    // The invariant: no hours anywhere unless a real value exists.
    expect(settings.hours).toEqual([]);
    expect(settings.hours).toHaveLength(0);
    // Empty CMS arrays must not blank out real fallback data either.
    expect(settings.phones).toEqual(FALLBACK_SITE.phones);
    expect(settings.socials).toEqual(FALLBACK_SITE.socials);
  });

  it("a populated CMS hours array DOES override the fallback", async () => {
    const hours = [
      { day: "Monday", open: "10:00", close: "18:00", closed: false },
      { day: "Sunday", closed: true },
    ];
    fetchMock.mockResolvedValue({ hours });

    const settings = await getSiteSettings();

    expect(settings.hours).toEqual(hours);
  });

  it("a populated CMS phones array DOES override the fallback", async () => {
    const phones = [
      { label: "New Desk", number: "0313 3694904", whatsapp: true },
    ];
    fetchMock.mockResolvedValue({ phones });

    const settings = await getSiteSettings();

    expect(settings.phones).toEqual(phones);
  });
});
