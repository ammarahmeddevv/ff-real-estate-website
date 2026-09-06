import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "property",
  title: "Property",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "purpose",
      title: "Purpose",
      type: "string",
      options: {
        list: [
          { title: "For Sale", value: "sale" },
          { title: "For Rent", value: "rent" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "House", value: "house" },
          { title: "Flat / Apartment", value: "flat" },
          { title: "Plot", value: "plot" },
          { title: "Commercial", value: "commercial" },
          { title: "Office", value: "office" },
          { title: "Shop", value: "shop" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "address", title: "Address", type: "string" }),
    defineField({ name: "price", title: "Price", type: "priceObject" }),
    defineField({ name: "bedrooms", title: "Bedrooms", type: "number" }),
    defineField({ name: "bathrooms", title: "Bathrooms", type: "number" }),
    defineField({ name: "area", title: "Area", type: "areaObject" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Under Offer", value: "under_offer" },
          { title: "Sold", value: "sold" },
          { title: "Rented", value: "rented" },
        ],
      },
      initialValue: "available",
    }),
    defineField({ name: "availability", title: "Availability", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
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
      ],
    }),
    defineField({
      name: "map",
      title: "Map",
      type: "object",
      fields: [
        defineField({ name: "lat", title: "Latitude", type: "number" }),
        defineField({ name: "lng", title: "Longitude", type: "number" }),
        defineField({ name: "embedUrl", title: "Embed URL", type: "url" }),
      ],
    }),
    defineField({
      name: "agent",
      title: "Agent",
      type: "reference",
      to: [{ type: "agent" }],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location",
      media: "gallery.0",
    },
  },
});
