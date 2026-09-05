"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
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
 * The transition is driven by plain React state + a CSS transition (not a
 * rAF-based animation library), so it still resolves when the tab is
 * backgrounded at load or the IntersectionObserver is suspended. A ~600ms mount
 * failsafe force-shows anything at or above the fold that has not revealed yet,
 * so hero/above-the-fold content is NEVER left permanently invisible. Content
 * genuinely below the fold is untouched by the failsafe and still reveals on
 * scroll.
 *
 * Under `prefers-reduced-motion` it renders a plain element — visible
 * immediately, no opacity/transform, no listeners.
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
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [armed, setArmed] = useState(false);
  const [failsafe, setFailsafe] = useState(false);

  useEffect(() => {
    // Arm the enter transition one tick after mount so `immediate` content
    // transitions from the hidden state rather than snapping in.
    const arm = setTimeout(() => setArmed(true), 30);
    // Hard guarantee: anything at/above the fold is shown even if neither the
    // mount arm nor the observer ever fires (suspended tab, lost callback).
    const guard = setTimeout(() => {
      const el = ref.current;
      if (!el || el.getBoundingClientRect().top < window.innerHeight) {
        setFailsafe(true);
      }
    }, 600);
    return () => {
      clearTimeout(arm);
      clearTimeout(guard);
    };
  }, []);

  const Tag = as;

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const visible = failsafe || (armed && (immediate || inView));

  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : `translateY(${y}px)`,
    transition: `opacity 500ms ease ${delay}s, transform 500ms ease ${delay}s`,
  };

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
