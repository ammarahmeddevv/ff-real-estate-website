import Image from "next/image";
import Link from "next/link";
import type { NewsSummary } from "@/lib/sanity/types";
import { NEWS_CATEGORY_LABEL } from "@/lib/property-labels";
import { formatDate } from "@/lib/format";

interface NewsCardProps {
  post: NewsSummary;
}

/**
 * Editorial news card. Two states, one shell:
 * - with `coverImage` — a 16:9 `next/image` with an LQIP blur;
 * - without — a composed `paper` card led by a gold rule, matching the site's
 *   imageless language (never a broken/grey image slot).
 * The whole card is a single link.
 */
export function NewsCard({ post }: NewsCardProps) {
  const category = NEWS_CATEGORY_LABEL[post.category] ?? "Update";
  const date = post.publishedAt ? formatDate(post.publishedAt) : "";
  const cover = post.coverImage?.url ? post.coverImage : null;

  return (
    <article className="group h-full">
      <Link
        href={`/news/${post.slug}`}
        aria-label={`Read article: ${post.title}`}
        className="flex h-full flex-col overflow-hidden rounded-[6px] border border-gray-200 bg-paper transition-colors duration-200 hover:border-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-0.5"
      >
        {cover ? (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={cover.url as string}
              alt={cover.alt || post.title}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
              placeholder={cover.lqip ? "blur" : "empty"}
              blurDataURL={cover.lqip ?? undefined}
            />
          </div>
        ) : (
          <div aria-hidden="true" className="h-1 w-full bg-gold" />
        )}

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <p className="u-micro-label">{category}</p>
          <h3 className="mt-2 font-display text-xl leading-snug text-ink transition-colors group-hover:text-gold-deep">
            {post.title}
          </h3>
          {date && (
            <p className="mt-1.5 font-sans text-xs uppercase tracking-[0.1em] text-gray-500">
              {date}
            </p>
          )}
          {post.excerpt && (
            <p className="mt-3 line-clamp-3 font-sans text-sm leading-relaxed text-gray-500">
              {post.excerpt}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 font-sans text-sm text-gray-500 transition-colors group-hover:text-gold-deep">
            Read article
            <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
