interface LogoProps {
  className?: string;
  title?: string;
}

/**
 * Hand-built "FF" monogram: two geometric "F" forms sharing a central stem
 * inside a thin ring, single flat weight. Uses `currentColor` throughout —
 * ink-on-ivory in the nav, gold-on-ink in the footer.
 */
export function Logo({
  className,
  title = "F.F Real Estate Builder & Developers",
}: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.25" />
      <g fill="currentColor">
        {/* left F */}
        <rect x="15" y="15" width="2.6" height="18" />
        <rect x="15" y="15" width="9.4" height="2.6" />
        <rect x="15" y="22.7" width="7.2" height="2.6" />
        {/* right F, sharing the central stem */}
        <rect x="23.4" y="15" width="2.6" height="18" />
        <rect x="23.4" y="15" width="9.4" height="2.6" />
        <rect x="23.4" y="22.7" width="7.2" height="2.6" />
      </g>
    </svg>
  );
}
