"use client";

import { useEffect, useRef, useState } from "react";

import type { Property, SiteSettings } from "@/lib/sanity/types";
import { propertyWhatsAppMessage } from "@/lib/whatsapp";
import { telHref } from "@/lib/phone";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { InquiryForm } from "@/components/forms/InquiryForm";

interface PropertyInquiryPanelProps {
  property: Property;
  settings: SiteSettings;
}

const TRIGGER_ID = "property-inquiry-trigger";

/**
 * The in-content conversion moment: WhatsApp-first, with a call and a
 * form fallback. Sticky beside the content on desktop, a full-width block
 * on mobile (the global mobile bar still covers scroll-anywhere contact).
 */
export function PropertyInquiryPanel({
  property,
  settings,
}: PropertyInquiryPanelProps) {
  const [formOpen, setFormOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  // Skip the focus move on first render; only react to user toggles.
  const mounted = useRef(false);

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
      document.getElementById(TRIGGER_ID)?.focus();
    }
  }, [formOpen]);

  const agent = property.agent ?? null;
  const whatsappPhone = agent?.whatsapp?.trim() || settings.primaryWhatsapp;
  const callNumber =
    agent?.phone?.trim() ||
    settings.phones[0]?.number ||
    settings.primaryWhatsapp;
  const message = propertyWhatsAppMessage(property.title, property.location);

  return (
    <aside className="rounded-[8px] border border-gray-200 bg-paper p-6 lg:sticky lg:top-24">
      <h2 className="font-display text-xl leading-snug text-ink">
        Interested in this property?
      </h2>
      <p className="mt-2 font-sans text-sm leading-relaxed text-gray-500">
        Message us on WhatsApp for the fastest reply, or ask us to call you
        back.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <WhatsAppButton
          phone={whatsappPhone}
          message={message}
          className="w-full"
        >
          WhatsApp about this property
        </WhatsAppButton>

        <Button as="a" href={telHref(callNumber)} variant="outline" className="w-full">
          {agent ? "Call agent" : "Call us"}
        </Button>

        <Button
          id={TRIGGER_ID}
          as="button"
          type="button"
          variant="ghost"
          className="w-full justify-center"
          aria-expanded={formOpen}
          aria-controls="property-inquiry-form"
          onClick={() => setFormOpen((open) => !open)}
        >
          {formOpen ? "Hide form" : "Request information"}
        </Button>
      </div>

      {formOpen && (
        <div
          id="property-inquiry-form"
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
              source={`property:${property.slug}`}
              relatedPropertyId={property._id}
              whatsappNumber={whatsappPhone}
              whatsappMessage={message}
              callNumber={callNumber}
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
