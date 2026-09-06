"use client";

import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * SSR-safe reduced-motion hook (no animation library).
 *
 * Returns `true` on the server and on the first client render, so the first
 * paint is always the final, motionless state (no hydration flash of hidden
 * content). After mount it reflects the real `prefers-reduced-motion` value and
 * stays in sync if the user changes the OS setting.
 */
export function useReducedMotionSafe(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    setReduced(mql.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
