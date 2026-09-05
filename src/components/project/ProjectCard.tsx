import Image from "next/image";
import Link from "next/link";
import type { ProjectStatus, ProjectSummary } from "@/lib/sanity/types";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  upcoming: "Upcoming",
  in_progress: "In Progress",
  completed: "Completed",
};

/** Imageless media panel — matches PropertyCard so grids read as one system. */
function ImagelessPanel({ label }: { label: string }) {
  return (
    <div className="relative flex h-full items-center justify-center bg-ink px-6 text-center">
      <span className="font-display text-2xl leading-tight text-ivory">
        {label}
      </span>
      <span aria-hidden="true">
        <span className="absolute inset-x-5 bottom-6 h-px bg-gold/15" />
        <span className="absolute bottom-4 right-4 h-8 w-px bg-gold/70" />
        <span className="absolute bottom-4 right-4 h-px w-8 bg-gold/70" />
      </span>
    </div>
  );
}

interface ProjectCardProps {
  project: ProjectSummary;
}

/** Same visual language as PropertyCard. Links to `/projects/<slug>`. */
export function ProjectCard({ project }: ProjectCardProps) {
  const image = project.heroImage;
  const typeLabel = project.projectType?.trim() || "Development";
  const statusLabel = project.status ? STATUS_LABEL[project.status] : null;

  return (
    <article className="group">
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`View project ${project.name}, ${project.location}`}
        className="block rounded-[6px] border border-gray-200 bg-paper p-3 transition-colors duration-200 hover:border-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-0.5"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[4px]">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || project.name}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
              placeholder={image.lqip ? "blur" : "empty"}
              blurDataURL={image.lqip ?? undefined}
            />
          ) : (
            <ImagelessPanel label={typeLabel} />
          )}
        </div>

        <div className="px-1 pb-1 pt-4">
          <p className="u-micro-label">Project</p>
          <h3 className="mt-1.5 font-display text-lg leading-snug text-ink">
            {project.name}
          </h3>
          <p className="mt-1 font-sans text-sm text-gray-500">
            {project.location}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {statusLabel && (
              <span className="rounded-full border border-gold/50 px-2.5 py-0.5 font-sans text-[0.68rem] uppercase tracking-[0.1em] text-gold-deep">
                {statusLabel}
              </span>
            )}
            <span className="rounded-full border border-gray-200 px-2.5 py-0.5 font-sans text-xs text-gray-500">
              {typeLabel}
            </span>
          </div>

          <span className="mt-4 inline-flex items-center gap-1 font-sans text-sm text-gray-500 transition-colors group-hover:text-gold-deep">
            View project
            <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
