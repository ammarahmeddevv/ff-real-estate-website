interface LogoProps {
  className?: string;
  title?: string;
}

/**
 * Hand-built "FF" monogram: two mirrored serif "F" forms inside a thin ring.
 * Uses `currentColor` throughout — ink-on-ivory in the nav, gold-on-ink in
 * the footer.
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
      <circle cx="24" cy="24" r="21.25" stroke="currentColor" strokeWidth="1.1" />
      <g fill="currentColor">
        <path d="M15 14h7v2.6h-4v5.6h3v2.6h-3V34h-3z" />
        <path d="M33 14h-7v2.6h4v5.6h-3v2.6h3V34h3z" />
      </g>
    </svg>
  );
}
