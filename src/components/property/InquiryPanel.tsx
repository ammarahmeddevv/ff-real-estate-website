"use client";

import { useEffect, useRef, useState } from "react";

import { telHref } from "@/lib/phone";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { InquiryForm } from "@/components/forms/InquiryForm";

interface InquiryPanelProps {
  /** WhatsApp number for the primary button and the form's WhatsApp fallback. */
  whatsappNumber: string;
  /** Prefilled WhatsApp message (also the form's fallback message). */
  whatsappMessage: string;
  /** Label on the primary WhatsApp button. */
  whatsappCta?: string;
  /** Phone for the "Call" button and the form's error-panel fallback. */
  callNumber?: string;
  /** Lead source, e.g. `property:<slug>` / `project:<slug>`. */
  inquirySource: string;
  relatedPropertyId?: string;
  /** Property-only contact block; when present the call button reads "Call agent". */
  agent?: { name: string; role?: string | null } | null;
  heading?: string;
  /** Overrides the derived `id` used for `aria-controls` / focus. */
  formId?: string;
}

/**
 * The in-content conversion moment: WhatsApp-first, with a call and a form
 * fallback. Sticky beside the content on desktop, a full-width block on mobile.
 * Shared by the property and project detail pages.
 */
export function InquiryPanel({
  whatsappNumber,
  whatsappMessage,
  whatsappCta = "WhatsApp us",
  callNumber,
  inquirySource,
  relatedPropertyId,
  agent = null,
  heading = "Interested in this?",
  formId,
}: InquiryPanelProps) {
  const [formOpen, setFormOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  // Skip the focus move on first render; only react to user toggles.
  const mounted = useRef(false);

  const kind = inquirySource.split(":")[0] || "inquiry";
  const triggerId = `${kind}-inquiry-trigger`;
  const resolvedFormId = formId ?? `${kind}-inquiry-form`;

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (formOpen) {
      const firstField = formRef.current?.querySelector<HTMLElement>(
        "input, textarea, select",
      );
      (firstField ?? formRef.current)?.focus();
    } else {
      document.getElementById(triggerId)?.focus();
    }
  }, [formOpen, triggerId]);

  const callTarget = callNumber?.trim() || whatsappNumber;

  return (
    <aside className="rounded-[8px] border border-gray-200 bg-paper p-6 lg:sticky lg:top-24">
      <h2 className="font-display text-xl leading-snug text-ink">{heading}</h2>
      <p className="mt-2 font-sans text-sm leading-relaxed text-gray-500">
        Message us on WhatsApp for the fastest reply, or ask us to call you
        back.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <WhatsAppButton
          phone={whatsappNumber}
          message={whatsappMessage}
          className="w-full"
        >
          {whatsappCta}
        </WhatsAppButton>

        <Button
          as="a"
          href={telHref(callTarget)}
          variant="outline"
          className="w-full"
        >
          {agent ? "Call agent" : "Call us"}
        </Button>

        <Button
          id={triggerId}
          as="button"
          type="button"
          variant="ghost"
          className="w-full justify-center"
          aria-expanded={formOpen}
          aria-controls={resolvedFormId}
          onClick={() => setFormOpen((open) => !open)}
        >
          {formOpen ? "Hide form" : "Request information"}
        </Button>
      </div>

      {formOpen && (
        <div
          id={resolvedFormId}
          ref={formRef}
          tabIndex={-1}
          className="mt-6 border-t border-gray-200 pt-5 focus:outline-none"
        >
          <p className="u-micro-label">Request information</p>
          <p className="mt-1.5 font-sans text-sm leading-relaxed text-gray-500">
            Leave your details and we&rsquo;ll get back to you.
          </p>
          <div className="mt-4">
            <InquiryForm
              source={inquirySource}
              relatedPropertyId={relatedPropertyId}
              whatsappNumber={whatsappNumber}
              whatsappMessage={whatsappMessage}
              callNumber={callTarget}
              compact
            />
          </div>
        </div>
      )}

      {agent && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="u-micro-label">Your contact</p>
          <p className="mt-1.5 font-sans text-sm text-ink">
            {agent.name}
            {agent.role ? (
              <span className="text-gray-500"> — {agent.role}</span>
            ) : null}
          </p>
        </div>
      )}
    </aside>
  );
}
