import { Button } from "@/components/ui/Button";

interface MobileActionBarProps {
  whatsappHref: string;
  callHref: string;
}

/**
 * Fixed bottom bar on `< md`: two equal-width CTAs. Page content in the root
 * layout reserves matching bottom padding so nothing hides behind it.
 */
export function MobileActionBar({ whatsappHref, callHref }: MobileActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-gray-200 bg-ivory pb-[env(safe-area-inset-bottom)] md:hidden">
      <Button
        as="a"
        href={whatsappHref}
        variant="solid"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-none py-3.5"
      >
        WhatsApp
      </Button>
      <Button
        as="a"
        href={callHref}
        variant="outline"
        className="rounded-none border-y-0 border-r-0 border-l border-gold bg-ivory py-3.5"
      >
        Call
      </Button>
    </div>
  );
}
