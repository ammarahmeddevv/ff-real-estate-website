import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
      S.divider(),
      S.documentTypeListItem("property").title("Properties"),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("agent").title("Agents"),
      S.documentTypeListItem("newsPost").title("News Posts"),
      S.documentTypeListItem("galleryImage").title("Gallery Images"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.divider(),
      S.listItem()
        .title("Leads")
        .id("leads")
        .child(S.documentTypeList("lead").title("Leads")),
    ]);
