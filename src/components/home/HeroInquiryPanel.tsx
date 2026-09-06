"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { FormStatus, type FormStatusState } from "@/components/forms/FormStatus";
import { submitLead } from "@/components/forms/submitLead";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface HeroInquiryPanelProps {
  /** E.164 WhatsApp number, e.g. `923133694904`. */
  phone: string;
  /** Phone shown as a "Call us" fallback on the error panel. */
  callNumber?: string;
}

type Purpose = "buy" | "rent" | "sell";

interface FormState {
  name: string;
  phone: string;
  propertyInterest: string;
  budget: string;
  purpose: Purpose;
  message: string;
}

const EMPTY: FormState = {
  name: "",
  phone: "",
  propertyInterest: "",
  budget: "",
  purpose: "buy",
  message: "",
};

const PURPOSE_LABEL: Record<Purpose, string> = {
  buy: "Buy",
  rent: "Rent",
  sell: "Sell",
};

function composeWhatsAppMessage(form: FormState): string {
  const lines = ["Hello F.F Real Estate,"];
  if (form.name) lines.push(`Name: ${form.name}`);
  if (form.propertyInterest) lines.push(`Looking for: ${form.propertyInterest}`);
  if (form.budget) lines.push(`Budget: ${form.budget}`);
  lines.push(`Purpose: ${PURPOSE_LABEL[form.purpose]}`);
  if (form.message) lines.push("", form.message);
  if (lines.length <= 3) lines.push("I'd like to ask about a property.");
  return lines.join("\n");
}

export function HeroInquiryPanel({ phone, callNumber }: HeroInquiryPanelProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [state, setState] = useState<FormStatusState>("idle");
  const [formError, setFormError] = useState<string | undefined>();
  const startedAt = useRef<number>(Date.now());
  const websiteRef = useRef<HTMLInputElement>(null);

  const set =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    const digits = form.phone.replace(/[^\d]/g, "");
    if (!form.phone.trim()) next.phone = "Please enter a phone number.";
    else if (digits.length < 7)
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
      name: form.name,
      phone: form.phone,
      propertyInterest: form.propertyInterest,
      budget: form.budget,
      purpose: form.purpose,
      message: form.message,
      source: "hero",
      website: websiteRef.current?.value ?? "",
      startedAt: startedAt.current,
    });

    if (result.ok) {
      setErrors({});
      setState("success");
      return;
    }
    if (result.kind === "validation") {
      setErrors(result.errors as Partial<Record<keyof FormState, string>>);
      setState("idle");
      return;
    }
    setFormError(result.message);
    setState("error");
  }

  const whatsappHref = buildWhatsAppLink({
    phone,
    message: composeWhatsAppMessage(form),
  });
  const submitting = state === "submitting";

  return (
    <div
      className="rounded-[8px] border border-gray-200 bg-paper p-6 text-ink shadow-[0_18px_40px_-24px_rgba(17,17,19,0.45)] sm:p-7"
    >
      {state !== "success" && (
        <form onSubmit={onSubmit} noValidate>
          <h2 className="font-display text-xl leading-snug">
            Looking for a Property?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Tell us what you need. We reply on WhatsApp or by phone.
          </p>

          <div className="mt-5 space-y-4">
            <Field
              label="Name"
              name="name"
              autoComplete="name"
              required
              value={form.name}
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
              value={form.phone}
              onChange={set("phone")}
              error={errors.phone}
            />
            <Field
              label="Property Interest"
              name="propertyInterest"
              placeholder="e.g. 2nd floor portion, F.B Area"
              value={form.propertyInterest}
              onChange={set("propertyInterest")}
            />
            <Field
              label="Budget"
              name="budget"
              placeholder="e.g. PKR 2.5 Crore"
              value={form.budget}
              onChange={set("budget")}
            />
            <Field
              as="select"
              label="Buy / Rent / Sell"
              name="purpose"
              value={form.purpose}
              onChange={set("purpose")}
            >
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
              <option value="sell">Sell</option>
            </Field>
            <Field
              as="textarea"
              label="Message"
              name="message"
              rows={2}
              value={form.message}
              onChange={set("message")}
            />
          </div>

          {/* Honeypot — visually hidden, never shown to real users. */}
          <div aria-hidden="true" className="sr-only">
            <label htmlFor="hero-website">Website</label>
            <input
              ref={websiteRef}
              id="hero-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button as="button" type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Request property details"}
            </Button>
            <Button
              as="a"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              Continue on WhatsApp
            </Button>
          </div>
        </form>
      )}

      <FormStatus
        state={state}
        whatsappPhone={phone}
        whatsappMessage={composeWhatsAppMessage(form)}
        callNumber={callNumber}
        errorMessage={formError}
      />
    </div>
  );
}
