import type { MetadataRoute } from "next";
import {
  NEWS_SLUGS_QUERY,
  PROJECT_SLUGS_QUERY,
  PROPERTY_SLUGS_QUERY,
  sanityFetch,
} from "@/lib/sanity";
import { SITE_URL } from "@/lib/metadata";

const abs = (path: string) => new URL(path, SITE_URL).toString();

/** Static routes, most-important first. `/studio` is intentionally excluded. */
const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/properties", changeFrequency: "daily", priority: 0.9 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.7 },
  { path: "/about", changeFrequency: "yearly", priority: 0.5 },
  { path: "/services", changeFrequency: "yearly", priority: 0.6 },
  { path: "/why-ff", changeFrequency: "yearly", priority: 0.4 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/news", changeFrequency: "weekly", priority: 0.6 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const [propertySlugs, projectSlugs, newsSlugs] = await Promise.all([
    sanityFetch<{ slug: string }[]>({
      query: PROPERTY_SLUGS_QUERY,
      tags: ["property"],
      fallback: [],
    }),
    sanityFetch<{ slug: string }[]>({
      query: PROJECT_SLUGS_QUERY,
      tags: ["project"],
      fallback: [],
    }),
    sanityFetch<{ slug: string }[]>({
      query: NEWS_SLUGS_QUERY,
      tags: ["newsPost"],
      fallback: [],
    }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: abs(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const dynamicEntries = (
    [
      ["properties", propertySlugs, 0.8] as const,
      ["projects", projectSlugs, 0.6] as const,
      ["news", newsSlugs, 0.5] as const,
    ] satisfies [string, { slug: string }[], number][]
  ).flatMap(([base, slugs, priority]) =>
    slugs
      .filter((row) => Boolean(row?.slug))
      .map((row) => ({
        url: abs(`/${base}/${row.slug}`),
        lastModified,
        changeFrequency: "weekly" as const,
        priority,
      })),
  );

  return [...staticEntries, ...dynamicEntries];
}
