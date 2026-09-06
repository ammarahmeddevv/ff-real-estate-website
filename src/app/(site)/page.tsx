import {
  FEATURED_PROJECTS_QUERY,
  FEATURED_PROPERTIES_QUERY,
  NEWS_LIST_QUERY,
  SERVICES_QUERY,
  getSiteSettings,
  sanityFetch,
} from "@/lib/sanity";
import type {
  NewsSummary,
  ProjectSummary,
  PropertySummary,
  Service,
} from "@/lib/sanity/types";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/EmptyState";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { ServicesStrip } from "@/components/home/ServicesStrip";
import { WhyFF } from "@/components/home/WhyFF";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { LatestFromFF } from "@/components/home/LatestFromFF";
import { LocationBlock } from "@/components/home/LocationBlock";
import { ContactCta } from "@/components/home/ContactCta";

export const revalidate = 60;

const LEAD_WHATSAPP_MESSAGE =
  "Hello F.F Real Estate, I'd like to ask about a property.";

export default async function HomePage() {
  const [settings, properties, projects, services, news] = await Promise.all([
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
    sanityFetch<Service[]>({
      query: SERVICES_QUERY,
      tags: ["service"],
      fallback: [],
    }),
    sanityFetch<NewsSummary[]>({
      query: NEWS_LIST_QUERY,
      tags: ["newsPost"],
      fallback: [],
    }),
  ]);

  const whatsappHref = buildWhatsAppLink({
    phone: settings.primaryWhatsapp,
    message: LEAD_WHATSAPP_MESSAGE,
  });

  const featuredProperties = properties.slice(0, 6);
  const featuredProjects = projects.slice(0, 6);
  const newsPosts = news.slice(0, 3);

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
        tone="ivory"
        className="border-t border-gray-200"
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

      <ServicesStrip services={services} />
      <WhyFF items={settings.whyFF} phone={settings.primaryWhatsapp} />
      <AboutTeaser />
      <LatestFromFF newsPosts={newsPosts} socials={settings.socials} />
      <LocationBlock address={settings.address} hours={settings.hours} />
      <ContactCta phone={settings.primaryWhatsapp} phones={settings.phones} />
    </>
  );
}
