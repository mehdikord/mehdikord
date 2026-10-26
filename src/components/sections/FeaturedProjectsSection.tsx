import { FeaturedGallery, type FeaturedItem } from "@/components/projects/FeaturedGallery";
import { PreviewNotice, ProjectVisual } from "@/components/projects/ProjectMedia";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/data/dictionaries";
import { interpolate, localePath, localizeDigits, pad } from "@/i18n/format";
import { getLocale } from "@/i18n/server";
import { getAllProjects, getCaseStudy } from "@/lib/projects";

export async function FeaturedProjectsSection() {
  const locale = await getLocale();
  const copy = getDictionary(locale).work;
  const projects = await getAllProjects(locale);
  const featured = projects.filter((project) => project.featured);
  const total = projects.length;

  const items: FeaturedItem[] = featured.map((project) => {
    const number = pad(locale, projects.indexOf(project) + 1);
    return {
      slug: project.slug,
      href: localePath(locale, `/projects/${project.slug}`),
      title: project.title,
      indexLabel: `${copy.indexPrefix}${number}`,
      number,
      category: project.categoryLabel,
      period: localizeDigits(locale, project.period),
      description: project.shortDescription,
      role: project.role,
      technologies: project.technologies,
      ctaLabel: getCaseStudy(project) ? copy.caseStudy : copy.overview,
      visual: <ProjectVisual project={project} sizes="(min-width: 1024px) 66vw, 85vw" />,
      notice: project.coverImage ? null : <PreviewNotice placement="top" />,
    };
  });

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-(--section-y)">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[64rem] bg-[radial-gradient(ellipse_45%_35%_at_72%_40%,rgb(130_87_255/0.10),transparent_70%)]"
      />
      <div className="container-page relative">
        <SectionHeader index={copy.index} label={copy.label} title={copy.title} titleId="work-title" intro={copy.intro} />

        <div className="mt-14 md:mt-20">
          <FeaturedGallery
            items={items}
            labels={{ role: copy.roleLabel, stack: copy.stackLabel, hint: copy.panelHint }}
          />
        </div>

        <Reveal className="mt-10 flex flex-col items-start gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between md:mt-14">
          <p className="label-mono text-fg-subtle">
            {interpolate(copy.shownCount, { shown: pad(locale, featured.length), total: pad(locale, total) })}
            <span aria-hidden className="mx-3 text-line-strong">
              /
            </span>
            {copy.exploreAllHint}
          </p>
          <ButtonLink href={localePath(locale, "/projects")} icon="right">
            {copy.exploreAll}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
