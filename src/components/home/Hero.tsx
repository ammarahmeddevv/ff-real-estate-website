import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { Reveal } from "@/components/motion/Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/sanity/types";
import { HeroElevation } from "./HeroElevation";
import { HeroInquiryPanel } from "./HeroInquiryPanel";

const HERO_WHATSAPP_MESSAGE =
  "Hello F.F Real Estate, I'd like to ask about a property.";

interface HeroProps {
  settings: SiteSettings;
}

/**
 * Full-width ink hero. No photography: the signature is a gold-hairline
 * architectural elevation bleeding off the right edge (behind the type on
 * mobile), with a left-aligned editorial headline and a floating inquiry card.
 */
export function Hero({ settings }: HeroProps) {
  const { hero } = settings;
  const whatsappHref = buildWhatsAppLink({
    phone: settings.primaryWhatsapp,
    message: HERO_WHATSAPP_MESSAGE,
  });

  return (
    <section className="relative isolate overflow-hidden bg-ink text-ivory">
      <HeroElevation className="pointer-events-none absolute -top-16 right-[-7%] hidden h-[128%] w-[52%] text-gold opacity-[0.16] md:block lg:right-[-4%] lg:w-[56%] lg:opacity-[0.18]" />

      <Container className="relative">
        <div className="grid min-h-[72vh] items-center gap-12 py-16 md:min-h-[86vh] md:py-24 lg:grid-cols-[1fr_minmax(340px,380px)] lg:items-center lg:gap-14 lg:py-24">
          <div className="max-w-xl">
            <Reveal immediate>
              <MicroLabel className="!text-gold">
                F.B Area &middot; Dastagir &middot; Karachi
              </MicroLabel>
            </Reveal>

            <Reveal
              immediate
              as="h1"
              delay={0.08}
              className="mt-5 font-display text-4xl leading-[1.05] [text-wrap:balance] md:text-6xl lg:text-7xl"
            >
              {hero.heading}
            </Reveal>

            <Reveal immediate delay={0.16} className="mt-6">
              <span className="block h-px w-16 bg-gold" />
            </Reveal>

            <Reveal
              immediate
              as="p"
              delay={0.24}
              className="mt-6 max-w-xl text-base text-ivory/75 md:text-lg"
            >
              {hero.subheading}
            </Reveal>

            <Reveal
              immediate
              delay={0.32}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <Button
                as="a"
                href="/properties"
                tone="dark"
                variant="solid"
                className="w-full sm:w-auto"
              >
                Explore Properties
              </Button>
              <Button
                as="a"
                href="/contact"
                tone="dark"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Talk to an Agent
              </Button>
            </Reveal>

            <Reveal immediate delay={0.4}>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm text-ivory/70 underline-offset-4 transition-colors hover:text-gold hover:underline"
              >
                <WhatsAppGlyph className="h-4 w-4" />
                Get property details on WhatsApp
              </a>
            </Reveal>
          </div>

          <div className="lg:ml-auto lg:w-full">
            <HeroInquiryPanel phone={settings.primaryWhatsapp} />
          </div>
        </div>
      </Container>
    </section>
  );
}
