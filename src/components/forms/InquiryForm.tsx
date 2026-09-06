"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { GENERAL_ENQUIRY_MESSAGE } from "@/lib/whatsapp";
import { FormStatus, type FormStatusState } from "./FormStatus";
import { submitLead } from "./submitLead";

interface InquiryFormProps {
  /** Where the lead came from, e.g. `"contact"` or `` `property:${slug}` ``. */
  source: string;
  relatedPropertyId?: string;
  /** Drops the Email + Preferred-contact fields for tight sidebar placements. */
  compact?: boolean;
  whatsappNumber?: string;
  whatsappMessage?: string;
  /** Phone shown as a "Call us" fallback on the error panel. */
  callNumber?: string;
  onDone?: () => void;
}

interface Fields {
  name: string;
  phone: string;
  email: string;
  preferredContact: string;
  message: string;
}

const EMPTY: Fields = {
  name: "",
  phone: "",
  email: "",
  preferredContact: "",
  message: "",
};

function composeWhatsAppMessage(fields: Fields, fallback: string): string {
  const lines = ["Hello F.F Real Estate,"];
  if (fields.name.trim()) lines.push(`Name: ${fields.name.trim()}`);
  if (fields.phone.trim()) lines.push(`Phone: ${fields.phone.trim()}`);
  if (fields.message.trim()) lines.push("", fields.message.trim());
  return lines.length > 1 ? lines.join("\n") : fallback;
}

/**
 * The shared inquiry form. Submits through `/api/lead` and always leaves the
 * visitor a way through: on success and on error the status panel offers a
 * WhatsApp continuation built from what they typed.
 */
export function InquiryForm({
  source,
  relatedPropertyId,
  compact = false,
  whatsappNumber,
  whatsappMessage,
  callNumber,
  onDone,
}: InquiryFormProps) {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [state, setState] = useState<FormStatusState>("idle");
  const [formError, setFormError] = useState<string | undefined>();
  const startedAt = useRef<number>(Date.now());
  const websiteRef = useRef<HTMLInputElement>(null);

  const set =
    (key: keyof Fields) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  function validate(): boolean {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (fields.name.trim().length < 2)
      next.name = "Please enter your name.";
    const phone = fields.phone.trim();
    if (!phone) next.phone = "Please enter a phone number.";
    else if (phone.replace(/[^\d]/g, "").length < 7)
      next.phone = "Please enter a valid phone number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;
    if (!validate()) return;

    setState("submitting");
    setFormError(undefined);

    const result = await submitLead({
      name: fields.name,
      phone: fields.phone,
      email: compact ? undefined : fields.email,
      preferredContact: compact ? undefined : fields.preferredContact,
      message: fields.message,
      relatedPropertyId,
      source,
      website: websiteRef.current?.value ?? "",
      startedAt: startedAt.current,
    });

    if (result.ok) {
      setErrors({});
      setState("success");
      onDone?.();
      return;
    }

    if (result.kind === "validation") {
      setErrors(result.errors as Partial<Record<keyof Fields, string>>);
      setState("idle");
      return;
    }

    setFormError(result.message);
    setState("error");
  }

  const waMessage = composeWhatsAppMessage(
    fields,
    whatsappMessage || GENERAL_ENQUIRY_MESSAGE,
  );
  const submitting = state === "submitting";
  const done = state === "success";

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="space-y-4" hidden={done}>
        <Field
          label="Name"
          name="name"
          autoComplete="name"
          required
          value={fields.name}
          onChange={set("name")}
          error={errors.name}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          value={fields.phone}
          onChange={set("phone")}
          error={errors.phone}
        />

        {!compact && (
          <>
            <Field
              label="Email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={fields.email}
              onChange={set("email")}
              error={errors.email}
            />
            <Field
              as="select"
              label="Preferred contact method"
              name="preferredContact"
              value={fields.preferredContact}
              onChange={set("preferredContact")}
            >
              <option value="">No preference</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
            </Field>
          </>
        )}

        <Field
          as="textarea"
          label="Message"
          name="message"
          rows={compact ? 3 : 4}
          value={fields.message}
          onChange={set("message")}
          error={errors.message}
        />
      </div>

      {/* Honeypot — visually hidden, never shown to real users. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="inquiry-website">Website</label>
        <input
          ref={websiteRef}
          id="inquiry-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="mt-5" hidden={done}>
        <Button
          as="button"
          type="submit"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Sending…" : "Send inquiry"}
        </Button>
      </div>

      <FormStatus
        state={state}
        whatsappPhone={whatsappNumber}
        whatsappMessage={waMessage}
        callNumber={callNumber}
        errorMessage={formError}
      />
    </form>
  );
}
