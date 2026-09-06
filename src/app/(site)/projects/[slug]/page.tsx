import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PROJECT_BY_SLUG_QUERY,
  PROJECT_SLUGS_QUERY,
  getSiteSettings,
  sanityFetch,
} from "@/lib/sanity";
import type {
  Project,
  PortableText as PortableTextValue,
} from "@/lib/sanity/types";
import { PROJECT_STATUS_LABEL } from "@/lib/property-labels";
import { Container } from "@/components/layout/Container";
import { PortableText } from "@/components/content/PortableText";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectInquiryPanel } from "@/components/project/ProjectInquiryPanel";

export const revalidate = 60;
export const dynamicParams = true;

type Params = { slug: string };

/** First ~160 chars of plain text pulled from portable-text blocks. */
function excerptFromPortableText(
  value: PortableTextValue | null | undefined,
  max = 160,
): string | null {
  if (!Array.isArray(value)) return null;
  const text = value
    .filter((b): b is { _type?: string; children?: { text?: string }[] } =>
      Boolean(b && typeof b === "object"),
    )
    .filter((b) => b._type === "block")
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

// Deduped per request: called by both `generateMetadata` and the page component.
const getProject = cache(
  async (slug: string): Promise<Project | null> =>
    sanityFetch<Project | null>({
      query: PROJECT_BY_SLUG_QUERY,
      params: { slug },
      tags: ["project"],
      fallback: null,
    }),
);

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: PROJECT_SLUGS_QUERY,
    tags: ["project"],
    fallback: [],
  });
  return slugs.filter((s) => Boolean(s?.slug)).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project | F.F Real Estate",
      description:
        "F.F Real Estate Builder & Developers undertakes construction and development work in Karachi.",
    };
  }

  const typeLabel = project.projectType?.trim() || "Development";
  const title = `${project.name} — ${typeLabel} in ${project.location} | F.F Real Estate`;
  const description =
    excerptFromPortableText(project.description) ??
    `${typeLabel} by F.F Real Estate Builder & Developers in ${project.location}, Karachi. Contact us for details.`;

  const ogImage =
    project.heroImage?.url ??
    project.gallery?.find((img) => img?.url)?.url ??
    undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProject(slug),
    getSiteSettings(),
  ]);

  if (!project) notFound();

  const hasOverview =
    Array.isArray(project.description) && project.description.length > 0;
  const keyFeatures = (project.keyFeatures ?? []).filter(
    (f): f is string => Boolean(f && f.trim()),
  );
  const gallery = (project.gallery ?? []).filter((img) => Boolean(img?.url));
  const statusLabel = project.status
    ? PROJECT_STATUS_LABEL[project.status]
    : null;

  return (
    <article className="pb-20">
      {/* Task 17: JSON-LD */}
      <ProjectHero project={project} />

      <Container className="pt-8 md:pt-12">
        <nav className="mb-6 font-sans text-sm text-gray-500">
          <Link
            href="/projects"
            className="transition-colors hover:text-gold-deep"
          >
            &larr; All projects
          </Link>
        </nav>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section>
              <h2 className="font-display text-2xl leading-snug text-ink">
                About this development
              </h2>
              {hasOverview ? (
                <div className="mt-4">
                  <PortableText value={project.description} />
                </div>
              ) : (
                <p className="mt-4 max-w-prose font-sans text-base leading-relaxed text-gray-500">
                  {project.name} is a{" "}
                  {(project.projectType?.trim() || "development").toLowerCase()}{" "}
                  by F.F Real Estate Builder &amp; Developers in{" "}
                  {project.location}
                  {statusLabel ? `, currently ${statusLabel.toLowerCase()}` : ""}.
                  Message us on WhatsApp for the latest details.
                </p>
              )}
            </section>

            {keyFeatures.length > 0 && (
              <section className="mt-12">
                <h2 className="font-display text-2xl leading-snug text-ink">
                  Key features
                </h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {keyFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2.5 font-sans text-base leading-relaxed text-ink"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {gallery.length > 0 && (
              <section className="mt-12">
                <h2 className="font-display text-2xl leading-snug text-ink">
                  Gallery
                </h2>
                <div className="mt-4">
                  <ProjectGallery images={gallery} title={project.name} />
                </div>
              </section>
            )}

            {/* Task 14: <LazyMap> if project has coords */}
          </div>

          <div className="lg:col-span-1">
            <ProjectInquiryPanel project={project} settings={settings} />
          </div>
        </div>
      </Container>
    </article>
  );
}
