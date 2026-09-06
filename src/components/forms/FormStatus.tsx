"use client";

import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { telHref } from "@/lib/phone";

export type FormStatusState = "idle" | "submitting" | "success" | "error";

export const SUCCESS_COPY =
  "Thank you — F.F Real Estate will contact you shortly. You can also reach us now on WhatsApp.";

interface FormStatusProps {
  state: FormStatusState;
  /** WhatsApp number for the success / error continuation button. */
  whatsappPhone?: string;
  /** Prefilled WhatsApp text, composed from whatever the visitor entered. */
  whatsappMessage?: string;
  /** Optional call-us fallback shown alongside WhatsApp on the error panel. */
  callNumber?: string;
  /** Overrides the default error copy (e.g. a server `_form` message). */
  errorMessage?: string;
}

/**
 * Always-mounted, `aria-live` status region for the inquiry forms. Renders
 * nothing while idle, a quiet "Sending…" while submitting, and a panel with a
 * WhatsApp continuation on both success and error so the visitor is never
 * left without a way to reach us.
 */
export function FormStatus({
  state,
  whatsappPhone,
  whatsappMessage,
  callNumber,
  errorMessage,
}: FormStatusProps) {
  return (
    <div aria-live="polite" role="status" className="mt-4">
      {state === "submitting" && (
        <p className="font-sans text-sm text-gray-500">Sending…</p>
      )}

      {state === "success" && (
        <div className="rounded-[6px] border border-gray-200 bg-paper p-5">
          <h3 className="font-display text-lg leading-snug text-ink">
            Thank you
          </h3>
          <p className="mt-2 font-sans text-sm leading-relaxed text-gray-500">
            {SUCCESS_COPY}
          </p>
          {whatsappPhone && (
            <div className="mt-4">
              <WhatsAppButton
                phone={whatsappPhone}
                message={whatsappMessage}
                className="w-full"
              >
                Continue on WhatsApp
              </WhatsAppButton>
            </div>
          )}
        </div>
      )}

      {state === "error" && (
        <div className="rounded-[6px] border border-[#B23B3B] bg-paper p-5">
          <p className="font-sans text-sm leading-relaxed text-ink">
            {errorMessage ||
              "Something went wrong. Please try WhatsApp or call us."}
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {whatsappPhone && (
              <WhatsAppButton
                phone={whatsappPhone}
                message={whatsappMessage}
                className="w-full"
              >
                Message us on WhatsApp
              </WhatsAppButton>
            )}
            {callNumber && (
              <Button
                as="a"
                href={telHref(callNumber)}
                variant="outline"
                className="w-full"
              >
                Call us
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
