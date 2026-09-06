import { describe, it, expect } from "vitest";
import { buildWhatsAppLink, propertyWhatsAppMessage } from "@/lib/whatsapp";

describe("buildWhatsAppLink", () => {
  it("strips formatting and normalises a local 03xx number", () => {
    expect(buildWhatsAppLink({ phone: "0313 3694904" })).toBe("https://wa.me/923133694904");
  });
  it("keeps an already-international number", () => {
    expect(buildWhatsAppLink({ phone: "+92 345 4569090" })).toBe("https://wa.me/923454569090");
  });
  it("encodes the prefilled message", () => {
    expect(buildWhatsAppLink({ phone: "923133694904", message: "Hello F.F Real Estate" }))
      .toBe("https://wa.me/923133694904?text=Hello%20F.F%20Real%20Estate");
  });
});

describe("propertyWhatsAppMessage", () => {
  it("includes the location when present", () => {
    expect(propertyWhatsAppMessage("2nd Floor Portion", "F.B Area, Block 15"))
      .toBe("Hello, I am interested in 2nd Floor Portion (F.B Area, Block 15). Please send me more details.");
  });
  it("omits the parenthetical when no location", () => {
    expect(propertyWhatsAppMessage("Corner Plot"))
      .toBe("Hello, I am interested in Corner Plot. Please send me more details.");
  });
});
