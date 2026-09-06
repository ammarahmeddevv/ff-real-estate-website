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
    <div className="bg-ivory">
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-y-2 py-4 text-center font-sans text-sm tracking-wide text-gray-500">
          {items.map((item, i) => (
            <li key={item} className="flex items-center">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="mx-4 h-3 w-px bg-gold/40"
                />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
