import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { content } from "@/data/content";
import { getAllProjects, getFeaturedProjects } from "@/lib/projects";
import { pad } from "@/lib/utils";

export function FeaturedProjectsSection() {
  const copy = content.work;
  const featured = getFeaturedProjects();
  const total = getAllProjects().length;

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-(--section-y)">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[64rem] bg-[radial-gradient(ellipse_45%_35%_at_72%_40%,rgb(130_87_255/0.10),transparent_70%)]"
      />
      <div className="container-page relative">
        <SectionHeader index={copy.index} label={copy.label} title={copy.title} titleId="work-title" intro={copy.intro} />

        <div className="mt-20 md:mt-28">
          <ProjectShowcase projects={featured} />
        </div>

        <Reveal className="mt-28 md:mt-44">
          <Link
            href="/projects"
            className="group flex flex-col gap-6 border-y border-line py-10 transition-colors duration-500 hover:border-accent/40 md:flex-row md:items-center md:justify-between md:py-14"
          >
            <span className="label-mono text-fg-subtle">
              <span className="text-accent">{pad(total)}</span> {content.projectsPage.projectsNoun} · {copy.exploreAllHint}
            </span>
            <span className="flex items-center justify-between gap-6 md:justify-end">
              <span className="text-[clamp(2rem,1.2rem+3.6vw,4.75rem)] leading-none font-semibold tracking-[-0.045em] transition-colors duration-500 group-hover:text-accent">
                {copy.exploreAll}
              </span>
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-line-strong transition-[background-color,border-color,transform] duration-700 ease-out-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent md:size-20">
                <ArrowUpRight aria-hidden className="size-6 transition-colors group-hover:text-ink-950 md:size-8" strokeWidth={1.5} />
              </span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
