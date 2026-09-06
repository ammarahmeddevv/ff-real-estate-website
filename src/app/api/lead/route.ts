import { createLead, isSpam, parseLead } from "@/lib/leads";
import { sendLeadEmail } from "@/lib/email";

export const runtime = "nodejs";

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * The single entry point for every inquiry form on the site.
 *
 * Status matrix:
 * - bad JSON / validation failure → 400 `{ ok:false, errors }`
 * - detected spam                 → 200 `{ ok:true }` (silent: no write, no email)
 * - persisted, or CMS not set up  → 202 `{ ok:true }` (email fired best-effort)
 * - real persistence failure      → 500 `{ ok:false, errors:{ _form } }`
 *
 * It must never lose a genuine lead: when Sanity is not configured the lead is
 * logged server-side and the email notification still runs.
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

  if (created.ok || created.reason === "not-configured") {
    // Fire-and-forget: the notification must never delay or fail the response.
    void Promise.resolve(sendLeadEmail(data)).catch((error) => {
      console.error("[lead] email notification threw:", error);
    });

    if (!created.ok) {
      console.info(
        "[lead] received (not persisted — Sanity not configured):",
        {
          name: data.name,
          phone: data.phone,
          source: data.source,
          relatedPropertyId: data.relatedPropertyId,
        },
      );
    }

    return json({ ok: true }, 202);
  }

  return json(
    {
      ok: false,
      errors: {
        _form: "Something went wrong. Please try WhatsApp or call us.",
      },
    },
    500,
  );
}
