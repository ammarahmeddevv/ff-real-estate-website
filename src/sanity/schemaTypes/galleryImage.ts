import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Exterior", value: "exterior" },
          { title: "Interior", value: "interior" },
          { title: "Building", value: "building" },
          { title: "Neighbourhood", value: "neighbourhood" },
          { title: "Commercial", value: "commercial" },
          { title: "Construction", value: "construction" },
          { title: "Project", value: "project" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({
      name: "relatedProperty",
      title: "Related property",
      type: "reference",
      to: [{ type: "property" }],
    }),
    defineField({
      name: "relatedProject",
      title: "Related project",
      type: "reference",
      to: [{ type: "project" }],
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "category", media: "image" },
    prepare({ title, subtitle, media }) {
      return { title: title || subtitle || "Gallery image", subtitle, media };
    },
  },
});
