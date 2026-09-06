export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const rawDataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();

/**
 * True only when a real Sanity project id is configured via env.
 * The read/fetch layer uses this to skip network calls and return
 * fallbacks so `next dev` and `next build` succeed with zero env vars.
 */
export const sanityConfigured = Boolean(rawProjectId);

if (!sanityConfigured && typeof window === "undefined") {
  // Single server-side warning — not per-render spam.
  console.warn(
    "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. " +
      "Using placeholder config; CMS reads will return fallback data. " +
      "Set the env vars (see .env.example) to connect a real project.",
  );
}

// Safe placeholders keep `createClient` and the image builder from throwing
// at import time when no project is configured.
export const projectId = rawProjectId || "placeholder";
export const dataset = rawDataset || "production";
