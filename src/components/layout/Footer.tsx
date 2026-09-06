import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { telHref } from "@/lib/phone";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/sanity";
import { Container } from "./Container";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Insert "News" before "Contact" when there is at least one published post. */
function quickLinks(showNews: boolean) {
  if (!showNews) return QUICK_LINKS;
  const at = QUICK_LINKS.findIndex((link) => link.href === "/contact");
  const index = at === -1 ? QUICK_LINKS.length : at;
  return [
    ...QUICK_LINKS.slice(0, index),
    { label: "News", href: "/news" },
    ...QUICK_LINKS.slice(index),
  ];
}

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook Page",
  facebook_group: "Facebook Group",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  other: "Social",
};

export function Footer({
  settings,
  showNews = false,
}: {
  settings: SiteSettings;
  showNews?: boolean;
}) {
  const { address, phones, email, socials, hours, primaryWhatsapp } = settings;
  const links = quickLinks(showNews);
  const whatsappHref = buildWhatsAppLink({ phone: primaryWhatsapp });
  const year = new Date().getFullYear();
  const fullAddress = [
    address.line1,
    address.area,
    address.city,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <footer className="bg-ink text-ivory">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="flex items-center gap-2 text-gold">
              <Logo className="h-10 w-10" />
              <span className="font-display text-lg text-ivory">
                F.F Real Estate
              </span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">
              Property buying, selling, renting, renovation and documentation in
              F.B Area, Dastagir and across Karachi.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="u-micro-label">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory/75 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="u-micro-label">Contact</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ivory/75">
              {phones.map((phone) => (
                <li key={phone.number}>
                  <a
                    href={telHref(phone.number)}
                    className="transition-colors hover:text-gold"
                  >
                    {phone.label}: {phone.number}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold"
                >
                  WhatsApp us
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="transition-colors hover:text-gold"
                >
                  {email}
                </a>
              </li>
              <li className="pt-1 text-ivory/55">
                {address.mapsUrl ? (
                  <a
                    href={address.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-gold"
                  >
                    {fullAddress}
                  </a>
                ) : (
                  fullAddress
                )}
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 p-6">
            <p className="font-display text-xl text-ivory">
              Talk to us on WhatsApp
            </p>
            <p className="mt-2 text-sm text-ivory/70">
              Quick answers on availability, pricing and viewings.
            </p>
            <Button
              as="a"
              href={whatsappHref}
              tone="dark"
              variant="solid"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 w-full"
            >
              WhatsApp Us
            </Button>
          </div>
        </div>

        {hours.length > 0 && (
          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="u-micro-label">Office hours</p>
            <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm text-ivory/75 sm:grid-cols-2 lg:grid-cols-3">
              {hours.map((row) => (
                <li
                  key={row.day}
                  className="flex justify-between gap-4 border-b border-white/10 pb-1.5"
                >
                  <span>{row.day}</span>
                  <span className="text-ivory/55">
                    {row.closed
                      ? "Closed"
                      : `${row.open ?? ""} – ${row.close ?? ""}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} F.F Real Estate Builder &amp; Developers</p>
          <div className="flex gap-5">
            {socials.map((social) => (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold"
              >
                {SOCIAL_LABELS[social.platform] ?? "Social"}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
