"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * SSR-safe wrapper around Framer Motion's `useReducedMotion`.
 *
 * Returns `true` on the server and on the first client render, so the first
 * paint is always the final, motionless state (no hydration flash of hidden
 * content). After mount it reflects the real `prefers-reduced-motion` value.
 */
export function useReducedMotionSafe(): boolean {
  const framerPrefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return true;
  return framerPrefersReduced ?? true;
}
