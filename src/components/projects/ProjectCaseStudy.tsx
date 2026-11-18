import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { MaskedHeading } from "@/components/motion/MaskedHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { DeviceShowcase } from "@/components/projects/DeviceShowcase";
import { getProjectShot, PreviewNotice, ProjectAmbient } from "@/components/projects/ProjectMedia";
import { ShotImage } from "@/components/projects/ShotImage";
import { ShotViewerButton } from "@/components/projects/ShotViewer";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getDictionary } from "@/data/dictionaries";
import type { Locale } from "@/i18n/config";
import { interpolate, localePath, localizeDigits, pad } from "@/i18n/format";
import { getLocale } from "@/i18n/server";
import { getAdjacentProjects, getAllProjects, getCaseStudy, getLiveUrl } from "@/lib/projects";
import { aspectOf } from "@/lib/screenshots";
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

/** "https://www.example.com/path" → "example.com" */
function liveHost(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** The project's site on a desktop display, scrolling as the visitor scrolls. */
async function ProjectDevice({ project, address }: { project: Project; address: string }) {
  const copy = getDictionary(await getLocale()).caseStudy;
  const shot = await getProjectShot(project);
  const widest = shot.full[0];
  // The screen is ~92vw on phones, and at most ~1240px wide on large displays.
  const screenSizes = "(min-width: 1280px) 1240px, 92vw";

  return (
    <div className="project-device container-page mt-14 md:mt-20">
      <DeviceShowcase
        title={project.title}
        address={address}
        aspect={aspectOf(shot.full)}
        pageSize={shot.placeholder || !widest ? undefined : { width: widest.width, height: widest.height }}
        screen={
          <>
            <ShotImage renditions={shot.full} alt={shot.alt} sizes={screenSizes} eager />
            {shot.placeholder ? <PreviewNotice placement="top" /> : null}
          </>
        }
        viewer={<ShotImage renditions={shot.full} alt={shot.alt} sizes="(min-width: 1344px) 1344px, 100vw" />}
        ambient={<ProjectAmbient project={project} />}
        labels={{
          screen: copy.screenLabel,
          hint: copy.screenHint,
          fullPage: copy.fullPage,
          fullPageAria: interpolate(copy.fullPageAria, { title: project.title }),
          close: copy.closeViewer,
          pageSize: copy.pageSize,
          scrolled: copy.scrolled,
        }}
      />
    </div>
  );
}

/** Shared template for every project page: full case study or overview. */
export async function ProjectCaseStudy({ project, index }: { project: Project; index: number }) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const copy = dictionary.caseStudy;
  const study = getCaseStudy(project);
  const liveUrl = getLiveUrl(project);
  const [adjacent, total] = await Promise.all([
    getAdjacentProjects(locale, project.slug),
    getAllProjects(locale).then((projects) => projects.length),
  ]);
  const period = localizeDigits(locale, project.period);
  const arrowBack =
    "size-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1 rtl:-scale-x-100 rtl:group-hover:translate-x-1";
  const arrowForward =
    "size-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1";
  const [leadParagraph, ...paragraphs] = project.fullDescription;
  const address = liveHost(liveUrl) ?? project.title;

  const meta = [
    { label: copy.role, value: project.role },
    { label: copy.category, value: project.categoryLabel },
    { label: copy.period, value: period },
  ];

  return (
    <article>
      <header className="project-hero relative isolate overflow-x-clip">
        {/* The project's own colours, drawn from its screenshot, tint the header. */}
        <div aria-hidden className="project-hero-glow">
          <ProjectAmbient project={project} />
        </div>

        <div className="container-page pt-[calc(var(--nav-h)+1.5rem)] md:pt-[calc(var(--nav-h)+2.25rem)]">
          <Reveal still className="flex items-center justify-between gap-6 border-b border-line pb-4">
            <Link
              href={localePath(locale, "/projects")}
              className="group label-mono -my-2 inline-flex items-center gap-2 py-2 text-fg-subtle transition-colors hover:text-fg"
            >
              <ArrowLeft aria-hidden className={arrowBack} />
              {copy.back}
            </Link>
            <p className="label-mono flex shrink-0 items-center gap-3 text-fg-subtle">
              <span className="hidden sm:inline">{study ? copy.caseStudyLabel : copy.overviewLabel}</span>
              <span aria-hidden className="hidden h-px w-6 bg-line-strong sm:block" />
              <span className="tabular-nums">
                <span className="text-accent">{pad(locale, index + 1)}</span>
                <span className="mx-1.5 text-fg-subtle/60">/</span>
                {pad(locale, total)}
              </span>
            </p>
          </Reveal>

          <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-12 lg:items-end lg:gap-x-8">
            <MaskedHeading
              as="h1"
              lines={[{ text: project.title }]}
              className="text-[clamp(2.75rem,1.3rem+5.4vw,6rem)] leading-[0.92] font-semibold tracking-[-0.04em] text-balance lg:col-span-7"
            />
            <div className="lg:col-span-4 lg:col-start-9 lg:pb-2">
              <Reveal delay={0.15}>
                <p className="max-w-xl text-[1.0625rem] leading-relaxed text-pretty text-fg-muted">{project.shortDescription}</p>
              </Reveal>
              {liveUrl ? (
                <Reveal delay={0.25} className="mt-7">
                  <ButtonLink href={liveUrl} external icon="up-right" ariaLabel={`${copy.live}: ${project.title} (${dictionary.contact.opensInNewTab})`}>
                    {copy.live}
                  </ButtonLink>
                </Reveal>
              ) : null}
            </div>
          </div>

          <Reveal delay={0.3} className="mt-12 md:mt-16">
            <dl className="grid grid-cols-2 gap-y-5 border-y border-line py-5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
              {meta.map((item, position) => (
                <div
                  key={item.label}
                  className={cn("min-w-0 md:border-s md:border-line md:px-6 md:first:border-s-0 md:first:ps-0", position === 0 && "col-span-2 md:col-span-1")}
                >
                  <dt className="label-mono text-fg-subtle">{item.label}</dt>
                  <dd className="mt-2 text-[0.9375rem] text-fg">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </header>

      <ProjectDevice project={project} address={address} />

      <div className="container-page mt-20 grid gap-16 pb-(--section-y) md:mt-28 lg:grid-cols-12 lg:gap-x-8">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)]">
            <dl className="divide-y divide-line border-y border-line">
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
              <div className="grid gap-6 sm:grid-cols-2">
                {project.gallery.map((image) => (
                  <Reveal key={image.src} className="sm:last:odd:col-span-2">
                    <ShotViewerButton
                      label={interpolate(copy.fullPageAria, { title: image.alt })}
                      title={image.alt}
                      address={address}
                      closeLabel={copy.closeViewer}
                      image={<ShotImage renditions={image.full} alt={image.alt} sizes="(min-width: 1344px) 1344px, 100vw" />}
                      className="rounded-md"
                    >
                      <span className="shot-card relative isolate block aspect-[16/11] w-full overflow-hidden rounded-md border border-line bg-ink-900">
                        <span className="shot-window absolute inset-0 block overflow-hidden">
                          <ShotImage
                            renditions={image.poster}
                            alt={image.alt}
                            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 46vw, 92vw"
                            className="shot-pan block min-h-full w-full object-cover object-top"
                          />
                        </span>
                      </span>
                    </ShotViewerButton>
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
                prefetch
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
