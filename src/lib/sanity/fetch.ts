import { client } from "./client";
import { sanityConfigured } from "@/sanity/env";

export interface SanityFetchOptions<T> {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  revalidate?: number;
  /**
   * Returned when Sanity is not configured or the request fails.
   * Defaults to `null` — pass `[]` for list queries.
   */
  fallback?: T;
}

// Warn once per process rather than on every render.
let warnedUnconfigured = false;

/**
 * Typed wrapper around `client.fetch` that NEVER throws:
 *
 * - When no real Sanity project is configured, returns `fallback` immediately.
 * - On any network/query error, logs once server-side and returns `fallback`.
 *
 * This keeps pages renderable during local "build then hand over" development
 * with zero Sanity env vars set.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate,
  fallback = null as T,
}: SanityFetchOptions<T>): Promise<T> {
  if (!sanityConfigured) {
    if (!warnedUnconfigured) {
      warnedUnconfigured = true;
      console.warn(
        "[sanity] sanityFetch called with no project configured — returning fallback data.",
      );
    }
    return fallback;
  }

  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate: revalidate ?? 60, tags },
    });
  } catch (error) {
    console.error("[sanity] fetch failed, returning fallback:", error);
    return fallback;
  }
}
