import { Fragment } from "react";
import { Container } from "@/components/layout/Container";

interface TrustBarProps {
  items: string[];
}

/**
 * One restrained row directly under the hero. Plain phrases separated by thin
 * gold dividers — no numbers, no stat tiles, no icons.
 */
export function TrustBar({ items }: TrustBarProps) {
  if (items.length === 0) return null;

  return (
    <div className="border-b border-gray-200 bg-ivory">
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-4 text-center font-sans text-sm tracking-wide text-gray-500">
          {items.map((item, i) => (
            <Fragment key={item}>
              {i > 0 && (
                <li aria-hidden="true" className="h-3 w-px bg-gold/40" />
              )}
              <li>{item}</li>
            </Fragment>
          ))}
        </ul>
      </Container>
    </div>
  );
}
