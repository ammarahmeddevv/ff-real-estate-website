import Link from "next/link";
import type { Service } from "@/lib/sanity/types";
import { FALLBACK_SERVICES } from "@/lib/services";
import { Container } from "@/components/layout/Container";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { Reveal } from "@/components/motion/Reveal";

interface ServicesStripProps {
  services: Service[];
}

/**
 * Editorial list of what F.F Real Estate does, on ivory. Uses CMS services when
 * present, otherwise the six confirmed fallbacks. Every item links to
 * `/services`. A gold hairline at the top marks the seam from the section above.
 */
export function ServicesStrip({ services }: ServicesStripProps) {
  const source = services.length > 0 ? services : FALLBACK_SERVICES;
  const items = source.map((service) => ({
    title: service.title,
    summary: service.summary?.trim() ?? "",
  }));

  return (
    <section className="border-t border-gold/30 bg-ivory pb-20 pt-24 text-ink md:pb-28 md:pt-32">
      <Container>
        <Reveal>
          <MicroLabel as="p">What We Do</MicroLabel>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight md:text-4xl">
            Property services, handled by one team
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 md:mt-16">
          <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.title}>
                <Link
                  href="/services"
                  className="group block border-t border-gold/40 pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
                >
                  <h3 className="font-display text-xl leading-snug text-ink">
                    {item.title}
                  </h3>
                  {item.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">
                      {item.summary}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors group-hover:text-gold-deep">
                    Learn more <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12} className="mt-12">
          {/* Standalone "→" navigation link: underline appears on hover.
              In-sentence links (see contact page) keep the underline at rest. */}
          <Link
            href="/services"
            className="inline-flex items-center gap-1 font-sans text-sm text-ink underline decoration-transparent decoration-1 underline-offset-4 transition-colors hover:decoration-gold"
          >
            All services <span aria-hidden="true">&rarr;</span>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
