import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { content } from "@/data/content";
import { skillGroups } from "@/data/skills";
import { pad } from "@/lib/utils";

export function ExpertiseSection() {
  const copy = content.expertise;

  return (
    <section id="expertise" aria-labelledby="expertise-title" className="relative border-t border-line py-(--section-y)">
      <div className="container-page">
        <SectionHeader index={copy.index} label={copy.label} title={copy.title} titleId="expertise-title" intro={copy.intro} />

        <RevealGroup as="ul" className="mt-16 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3 md:mt-20">
          {skillGroups.map((group, index) => (
            <RevealItem
              as="li"
              key={group.id}
              className="group relative border-r border-b border-line p-6 transition-colors duration-500 hover:bg-white/[0.02] sm:p-8"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
              />
              <div className="label-mono flex items-center justify-between text-fg-subtle">
                <span className="transition-colors duration-300 group-hover:text-accent">
                  {copy.index}.{pad(index + 1)}
                </span>
                <span>{group.annotation}</span>
              </div>
              <h3 className="mt-8 text-xl font-medium tracking-tight">{group.title}</h3>
              <ul className="mt-5 space-y-2 text-[0.9375rem] text-fg-muted">
                {group.items.map((item) => (
                  <li key={item} className="flex items-baseline gap-3">
                    <span aria-hidden className="h-px w-3 shrink-0 translate-y-[-0.25em] bg-line-strong transition-colors duration-300 group-hover:bg-accent/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
