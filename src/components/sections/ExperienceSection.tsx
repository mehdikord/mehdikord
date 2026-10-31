import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/data/dictionaries";
import { getLocale } from "@/i18n/server";
import { getExperience } from "@/lib/career";

export async function ExperienceSection() {
  const locale = await getLocale();
  const copy = getDictionary(locale).experience;
  const experience = await getExperience(locale);

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative border-t border-line py-(--section-y)">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[50%] bg-[radial-gradient(ellipse_45%_50%_at_15%_30%,rgb(130_87_255/0.08),transparent_70%)] rtl:bg-[radial-gradient(ellipse_45%_50%_at_85%_30%,rgb(130_87_255/0.08),transparent_70%)]" />
      <div className="container-page relative">
        <SectionHeader index={copy.index} label={copy.label} title={copy.title} titleId="experience-title" intro={copy.intro} />
        <ExperienceTimeline
          entries={experience}
          copy={{
            present: copy.present,
            responsibilitiesLabel: copy.responsibilitiesLabel,
            technologiesLabel: copy.technologiesLabel,
            railLabel: copy.railLabel,
            currentBadge: copy.currentBadge,
            rolesLabel: copy.rolesLabel,
            yearsLabel: copy.yearsLabel,
          }}
        />
      </div>
    </section>
  );
}
