import { getSiteSettings, hasNews } from "@/lib/sanity";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { telHref } from "@/lib/phone";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { MobileActionBar } from "@/components/layout/MobileActionBar";

const LAYOUT_WHATSAPP_MESSAGE =
  "Hello F.F Real Estate, I would like to enquire about a property.";

/**
 * Chrome shared by every public page. The `/studio` route lives outside this
 * route group, so the Sanity Studio never renders the nav, footer or CTAs.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, showNews] = await Promise.all([
    getSiteSettings(),
    hasNews(),
  ]);
  const whatsappHref = buildWhatsAppLink({
    phone: settings.primaryWhatsapp,
    message: LAYOUT_WHATSAPP_MESSAGE,
  });
  const callHref = telHref(
    settings.phones[0]?.number ?? settings.primaryWhatsapp,
  );

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-[6px] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-ivory"
      >
        Skip to content
      </a>
      <Nav settings={settings} showNews={showNews} />
      <main id="content" className="min-h-[60vh] pb-16 pt-20 md:pb-0">
        {children}
      </main>
      <Footer settings={settings} showNews={showNews} />
      <FloatingWhatsApp href={whatsappHref} />
      <MobileActionBar whatsappHref={whatsappHref} callHref={callHref} />
    </>
  );
}
