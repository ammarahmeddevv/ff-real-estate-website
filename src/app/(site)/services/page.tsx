import { SERVICES_QUERY, getSiteSettings, sanityFetch } from "@/lib/sanity";
import type { Service } from "@/lib/sanity/types";
import { buildMetadata } from "@/lib/metadata";
import { FALLBACK_SERVICES } from "@/lib/services";
import { Container } from "@/components/layout/Container";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const revalidate = 60;

const SERVICES_WHATSAPP_MESSAGE =
  "Hello F.F Real Estate, I'd like to speak with someone about a property.";

export const metadata = buildMetadata({
  title: "Our Services",
  description:
    "Property buying, selling, renting, renovation, documentation and consultation in Karachi — handled by one F.F Real Estate team from first enquiry to handover.",
  path: "/services",
});

export default async function ServicesPage() {
  const [settings, cmsServices] = await Promise.all([
    getSiteSettings(),
    sanityFetch<Service[]>({
      query: SERVICES_QUERY,
      tags: ["service"],
      fallback: [],
    }),
  ]);

  const services = cmsServices.length > 0 ? cmsServices : FALLBACK_SERVICES;

  return (
    <>
      <section className="bg-ivory pb-14 pt-16 text-ink md:pb-20 md:pt-24">
        <Container>
          <Reveal className="max-w-3xl">
            <MicroLabel as="p">What We Do</MicroLabel>
            <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
              Our Services
            </h1>
            <p className="mt-6 font-sans text-lg leading-relaxed text-ink/80">
              Buying, selling, renting, renovation and property documentation,
              handled by one team. If you would rather talk things through
              first, a property consultation is a straightforward place to
              start.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-gold/30 bg-ivory pb-8 pt-4 text-ink md:pb-12">
        <Container>
          <div className="divide-y divide-gold/25">
            {services.map((service, i) => {
              const bullets = (service.whatYouGet ?? []).filter(
                (b): b is string => Boolean(b && b.trim()),
              );
              return (
                <Reveal
                  key={service._id ?? service.slug ?? service.title}
                  delay={Math.min(i * 0.03, 0.12)}
                >
                  <div className="grid gap-6 py-12 md:grid-cols-[1fr_1.5fr] md:gap-16 md:py-16">
                    <div>
                      <h2 className="font-display text-2xl leading-snug md:text-[1.7rem]">
                        {service.title}
                      </h2>
                      {service.summary?.trim() && (
                        <p className="mt-3 max-w-md font-sans text-base leading-relaxed text-ink/70">
                          {service.summary.trim()}
                        </p>
                      )}
                    </div>

                    <div>
                      {bullets.length > 0 && (
                        <>
                          <p className="u-micro-label">What you get</p>
                          <ul className="mt-4 space-y-2.5">
                            {bullets.map((bullet) => (
                              <li
                                key={bullet}
                                className="flex gap-2.5 font-sans text-base leading-relaxed text-ink"
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                                />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      <div className="mt-6">
                        <WhatsAppButton
                          phone={settings.primaryWhatsapp}
                          message={`Hello F.F Real Estate, I'd like to ask about your ${service.title} service.`}
                          variant="outline"
                        >
                          Discuss on WhatsApp
                        </WhatsAppButton>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-ink py-20 text-ivory md:py-28">
        <Container>
          <Reveal className="max-w-3xl">
            <span aria-hidden="true" className="block h-px w-12 bg-gold" />
            <h2 className="mt-6 font-display text-3xl leading-tight md:text-4xl">
              Not sure which service you need?
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-ivory/75">
              Tell us what you are trying to do and we will point you to the
              right starting point &mdash; no obligation either way.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <WhatsAppButton
                phone={settings.primaryWhatsapp}
                message={SERVICES_WHATSAPP_MESSAGE}
                tone="dark"
                variant="solid"
                className="w-full px-7 py-3 text-base sm:w-auto"
              >
                Message on WhatsApp
              </WhatsAppButton>
              <Button as="a" href="/contact" tone="dark" variant="ghost">
                Contact us
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
