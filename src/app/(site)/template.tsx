"use client";

/**
 * Re-mounts on every route change within the public site, giving each
 * navigation a barely-there opacity fade-in (~180ms, ease-out, no slide).
 * `motion-safe:` gates it, and the global `prefers-reduced-motion` reset
 * neutralises the duration as a second guard.
 */
export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="motion-safe:animate-[u-page-in_180ms_ease-out]">
      {children}
    </div>
  );
}
