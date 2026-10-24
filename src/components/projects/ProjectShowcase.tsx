import Link from "next/link";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { ProjectSummary } from "@/components/projects/ProjectSummary";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/portfolio";

type Layout = "feature" | "split" | "split-reverse" | "light" | "duo" | "wide";

/** Editorial rhythm for the homepage. Each entry consumes one project, `duo` two. */
const rhythm: readonly Layout[] = ["feature", "split", "split-reverse", "light", "duo", "split", "wide"];

interface Block {
  layout: Layout;
  items: { project: Project; index: number }[];
}

function toBlocks(projects: readonly Project[]): Block[] {
  const blocks: Block[] = [];
  let cursor = 0;
  let step = 0;
  while (cursor < projects.length) {
    let layout = rhythm[step % rhythm.length] ?? "split";
    // A trailing duo with a single project falls back to a split.
    if (layout === "duo" && cursor === projects.length - 1) layout = "split";
    const count = layout === "duo" ? 2 : 1;
    const items = projects.slice(cursor, cursor + count).map((project, offset) => ({ project, index: cursor + offset }));
    blocks.push({ layout, items });
    cursor += count;
    step += 1;
  }
  return blocks;
}

/** The decorative media link duplicates the title link, so it is skipped by keyboard and screen readers. */
function MediaLink({ project, children, className }: { project: Project; children: ReactNode; className?: string }) {
  return (
    <Link href={`/projects/${project.slug}`} tabIndex={-1} aria-hidden className={cn("block", className)}>
      {children}
    </Link>
  );
}

function renderBlock({ layout, items }: Block): ReactNode {
  const [first, second] = items;
  if (!first) return null;
  const { project, index } = first;

  switch (layout) {
    case "feature":
    case "wide":
      return (
        <article className="group">
          <Reveal>
            <MediaLink project={project}>
              <ProjectMedia
                project={project}
                effect="parallax"
                sizes="(min-width: 1440px) 1392px, 100vw"
                className={layout === "feature" ? "aspect-[4/3] md:aspect-[16/9]" : "aspect-[4/3] md:aspect-[21/9]"}
              />
            </MediaLink>
          </Reveal>
          <ProjectSummary project={project} index={index} size="lg" wide className="mt-10 md:mt-14" />
        </article>
      );

    case "split":
    case "split-reverse": {
      const reverse = layout === "split-reverse";
      return (
        <article className="group grid items-center gap-10 md:grid-cols-12 md:gap-x-8">
          <Reveal className={cn("md:col-span-7 md:row-start-1", reverse ? "md:col-start-6" : "md:col-start-1")}>
            <MediaLink project={project}>
              <ProjectMedia project={project} effect="tilt" className="aspect-[4/3]" sizes="(min-width: 768px) 58vw, 100vw" />
            </MediaLink>
          </Reveal>
          <ProjectSummary
            project={project}
            index={index}
            className={cn(
              "md:row-start-1 md:col-span-5 lg:col-span-4",
              reverse ? "md:col-start-1" : "md:col-start-8 lg:col-start-9",
            )}
          />
        </article>
      );
    }

    case "light":
      return (
        <Reveal>
          <article className="group relative overflow-hidden rounded-lg bg-paper px-5 py-10 text-paper-ink sm:px-10 sm:py-14 lg:px-16 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-x-12">
              <ProjectSummary project={project} index={index} light className="lg:col-span-4" />
              <MediaLink project={project} className="lg:col-span-8">
                <ProjectMedia project={project} surface="light" className="aspect-[4/3] sm:aspect-[16/10]" sizes="(min-width: 1024px) 60vw, 100vw" />
              </MediaLink>
            </div>
          </article>
        </Reveal>
      );

    case "duo":
      return (
        <div className="grid gap-24 md:grid-cols-12 md:gap-x-8 md:gap-y-0">
          <article className="group md:col-span-6">
            <Reveal>
              <MediaLink project={project}>
                <ProjectMedia project={project} effect="tilt" className="aspect-[4/3] md:aspect-[4/5]" sizes="(min-width: 768px) 48vw, 100vw" />
              </MediaLink>
            </Reveal>
            <ProjectSummary project={project} index={index} className="mt-10" />
          </article>
          {second ? (
            <article className="group md:col-span-5 md:col-start-8 md:mt-48">
              <Reveal>
                <MediaLink project={second.project}>
                  <ProjectMedia project={second.project} effect="tilt" className="aspect-[4/3]" sizes="(min-width: 768px) 40vw, 100vw" />
                </MediaLink>
              </Reveal>
              <ProjectSummary project={second.project} index={second.index} className="mt-10" />
            </article>
          ) : null}
        </div>
      );
  }
}

/** Varied editorial presentation of the featured projects. */
export function ProjectShowcase({ projects }: { projects: readonly Project[] }) {
  return (
    <div className="space-y-28 md:space-y-44">
      {toBlocks(projects).map((block) => (
        <div key={block.items.map((item) => item.project.id).join("+")}>{renderBlock(block)}</div>
      ))}
    </div>
  );
}
