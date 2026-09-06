"use client";

import { useEffect, useRef, useState } from "react";

import type { Project, SiteSettings } from "@/lib/sanity/types";
import { telHref } from "@/lib/phone";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { InquiryForm } from "@/components/forms/InquiryForm";

interface ProjectInquiryPanelProps {
  project: Project;
  settings: SiteSettings;
}

const TRIGGER_ID = "project-inquiry-trigger";

/**
 * Conversion moment for a project: WhatsApp-first, with a call and a form
 * fallback. Sticky beside the content on desktop, a full-width block on
 * mobile. Mirrors `<PropertyInquiryPanel>`.
 */
export function ProjectInquiryPanel({
  project,
  settings,
}: ProjectInquiryPanelProps) {
  const [formOpen, setFormOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
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

  const whatsappPhone = settings.primaryWhatsapp;
  const callNumber = settings.phones[0]?.number || settings.primaryWhatsapp;
  const whatsappMessage = `Hello, I would like details about the ${project.name} project.`;
  const formMessage = `Hello, I'm interested in the ${project.name} project.`;

  return (
    <aside className="rounded-[8px] border border-gray-200 bg-paper p-6 lg:sticky lg:top-24">
      <h2 className="font-display text-xl leading-snug text-ink">
        Interested in this project?
      </h2>
      <p className="mt-2 font-sans text-sm leading-relaxed text-gray-500">
        Message us on WhatsApp for the fastest reply, or ask us to call you
        back.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <WhatsAppButton
          phone={whatsappPhone}
          message={whatsappMessage}
          className="w-full"
        >
          WhatsApp about this project
        </WhatsAppButton>

        <Button
          as="a"
          href={telHref(callNumber)}
          variant="outline"
          className="w-full"
        >
          Call us
        </Button>

        <Button
          id={TRIGGER_ID}
          as="button"
          type="button"
          variant="ghost"
          className="w-full justify-center"
          aria-expanded={formOpen}
          aria-controls="project-inquiry-form"
          onClick={() => setFormOpen((open) => !open)}
        >
          {formOpen ? "Hide form" : "Request information"}
        </Button>
      </div>

      {formOpen && (
        <div
          id="project-inquiry-form"
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
              source={`project:${project.slug}`}
              compact
              callNumber={callNumber}
              whatsappNumber={whatsappPhone}
              whatsappMessage={formMessage}
            />
          </div>
        </div>
      )}
    </aside>
  );
}
