import type { NewsSummary } from "@/lib/sanity/types";
import { NewsCard } from "./NewsCard";

interface NewsGridProps {
  posts: NewsSummary[];
}

/** Responsive 1 / 2 / 3-column grid of news cards. */
export function NewsGrid({ posts }: NewsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {posts.map((post) => (
        <NewsCard key={post._id} post={post} />
      ))}
    </div>
  );
}
