"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import type { NavLink } from "./links";

interface PhoneRow {
  label: string;
  number: string;
}

interface NavShellProps {
  links: NavLink[];
  phones: PhoneRow[];
  whatsappHref: string;
  callHref: string;
}

function isActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Client nav chrome. A 24px sentinel at the top of the document is watched
 * with an `IntersectionObserver`; once it scrolls out of view the header
 * compacts and gains a hairline border + blurred background.
 */
export function NavShell({ links, phones, whatsappHref, callHref }: NavShellProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-6 w-px"
      />
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 bg-ivory transition-[padding] duration-300",
          scrolled ? "border-b border-gray-200 py-2" : "py-4",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-content items-center justify-between px-5 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 text-ink"
            aria-label="F.F Real Estate — home"
          >
            <Logo className="h-9 w-9 shrink-0" />
            <span className="leading-none">
              <span className="block font-display text-lg tracking-tight">
                F.F Real Estate
              </span>
              <span className="u-micro-label mt-1 block">
                Builder &amp; Developers
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
            {links.map((link) => {
              const active = isActive(link.href, pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "font-sans text-sm tracking-[0.01em] transition-colors",
                    active ? "text-ink" : "text-gray-500 hover:text-ink",
                  ].join(" ")}
                >
                  <span className="relative inline-block py-1">
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={[
                        "absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300",
                        active ? "w-full" : "w-0",
                      ].join(" ")}
                    />
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <Button
              as="a"
              href={whatsappHref}
              variant="solid"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap"
            >
              WhatsApp Us
            </Button>
            <Button
              as="a"
              href={callHref}
              variant="outline"
              className="whitespace-nowrap"
            >
              Call Now
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-gray-200 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory xl:hidden"
          >
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
              <path d="M0 1h18M0 6h18M0 11h18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        links={links}
        phones={phones}
        whatsappHref={whatsappHref}
        activeHref={pathname}
      />
    </>
  );
}
