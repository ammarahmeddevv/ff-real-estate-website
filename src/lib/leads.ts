import { z } from "zod";

import { apiVersion, dataset, projectId, sanityConfigured } from "@/sanity/env";

/**
 * Lead capture — validation, spam heuristics and the (optional) Sanity write.
 *
 * Every inquiry form on the site submits through `/api/lead`, which leans on
 * this module. It must degrade gracefully: with no CMS token and no email
 * configured the API still returns success so a real visitor is never blocked
 * or loses their message (the route logs it and fires the WhatsApp fallback).
 */

const PREFERRED_CONTACT = ["whatsapp", "call", "email"] as const;
const PURPOSE = ["buy", "rent", "sell", "consult", "other"] as const;

/** Blank strings arrive from optional inputs — treat them as "not provided". */
const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

/** Optional free-text field with a hard upper bound (defence against abuse). */
const optionalText = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().max(max).optional());

export const leadSchema = z.object({
  name: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : v),
    z
      .string()
      .min(2, "Please enter your name.")
      .max(100, "Please shorten your name."),
  ),
  phone: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : v),
    z
      .string()
      .min(7, "Please enter a valid phone number.")
      .max(32, "Please enter a valid phone number.")
      .regex(/^[\d\s+()-]+$/, "Please enter a valid phone number."),
  ),
  email: z.preprocess(
    emptyToUndefined,
    z
      .email("Please enter a valid email address.")
      .max(254, "Please enter a valid email address.")
      .optional(),
  ),
  preferredContact: z.preprocess(
    emptyToUndefined,
    z.enum(PREFERRED_CONTACT).optional(),
  ),
  purpose: z.preprocess(emptyToUndefined, z.enum(PURPOSE).optional()),
  propertyInterest: optionalText(200),
  budget: optionalText(200),
  message: optionalText(4000),
  /**
   * Internal hidden field. Must look like a Sanity document id before it is
   * written into a `_ref`. A bad value is dropped silently (`.catch`) rather
   * than 400'd — it should never cost a real visitor their lead.
   */
  relatedPropertyId: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .max(128)
      .regex(/^[A-Za-z0-9._-]+$/)
      .optional()
      .catch(undefined),
  ),
  source: z.preprocess(
    emptyToUndefined,
    z.string().max(120).default("unknown"),
  ),
  /** Honeypot — real users never see or fill this. */
  website: optionalText(400),
  /** Epoch ms recorded when the form mounted, for the time-to-submit check. */
  startedAt: z.number().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type ParseResult =
  | { ok: true; data: LeadInput }
  | { ok: false; errors: Record<string, string> };

/** Validate an unknown request body. Errors are keyed by field (first issue). */
export function parseLead(input: unknown): ParseResult {
  const result = leadSchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = typeof issue.path[0] === "string" ? issue.path[0] : "_form";
    if (!(key in errors)) errors[key] = issue.message;
  }
  return { ok: false, errors };
}

/**
 * True only when the honeypot `website` field is filled — a real visitor never
 * sees it, so a non-empty value is an unambiguous bot signal.
 *
 * `startedAt` / `submittedAtMs` stay plumbed for future heuristics, but elapsed
 * time alone must NEVER classify a submission as spam: browser autofill and
 * password managers routinely submit a genuine form in well under two seconds,
 * and a spam classification silently drops the lead (fake 200, no write, no
 * email, no log). The project's overriding rule is to never lose a real lead.
 */
export function isSpam(
  data: LeadInput,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  submittedAtMs: number,
): boolean {
  return typeof data.website === "string" && data.website.trim() !== "";
}

export type CreateLeadResult =
  | { ok: true; id: string }
  | { ok: false; reason: "not-configured" | "error" };

/**
 * Persist the lead as a `lead` document in Sanity. Returns `not-configured`
 * (not a throw) when there is no write token or no project — the caller then
 * falls back to email + a server log. `@sanity/client` is imported lazily so
 * unit tests never need the token.
 */
export async function createLead(data: LeadInput): Promise<CreateLeadResult> {
  if (!process.env.SANITY_API_WRITE_TOKEN || !sanityConfigured) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const { createClient } = await import("@sanity/client");
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
    });

    const doc: Record<string, unknown> = {
      _type: "lead",
      name: data.name,
      phone: data.phone,
      source: data.source,
      status: "new",
      submittedAt: new Date().toISOString(),
    };
    if (data.email) doc.email = data.email;
    if (data.preferredContact) doc.preferredContact = data.preferredContact;
    if (data.purpose) doc.purpose = data.purpose;
    if (data.propertyInterest) doc.propertyInterest = data.propertyInterest;
    if (data.budget) doc.budget = data.budget;
    if (data.message) doc.message = data.message;
    if (data.relatedPropertyId) {
      doc.relatedProperty = {
        _type: "reference",
        _ref: data.relatedPropertyId,
      };
    }

    const created = await client.create(doc as { _type: string });
    return { ok: true, id: created._id };
  } catch (error) {
    // Log every failure — a sustained outage must not go silent after the
    // first hit. The route also logs the full payload on this branch.
    console.error("[lead] Sanity write failed:", error);
    return { ok: false, reason: "error" };
  }
}
