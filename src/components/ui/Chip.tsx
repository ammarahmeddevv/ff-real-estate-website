import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const BASE =
  "inline-flex items-center rounded-full px-3.5 py-1.5 font-sans text-xs font-medium tracking-[0.03em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

function classesFor(active: boolean | undefined, className: string | undefined) {
  return [
    BASE,
    active
      ? "border border-gold bg-gold/5 text-ink"
      : "border border-gray-200 text-gray-500 hover:border-gold/60 hover:text-ink",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Small pill for filters and tags. Gold outline when `active`. */
export function Chip({ children, active, href, onClick, className }: ChipProps) {
  if (href) {
    return (
      <a
        href={href}
        aria-current={active ? "page" : undefined}
        className={classesFor(active, className)}
      >
        {children}
      </a>
    );
  }
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={classesFor(active, className)}
      >
        {children}
      </button>
    );
  }
  return <span className={classesFor(active, className)}>{children}</span>;
}
