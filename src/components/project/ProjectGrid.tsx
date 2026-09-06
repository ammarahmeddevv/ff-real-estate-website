import type { ProjectSummary } from "@/lib/sanity/types";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: ProjectSummary[];
}

/** Responsive 1 / 2 / 3-column grid of project cards. */
export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
