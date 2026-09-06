"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

interface RevealProps {
  children: ReactNode;
  /** Element/tag to render as. Default `"div"`. */
  as?: ElementType;
  /** Transition delay in seconds (used for load/scroll staggers). Default `0`. */
  delay?: number;
  /** Initial vertical offset in pixels. Default `16`. */
  y?: number;
  className?: string;
  /**
   * Reveal on mount instead of on viewport entry — for above-the-fold content
   * (e.g. the hero) so the load stagger always plays. `delay` still applies.
   */
  immediate?: boolean;
}

/**
 * Fades and rises its children in — on mount when `immediate`, otherwise on
 * first viewport entry.
 *
 * The reveal is driven by plain React state + a CSS transition (no rAF-based
 * animation library) and a **native `IntersectionObserver`**, so it resolves
 * even when the tab is backgrounded at load. Because
 * `useReducedMotionSafe()` returns `true` for the first render, the observed
 * element only mounts its `ref` on the second render; the observer effect
 * therefore keys off `reduceMotion` so it (re)runs once the ref is attached.
 *
 * Safety nets: an at-mount visibility check shows anything already on screen,
 * and a ~1.2s failsafe shows anything still at/above the fold. Genuinely
 * below-the-fold content is untouched by both and still reveals on scroll.
 *
 * Under `prefers-reduced-motion` it renders a plain element — visible
 * immediately, no opacity/transform, no listeners.
 *
 * The wrapper always carries a `data-reveal` attribute. The global
 * `<noscript>` style in `app/layout.tsx` targets it to force
 * `opacity:1; transform:none` when client JS never runs.
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 16,
  className,
  immediate = false,
}: RevealProps) {
  const reduceMotion = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion || visible) return;

    if (immediate) {
      const t = setTimeout(() => setVisible(true), 30);
      return () => clearTimeout(t);
    }

    const el = ref.current;
    if (!el) return;

    const withinFold = (ratio: number) => {
      const rect = el.getBoundingClientRect();
      // No lower bound: anything at OR ABOVE the fold should already be shown.
      // (Requiring `rect.bottom > 0` stranded any element scrolled above the
      // viewport on mount — e.g. after a reload that restores scroll position —
      // at opacity 0 forever, since it never intersects again on the way down.)
      return rect.top < window.innerHeight * ratio;
    };

    // Already on screen when the observer is wired up (above-the-fold, fast
    // loads, or a re-render after the ref attaches).
    if (withinFold(0.92)) {
      setVisible(true);
      return;
    }

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setVisible(true);
            observer?.disconnect();
          }
        },
        // Wide top margin so fast wheel scrolls and native smooth-scroll jumps
        // (`html { scroll-behavior: smooth }`) still trip the observer even when
        // the element transits between IntersectionObserver sampling frames.
        { rootMargin: "400px 0px -10% 0px" },
      );
      observer.observe(el);
    } else {
      setVisible(true);
      return;
    }

    // Never leave at/above-the-fold content hidden if the observer callback is
    // delayed or dropped (suspended tab, etc.).
    const guard = setTimeout(() => {
      if (withinFold(1)) setVisible(true);
    }, 1200);

    return () => {
      observer?.disconnect();
      clearTimeout(guard);
    };
  }, [reduceMotion, immediate, visible]);

  const Tag = as;

  if (reduceMotion) {
    return (
      <Tag data-reveal className={className}>
        {children}
      </Tag>
    );
  }

  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : `translateY(${y}px)`,
    transition: `opacity 500ms ease ${delay}s, transform 500ms ease ${delay}s`,
  };

  return (
    <Tag ref={ref} data-reveal className={className} style={style}>
      {children}
    </Tag>
  );
}
