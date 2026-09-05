import { Button } from "./ui/Button";
import { MicroLabel } from "./ui/MicroLabel";

interface EmptyStateProps {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
}

/** Calm placeholder for lists with no results yet. */
export function EmptyState({ title, body, ctaHref, ctaLabel }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-paper px-8 py-14 text-center">
      <MicroLabel as="p">Nothing here yet</MicroLabel>
      <h3 className="mt-3 font-display text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">{body}</p>
      {ctaHref && ctaLabel && (
        <div className="mt-6">
          <Button as="a" href={ctaHref} variant="outline">
            {ctaLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
