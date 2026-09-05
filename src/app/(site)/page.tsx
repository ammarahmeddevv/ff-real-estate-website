import {
  FEATURED_PROJECTS_QUERY,
  FEATURED_PROPERTIES_QUERY,
  getSiteSettings,
  sanityFetch,
} from "@/lib/sanity";
import type { ProjectSummary, PropertySummary } from "@/lib/sanity/types";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/EmptyState";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { ProjectGrid } from "@/components/project/ProjectGrid";

export const revalidate = 60;

const LEAD_WHATSAPP_MESSAGE =
  "Hello F.F Real Estate, I'd like to ask about a property.";

export default async function HomePage() {
  const [settings, properties, projects] = await Promise.all([
    getSiteSettings(),
    sanityFetch<PropertySummary[]>({
      query: FEATURED_PROPERTIES_QUERY,
      tags: ["property"],
      fallback: [],
    }),
    sanityFetch<ProjectSummary[]>({
      query: FEATURED_PROJECTS_QUERY,
      tags: ["project"],
      fallback: [],
    }),
  ]);

  const whatsappHref = buildWhatsAppLink({
    phone: settings.primaryWhatsapp,
    message: LEAD_WHATSAPP_MESSAGE,
  });

  const featuredProperties = properties.slice(0, 6);
  const featuredProjects = projects.slice(0, 6);

  return (
    <>
      <Hero settings={settings} />
      <TrustBar items={settings.trustBarItems} />

      <Section
        id="featured-properties"
        label="Featured Properties"
        title="A selection of what F.F Real Estate is working on"
      >
        {featuredProperties.length > 0 ? (
          <>
            <PropertyGrid properties={featuredProperties} />
            <div className="mt-10">
              <Button as="a" href="/properties" variant="ghost">
                View all properties &rarr;
              </Button>
            </div>
          </>
        ) : (
          <EmptyState
            title="New listings are on the way"
            body="Message us on WhatsApp to hear about current opportunities."
            ctaHref={whatsappHref}
            ctaLabel="Ask on WhatsApp"
          />
        )}
      </Section>

      <Section
        id="projects"
        label="Projects & Developments"
        title="Builder and developer projects"
      >
        {featuredProjects.length > 0 ? (
          <>
            <ProjectGrid projects={featuredProjects} />
            <div className="mt-10">
              <Button as="a" href="/projects" variant="ghost">
                View all projects &rarr;
              </Button>
            </div>
          </>
        ) : (
          <EmptyState
            title="Developments will be listed here"
            body="Project details are added as developments progress."
            ctaHref={whatsappHref}
            ctaLabel="Ask on WhatsApp"
          />
        )}
      </Section>

      {/* TODO Task 8b: ServicesStrip, WhyFF, AboutTeaser, LatestFromFF, LocationBlock, ContactCta */}
    </>
  );
}
