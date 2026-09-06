import {
  ALL_PROJECTS_QUERY,
  getSiteSettings,
  sanityFetch,
} from "@/lib/sanity";
import { buildMetadata } from "@/lib/metadata";
import type { ProjectSummary } from "@/lib/sanity/types";
import { GENERAL_ENQUIRY_MESSAGE, buildWhatsAppLink } from "@/lib/whatsapp";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/EmptyState";
import { ProjectGrid } from "@/components/project/ProjectGrid";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Projects & Developments in Karachi",
  description:
    "F.F Real Estate Builder & Developers undertakes construction and development work in Karachi. Developments are published here as they progress.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([
    getSiteSettings(),
    sanityFetch<ProjectSummary[]>({
      query: ALL_PROJECTS_QUERY,
      tags: ["project"],
      fallback: [],
    }),
  ]);

  const whatsappHref = buildWhatsAppLink({
    phone: settings.primaryWhatsapp,
    message: GENERAL_ENQUIRY_MESSAGE,
  });

  return (
    <Container className="py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="u-micro-label">Our Work</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          Projects &amp; Developments
        </h1>
        <p className="mt-4 font-sans text-base leading-relaxed text-gray-500">
          F.F Real Estate Builder &amp; Developers undertakes construction and
          development work in Karachi.
        </p>
      </header>

      <div className="mt-12 md:mt-16">
        {projects.length > 0 ? (
          <ProjectGrid projects={projects} />
        ) : (
          <EmptyState
            headingLevel={2}
            title="Project details are on the way"
            body="Developments are published here as they progress. Message us on WhatsApp to discuss current work."
            ctaHref={whatsappHref}
            ctaLabel="Ask on WhatsApp"
          />
        )}
      </div>
    </Container>
  );
}
