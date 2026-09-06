import { buildWhatsAppLink } from "@/lib/whatsapp";
import { telHref } from "@/lib/phone";
import type { SiteSettings } from "@/lib/sanity";
import { NAV_LINKS, type NavLink } from "./links";
import { NavShell } from "./NavShell";

const NAV_WHATSAPP_MESSAGE =
  "Hello F.F Real Estate, I would like to enquire about a property.";

/** "News" sits before "Contact" when there is at least one published post. */
function navLinks(showNews: boolean): NavLink[] {
  if (!showNews) return NAV_LINKS;
  const contactIndex = NAV_LINKS.findIndex((link) => link.href === "/contact");
  const at = contactIndex === -1 ? NAV_LINKS.length : contactIndex;
  return [
    ...NAV_LINKS.slice(0, at),
    { label: "News", href: "/news" },
    ...NAV_LINKS.slice(at),
  ];
}

/** Server wrapper: derives contact links from settings, renders the client shell. */
export function Nav({
  settings,
  showNews = false,
}: {
  settings: SiteSettings;
  showNews?: boolean;
}) {
  const whatsappHref = buildWhatsAppLink({
    phone: settings.primaryWhatsapp,
    message: NAV_WHATSAPP_MESSAGE,
  });
  const phones = settings.phones.map((phone) => ({
    label: phone.label,
    number: phone.number,
  }));
  const callHref = telHref(
    settings.phones[0]?.number ?? settings.primaryWhatsapp,
  );

  return (
    <NavShell
      links={navLinks(showNews)}
      phones={phones}
      whatsappHref={whatsappHref}
      callHref={callHref}
    />
  );
}
