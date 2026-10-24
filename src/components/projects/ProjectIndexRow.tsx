import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { content } from "@/data/content";
import { getCaseStudy, getCategoryLabel, getLiveUrl } from "@/lib/projects";
import { pad } from "@/lib/utils";
import type { Project } from "@/types/portfolio";

/** One row of the projects index. The title link stretches over the row. */
export function ProjectIndexRow({ project, index }: { project: Project; index: number }) {
  const liveUrl = getLiveUrl(project);
  const hasCaseStudy = getCaseStudy(project) !== null;

  return (
    <article className="relative grid grid-cols-[2.25rem_1fr] gap-x-4 border-b border-line py-8 transition-colors duration-500 group-hover/row:border-line-strong md:grid-cols-[3rem_1fr_auto] md:gap-x-6 md:py-10">
      <span className="pt-2 font-mono text-xs text-fg-subtle transition-colors duration-300 group-data-[active=true]/row:text-accent">
        {pad(index + 1)}
      </span>

      <div className="min-w-0">
        <div className="mb-6 lg:hidden">
          <ProjectMedia project={project} className="aspect-[16/10]" sizes="(min-width: 768px) 80vw, 100vw" />
        </div>
        <p className="label-mono flex flex-wrap gap-x-3 gap-y-1 text-fg-subtle">
          <span>{getCategoryLabel(project.category)}</span>
          <span aria-hidden>·</span>
          <span>{project.period}</span>
          {hasCaseStudy ? (
            <>
              <span aria-hidden>·</span>
              <span className="text-accent">{content.projectsPage.caseStudyTag}</span>
            </>
          ) : null}
        </p>
        <h2 className="mt-3 text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] leading-[1.05] font-semibold tracking-[-0.035em]">
          <Link
            href={`/projects/${project.slug}`}
            className="transition-colors duration-300 group-hover/row:text-fg after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-fg-muted">{project.shortDescription}</p>
        <p className="mt-5 text-sm text-fg">{project.role}</p>
        <p className="mt-1.5 font-mono text-[0.8125rem] leading-relaxed text-fg-subtle">{project.technologies.join(" · ")}</p>
        {liveUrl ? (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${content.work.liveSite}: ${project.title} (opens in a new tab)`}
            className="relative z-10 mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent"
          >
            {content.work.liveSite}
            <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.75} />
          </a>
        ) : null}
      </div>

      <span
        aria-hidden
        className="hidden size-12 items-center justify-center self-start rounded-full border border-line-strong transition-[transform,background-color,border-color] duration-700 ease-out-expo group-hover/row:rotate-45 group-hover/row:border-accent group-hover/row:bg-accent md:inline-flex"
      >
        <ArrowUpRight className="size-5 transition-colors group-hover/row:text-ink-950" strokeWidth={1.5} />
      </span>
    </article>
  );
}
