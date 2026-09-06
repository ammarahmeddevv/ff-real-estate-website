import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  NEWS_BY_SLUG_QUERY,
  NEWS_SLUGS_QUERY,
  getSiteSettings,
  sanityFetch,
} from "@/lib/sanity";
import type { NewsPost } from "@/lib/sanity/types";
import { NEWS_CATEGORY_LABEL } from "@/lib/property-labels";
import { formatDate } from "@/lib/format";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PortableText } from "@/components/content/PortableText";

export const revalidate = 60;
export const dynamicParams = true;

type Params = { slug: string };

// Deduped per request: called by both `generateMetadata` and the page component.
const getPost = cache(
  async (slug: string): Promise<NewsPost | null> =>
    sanityFetch<NewsPost | null>({
      query: NEWS_BY_SLUG_QUERY,
      params: { slug },
      tags: ["newsPost"],
      fallback: null,
    }),
);

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: NEWS_SLUGS_QUERY,
    tags: ["newsPost"],
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
  const post = await getPost(slug);

  if (!post) {
    return {
      description:
        "News and market updates from F.F Real Estate in Karachi.",
    };
  }

  const description =
    post.excerpt?.trim() ||
    `${NEWS_CATEGORY_LABEL[post.category] ?? "Update"} from F.F Real Estate, Karachi.`;
  const ogImage = post.coverImage?.url ?? undefined;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSiteSettings()]);

  if (!post) notFound();

  const category = NEWS_CATEGORY_LABEL[post.category] ?? "Update";
  const date = post.publishedAt ? formatDate(post.publishedAt) : "";
  const cover = post.coverImage?.url ? post.coverImage : null;
  const whatsappHref = buildWhatsAppLink({
    phone: settings.primaryWhatsapp,
    message: `Hello F.F Real Estate, I have a question about your update: "${post.title}".`,
  });

  return (
    <article className="pb-20 pt-8 md:pt-12">
      {/* Task 17: Article JSON-LD */}
      <Container>
        <nav className="mb-6 font-sans text-sm text-gray-500">
          <Link href="/news" className="transition-colors hover:text-gold-deep">
            &larr; Back to news
          </Link>
        </nav>

        <header className="mx-auto max-w-prose">
          <p className="u-micro-label">{category}</p>
          <h1 className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl">
            {post.title}
          </h1>
          {date && (
            <p className="mt-3 font-sans text-sm uppercase tracking-[0.1em] text-gray-500">
              {date}
            </p>
          )}
        </header>

        {cover && (
          <div className="relative mx-auto mt-8 aspect-[16/9] max-w-3xl overflow-hidden rounded-[6px] border border-gray-200">
            <Image
              src={cover.url as string}
              alt={cover.alt || post.title}
              fill
              priority
              sizes="(min-width: 1024px) 768px, 100vw"
              placeholder={cover.lqip ? "blur" : "empty"}
              blurDataURL={cover.lqip ?? undefined}
              className="object-cover"
            />
          </div>
        )}

        <div className="mx-auto mt-8 max-w-prose">
          <PortableText value={post.body} />
        </div>

        <div className="mx-auto mt-12 max-w-prose border-t border-gray-200 pt-8">
          <Link
            href="/news"
            className="font-sans text-sm text-gray-500 transition-colors hover:text-gold-deep"
          >
            &larr; Back to news
          </Link>

          <div className="mt-8 rounded-lg border border-gray-200 bg-paper p-6">
            <p className="font-display text-xl leading-snug text-ink">
              Have a question about this?
            </p>
            <p className="mt-2 font-sans text-base leading-relaxed text-gray-500">
              Message us on WhatsApp and we&rsquo;ll get back to you.
            </p>
            <Button
              as="a"
              href={whatsappHref}
              variant="solid"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5"
            >
              Message us on WhatsApp
            </Button>
          </div>
        </div>
      </Container>
    </article>
  );
}
