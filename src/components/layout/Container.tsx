import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Centered page-width wrapper with the standard gutters. */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={["mx-auto w-full max-w-content px-5 md:px-8", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
