import { AboutStage } from "@/components/about/AboutStage";
import { PrincipleBlueprint } from "@/components/about/PrincipleBlueprint";
import { ScrollLead } from "@/components/about/ScrollLead";
import { StatOdometer } from "@/components/about/StatOdometer";
import { StrengthBoard } from "@/components/about/StrengthBoard";
import { SystemStack } from "@/components/about/SystemStack";
import { MaskedHeading } from "@/components/motion/MaskedHeading";
import { Reveal } from "@/components/motion/Reveal";
import { getDictionary } from "@/data/dictionaries";
import { localizeDigits } from "@/i18n/format";
import { getLocale } from "@/i18n/server";
import { getProfile } from "@/lib/profile";
import { getAllProjects, getUsedCategories } from "@/lib/projects";

export async function AboutSection() {
  const locale = await getLocale();
  const copy = getDictionary(locale).about;
  const [profile, projects, categories] = await Promise.all([
    getProfile(locale),
    getAllProjects(locale),
    getUsedCategories(locale),
  ]);
  const [lead = "", ...paragraphs] = profile.bio;
  const stats = [
    { value: String(profile.yearsOfExperience), suffix: "+", label: copy.stats.years },
    { value: String(projects.length).padStart(2, "0"), label: copy.stats.projects },
    { value: String(categories.length).padStart(2, "0"), label: copy.stats.domains },
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="relative isolate">
      {/* Pinned intro: headline, lead and figures beside the system stack. */}
      <AboutStage>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_60%_at_72%_55%,var(--color-accent-soft),transparent_70%)] rtl:bg-[radial-gradient(ellipse_55%_60%_at_28%_55%,var(--color-accent-soft),transparent_70%)]"
        />
        <div className="container-page pt-(--section-y) pin:pt-[calc(var(--nav-h)+1.25rem)] pin:pb-6">
          <Reveal still className="label-mono flex items-center gap-4 text-fg-subtle">
            <span className="text-accent">{copy.index}</span>
            <span>{copy.label}</span>
            <span aria-hidden className="h-px flex-1 bg-line" />
          </Reveal>

          <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-x-10 pin:mt-6">
            <div className="lg:col-span-5">
              <MaskedHeading
                id="about-title"
                lines={copy.title}
                className="text-[clamp(2.25rem,1.3rem+3.2vw,4.4rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
              />
              <ScrollLead text={lead} className="text-lead mt-8 text-pretty text-fg pin:mt-7" />
              <div className="mt-12 pin:mt-10">
                <StatOdometer stats={stats} />
              </div>
            </div>

            <div className="lg:col-span-7">
              <SystemStack
                initials={profile.initials}
                years={profile.yearsOfExperience}
                figureLabel={copy.diagramLabel}
                liveLabel={copy.diagramLive}
                hint={copy.diagramHint}
                caption={copy.diagramCaption}
              />
            </div>
          </div>
        </div>
      </AboutStage>

      <div className="container-page pb-(--section-y)">
        {paragraphs.length > 0 ? (
          <div className="mt-20 grid gap-8 md:mt-28 lg:grid-cols-12 lg:gap-x-8">
            <Reveal still className="lg:col-span-3">
              <h3 className="label-mono text-fg-subtle">{copy.storyLabel}</h3>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:col-span-9">
              {paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph} delay={0.08 * index}>
                  <p className="border-s border-line-strong ps-5 text-pretty text-fg-muted">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-24 md:mt-32">
          <Reveal>
            <PrincipleBlueprint principles={profile.philosophy} label={copy.philosophyLabel} />
          </Reveal>
        </div>

        <div className="mt-24 grid gap-8 md:mt-32 lg:grid-cols-12 lg:gap-x-8">
          <Reveal still className="lg:col-span-3">
            <h3 className="label-mono text-fg-subtle">{copy.strengthsLabel}</h3>
            <p className="mt-4 max-w-xs text-sm text-pretty text-fg-muted">{copy.strengthsIntro}</p>
          </Reveal>
          <div className="lg:col-span-9">
            <StrengthBoard
              strengths={profile.strengths}
              coreLabel={copy.coreStrength}
              coreMeta={`${localizeDigits(locale, profile.yearsOfExperience)}+ · ${copy.stats.years}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
