/**
 * Client helper shared by every inquiry form. Wraps the POST to `/api/lead`
 * and normalises the outcome so a form never has to branch on status codes
 * or throw. A network failure resolves to a friendly `error` result rather
 * than rejecting — the caller then shows the WhatsApp / call fallback.
 */

export type LeadFieldErrors = Record<string, string>;

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; kind: "validation"; errors: LeadFieldErrors }
  | { ok: false; kind: "error"; message: string };

const GENERIC_ERROR =
  "Something went wrong. Please try WhatsApp or call us.";
const NETWORK_ERROR =
  "We couldn't send that just now. Please reach us on WhatsApp or call us.";

export async function submitLead(
  body: Record<string, unknown>,
): Promise<SubmitLeadResult> {
  let res: Response;
  try {
    res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, kind: "error", message: NETWORK_ERROR };
  }

  if (res.ok) return { ok: true };

  if (res.status >= 400 && res.status < 500) {
    let errors: LeadFieldErrors = {};
    try {
      const data = (await res.json()) as { errors?: LeadFieldErrors };
      if (data && typeof data.errors === "object" && data.errors) {
        errors = data.errors;
      }
    } catch {
      /* keep the empty errors object */
    }
    if (errors._form) {
      return { ok: false, kind: "error", message: errors._form };
    }
    if (Object.keys(errors).length > 0) {
      return { ok: false, kind: "validation", errors };
    }
  }

  return { ok: false, kind: "error", message: GENERIC_ERROR };
}
