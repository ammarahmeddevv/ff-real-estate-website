import { buildWhatsAppLink } from "@/lib/whatsapp";
import { telHref } from "@/lib/phone";
import type { SiteSettings } from "@/lib/sanity";
import { NAV_LINKS } from "./links";
import { NavShell } from "./NavShell";

const NAV_WHATSAPP_MESSAGE =
  "Hello F.F Real Estate, I would like to enquire about a property.";

/** Server wrapper: derives contact links from settings, renders the client shell. */
export function Nav({ settings }: { settings: SiteSettings }) {
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
      links={NAV_LINKS}
      phones={phones}
      whatsappHref={whatsappHref}
      callHref={callHref}
    />
  );
}
