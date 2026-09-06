import type { HoursRow, SiteAddress } from "@/lib/sanity/types";
import { Container } from "@/components/layout/Container";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { LazyMap } from "@/components/layout/LazyMap";

interface LocationBlockProps {
  address: SiteAddress;
  hours: HoursRow[];
}

/**
 * The office address set as a typographic element, with a directions button.
 * No embedded map here — a lazy-loaded map arrives in Task 14.
 */
export function LocationBlock({ address, hours }: LocationBlockProps) {
  const cityLine = [address.city, address.postalCode]
    .filter(Boolean)
    .join(" ");
  const fullAddress = [
    address.line1,
    address.area,
    address.city,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
  const mapsUrl =
    address.mapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      fullAddress,
    )}`;

  return (
    <section className="border-t border-gold/30 bg-ivory pb-20 pt-24 text-ink md:pb-28 md:pt-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="sr-only">Visit F.F Real Estate</h2>
            <MicroLabel as="p">Visit Us</MicroLabel>
            <p className="mt-5 font-display text-3xl leading-tight md:text-4xl">
              {address.line1 && (
                <span className="block">{address.line1}</span>
              )}
              {address.area && <span className="block">{address.area}</span>}
              {cityLine && <span className="block">{cityLine}</span>}
            </p>
          </Reveal>

          <Reveal delay={0.08} className="lg:pt-10">
            <p className="max-w-md text-base leading-relaxed text-ink/70">
              Near Taal Stop, F.B Area &mdash; Dastagir Society.
            </p>

            <LazyMap
              query={fullAddress}
              title="F.F Real Estate office"
              className="mt-6"
            />

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
        </div>
      </Container>
    </section>
  );
}
