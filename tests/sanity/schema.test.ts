// @vitest-environment node
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import schema from "@/sanity/schemaTypes";

const names = schema.types.map((t) => t.name);

describe("sanity schema", () => {
  it("registers every document type", () => {
    for (const n of [
      "siteSettings",
      "property",
      "project",
      "service",
      "agent",
      "newsPost",
      "galleryImage",
      "testimonial",
      "lead",
    ]) {
      expect(names).toContain(n);
    }
  });

  it("registers every shared object type", () => {
    for (const n of [
      "priceObject",
      "areaObject",
      "addressObject",
      "hoursRow",
      "phoneRow",
      "socialRow",
    ]) {
      expect(names).toContain(n);
    }
  });

  it("property.purpose offers sale and rent", () => {
    const property = schema.types.find((t) => t.name === "property") as any;
    const purpose = property.fields.find((f: any) => f.name === "purpose");
    const values = purpose.options.list.map((o: any) =>
      typeof o === "string" ? o : o.value,
    );
    expect(values).toEqual(["sale", "rent"]);
  });
});
