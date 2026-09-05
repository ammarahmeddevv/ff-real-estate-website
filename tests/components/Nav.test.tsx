import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MobileMenu } from "@/components/nav/MobileMenu";
import { NAV_LINKS } from "@/components/nav/links";

const phones = [
  { label: "Syed Mustafa Rehman", number: "0313 3694904" },
  { label: "Mohammad Salman", number: "0345 4569090" },
];

const whatsappHref =
  "https://wa.me/923133694904?text=Hello%20F.F%20Real%20Estate";

function renderMenu() {
  return render(
    <MobileMenu
      open
      onClose={() => {}}
      links={NAV_LINKS}
      phones={phones}
      whatsappHref={whatsappHref}
    />,
  );
}

describe("MobileMenu", () => {
  it("renders every primary nav link label", () => {
    renderMenu();
    for (const label of [
      "Home",
      "Properties",
      "Projects",
      "About Us",
      "Services",
      "Why F.F",
      "Contact",
    ]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("pins a WhatsApp CTA pointing at the business number", () => {
    renderMenu();
    const cta = screen.getByRole("link", { name: /whatsapp us/i });
    expect(cta.getAttribute("href")).toMatch(/^https:\/\/wa\.me\/923133694904/);
  });
});
