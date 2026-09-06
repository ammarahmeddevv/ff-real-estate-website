import { defineField, defineType } from "sanity";

export const priceObject = defineType({
  name: "priceObject",
  title: "Price",
  type: "object",
  fields: [
    defineField({
      name: "amount",
      title: "Amount (PKR)",
      type: "number",
    }),
    defineField({
      name: "display",
      title: "Display text",
      type: "string",
      description:
        "e.g. PKR 2.4 Crore — leave blank to show the number or 'Price on request'",
    }),
    defineField({
      name: "onRequest",
      title: "Price on request",
      type: "boolean",
      initialValue: true,
    }),
  ],
});

export const areaObject = defineType({
  name: "areaObject",
  title: "Area",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      type: "number",
    }),
    defineField({
      name: "unit",
      title: "Unit",
      type: "string",
      options: {
        list: [
          { title: "Square Yards", value: "sqyd" },
          { title: "Square Feet", value: "sqft" },
          { title: "Marla", value: "marla" },
          { title: "Kanal", value: "kanal" },
        ],
      },
    }),
  ],
});

export const addressObject = defineType({
  name: "addressObject",
  title: "Address",
  type: "object",
  fields: [
    defineField({ name: "line1", title: "Address line", type: "string" }),
    defineField({ name: "area", title: "Area / Locality", type: "string" }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      initialValue: "Karachi",
    }),
    defineField({ name: "postalCode", title: "Postal code", type: "string" }),
    defineField({ name: "mapsUrl", title: "Google Maps URL", type: "url" }),
    defineField({ name: "lat", title: "Latitude", type: "number" }),
    defineField({ name: "lng", title: "Longitude", type: "number" }),
  ],
});

export const phoneRow = defineType({
  name: "phoneRow",
  title: "Phone number",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "number", title: "Number", type: "string" }),
    defineField({
      name: "whatsapp",
      title: "On WhatsApp",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "number" },
  },
});

export const hoursRow = defineType({
  name: "hoursRow",
  title: "Opening hours row",
  type: "object",
  fields: [
    defineField({
      name: "day",
      title: "Day",
      type: "string",
      options: {
        list: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    }),
    defineField({ name: "open", title: "Opens", type: "string" }),
    defineField({ name: "close", title: "Closes", type: "string" }),
    defineField({ name: "closed", title: "Closed", type: "boolean" }),
  ],
  preview: {
    select: { title: "day", open: "open", close: "close", closed: "closed" },
    prepare({ title, open, close, closed }) {
      return {
        title: title || "—",
        subtitle: closed ? "Closed" : [open, close].filter(Boolean).join(" – "),
      };
    },
  },
});

export const socialRow = defineType({
  name: "socialRow",
  title: "Social link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Facebook", value: "facebook" },
          { title: "Facebook Group", value: "facebook_group" },
          { title: "Instagram", value: "instagram" },
          { title: "YouTube", value: "youtube" },
          { title: "TikTok", value: "tiktok" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({ name: "url", title: "URL", type: "url" }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});
