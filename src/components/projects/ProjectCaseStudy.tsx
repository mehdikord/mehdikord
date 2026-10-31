import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { MaskedHeading } from "@/components/motion/MaskedHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getDictionary } from "@/data/dictionaries";
import type { Locale } from "@/i18n/config";
import { localePath, localizeDigits, pad } from "@/i18n/format";
import { getLocale } from "@/i18n/server";
import { getAdjacentProjects, getCaseStudy, getLiveUrl } from "@/lib/projects";
import { cn, displayUrl } from "@/lib/utils";
import type { CaseStudyNote, Project } from "@/types/portfolio";

function Block({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("border-t border-line pt-8", className)}>
      <Reveal still>
        <h2 className="label-mono text-fg-subtle">{title}</h2>
      </Reveal>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function NoteGrid({ notes, marker, locale }: { notes: readonly CaseStudyNote[]; marker: "index" | "arrow"; locale: Locale }) {
  return (
    <RevealGroup as="ol" className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
      {notes.map((note, index) => (
        <RevealItem as="li" key={note.title} className="bg-ink-950 p-6 sm:p-7 sm:odd:last:col-span-2">
          <span className="font-mono text-xs text-accent">{marker === "index" ? pad(locale, index + 1) : <span className="inline-block rtl:-scale-x-100">→</span>}</span>
          <h3 className="mt-4 text-lg font-medium tracking-tight text-balance">{note.title}</h3>
          <p className="mt-2.5 text-[0.9375rem] text-pretty text-fg-muted">{note.detail}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function BulletList({ items, locale }: { items: readonly string[]; locale: Locale }) {
  return (
    <RevealGroup as="ul" className="divide-y divide-line">
      {items.map((item, index) => (
        <RevealItem as="li" key={item} className="flex gap-5 py-4 text-pretty first:pt-0">
          <span className="w-6 shrink-0 pt-1 font-mono text-xs text-fg-subtle">{pad(locale, index + 1)}</span>
          <span>{item}</span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/** Shared template for every project page: full case study or overview. */
export async function ProjectCaseStudy({ project, index }: { project: Project; index: number }) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const copy = dictionary.caseStudy;
  const study = getCaseStudy(project);
  const liveUrl = getLiveUrl(project);
  const adjacent = await getAdjacentProjects(locale, project.slug);
  const period = localizeDigits(locale, project.period);
  const arrowBack =
    "size-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1 rtl:-scale-x-100 rtl:group-hover:translate-x-1";
  const arrowForward =
    "size-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1";
  const [leadParagraph, ...paragraphs] = project.fullDescription;

  const meta = [
    { label: copy.role, value: project.role },
    { label: copy.category, value: project.categoryLabel },
    { label: copy.period, value: period },
  ];

  return (
    <article>
      <header className="container-page pt-[calc(var(--nav-h)+3.5rem)] md:pt-[calc(var(--nav-h)+6rem)]">
        <Reveal still>
          <Link
            href={localePath(locale, "/projects")}
            className="group label-mono inline-flex items-center gap-2 text-fg-subtle transition-colors hover:text-fg"
          >
            <ArrowLeft aria-hidden className={arrowBack} />
            {copy.back}
          </Link>
        </Reveal>

        <Reveal still className="label-mono mt-14 flex flex-wrap items-center gap-x-3 gap-y-1 text-fg-subtle md:mt-20">
          <span className="text-accent">
            {dictionary.work.indexPrefix}
            {pad(locale, index + 1)}
          </span>
          <span>{project.categoryLabel}</span>
          <span aria-hidden>·</span>
          <span>{period}</span>
          <span aria-hidden>·</span>
          <span>{study ? copy.caseStudyLabel : copy.overviewLabel}</span>
        </Reveal>

        <MaskedHeading
          as="h1"
          lines={[{ text: project.title }]}
          className="mt-6 text-[clamp(2.5rem,1.2rem+5.6vw,6.75rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-balance"
        />

        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal delay={0.15} className="md:col-span-7">
            <p className="text-lead text-pretty text-fg-muted">{project.shortDescription}</p>
          </Reveal>
          {liveUrl ? (
            <Reveal delay={0.25} className="md:col-span-4 md:col-start-9 md:justify-self-end">
              <ButtonLink href={liveUrl} external icon="up-right" ariaLabel={`${copy.live}: ${project.title} (${dictionary.contact.opensInNewTab})`}>
                {copy.live}
              </ButtonLink>
            </Reveal>
          ) : null}
        </div>
      </header>

      <Reveal className="container-page mt-14 md:mt-20">
        <ProjectMedia
          project={project}
          effect="parallax"
          preload
          className="aspect-[4/3] md:aspect-[16/9]"
          sizes="(min-width: 1440px) 1392px, 100vw"
        />
      </Reveal>

      <div className="container-page mt-20 grid gap-16 pb-(--section-y) md:mt-28 lg:grid-cols-12 lg:gap-x-8">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)]">
            <dl className="divide-y divide-line border-y border-line">
              {meta.map((item) => (
                <div key={item.label} className="grid grid-cols-[7rem_1fr] gap-4 py-4">
                  <dt className="label-mono pt-0.5 text-fg-subtle">{item.label}</dt>
                  <dd className="text-sm">{item.value}</dd>
                </div>
              ))}
              <div className="py-4">
                <dt className="label-mono text-fg-subtle">{copy.stack}</dt>
                <dd className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span key={technology} dir="ltr" className="rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-fg-muted">
                      {technology}
                    </span>
                  ))}
                </dd>
              </div>
              {liveUrl ? (
                <div className="grid grid-cols-[7rem_1fr] gap-4 py-4">
                  <dt className="label-mono pt-0.5 text-fg-subtle">{copy.liveLabel}</dt>
                  <dd className="min-w-0 text-sm">
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      className="inline-flex max-w-full items-center gap-1.5 underline decoration-line-strong underline-offset-4 hover:decoration-accent"
                    >
                      <span className="truncate">{displayUrl(liveUrl)}</span>
                      <ArrowUpRight aria-hidden className="size-3.5 shrink-0" />
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </aside>

        <div className="space-y-20 lg:col-span-7 lg:col-start-6">
          <Block title={copy.overview}>
            {leadParagraph ? (
              <Reveal>
                <p className="text-lead text-pretty">{leadParagraph}</p>
              </Reveal>
            ) : null}
            {paragraphs.map((paragraph) => (
              <Reveal key={paragraph}>
                <p className="mt-6 text-pretty text-fg-muted">{paragraph}</p>
              </Reveal>
            ))}
            {study ? null : (
              <Reveal>
                <p className="mt-10 rounded-md border border-dashed border-line-strong p-5 text-sm text-pretty text-fg-subtle">
                  {copy.overviewOnly}
                </p>
              </Reveal>
            )}
          </Block>

          {study ? (
            <Block title={copy.context}>
              <Reveal>
                <p className="text-pretty text-fg-muted">{study.context}</p>
              </Reveal>
            </Block>
          ) : null}

          {project.responsibilities.length > 0 ? (
            <Block title={copy.responsibilities}>
              <BulletList items={project.responsibilities} locale={locale} />
            </Block>
          ) : null}

          {project.highlights.length > 0 ? (
            <Block title={copy.highlights}>
              <BulletList items={project.highlights} locale={locale} />
            </Block>
          ) : null}

          {study && study.challenges.length > 0 ? (
            <Block title={copy.challenges}>
              <NoteGrid notes={study.challenges} marker="index" locale={locale} />
            </Block>
          ) : null}

          {study && study.decisions.length > 0 ? (
            <Block title={copy.decisions}>
              <NoteGrid notes={study.decisions} marker="arrow" locale={locale} />
            </Block>
          ) : null}

          {study?.implementation && study.implementation.length > 0 ? (
            <Block title={copy.implementation}>
              <RevealGroup as="ul" className="space-y-3 text-[0.9375rem] leading-relaxed text-fg-muted">
                {study.implementation.map((item) => (
                  <RevealItem as="li" key={item} className="flex gap-3">
                    <span aria-hidden className="inline-block text-accent rtl:-scale-x-100">
                      ›
                    </span>
                    {item}
                  </RevealItem>
                ))}
              </RevealGroup>
            </Block>
          ) : null}

          {project.gallery.length > 0 ? (
            <Block title={copy.gallery}>
              <div className="grid gap-6">
                {project.gallery.map((image) => (
                  <Reveal key={image.src}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="w-full rounded-md border border-line"
                    />
                  </Reveal>
                ))}
              </div>
            </Block>
          ) : null}
        </div>
      </div>

      {adjacent ? (
        <nav aria-label={copy.projectNavigation} className="border-t border-line">
          <div className="container-page grid md:grid-cols-2">
            {[
              { project: adjacent.previous, label: copy.previous, direction: "previous" as const },
              { project: adjacent.next, label: copy.next, direction: "next" as const },
            ].map(({ project: target, label, direction }) => (
              <Link
                key={direction}
                href={localePath(locale, `/projects/${target.slug}`)}
                rel={direction === "next" ? "next" : "prev"}
                className={cn(
                  "group flex flex-col gap-4 py-12 transition-colors md:py-16",
                  direction === "next"
                    ? "border-t border-line md:items-end md:border-s md:border-t-0 md:ps-10 md:text-end"
                    : "md:pe-10",
                )}
              >
                <span className="label-mono inline-flex items-center gap-2 text-fg-subtle">
                  {direction === "previous" ? (
                    <ArrowLeft aria-hidden className={arrowBack} />
                  ) : null}
                  {label}
                  {direction === "next" ? (
                    <ArrowRight aria-hidden className={arrowForward} />
                  ) : null}
                </span>
                <span className="text-[clamp(1.75rem,1.2rem+2vw,3.25rem)] leading-none font-semibold tracking-[-0.04em] transition-colors duration-300 group-hover:text-accent">
                  {target.title}
                </span>
                <span className="text-sm text-fg-subtle">{target.categoryLabel}</span>
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </article>
  );
}
