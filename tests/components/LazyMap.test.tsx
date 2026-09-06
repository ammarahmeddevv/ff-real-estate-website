import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LazyMap } from "@/components/layout/LazyMap";

describe("LazyMap", () => {
  const query = "R-37, Block 15, F.B Area, Karachi";

  it("renders no iframe before the user asks for the map", () => {
    const { container } = render(
      <LazyMap query={query} title="F.F Real Estate" />,
    );

    expect(container.querySelector("iframe")).toBeNull();
    expect(
      screen.getByRole("button", { name: /view map/i }),
    ).toBeInTheDocument();
  });

  it("injects the Google Maps embed after clicking View map", () => {
    const { container } = render(
      <LazyMap query={query} title="F.F Real Estate" />,
    );

    fireEvent.click(screen.getByRole("button", { name: /view map/i }));

    const iframe = container.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute("src")).toContain("output=embed");
    expect(iframe?.getAttribute("src")).toContain(encodeURIComponent(query));
    expect(iframe).toHaveAttribute("loading", "lazy");
  });

  it("renders nothing when no query or coordinates are available", () => {
    const { container } = render(<LazyMap title="F.F Real Estate" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("builds the embed from coordinates when no query is given", () => {
    const { container } = render(
      <LazyMap lat={24.9} lng={67.05} title="A project" />,
    );

    fireEvent.click(screen.getByRole("button", { name: /view map/i }));
    expect(container.querySelector("iframe")?.getAttribute("src")).toContain(
      encodeURIComponent("24.9,67.05"),
    );
  });
});
