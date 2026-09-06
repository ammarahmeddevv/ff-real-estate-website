import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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

  it("marks its wrapper with data-reveal for the no-JS fallback style", () => {
    const { container } = render(
      <Reveal>
        <p>Revealed content</p>
      </Reveal>,
    );

    expect(container.querySelector("[data-reveal]")).not.toBeNull();
  });
});

describe("Reveal (animated motion)", () => {
  it("marks its wrapper with data-reveal in the animated branch", () => {
    mockReducedMotion(false);

    const { container } = render(
      <Reveal>
        <p>Animated content</p>
      </Reveal>,
    );

    expect(container.querySelector("[data-reveal]")).not.toBeNull();
  });
});

describe("Reveal (animated branch reaches the visible state)", () => {
  const realGetRect = Element.prototype.getBoundingClientRect;

  beforeEach(() => {
    mockReducedMotion(false);
    // A real (non-firing) IntersectionObserver must exist, so Reveal takes the
    // observer path rather than the "no IO → show immediately" fallback.
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      },
    );
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = realGetRect;
    vi.unstubAllGlobals();
  });

  it("shows content already scrolled ABOVE the fold on mount (I1 regression)", async () => {
    // Element sits entirely above the viewport — the situation after a reload
    // that restores scroll position. Pre-I1 (`rect.bottom > 0` lower bound)
    // this never qualified and stayed at opacity 0 forever.
    Element.prototype.getBoundingClientRect = function () {
      return {
        top: -600,
        bottom: -400,
        left: 0,
        right: 0,
        width: 0,
        height: 200,
        x: 0,
        y: -600,
        toJSON() {},
      } as DOMRect;
    };

    const { container } = render(
      <Reveal>
        <p>Above-the-fold content</p>
      </Reveal>,
    );

    const wrapper = () =>
      container.querySelector("[data-reveal]") as HTMLElement;

    await waitFor(() => {
      expect(wrapper().style.opacity).toBe("1");
    });
    expect(wrapper().style.transform).toBe("none");
  });
});
