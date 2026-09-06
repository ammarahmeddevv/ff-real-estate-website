import { describe, it, expect, vi, beforeEach } from "vitest";

import { POST } from "@/app/api/lead/route";
import { createLead } from "@/lib/leads";
import { sendLeadEmail } from "@/lib/email";

vi.mock("@/lib/leads", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/leads")>();
  return { ...actual, createLead: vi.fn() };
});

vi.mock("@/lib/email", () => ({ sendLeadEmail: vi.fn() }));

const createLeadMock = vi.mocked(createLead);
const sendLeadEmailMock = vi.mocked(sendLeadEmail);

function post(body: unknown, { raw = false } = {}) {
  return POST(
    new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: raw ? (body as string) : JSON.stringify(body),
    }),
  );
}

const validBody = {
  name: "Ayesha Khan",
  phone: "0313 3694904",
  message: "Please send details for the F.B Area portion.",
  source: "hero",
};

beforeEach(() => {
  vi.clearAllMocks();
  createLeadMock.mockResolvedValue({ ok: true, id: "lead-1" });
  sendLeadEmailMock.mockResolvedValue(undefined);
});

describe("POST /api/lead", () => {
  it("returns 202 and writes the lead for a valid body", async () => {
    const res = await post(validBody);
    expect(res.status).toBe(202);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(createLeadMock).toHaveBeenCalledTimes(1);
  });

  it("returns 400 with a field error for an invalid body", async () => {
    const res = await post({ phone: "03001234567" });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.errors.name).toBeTruthy();
    expect(createLeadMock).not.toHaveBeenCalled();
  });

  it("returns 400 for a body that is not JSON", async () => {
    const res = await post("not json{", { raw: true });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.errors._form).toBeTruthy();
  });

  it("silently fake-succeeds and does not write when the honeypot is filled", async () => {
    const res = await post({ ...validBody, website: "http://spam.example" });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(createLeadMock).not.toHaveBeenCalled();
    expect(sendLeadEmailMock).not.toHaveBeenCalled();
  });

  it("returns 500 when persistence genuinely fails", async () => {
    createLeadMock.mockResolvedValue({ ok: false, reason: "error" });
    const res = await post(validBody);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.errors._form).toBeTruthy();
  });

  it("still returns 202 when Sanity is not configured", async () => {
    createLeadMock.mockResolvedValue({ ok: false, reason: "not-configured" });
    const res = await post(validBody);
    expect(res.status).toBe(202);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(sendLeadEmailMock).toHaveBeenCalledTimes(1);
  });

  it("still returns 202 when the email notification rejects", async () => {
    sendLeadEmailMock.mockRejectedValue(new Error("smtp down"));
    const res = await post(validBody);
    expect(res.status).toBe(202);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });
});
