import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sanity";
import { Container } from "@/components/layout/Container";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const revalidate = 60;

const WHY_WHATSAPP_MESSAGE =
  "Hello F.F Real Estate, I'd like to speak with someone about a property.";

export function generateMetadata(): Metadata {
  return {
    title: "Why Choose F.F",
    description:
      "Local knowledge in F.B Area and Dastagir, one team for the whole transaction, and direct contact with Syed Mustafa Rehman and Mohammad Salman.",
  };
}

export default async function WhyFFPage() {
  const settings = await getSiteSettings();
  const items = settings.whyFF ?? [];

  return (
    <>
      <section className="bg-ivory pb-14 pt-16 text-ink md:pb-20 md:pt-24">
        <Container>
          <Reveal className="max-w-3xl">
            <MicroLabel as="p">Why F.F</MicroLabel>
            <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
              Why Choose F.F
            </h1>
            <p className="mt-6 font-sans text-lg leading-relaxed text-ink/80">
              A calm, straightforward way to handle property in Karachi &mdash;
              here is what that means in practice.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-ink py-20 text-ivory md:py-28">
        <Container>
          <div>
            {items.map((item, i) => (
              <Reveal key={item.title} delay={Math.min(i * 0.04, 0.12)}>
                <div className="grid gap-3 border-t border-gold/30 py-10 first:border-t-0 md:py-14 lg:grid-cols-[1fr_1.55fr] lg:gap-12">
                  <h2 className="font-display text-2xl leading-snug md:text-3xl">
                    {item.title}
                  </h2>
                  <p className="max-w-2xl font-sans text-base leading-relaxed text-ivory/75 md:text-lg md:leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.08}>
            <div className="mt-16 max-w-3xl border-t border-gold/30 pt-12 md:mt-20">
              <span aria-hidden="true" className="block h-px w-12 bg-gold" />
              <p className="mt-6 font-sans text-base leading-relaxed text-ivory/75 md:text-lg md:leading-relaxed">
                In short: people who know the area, one team handling buying,
                selling, renting, renovation and documentation, and direct
                contact with Syed Mustafa Rehman and Mohammad Salman from the
                first enquiry to handover. The guidance stays plain and the pace
                is yours.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <WhatsAppButton
                  phone={settings.primaryWhatsapp}
                  message={WHY_WHATSAPP_MESSAGE}
                  tone="dark"
                  variant="solid"
                  className="w-full px-7 py-3 text-base sm:w-auto"
                >
                  Speak with F.F Real Estate
                </WhatsAppButton>
                <Button as="a" href="/contact" tone="dark" variant="ghost">
                  Contact us
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
