import type { ReactNode } from "react";
import { Container } from "./Container";
import { MicroLabel } from "@/components/ui/MicroLabel";

type Tone = "light" | "dark" | "ivory";

interface SectionProps {
  id?: string;
  label?: string;
  title?: ReactNode;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}

const TONE: Record<Tone, string> = {
  light: "bg-paper text-ink",
  ivory: "bg-ivory text-ink",
  dark: "bg-ink text-ivory",
};

/**
 * Page section with consistent vertical rhythm and an optional
 * micro-label + serif heading. `tone="dark"` renders on ink.
 */
export function Section({
  id,
  label,
  title,
  tone = "light",
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={["py-20 md:py-28", TONE[tone], className]
        .filter(Boolean)
        .join(" ")}
    >
      <Container>
        {(label || title) && (
          <header className="mb-10 max-w-2xl md:mb-14">
            {label && (
              <MicroLabel
                as="p"
                className={tone === "dark" ? "!text-gold" : undefined}
              >
                {label}
              </MicroLabel>
            )}
            {title && (
              <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
                {title}
              </h2>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
