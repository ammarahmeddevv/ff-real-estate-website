import { defineField, defineType } from "sanity";

export default defineType({
  name: "lead",
  title: "Lead",
  type: "document",
  readOnly: false,
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Closed", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "preferredContact",
      title: "Preferred contact",
      type: "string",
      options: {
        list: [
          { title: "WhatsApp", value: "whatsapp" },
          { title: "Call", value: "call" },
          { title: "Email", value: "email" },
        ],
      },
    }),
    defineField({
      name: "purpose",
      title: "Purpose",
      type: "string",
      options: {
        list: [
          { title: "Buy", value: "buy" },
          { title: "Rent", value: "rent" },
          { title: "Sell", value: "sell" },
          { title: "Consult", value: "consult" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "propertyInterest",
      title: "Property interest",
      type: "string",
    }),
    defineField({ name: "budget", title: "Budget", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text" }),
    defineField({
      name: "relatedProperty",
      title: "Related property",
      type: "reference",
      to: [{ type: "property" }],
    }),
    defineField({ name: "source", title: "Source", type: "string" }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { name: "name", phone: "phone", submittedAt: "submittedAt" },
    prepare({ name, phone, submittedAt }) {
      const when = submittedAt
        ? new Date(submittedAt).toLocaleDateString()
        : "";
      return {
        title: name || "Lead",
        subtitle: [phone, when].filter(Boolean).join(" · "),
      };
    },
  },
});
