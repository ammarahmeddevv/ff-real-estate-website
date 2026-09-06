import { getSiteSettings } from "@/lib/sanity";
import { buildMetadata } from "@/lib/metadata";
import { GENERAL_ENQUIRY_MESSAGE } from "@/lib/whatsapp";
import { telHref } from "@/lib/phone";
import { Container } from "@/components/layout/Container";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { LazyMap } from "@/components/layout/LazyMap";
import { InquiryForm } from "@/components/forms/InquiryForm";

export const revalidate = 60;

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook page",
  facebook_group: "Facebook group",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  other: "Facebook",
};

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact F.F Real Estate in F.B Area, Dastagir Society, Karachi. Message us on WhatsApp, call Syed Mustafa Rehman or Mohammad Salman, email, or send an enquiry. Office at R-37, Block 15, near Taal Stop.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const { address, phones, email, socials, hours } = settings;

  const fullAddress = [
    address.line1,
    address.area,
    address.city,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
  const cityLine = [address.city, address.postalCode].filter(Boolean).join(" ");
  const mapsUrl =
    address.mapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      fullAddress,
    )}`;
  const facebook = socials.find((s) => s.platform === "facebook") ?? socials[0];

  return (
    <>
      <section className="bg-ivory pb-14 pt-16 text-ink md:pb-20 md:pt-24">
        <Container>
          <Reveal className="max-w-3xl">
            <MicroLabel as="p">Contact</MicroLabel>
            <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
              Contact F.F Real Estate
            </h1>
            <p className="mt-6 font-sans text-lg leading-relaxed text-ink/80 md:text-xl md:leading-relaxed">
              The fastest way to reach us is WhatsApp. You can also call, email
              or drop into the office in F.B Area, Dastagir Society.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* WhatsApp-first contact actions, one card per person */}
      <section className="border-t border-gold/30 bg-ink py-16 text-ivory md:py-24">
        <Container>
          <Reveal>
            <h2 className="font-display text-2xl leading-snug md:text-3xl">
              Message or call us directly
            </h2>
            <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-ivory/70">
              You deal directly with Syed Mustafa Rehman and Mohammad Salman
              from the first message through to handover.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {phones.map((phone, i) => (
              <Reveal
                key={phone.number}
                delay={0.05 * (i + 1)}
                className="flex flex-col rounded-[10px] border border-white/10 bg-ink-soft p-6"
              >
                <p className="font-display text-xl text-ivory">{phone.label}</p>
                <p className="mt-1 font-sans text-sm tabular-nums text-ivory/60">
                  {phone.number}
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {phone.whatsapp && (
                    <WhatsAppButton
                      phone={phone.number}
                      message={GENERAL_ENQUIRY_MESSAGE}
                      tone="dark"
                      variant="solid"
                      className="w-full"
                    >
                      WhatsApp {phone.label}
                    </WhatsAppButton>
                  )}
                  <Button
                    as="a"
                    href={telHref(phone.number)}
                    tone="dark"
                    variant="outline"
                    className="w-full"
                  >
                    Call {phone.label}
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-8">
            <p className="font-sans text-sm text-ivory/70">
              Prefer email?{" "}
              <a
                href={`mailto:${email}`}
                className="text-gold underline decoration-1 underline-offset-4 transition-colors hover:text-ivory"
              >
                {email}
              </a>
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Office address + lazy-loaded map */}
      <section className="border-t border-gold/30 bg-ivory py-16 text-ink md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <MicroLabel as="p">Visit the office</MicroLabel>
              <p className="mt-5 font-display text-3xl leading-tight md:text-4xl">
                {address.line1 && <span className="block">{address.line1}</span>}
                {address.area && <span className="block">{address.area}</span>}
                {cityLine && <span className="block">{cityLine}</span>}
              </p>
              <div className="mt-6">
                <Button
                  as="a"
                  href={mapsUrl}
                  variant="outline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions
                </Button>
              </div>

              {hours.length > 0 && (
                <dl className="mt-8 space-y-1.5 text-sm text-gray-500">
                  {hours.map((row) => (
                    <div key={row.day} className="flex gap-4">
                      <dt className="w-28 shrink-0">{row.day}</dt>
                      <dd>
                        {row.closed
                          ? "Closed"
                          : `${row.open ?? ""} – ${row.close ?? ""}`}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </Reveal>

            <Reveal delay={0.08}>
              <LazyMap query={fullAddress} title="F.F Real Estate office" />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Inquiry form */}
      <section className="border-t border-gold/30 bg-paper py-16 text-ink md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
            <Reveal>
              <MicroLabel as="p">Send an enquiry</MicroLabel>
              <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
                Tell us what you&rsquo;re looking for
              </h2>
              <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-gray-500">
                Share a few details and we&rsquo;ll get back to you by your
                preferred method. You can continue the conversation on WhatsApp
                straight after sending.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="rounded-[10px] border border-gray-200 bg-paper p-6 md:p-8">
              <InquiryForm
                source="contact"
                callNumber={phones[0]?.number}
                whatsappNumber={settings.primaryWhatsapp}
                whatsappMessage={GENERAL_ENQUIRY_MESSAGE}
              />
            </Reveal>
          </div>

          {facebook && (
            <p className="mt-12 font-sans text-sm text-gray-500">
              Also on Facebook:{" "}
              <a
                href={facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-deep underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
              >
                {SOCIAL_LABELS[facebook.platform] ?? "Facebook"}
              </a>
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
