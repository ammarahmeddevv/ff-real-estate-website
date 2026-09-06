import { FALLBACK_SITE } from "@/lib/site";
import { sanityFetch } from "./fetch";
import { SITE_SETTINGS_QUERY } from "./queries";
import type { SiteSettings, SiteSettingsDocument } from "./types";

function isNonEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

/** Shallow-merge only the CMS keys that carry a usable value over the base. */
function mergePreferring<T extends object>(
  base: T,
  override: Partial<T> | null | undefined,
): T {
  if (!override) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(
    override as Record<string, unknown>,
  )) {
    if (isNonEmpty(value)) out[key] = value;
  }
  return out as T;
}

/**
 * Returns fully-populated site settings: the CMS `siteSettings` document
 * (when present) merged over `FALLBACK_SITE`. Never throws and never returns
 * null/undefined fields, so layout and pages can render pre-seed.
 *
 * `hero` and `address` are merged one level deep so a partially-filled CMS
 * object still inherits the missing sub-fields from the fallback.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const cms = await sanityFetch<SiteSettingsDocument | null>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
    fallback: null,
  });

  if (!cms) return FALLBACK_SITE;

  return {
    ...mergePreferring(FALLBACK_SITE, cms as Partial<SiteSettings>),
    name: FALLBACK_SITE.name,
    hero: mergePreferring(FALLBACK_SITE.hero, cms.hero ?? undefined),
    address: mergePreferring(FALLBACK_SITE.address, cms.address ?? undefined),
  };
}
