import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { Reveal } from "@/components/motion/Reveal";

/**
 * A short, personal statement of who F.F Real Estate is — verified facts only,
 * no corporate boilerplate, no invented history or scale claims.
 */
export function AboutTeaser() {
  return (
    <section className="border-t border-gray-200 bg-ivory py-20 text-ink md:py-28">
      <Container>
        <Reveal className="max-w-3xl">
          <MicroLabel as="p">About</MicroLabel>
          <p className="mt-5 font-display text-xl leading-relaxed md:text-2xl md:leading-[1.55]">
            F.F Real Estate is a Karachi property service based in F.B Area,
            Dastagir Society. We help people buy, sell and rent homes and
            commercial space, and we take care of renovation and property
            documentation. Every enquiry is looked after directly by Syed Mustafa
            Rehman and Mohammad Salman.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-1 font-sans text-sm text-gold-deep underline-offset-4 hover:underline"
          >
            More about F.F Real Estate <span aria-hidden="true">&rarr;</span>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
