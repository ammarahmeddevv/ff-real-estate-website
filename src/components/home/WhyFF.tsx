import type { WhyFFItem } from "@/lib/sanity/types";
import { Container } from "@/components/layout/Container";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const WHY_WHATSAPP_MESSAGE =
  "Hello F.F Real Estate, I'd like to speak with someone about a property.";

interface WhyFFProps {
  items: WhyFFItem[];
  phone: string;
}

/**
 * Large editorial trust section on ink — the page's dark centre of gravity. No
 * icon cards, no numbering: each point is a Fraunces line and a short,
 * plain-spoken paragraph. Renders nothing if there is no content.
 */
export function WhyFF({ items, phone }: WhyFFProps) {
  if (items.length === 0) return null;

  return (
    <section className="bg-ink py-24 text-ivory md:py-32">
      <Container>
        <Reveal>
          <MicroLabel as="p" className="!text-gold">
            Why F.F
          </MicroLabel>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight md:text-4xl">
            A calm, straightforward way to handle property
          </h2>
        </Reveal>

        <div className="mt-12 md:mt-16">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={Math.min(i * 0.04, 0.12)}>
              <div className="grid gap-3 border-t border-white/12 py-8 first:border-t-0 md:py-10 lg:grid-cols-[1fr_1.55fr] lg:gap-12">
                <h3 className="font-display text-2xl leading-snug md:text-[1.7rem]">
                  {item.title}
                </h3>
                <p className="max-w-2xl leading-relaxed text-ivory/70">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12">
          <WhatsAppButton
            phone={phone}
            message={WHY_WHATSAPP_MESSAGE}
            variant="outline"
            tone="dark"
          >
            Speak with F.F Real Estate
          </WhatsAppButton>
        </Reveal>
      </Container>
    </section>
  );
}
