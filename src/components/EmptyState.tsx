import { Button } from "./ui/Button";
import { MicroLabel } from "./ui/MicroLabel";

interface EmptyStateProps {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
  headingLevel?: 2 | 3;
}

/** Calm placeholder for lists with no results yet. */
export function EmptyState({
  title,
  body,
  ctaHref,
  ctaLabel,
  headingLevel = 2,
}: EmptyStateProps) {
  const HeadingTag = headingLevel === 3 ? "h3" : "h2";
  const isExternal = ctaHref?.startsWith("http");
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-paper px-8 py-14 text-center">
      <MicroLabel as="p">Coming soon</MicroLabel>
      <HeadingTag className="mt-3 font-display text-2xl">{title}</HeadingTag>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">{body}</p>
      {ctaHref && ctaLabel && (
        <div className="mt-6">
          <Button
            as="a"
            href={ctaHref}
            variant="outline"
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {ctaLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
