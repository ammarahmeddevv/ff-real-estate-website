import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Lightbox } from "@/components/gallery/Lightbox";

const images = [
  { url: "https://cdn.sanity.io/a.jpg", alt: "Front elevation" },
  { url: "https://cdn.sanity.io/b.jpg", alt: "Living room" },
  { url: "https://cdn.sanity.io/c.jpg", alt: "Kitchen" },
];

describe("Lightbox", () => {
  it("renders a modal dialog with a counter", () => {
    render(
      <Lightbox images={images} startIndex={0} open onClose={vi.fn()} />,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("advances the counter on ArrowRight", () => {
    render(
      <Lightbox images={images} startIndex={0} open onClose={vi.fn()} />,
    );

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(
      <Lightbox images={images} startIndex={0} open onClose={onClose} />,
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("traps focus when Shift+Tab is the first keystroke after opening", async () => {
    render(
      <Lightbox images={images} startIndex={0} open onClose={vi.fn()} />,
    );

    const dialog = screen.getByRole("dialog");
    // The dialog container takes focus on open (rAF).
    await waitFor(() => expect(dialog).toHaveFocus());

    // Shift+Tab from the container must not escape the dialog.
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });

    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).not.toBe(document.body);
  });

  it("renders nothing when closed", () => {
    render(
      <Lightbox images={images} startIndex={0} open={false} onClose={vi.fn()} />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
