import { describe, it, expect, vi, beforeEach } from "vitest";

import { POST } from "@/app/api/lead/route";
import { createLead } from "@/lib/leads";
import { sendLeadEmail } from "@/lib/email";

// The route defers the email with `after()` from next/server, which throws
// outside a request scope. Stub it to run the task immediately (swallowing any
// rejection, exactly as the real callback wrapper does) so tests can assert the
// notification fired.
vi.mock("next/server", () => ({
  after: (task: () => unknown) => {
    void Promise.resolve()
      .then(task)
      .catch(() => {});
  },
}));

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

  it("does not lose the lead when the Sanity write genuinely fails", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    createLeadMock.mockResolvedValue({ ok: false, reason: "error" });

    const res = await post(validBody);

    // 202 (accepted, not fully persisted) — never a bare 500 with nothing sent.
    expect(res.status).toBe(202);
    await expect(res.json()).resolves.toEqual({ ok: true });
    // The email notification still fires so the lead reaches Gmail.
    expect(sendLeadEmailMock).toHaveBeenCalledTimes(1);
    expect(sendLeadEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Ayesha Khan" }),
    );
    // …and the full payload is logged for manual recovery.
    expect(errorSpy).toHaveBeenCalledWith(
      "[lead] Sanity write failed, payload:",
      expect.stringContaining("Ayesha Khan"),
    );

    errorSpy.mockRestore();
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
