import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { content } from "@/data/content";
import { getCaseStudy, getCategoryLabel, getLiveUrl } from "@/lib/projects";
import { cn, pad } from "@/lib/utils";
import type { Project } from "@/types/portfolio";

interface ProjectSummaryProps {
  project: Project;
  index: number;
  size?: "md" | "lg";
  /** Two-column arrangement: heading left, details right. */
  wide?: boolean;
  light?: boolean;
  className?: string;
}

/** Title, description, role, stack and actions for one project. */
export function ProjectSummary({ project, index, size = "md", wide = false, light = false, className }: ProjectSummaryProps) {
  const href = `/projects/${project.slug}`;
  const liveUrl = getLiveUrl(project);
  const hasCaseStudy = getCaseStudy(project) !== null;
  const tone = {
    label: light ? "text-paper-muted" : "text-fg-subtle",
    muted: light ? "text-paper-muted" : "text-fg-muted",
    line: light ? "border-paper-line" : "border-line",
    accent: light ? "text-accent-strong" : "text-accent",
  };

  const heading = (
    <div>
      <p className={cn("label-mono flex flex-wrap items-center gap-x-3 gap-y-1", tone.label)}>
        <span className={tone.accent}>P/{pad(index + 1)}</span>
        <span>{getCategoryLabel(project.category)}</span>
        <span aria-hidden>·</span>
        <span>{project.period}</span>
      </p>
      <h3
        className={cn(
          "mt-5 font-semibold text-balance",
          size === "lg"
            ? "text-[clamp(2.1rem,1.4rem+2.8vw,4rem)] leading-[1] tracking-[-0.045em]"
            : "text-[clamp(1.75rem,1.3rem+1.5vw,2.6rem)] leading-[1.04] tracking-[-0.035em]",
        )}
      >
        <Link
          href={href}
          className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-out-expo group-hover:bg-[length:100%_1px]"
        >
          {project.title}
        </Link>
      </h3>
    </div>
  );

  const details = (
    <div>
      <p className={cn("max-w-xl text-pretty", tone.muted, wide ? "" : "mt-5")}>{project.shortDescription}</p>
      <dl
        className={cn(
          "mt-7 grid gap-x-8 gap-y-3 border-t pt-5 text-sm sm:grid-cols-[4.5rem_1fr]",
          tone.line,
        )}
      >
        <dt className={cn("label-mono pt-0.5", tone.label)}>{content.work.roleLabel}</dt>
        <dd>{project.role}</dd>
        <dt className={cn("label-mono pt-0.5", tone.label)}>{content.work.stackLabel}</dt>
        <dd className={cn("font-mono text-[0.8125rem] leading-relaxed", tone.muted)}>
          {project.technologies.join(" · ")}
        </dd>
      </dl>
      <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
        <ButtonLink href={href} variant="ghost" icon="right" onLight={light}>
          {hasCaseStudy ? content.work.caseStudy : content.work.overview}
        </ButtonLink>
        {liveUrl ? (
          <ButtonLink
            href={liveUrl}
            external
            variant="ghost"
            icon="up-right"
            onLight={light}
            ariaLabel={`${content.work.liveSite}: ${project.title} (opens in a new tab)`}
          >
            {content.work.liveSite}
          </ButtonLink>
        ) : null}
      </div>
    </div>
  );

  if (wide) {
    return (
      <Reveal className={cn("grid gap-8 md:grid-cols-12 md:gap-x-8", className)}>
        <div className="md:col-span-6">{heading}</div>
        <div className="md:col-span-5 md:col-start-8 md:pt-9">{details}</div>
      </Reveal>
    );
  }

  return (
    <Reveal className={className}>
      {heading}
      {details}
    </Reveal>
  );
}
