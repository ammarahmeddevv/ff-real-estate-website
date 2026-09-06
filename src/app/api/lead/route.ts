import { after } from "next/server";

import { createLead, isSpam, parseLead } from "@/lib/leads";
import { sendLeadEmail } from "@/lib/email";
import type { LeadInput } from "@/lib/leads";

export const runtime = "nodejs";

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Send the lead-notification email after the response is flushed.
 *
 * `after()` (stable in Next 15.5) keeps the serverless instance alive until the
 * SMTP round-trip finishes — a bare `void sendLeadEmail(...)` can be frozen by
 * Vercel the moment the response is sent, dropping the notification.
 */
function notify(data: LeadInput): void {
  after(() =>
    sendLeadEmail(data).catch((error) => {
      console.error("[lead] email notification threw:", error);
    }),
  );
}

/**
 * The single entry point for every inquiry form on the site.
 *
 * Status matrix:
 * - bad JSON / validation failure → 400 `{ ok:false, errors }`
 * - detected spam                 → 200 `{ ok:true }` (silent: no write, no email)
 * - persisted                     → 202 `{ ok:true }` (email queued via `after`)
 * - CMS not configured            → 202 `{ ok:true }` (logged + email queued)
 * - Sanity write error            → 202 `{ ok:true }` (payload logged + email
 *                                    queued so the lead is still recoverable —
 *                                    never a bare 500 with nothing sent)
 *
 * It must never lose a genuine lead: the email notification fires on every
 * non-spam submission regardless of what happens to the Sanity write.
 */
export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, errors: { _form: "Invalid request" } }, 400);
  }

  const parsed = parseLead(body);
  if (!parsed.ok) {
    return json({ ok: false, errors: parsed.errors }, 400);
  }

  const data = parsed.data;

  if (isSpam(data, Date.now())) {
    return json({ ok: true }, 200);
  }

  const created = await createLead(data);

  // The lead reaches Gmail whatever happens to the DB write — success,
  // Sanity-not-configured, or a genuine write failure — so a real enquiry is
  // never lost.
  notify(data);

  if (created.ok) {
    return json({ ok: true }, 202);
  }

  if (created.reason === "not-configured") {
    console.info(
      "[lead] received (not persisted — Sanity not configured):",
      {
        name: data.name,
        phone: data.phone,
        source: data.source,
        relatedPropertyId: data.relatedPropertyId,
      },
    );
    return json({ ok: true }, 202);
  }

  // created.reason === "error": bad token, revoked permissions, or a Sanity
  // outage. The email above still goes out; log the full payload every time
  // (no one-shot flag) so a sustained outage stays visible and the lead can be
  // re-entered by hand. 202 (accepted, not fully persisted) — not 500 — keeps
  // the "never lose a lead" contract: the visitor still has the WhatsApp/Call
  // panel and the notification fired.
  console.error(
    "[lead] Sanity write failed, payload:",
    JSON.stringify(data),
  );
  return json({ ok: true }, 202);
}
