"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useId } from "react";

type Base = {
  label: string;
  error?: string;
  hint?: string;
  /** Options markup — only used when `as="select"`. */
  children?: ReactNode;
};

type InputField = Base &
  Omit<InputHTMLAttributes<HTMLInputElement>, "children"> & { as?: "input" };
type TextareaField = Base &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children"> & {
    as: "textarea";
  };
type SelectField = Base &
  SelectHTMLAttributes<HTMLSelectElement> & { as: "select" };

export type FieldProps = InputField | TextareaField | SelectField;

const CONTROL =
  "mt-1.5 w-full rounded-[4px] border bg-white px-3 py-2 font-sans text-sm text-ink shadow-none transition-colors placeholder:text-gray-500/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 focus-visible:ring-offset-paper";

/**
 * Label + control + error slot, sharing one id so the error is announced.
 * Renders an `<input>` by default, or a `<textarea>` / `<select>` via `as`.
 */
export function Field(props: FieldProps) {
  const { label, error, hint, children, as = "input", ...rest } = props as Base & {
    as?: "input" | "textarea" | "select";
  } & Record<string, unknown>;

  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  const borderClass = error
    ? "border-[#B23B3B]"
    : "border-gray-200 hover:border-gold/60";

  const commonProps = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: [CONTROL, borderClass].join(" "),
    ...(rest as Record<string, unknown>),
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="font-sans text-xs font-medium uppercase tracking-[0.1em] text-gray-500"
      >
        {label}
        {(rest as { required?: boolean }).required && (
          <span aria-hidden="true" className="text-gold-deep">
            {" "}
            *
          </span>
        )}
      </label>

      {as === "textarea" ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <textarea {...(commonProps as any)} />
      ) : as === "select" ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <select {...(commonProps as any)}>{children}</select>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <input {...(commonProps as any)} />
      )}

      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-xs text-[#B23B3B]">
          {error}
        </p>
      )}
    </div>
  );
}
