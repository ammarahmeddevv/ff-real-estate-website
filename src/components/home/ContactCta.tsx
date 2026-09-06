import type { PhoneRow } from "@/lib/sanity/types";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { telHref } from "@/lib/phone";
import { GENERAL_ENQUIRY_MESSAGE } from "@/lib/whatsapp";

interface ContactCtaProps {
  phone: string;
  phones: PhoneRow[];
}

/**
 * Full-width ink band that closes the page. The WhatsApp option is the loudest
 * element; Call and Contact sit quietly beside it. A short gold rule marks the
 * end of the page before the footer.
 */
export function ContactCta({ phone, phones }: ContactCtaProps) {
  const firstPhone = phones[0]?.number;

  return (
    <section className="border-b border-white/10 bg-ink py-24 text-ivory md:py-32">
      <Container>
        <Reveal className="max-w-3xl">
          <span aria-hidden="true" className="block h-px w-12 bg-gold" />
          <h2 className="mt-6 font-display text-3xl leading-tight md:text-5xl">
            Talk to F.F Real Estate about your next move.
          </h2>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <WhatsAppButton
              phone={phone}
              message={GENERAL_ENQUIRY_MESSAGE}
              tone="dark"
              variant="solid"
              className="w-full px-7 py-3 text-base sm:w-auto"
            >
              Message on WhatsApp
            </WhatsAppButton>

            {firstPhone && (
              <Button
                as="a"
                href={telHref(firstPhone)}
                tone="dark"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Call {firstPhone}
              </Button>
            )}

            <Button as="a" href="/contact" tone="dark" variant="ghost">
              Contact us
            </Button>
          </div>
        </Reveal>

        <div
          aria-hidden="true"
          className="mt-20 h-px w-24 bg-gold/50 md:mt-24"
        />
      </Container>
    </section>
  );
}
