import { describe, it, expect } from "vitest";
import {
  urlForImage,
  imageProps,
  dimensionsFromRef,
} from "@/lib/sanity/image";

// A realistic Sanity image object (asset ref carries intrinsic dimensions).
const imageObject = {
  _type: "image",
  asset: {
    _type: "reference",
    _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg",
  },
};

// The projected shape the GROQ queries return.
const projected = {
  url: "https://cdn.sanity.io/images/abc123/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-1920x1080.jpg",
  lqip: "data:image/jpeg;base64,/9j/PLACEHOLDER",
  alt: "Front elevation",
};

describe("urlForImage", () => {
  it("builds a CDN URL with the requested width", () => {
    const url = urlForImage(imageObject).width(800).url();
    expect(url).toContain("w=800");
  });

  it("includes the configured project id and dataset in the path", () => {
    const url = urlForImage(imageObject).width(800).url();
    // No real project configured in tests -> placeholder id, production dataset.
    expect(url).toContain("cdn.sanity.io/images/placeholder/production/");
  });

  it("passes through height and other transforms", () => {
    const url = urlForImage(imageObject).width(400).height(300).url();
    expect(url).toContain("w=400");
    expect(url).toContain("h=300");
  });
});

describe("dimensionsFromRef", () => {
  it("reads dimensions from an asset ref", () => {
    expect(
      dimensionsFromRef("image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg"),
    ).toEqual({ width: 2000, height: 3000 });
  });

  it("reads dimensions from a CDN url", () => {
    expect(
      dimensionsFromRef(
        "https://cdn.sanity.io/images/abc/production/x-1920x1080.jpg",
      ),
    ).toEqual({ width: 1920, height: 1080 });
  });

  it("returns null when no dimensions are present", () => {
    expect(dimensionsFromRef("not-an-image-ref")).toBeNull();
    expect(dimensionsFromRef(undefined)).toBeNull();
  });
});

describe("imageProps", () => {
  it("derives height from the intrinsic aspect ratio of a raw image object", () => {
    const props = imageProps(imageObject, { width: 800 });
    expect(props.width).toBe(800);
    expect(props.height).toBe(1200); // 800 * 3000 / 2000
    expect(props.src).toContain("w=800");
  });

  it("uses the projected url and lqip for a projected image", () => {
    const props = imageProps(projected, { width: 640 });
    expect(props.src).toContain("cdn.sanity.io/images/abc123/production/");
    expect(props.src).toContain("w=640");
    expect(props.height).toBe(360); // 640 * 1080 / 1920
    expect(props.alt).toBe("Front elevation");
    expect(props.blurDataURL).toBe(projected.lqip);
  });

  it("honours an explicit height and omits blurDataURL when no lqip", () => {
    const props = imageProps(
      { url: "https://cdn.sanity.io/images/abc/production/y-100x100.jpg", alt: null },
      { width: 200, height: 120 },
    );
    expect(props.width).toBe(200);
    expect(props.height).toBe(120);
    expect(props.src).toContain("h=120");
    expect(props.blurDataURL).toBeUndefined();
    expect(props.alt).toBe("");
  });

  it("falls back to a 3:2 ratio when dimensions can't be read", () => {
    const props = imageProps({ url: "https://example.com/plain.jpg" }, { width: 900 });
    expect(props.height).toBe(600);
  });
});
