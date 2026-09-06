import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sanity";
import { Container } from "@/components/layout/Container";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const revalidate = 60;

const ABOUT_WHATSAPP_MESSAGE =
  "Hello F.F Real Estate, I'd like to speak with someone about a property.";

export function generateMetadata(): Metadata {
  return {
    title: "About Us",
    description:
      "F.F Real Estate Builder & Developers is a Karachi property service — buying, selling, renting, renovation and documentation, handled by one team in F.B Area and Dastagir Society.",
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className="bg-ivory pb-16 pt-16 text-ink md:pb-24 md:pt-24">
        <Container>
          <Reveal className="max-w-3xl">
            <MicroLabel as="p">About</MicroLabel>
            <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
              Real Estate, Handled Professionally.
            </h1>
            <p className="mt-6 font-sans text-lg leading-relaxed text-ink/80 md:text-xl md:leading-relaxed">
              F.F Real Estate Builder &amp; Developers is a Karachi property
              service. We help people buy, sell and rent homes, plots and
              commercial space, and we take care of renovation and property
              documentation &mdash; all handled by one team.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-gold/30 bg-ivory py-16 text-ink md:py-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_1.55fr] md:gap-16">
            <Reveal>
              <h2 className="font-display text-2xl leading-snug md:text-3xl">
                What F.F does
              </h2>
            </Reveal>
            <Reveal delay={0.05} className="max-w-2xl space-y-5">
              <p className="font-sans text-base leading-relaxed text-ink/80">
                Whether you are looking for a place to live, an investment, or a
                buyer for a property you already own, we work through it with you
                step by step. Buying, selling, renting, renovation and
                documentation are all handled in-house, so there is a single
                point of contact from your first enquiry to handover.
              </p>
              <p className="font-sans text-base leading-relaxed text-ink/80">
                We also offer property consultation &mdash; a straightforward
                sit-down to talk through your options, timing and budget before
                you commit to anything.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-gold/30 bg-ivory py-16 text-ink md:py-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_1.55fr] md:gap-16">
            <Reveal>
              <h2 className="font-display text-2xl leading-snug md:text-3xl">
                Where we work
              </h2>
            </Reveal>
            <Reveal delay={0.05} className="max-w-2xl space-y-5">
              <p className="font-sans text-base leading-relaxed text-ink/80">
                Our office is at R-37, Block 15, near Taal Stop in F.B Area,
                Dastagir Society, Karachi. We work day to day across F.B Area,
                Dastagir Society, Scheme 33 and Scheme 45, so we know these
                streets, buildings and price expectations first-hand.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-ink py-20 text-ivory md:py-28">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_1.55fr] md:gap-16">
            <Reveal>
              <h2 className="font-display text-2xl leading-snug md:text-3xl">
                How you&rsquo;ll deal with us
              </h2>
            </Reveal>
            <Reveal delay={0.05} className="max-w-2xl space-y-5">
              <p className="font-sans text-base leading-relaxed text-ivory/75">
                You deal directly with Syed Mustafa Rehman and Mohammad Salman.
                The same people who take your first call stay involved through
                viewings, negotiation, paperwork and handover &mdash; you are not
                passed around.
              </p>
              <p className="font-sans text-base leading-relaxed text-ivory/75">
                We explain each option plainly and let you decide at your own
                pace, without pressure or inflated promises. If something is not
                the right fit, we will say so.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-ink py-20 text-ivory md:py-28">
        <Container>
          <Reveal className="max-w-3xl">
            <span aria-hidden="true" className="block h-px w-12 bg-gold" />
            <h2 className="mt-6 font-display text-3xl leading-tight md:text-4xl">
              Talk to F.F Real Estate about your next move.
            </h2>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <WhatsAppButton
                phone={settings.primaryWhatsapp}
                message={ABOUT_WHATSAPP_MESSAGE}
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
