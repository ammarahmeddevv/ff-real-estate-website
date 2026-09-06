import type { LeadInput } from "./leads";

/**
 * Fire-and-forget lead notification to the F.F Real Estate inbox.
 *
 * With no Gmail credentials configured it logs once and resolves — a build
 * and a local `next dev` run with zero env vars. It NEVER throws to the
 * caller: any transport failure is caught and logged so a lead is still
 * acknowledged to the visitor.
 */

let loggedNotConfigured = false;

const FIELD_LABELS: Array<[keyof LeadInput, string]> = [
  ["name", "Name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["preferredContact", "Preferred contact"],
  ["purpose", "Purpose"],
  ["propertyInterest", "Property interest"],
  ["budget", "Budget"],
  ["message", "Message"],
  ["relatedPropertyId", "Related property ID"],
  ["source", "Source"],
];

function buildBody(data: LeadInput): string {
  const lines = ["A new inquiry was submitted on the F.F Real Estate website.", ""];
  for (const [key, label] of FIELD_LABELS) {
    const value = data[key];
    if (value !== undefined && value !== null && `${value}`.trim() !== "") {
      lines.push(`${label}: ${value}`);
    }
  }
  return lines.join("\n");
}

export async function sendLeadEmail(data: LeadInput): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    if (!loggedNotConfigured) {
      loggedNotConfigured = true;
      console.info(
        "[lead] email not configured (GMAIL_USER / GMAIL_APP_PASSWORD) — skipping notification.",
      );
    }
    return;
  }

  try {
    const nodemailer = (await import("nodemailer")).default;
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transport.sendMail({
      to: process.env.LEAD_NOTIFICATION_EMAIL || user,
      from: user,
      subject: `New website lead — ${data.name}`,
      text: buildBody(data),
    });
  } catch (error) {
    console.error("[lead] email notification failed:", error);
  }
}
