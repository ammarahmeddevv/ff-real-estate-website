"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export interface LightboxImage {
  url: string;
  alt: string | null;
}

interface LightboxProps {
  images: LightboxImage[];
  startIndex: number;
  open: boolean;
  onClose: () => void;
}

/**
 * Focus-trapped image viewer. Arrow keys and the on-screen controls move
 * between images, `Esc` and a backdrop click close it, body scroll is locked
 * while open and focus returns to the trigger on close. All motion is
 * `motion-safe` only.
 */
export function Lightbox({ images, startIndex, open, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const count = images.length;

  // Re-sync to the requested start image each time the viewer opens.
  useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (count === 0 ? 0 : (i + delta + count) % count));
    },
    [count],
  );

  // Key handling: Esc closes, arrows navigate, Tab is trapped inside the dialog.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusable = root.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, go]);

  // Body scroll lock + focus management.
  useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = overflow;
      cancelAnimationFrame(raf);
      const trigger = triggerRef.current;
      if (trigger instanceof HTMLElement) trigger.focus();
    };
  }, [open]);

  if (!open || count === 0) return null;

  const current = images[Math.min(index, count - 1)];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${count}`}
      ref={dialogRef}
      tabIndex={-1}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[80] flex flex-col bg-ink/95 outline-none backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-4 py-4 text-ivory md:px-6">
        <span className="font-sans text-sm tabular-nums text-ivory/70">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="rounded-[6px] border border-transparent p-2 text-ivory/80 transition-colors hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-6 md:px-16"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="relative h-full w-full max-w-5xl">
          <Image
            key={current.url}
            src={current.url}
            alt={current.alt || `Property image ${index + 1}`}
            fill
            sizes="100vw"
            className="object-contain motion-safe:transition-opacity motion-safe:duration-200"
            priority
          />
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-transparent bg-ink/50 p-3 text-ivory transition-colors hover:bg-ink/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:left-4"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-transparent bg-ink/50 p-3 text-ivory transition-colors hover:bg-ink/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:right-4"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {current.alt ? (
        <p className="px-4 pb-6 text-center font-sans text-sm text-ivory/70 md:px-6">
          {current.alt}
        </p>
      ) : null}
    </div>
  );
}
