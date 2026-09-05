"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface HeroInquiryPanelProps {
  /** E.164 WhatsApp number, e.g. `923133694904`. */
  phone: string;
}

type Purpose = "Buy" | "Rent" | "Sell";

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
  purpose: "Buy",
  message: "",
};

function composeWhatsAppMessage(form: FormState): string {
  const lines = ["Hello F.F Real Estate,"];
  if (form.name) lines.push(`Name: ${form.name}`);
  if (form.propertyInterest) lines.push(`Looking for: ${form.propertyInterest}`);
  if (form.budget) lines.push(`Budget: ${form.budget}`);
  lines.push(`Purpose: ${form.purpose}`);
  if (form.message) lines.push("", form.message);
  if (lines.length <= 2) lines.push("I'd like to ask about a property.");
  return lines.join("\n");
}

export function HeroInquiryPanel({ phone }: HeroInquiryPanelProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

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
    if (!form.name.trim()) next.name = "Please enter your name.";
    const digits = form.phone.replace(/[^\d]/g, "");
    if (!form.phone.trim()) next.phone = "Please enter a phone number.";
    else if (digits.length < 7) next.phone = "Enter a valid phone number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          propertyInterest: form.propertyInterest,
          budget: form.budget,
          purpose: form.purpose,
          message: form.message,
          source: "hero",
        }),
      });
    } catch {
      // The lead API arrives in a later task — never block the visitor.
    }
    setStatus("done");
  }

  const whatsappHref = buildWhatsAppLink({
    phone,
    message: composeWhatsAppMessage(form),
  });

  return (
    <div
      className="rounded-[8px] border border-gray-200 bg-paper p-6 text-ink shadow-[0_18px_40px_-24px_rgba(17,17,19,0.45)] sm:p-7"
      aria-live="polite"
    >
      {status === "done" ? (
        <div>
          <h2 className="font-display text-xl leading-snug">Thank you</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            F.F Real Estate will be in touch shortly. You can also reach us now
            on WhatsApp.
          </p>
          <div className="mt-5">
            <WhatsAppButton phone={phone} message={composeWhatsAppMessage(form)}>
              Continue on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      ) : (
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
              <option value="Buy">Buy</option>
              <option value="Rent">Rent</option>
              <option value="Sell">Sell</option>
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

          <div className="mt-6 flex flex-col gap-3">
            <Button as="button" type="submit" disabled={status === "submitting"}>
              {status === "submitting"
                ? "Sending…"
                : "Request property details"}
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
    </div>
  );
}
