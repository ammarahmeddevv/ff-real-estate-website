"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { telHref } from "@/lib/phone";
import type { NavLink } from "./links";

interface PhoneRow {
  label: string;
  number: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  phones: PhoneRow[];
  whatsappHref: string;
  activeHref?: string;
}

const FOCUSABLE = 'a[href], button:not([disabled]):not([tabindex="-1"])';

function isActive(href: string, activeHref: string | undefined): boolean {
  if (!activeHref) return false;
  return href === "/" ? activeHref === "/" : activeHref.startsWith(href);
}

/** Below this width the menu panel is rendered; at or above it the desktop nav
 * takes over (`NavShell` switches at Tailwind's `xl` = 1280px). */
const DESKTOP_NAV_QUERY = "(min-width: 1280px)";

/**
 * Full-height slide-in menu for `< xl`. Focus-trapped while open, closes on
 * `Esc` or backdrop click, locks background scroll, and pins a WhatsApp CTA
 * at the bottom.
 */
export function MobileMenu({
  open,
  onClose,
  links,
  phones,
  whatsappHref,
  activeHref,
}: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    // Defence in depth: the panel is only mounted below `xl` (the `xl:hidden`
    // wrapper). If this effect ever runs at desktop width, do NOT lock scroll —
    // there is no visible panel or close control there, so the page would be
    // stuck. `matchMedia` is absent in some test envs; the `?.` handles that.
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.(DESKTOP_NAV_QUERY).matches
    ) {
      return;
    }

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);

    focusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  return (
    <div
      className={[
        "fixed inset-0 z-[60] xl:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close menu"
        onClick={onClose}
        className={[
          "absolute inset-0 h-full w-full cursor-default bg-ink/45 motion-safe:transition-opacity motion-safe:duration-300",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open || undefined}
        className={[
          "absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <span className="flex items-center gap-2 text-ink">
            <Logo className="h-8 w-8" />
            <span className="font-display text-base">F.F Real Estate</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-gray-200 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-6" aria-label="Primary">
          <ul>
            {links.map((link) => {
              const active = isActive(link.href, activeHref);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "block border-b border-gray-200/70 py-3 font-display text-xl transition-colors",
                      active ? "text-gold-deep" : "text-ink hover:text-gold-deep",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 space-y-4">
            <p className="u-micro-label">Call us</p>
            {phones.map((phone) => (
              <a
                key={phone.number}
                href={telHref(phone.number)}
                className="block"
              >
                <span className="text-xs text-gray-500">{phone.label}</span>
                <span className="mt-0.5 block font-display text-lg text-ink">
                  {phone.number}
                </span>
              </a>
            ))}
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <Button
            as="a"
            href={whatsappHref}
            variant="solid"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            WhatsApp Us
          </Button>
        </div>
      </div>
    </div>
  );
}
