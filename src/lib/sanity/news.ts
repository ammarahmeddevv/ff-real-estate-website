import { cache } from "react";
import { sanityFetch } from "./fetch";

const NEWS_COUNT_QUERY = `count(*[_type == "newsPost" && defined(slug.current)])`;

/**
 * True when at least one published news post exists. Used by the layout to
 * decide whether the "News" link appears in the nav and footer. Deduped per
 * request with `cache()`; returns `false` with no CMS configured.
 */
export const hasNews = cache(async (): Promise<boolean> => {
  const count = await sanityFetch<number>({
    query: NEWS_COUNT_QUERY,
    tags: ["newsPost"],
    fallback: 0,
  });
  return count > 0;
});
