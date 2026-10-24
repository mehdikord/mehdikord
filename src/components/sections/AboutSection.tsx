import { ArchitectureDiagram } from "@/components/about/ArchitectureDiagram";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import { getAllProjects, getUsedCategories } from "@/lib/projects";
import { pad } from "@/lib/utils";

export function AboutSection() {
  const copy = content.about;
  const [lead, ...paragraphs] = profile.bio;
  const stats = [
    { value: String(profile.yearsOfExperience), suffix: "+", label: copy.stats.years },
    { value: pad(getAllProjects().length), label: copy.stats.projects },
    { value: pad(getUsedCategories().length), label: copy.stats.domains },
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-(--section-y)">
      <div className="container-page">
        <SectionHeader index={copy.index} label={copy.label} title={copy.title} titleId="about-title" />

        <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-lead text-pretty text-fg">{lead}</p>
            </Reveal>
            {paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph} delay={0.08 * (index + 1)}>
                <p className="mt-6 text-pretty text-fg-muted">{paragraph}</p>
              </Reveal>
            ))}

            <RevealGroup as="ul" className="mt-14 grid grid-cols-3 border-t border-line">
              {stats.map((stat) => (
                <RevealItem as="li" key={stat.label} className="border-r border-line pt-6 pr-4 last:border-r-0 [&:not(:first-child)]:pl-4">
                  <p className="text-[clamp(2.25rem,5vw,3.75rem)] leading-none font-semibold tracking-[-0.05em]">
                    {stat.value}
                    {stat.suffix ? <span className="text-accent">{stat.suffix}</span> : null}
                  </p>
                  <p className="mt-3 text-xs leading-snug text-pretty text-fg-subtle sm:text-sm">{stat.label}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
            <figure className="relative">
              <div className="relative rounded-md border border-line bg-ink-900/60 p-5 sm:p-8">
                <div
                  aria-hidden
                  className="hairline-grid absolute inset-0 rounded-md opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]"
                />
                {/* Corner registration ticks */}
                <span aria-hidden className="absolute -top-px -left-px size-3 border-t border-l border-accent/70" />
                <span aria-hidden className="absolute -top-px -right-px size-3 border-t border-r border-accent/70" />
                <span aria-hidden className="absolute -bottom-px -left-px size-3 border-b border-l border-accent/70" />
                <span aria-hidden className="absolute -right-px -bottom-px size-3 border-r border-b border-accent/70" />
                <p className="label-mono relative mb-6 flex items-center justify-between text-fg-subtle">
                  <span>{copy.diagramLabel}</span>
                  <span aria-hidden className="hidden text-accent sm:inline">
                    ● live path
                  </span>
                </p>
                <div className="relative mx-auto max-w-[30rem]">
                  <ArchitectureDiagram />
                </div>
              </div>
              <figcaption className="mt-4 max-w-lg text-sm text-pretty text-fg-subtle">{copy.diagramCaption}</figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="mt-24 grid gap-12 md:mt-32 lg:grid-cols-12 lg:gap-x-8">
          <Reveal still className="lg:col-span-3">
            <h3 className="label-mono text-fg-subtle">{copy.philosophyLabel}</h3>
          </Reveal>
          <RevealGroup as="ol" className="grid gap-10 sm:grid-cols-3 sm:gap-8 lg:col-span-9">
            {profile.philosophy.map((principle, index) => (
              <RevealItem as="li" key={principle.title} className="border-t border-line-strong pt-6">
                <span className="font-mono text-xs text-accent">{pad(index + 1)}</span>
                <h4 className="mt-4 text-xl font-medium tracking-tight text-balance">{principle.title}</h4>
                <p className="mt-3 text-sm text-pretty text-fg-muted">{principle.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="mt-24 grid gap-8 md:mt-32 lg:grid-cols-12 lg:gap-x-8">
          <Reveal still className="lg:col-span-3">
            <h3 className="label-mono text-fg-subtle">{copy.strengthsLabel}</h3>
          </Reveal>
          <Reveal className="lg:col-span-9">
            <ul className="flex flex-wrap items-baseline gap-x-1 text-[clamp(1.5rem,1.1rem+1.8vw,2.75rem)] leading-[1.25] font-medium tracking-[-0.03em]">
              {profile.strengths.map((strength, index) => (
                <li key={strength} className="text-fg/90 transition-colors duration-300 hover:text-fg">
                  {strength}
                  {index < profile.strengths.length - 1 ? (
                    <span aria-hidden className="mx-2 font-serif text-accent/70 italic">
                      /
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
