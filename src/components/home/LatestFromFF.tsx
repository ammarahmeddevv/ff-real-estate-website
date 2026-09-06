import Link from "next/link";
import type { NewsSummary, SocialRow } from "@/lib/sanity/types";
import { Container } from "@/components/layout/Container";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

interface LatestFromFFProps {
  newsPosts: NewsSummary[];
  socials: SocialRow[];
}

function formatDate(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * News teaser. Shows up to three minimal post cards when the CMS has posts,
 * otherwise a single quiet line. The "Follow on Facebook" button is always a
 * plain link — no Facebook SDK, iframe or embed.
 */
export function LatestFromFF({ newsPosts, socials }: LatestFromFFProps) {
  const posts = newsPosts.slice(0, 3);
  const facebookUrl = socials.find(
    (social) => social.platform === "facebook",
  )?.url;

  return (
    <section className="border-t border-gray-200 bg-paper py-20 text-ink md:py-28">
      <Container>
        <Reveal>
          <MicroLabel as="p">Updates</MicroLabel>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight md:text-4xl">
            Latest From F.F Real Estate
          </h2>
        </Reveal>

        {posts.length > 0 ? (
          <Reveal delay={0.08} className="mt-12 md:mt-16">
            <ul className="grid gap-8 md:grid-cols-3 md:gap-10">
              {posts.map((post) => {
                const date = formatDate(post.publishedAt);
                return (
                  <li key={post._id}>
                    <Link
                      href={`/news/${post.slug}`}
                      className="group block border-t border-gray-200 pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                    >
                      {date && (
                        <p className="font-sans text-xs uppercase tracking-[0.1em] text-gray-500">
                          {date}
                        </p>
                      )}
                      <h3 className="mt-2 font-display text-xl leading-snug transition-colors group-hover:text-gold-deep">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-500">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="mt-3 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors group-hover:text-gold-deep">
                        Read more <span aria-hidden="true">&rarr;</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ) : (
          <Reveal delay={0.08} className="mt-8">
            <p className="max-w-xl text-base leading-relaxed text-ink/70">
              Follow F.F Real Estate on Facebook for new listings and updates.
            </p>
          </Reveal>
        )}

        {facebookUrl && (
          <Reveal delay={0.12} className="mt-10">
            <Button
              as="a"
              href={facebookUrl}
              variant="outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow on Facebook
            </Button>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
