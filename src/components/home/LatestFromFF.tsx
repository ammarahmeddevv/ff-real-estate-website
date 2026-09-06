import type { NewsSummary, SocialRow } from "@/lib/sanity/types";
import { Container } from "@/components/layout/Container";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { NewsCard } from "@/components/news/NewsCard";

interface LatestFromFFProps {
  newsPosts: NewsSummary[];
  socials: SocialRow[];
}

/**
 * News teaser. Shows up to three real news cards when the CMS has posts,
 * otherwise a single quiet line. The "Follow on Facebook" button is always a
 * plain link — no Facebook SDK, iframe or embed.
 */
export function LatestFromFF({ newsPosts, socials }: LatestFromFFProps) {
  const posts = newsPosts.slice(0, 3);
  const facebookUrl = socials.find(
    (social) => social.platform === "facebook",
  )?.url;

  return (
    <section className="border-t border-gold/30 bg-ivory pb-20 pt-24 text-ink md:pb-28 md:pt-32">
      <Container>
        <Reveal>
          <MicroLabel as="p">Updates</MicroLabel>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight md:text-4xl">
            Latest From F.F Real Estate
          </h2>
        </Reveal>

        {posts.length > 0 ? (
          <Reveal delay={0.08} className="mt-12 md:mt-16">
            <ul className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post._id}>
                  <NewsCard post={post} />
                </li>
              ))}
            </ul>
          </Reveal>
        ) : (
          <Reveal delay={0.08} className="mt-8">
            <p className="max-w-xl text-base leading-relaxed text-ink/70">
              Follow F.F Real Estate on Facebook for new listings and updates.
            </p>
          </Reveal>
        )}

        <Reveal delay={0.12} className="mt-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {posts.length > 0 && (
              <Button as="a" href="/news" variant="ghost">
                View all news &rarr;
              </Button>
            )}
            {facebookUrl && (
              <Button
                as="a"
                href={facebookUrl}
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow on Facebook
              </Button>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
