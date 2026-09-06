import type { Property, SiteSettings } from "@/lib/sanity/types";
import { propertyWhatsAppMessage } from "@/lib/whatsapp";
import { telHref } from "@/lib/phone";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

interface PropertyInquiryPanelProps {
  property: Property;
  settings: SiteSettings;
}

/**
 * The in-content conversion moment: WhatsApp-first, with a call and a
 * form fallback. Sticky beside the content on desktop, a full-width block
 * on mobile (the global mobile bar still covers scroll-anywhere contact).
 */
export function PropertyInquiryPanel({
  property,
  settings,
}: PropertyInquiryPanelProps) {
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

        {/* Task 11: <InquiryForm relatedProperty={property._id} source={`property:${property.slug}`} /> */}
        <Button as="a" href="/contact" variant="ghost" className="w-full justify-center">
          Request information
        </Button>
      </div>

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
