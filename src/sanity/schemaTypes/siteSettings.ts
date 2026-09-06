import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
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
    }),
    defineField({
      name: "phones",
      title: "Phone numbers",
      type: "array",
      of: [defineArrayMember({ type: "phoneRow" })],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "primaryWhatsapp",
      title: "Primary WhatsApp number",
      type: "string",
    }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "address", title: "Address", type: "addressObject" }),
    defineField({
      name: "hours",
      title: "Opening hours",
      type: "array",
      of: [defineArrayMember({ type: "hoursRow" })],
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      of: [defineArrayMember({ type: "socialRow" })],
    }),
    defineField({
      name: "hero",
      title: "Homepage hero",
      type: "object",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "subheading", title: "Subheading", type: "text" }),
        defineField({
          name: "primaryCtaLabel",
          title: "Primary CTA label",
          type: "string",
        }),
        defineField({
          name: "primaryCtaHref",
          title: "Primary CTA link",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "trustBarItems",
      title: "Trust bar items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "whyFF",
      title: "Why F.F Real Estate",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text" }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
