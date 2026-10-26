import { TimelineNode } from "@/components/experience/TimelineNode";
import { TimelineTrack } from "@/components/experience/TimelineTrack";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusDot } from "@/components/ui/StatusDot";
import { getDictionary } from "@/data/dictionaries";
import { formatYearMonth } from "@/i18n/format";
import { getLocale } from "@/i18n/server";
import { getExperience } from "@/lib/career";

export async function ExperienceSection() {
  const locale = await getLocale();
  const copy = getDictionary(locale).experience;
  const experience = await getExperience(locale);

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative border-t border-line py-(--section-y)">
      <div className="container-page">
        <SectionHeader index={copy.index} label={copy.label} title={copy.title} titleId="experience-title" intro={copy.intro} />

        <div className="mt-16 md:mt-24">
          <TimelineTrack>
            <ol className="space-y-16 md:space-y-24">
              {experience.map((entry) => {
                const isCurrent = entry.end === null;
                return (
                  <li key={entry.id} className="relative ps-9 md:grid md:grid-cols-12 md:gap-x-8 md:ps-0">
                    <TimelineNode current={isCurrent} />

                    <Reveal still className="md:col-span-3">
                      <p className="label-mono flex items-center gap-2 text-fg-muted md:flex-col md:items-start md:gap-1.5">
                        <span>
                          <time dateTime={entry.start}>{formatYearMonth(locale, entry.start)}</time>
                          <span aria-hidden> — </span>
                          {entry.end ? (
                            <time dateTime={entry.end}>{formatYearMonth(locale, entry.end)}</time>
                          ) : (
                            <span className="text-fg">{copy.present}</span>
                          )}
                        </span>
                        {isCurrent ? <StatusDot className="md:hidden" /> : null}
                      </p>
                      {entry.location ? <p className="label-mono mt-2 hidden text-fg-subtle md:block">{entry.location}</p> : null}
                    </Reveal>

                    <Reveal className="mt-4 md:col-span-8 md:col-start-5 md:mt-0">
                      <h3 className="text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em]">
                        {entry.position}
                      </h3>
                      <p className="mt-2 text-fg-muted">
                        {entry.company}
                        {entry.companyContext ? <span className="text-fg-subtle"> · {entry.companyContext}</span> : null}
                      </p>
                      <p className="mt-5 max-w-2xl text-pretty text-fg-muted">{entry.description}</p>

                      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
                        <div>
                          <h4 className="label-mono text-fg-subtle">{copy.responsibilitiesLabel}</h4>
                          <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
                            {entry.responsibilities.map((item) => (
                              <li key={item} className="flex gap-3 text-pretty">
                                <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent/70" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="label-mono text-fg-subtle">{copy.technologiesLabel}</h4>
                          <p dir="ltr" className="mt-4 text-start font-mono text-[0.8125rem] leading-relaxed text-fg-muted rtl:text-end">
                            {entry.technologies.join(" · ")}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </TimelineTrack>
        </div>
      </div>
    </section>
  );
}
