import Link from "next/link";
import { FALLBACK_SITE } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Page not found",
  description: "The page you were looking for could not be found.",
};

const NOT_FOUND_WHATSAPP_MESSAGE =
  "Hello F.F Real Estate, I couldn't find a page on your site and would like some help.";

/**
 * Top-level 404. Renders inside the bare root layout (the nav/footer live in
 * the `(site)` route group), so it carries its own minimal chrome.
 */
export default function NotFound() {
  const whatsappHref = buildWhatsAppLink({
    phone: FALLBACK_SITE.primaryWhatsapp,
    message: NOT_FOUND_WHATSAPP_MESSAGE,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 py-20 text-ink">
      <div className="w-full max-w-lg text-center">
        <Link
          href="/"
          aria-label="F.F Real Estate — home"
          className="mx-auto flex w-fit items-center gap-3 text-ink transition-colors hover:text-gold-deep"
        >
          <Logo className="h-10 w-10" />
          <span className="font-display text-lg">F.F Real Estate</span>
        </Link>

        <p className="u-micro-label mt-14">Error 404</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          Page not found.
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-gray-500">
          The page you were looking for has moved or never existed. Head back to
          the homepage, browse current properties, or message us on WhatsApp and
          we&rsquo;ll point you the right way.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button as="a" href="/" variant="solid">
            Back to home
          </Button>
          <Button as="a" href="/properties" variant="outline">
            Browse properties
          </Button>
          <Button
            as="a"
            href={whatsappHref}
            variant="ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            Message on WhatsApp
          </Button>
        </div>
      </div>
    </main>
  );
}
