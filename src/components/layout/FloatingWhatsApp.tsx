import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";

interface FloatingWhatsAppProps {
  href: string;
}

/**
 * Persistent circular WhatsApp affordance, bottom-right. Sits above the mobile
 * action bar on small screens. The idle ring pulse is `motion-safe` only.
 */
export function FloatingWhatsApp({ href }: FloatingWhatsAppProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with F.F Real Estate on WhatsApp"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-ivory shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory md:bottom-6 md:right-6"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-gold/40 motion-safe:animate-pulse"
      />
      <WhatsAppGlyph className="relative h-6 w-6" />
    </a>
  );
}
