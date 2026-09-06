import type { ReactNode } from "react";

interface MicroLabelProps {
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "div";
}

/** Uppercase gold micro-eyebrow used above section headings and in small print. */
export function MicroLabel({ children, className, as: Tag = "span" }: MicroLabelProps) {
  return (
    <Tag className={["u-micro-label", className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
