import { describe, it, expect } from "vitest";
import { parseLead, isSpam, type LeadInput } from "@/lib/leads";

const valid = {
  name: "Ayesha Khan",
  phone: "0313 3694904",
  message: "Interested in a 3-bed portion in F.B Area.",
  source: "hero",
};

describe("parseLead", () => {
  it("accepts a valid payload", () => {
    const result = parseLead(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe("Ayesha Khan");
      expect(result.data.source).toBe("hero");
    }
  });

  it("defaults source to 'unknown' when omitted", () => {
    const result = parseLead({ name: "Ali Raza", phone: "03001234567" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.source).toBe("unknown");
  });

  it("flags a missing name with an error keyed 'name'", () => {
    const result = parseLead({ phone: "03001234567" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeTruthy();
  });

  it("flags a too-short phone with an error keyed 'phone'", () => {
    const result = parseLead({ name: "Ali Raza", phone: "12" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.phone).toBeTruthy();
  });

  it("rejects a phone with letters", () => {
    const result = parseLead({ name: "Ali Raza", phone: "call me now" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.phone).toBeTruthy();
  });

  it("flags a malformed email with an error keyed 'email'", () => {
    const result = parseLead({ ...valid, email: "nope" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toBeTruthy();
  });

  it("treats an empty email string as omitted", () => {
    const result = parseLead({ ...valid, email: "" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.email).toBeUndefined();
  });

  it("rejects an out-of-enum preferredContact", () => {
    const result = parseLead({ ...valid, preferredContact: "pigeon" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.preferredContact).toBeTruthy();
  });
});

describe("isSpam", () => {
  const base: LeadInput = {
    name: "Ayesha Khan",
    phone: "03133694904",
    source: "hero",
  };

  it("is true when the honeypot field is filled", () => {
    expect(isSpam({ ...base, website: "http://spam.example" }, Date.now())).toBe(
      true,
    );
  });

  it("is false for a fast submission with a clean honeypot", () => {
    // Silent drops on timing alone were removed: browser autofill / password
    // managers submit genuine forms in well under 2s, and a spam verdict loses
    // the lead. Only the honeypot may trigger the silent-drop path.
    const started = Date.now() - 500;
    expect(isSpam({ ...base, startedAt: started }, Date.now())).toBe(false);
  });

  it("is false after a natural delay with no honeypot", () => {
    const started = Date.now() - 5000;
    expect(isSpam({ ...base, startedAt: started }, Date.now())).toBe(false);
  });

  it("is false with no honeypot and no startedAt", () => {
    expect(isSpam(base, Date.now())).toBe(false);
  });
});
