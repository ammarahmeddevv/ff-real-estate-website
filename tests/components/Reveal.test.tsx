import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/motion/Reveal";

/** Mock matchMedia so `prefers-reduced-motion: reduce` reports true. */
function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: reduce && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

describe("Reveal (reduced motion)", () => {
  beforeEach(() => {
    mockReducedMotion(true);
  });

  it("renders children immediately with no hidden state", () => {
    const { container } = render(
      <div>
        <Reveal>
          <p>Revealed content</p>
        </Reveal>
      </div>,
    );

    expect(screen.getByText("Revealed content")).toBeInTheDocument();

    const wrapper = container.querySelector("div > div") as HTMLElement;
    expect(wrapper).not.toBeNull();
    // No inline opacity:0 / visually-hidden state — content is visible at once.
    expect(wrapper.style.opacity).not.toBe("0");
    expect(wrapper).toBeVisible();
  });
});
