import { ExpertiseExplorer } from "@/components/expertise/ExpertiseExplorer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/data/dictionaries";
import { getLocale } from "@/i18n/server";
import { getSkillGroups } from "@/lib/career";

export async function ExpertiseSection() {
  const locale = await getLocale();
  const copy = getDictionary(locale).expertise;
  const skillGroups = await getSkillGroups(locale);

  return (
    <section id="expertise" aria-labelledby="expertise-title" className="relative border-t border-line py-(--section-y)">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(ellipse_50%_60%_at_80%_40%,rgb(130_87_255/0.1),transparent_70%)] rtl:bg-[radial-gradient(ellipse_50%_60%_at_20%_40%,rgb(130_87_255/0.1),transparent_70%)]" />
      <div className="container-page relative">
        <SectionHeader index={copy.index} label={copy.label} title={copy.title} titleId="expertise-title" intro={copy.intro} />
        <ExpertiseExplorer
          groups={skillGroups}
          copy={{
            index: copy.index,
            moduleLabel: copy.moduleLabel,
            capabilities: copy.capabilities,
            listLabel: copy.listLabel,
            stageLabel: copy.stageLabel,
          }}
        />
      </div>
    </section>
  );
}
