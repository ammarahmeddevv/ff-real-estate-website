"use client";

import type { ElementType, ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

interface RevealProps {
  children: ReactNode;
  /** Element/tag to render as. Default `"div"`. */
  as?: ElementType;
  /** Animation delay in seconds. Default `0`. */
  delay?: number;
  /** Initial vertical offset in pixels. Default `16`. */
  y?: number;
  className?: string;
}

/**
 * Fades and rises its children in on first viewport entry.
 *
 * When reduced motion is preferred, renders a plain element with no motion
 * props and no inline `opacity: 0` — children are visible immediately. The
 * global `prefers-reduced-motion` CSS reset is the second line of defence.
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 16,
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotionSafe();

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const motionTags = motion as unknown as Record<string, ElementType>;
  const MotionTag =
    (typeof as === "string" && motionTags[as]) || motionTags.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </MotionTag>
  );
}
