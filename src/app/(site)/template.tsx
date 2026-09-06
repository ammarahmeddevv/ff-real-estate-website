"use client";

import { useEffect, useState } from "react";

/**
 * Re-mounts on every route change within the public site, giving each
 * navigation a barely-there opacity fade-in (~180ms, ease-out, no slide).
 * `motion-safe:` gates it, and the global `prefers-reduced-motion` reset
 * neutralises the duration as a second guard.
 *
 * The fade is skipped on first page load (to avoid delaying first paint)
 * and only applied on client-side navigations.
 */

let hasMountedOnce = false;

export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (hasMountedOnce) {
      setAnimate(true);
    } else {
      hasMountedOnce = true;
    }
  }, []);

  return (
    <div
      className={
        animate ? "motion-safe:animate-[u-page-in_180ms_ease-out]" : undefined
      }
    >
      {children}
    </div>
  );
}
