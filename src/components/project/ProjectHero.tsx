import Image from "next/image";
import type { Project } from "@/lib/sanity/types";
import { PROJECT_STATUS_LABEL } from "@/lib/property-labels";

interface ProjectHeroProps {
  project: Project;
}

/**
 * Full-width project hero. With a `heroImage` it fills the frame at a wide
 * ratio behind a dark scrim; without one it falls back to a composed ink band
 * (echoing `<ImagelessPanel>`'s gold corner) so a project with no photography
 * still reads as intentional rather than broken. The name, location, type and
 * status badge sit at the bottom of the frame in both cases.
 */
export function ProjectHero({ project }: ProjectHeroProps) {
  const image = project.heroImage;
  const typeLabel = project.projectType?.trim() || "Development";
  const statusLabel = project.status
    ? PROJECT_STATUS_LABEL[project.status]
    : null;

  const caption = (
    <div className="mx-auto w-full max-w-content px-5 md:px-8">
      <p className="u-micro-label !text-gold">Project</p>
      <h1 className="mt-3 max-w-3xl font-display text-3xl leading-tight md:text-5xl">
        {project.name}
      </h1>
      <p className="mt-3 font-sans text-base text-ivory/80">
        {project.location}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {statusLabel && (
          <span className="rounded-full border border-gold/60 px-3 py-0.5 font-sans text-[0.7rem] uppercase tracking-[0.1em] text-gold">
            {statusLabel}
          </span>
        )}
        <span className="rounded-full border border-ivory/25 px-3 py-0.5 font-sans text-xs text-ivory/80">
          {typeLabel}
        </span>
      </div>
    </div>
  );

  if (!image?.url) {
    return (
      <header className="relative isolate overflow-hidden bg-ink py-16 text-ivory md:py-24">
        {caption}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0"
        >
          <span className="absolute inset-x-6 bottom-8 h-px bg-gold/15 md:inset-x-8" />
          <span className="absolute bottom-5 right-6 h-9 w-px bg-gold/70 md:right-8" />
          <span className="absolute bottom-5 right-6 h-px w-9 bg-gold/70 md:right-8" />
        </span>
      </header>
    );
  }

  return (
    <header className="relative isolate overflow-hidden bg-ink text-ivory">
      <div className="relative aspect-[16/11] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        <Image
          src={image.url}
          alt={image.alt || project.name}
          fill
          priority
          sizes="100vw"
          placeholder={image.lqip ? "blur" : "empty"}
          blurDataURL={image.lqip ?? undefined}
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/10"
        />
        <div className="absolute inset-x-0 bottom-0 pb-8 md:pb-12">{caption}</div>
      </div>
    </header>
  );
}
