import { NEWS_LIST_QUERY, getSiteSettings, sanityFetch } from "@/lib/sanity";
import type { NewsSummary } from "@/lib/sanity/types";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/EmptyState";
import { NewsGrid } from "@/components/news/NewsGrid";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "News & Market Updates",
  description:
    "New listings, project news and property-market notes from F.F Real Estate in F.B Area, Dastagir and across Karachi.",
  path: "/news",
});

export default async function NewsPage() {
  const [settings, posts] = await Promise.all([
    getSiteSettings(),
    sanityFetch<NewsSummary[]>({
      query: NEWS_LIST_QUERY,
      tags: ["newsPost"],
      fallback: [],
    }),
  ]);

  const facebookUrl = settings.socials.find(
    (social) => social.platform === "facebook",
  )?.url;

  return (
    <Container className="py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="u-micro-label">Updates</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          News &amp; Market Updates
        </h1>
        <p className="mt-4 font-sans text-base leading-relaxed text-gray-500">
          New listings, project news and notes on the Karachi property market,
          posted here as they happen.
        </p>
      </header>

      <div className="mt-12 md:mt-16">
        {posts.length > 0 ? (
          <NewsGrid posts={posts} />
        ) : (
          <EmptyState
            headingLevel={2}
            title="Updates will be posted here"
            body="New listings, project news and market notes will appear here. In the meantime, F.F Real Estate posts regularly on Facebook."
            ctaHref={facebookUrl}
            ctaLabel="Follow on Facebook"
          />
        )}
      </div>
    </Container>
  );
}
