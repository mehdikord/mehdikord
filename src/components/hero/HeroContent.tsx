"use client";

import { m } from "motion/react";

import { ease } from "@/components/motion/motion-variants";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusDot } from "@/components/ui/StatusDot";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/portfolio";

/** Entrance timeline in seconds (navigation joins at ~0.65s from the Navbar). */
const timeline = { firstLine: 0.15, lineStep: 0.16, status: 0.55, copy: 0.8, ctas: 0.95, meta: 1.25 };

const settle = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: ease.outExpo, delay },
});

interface HeroContentProps {
  hero: Profile["hero"];
  availability: Profile["availability"];
}

export function HeroContent({ hero, availability }: HeroContentProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <m.p
        {...settle(timeline.status)}
        data-reveal=""
        className="label-mono mb-8 inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-ink-950/40 px-4 py-2 text-fg-muted backdrop-blur-md md:mb-10 [@media(max-height:520px)]:mb-5"
      >
        <StatusDot active={availability.available} />
        {availability.label}
      </m.p>

      <h1 id="hero-title" className="text-display max-w-[16ch] md:max-w-none">
        {hero.headline.map((line, lineIndex) => (
          <span key={lineIndex} className="block">
            {line.map((segment, segmentIndex) => (
              <span key={segment.text}>
                {/* Each segment is its own mask: stacked on mobile, inline from md. */}
                <span className="mask-line md:inline-block md:align-bottom">
                  <m.span
                    className={cn("block", segment.emphasis && "text-accent-serif text-[1.08em] leading-[0.9]")}
                    data-reveal=""
                    initial={{ y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 1.15,
                      ease: ease.outExpo,
                      delay: timeline.firstLine + lineIndex * timeline.lineStep,
                    }}
                  >
                    {segment.text}
                  </m.span>
                </span>
                {segmentIndex < line.length - 1 ? " " : null}
              </span>
            ))}
          </span>
        ))}
      </h1>

      <m.p
        {...settle(timeline.copy)}
        data-reveal=""
        className="text-lead mt-8 max-w-[34rem] text-pretty text-fg-muted md:mt-10"
      >
        {hero.description}
      </m.p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <m.div {...settle(timeline.ctas)} data-reveal="">
          <ButtonLink href={hero.primaryCta.href} icon="down">
            {hero.primaryCta.label}
          </ButtonLink>
        </m.div>
        <m.div {...settle(timeline.ctas + 0.08)} data-reveal="">
          <ButtonLink href={hero.secondaryCta.href} variant="secondary" icon="none">
            {hero.secondaryCta.label}
          </ButtonLink>
        </m.div>
      </div>
    </div>
  );
}

export const heroMetaDelay = timeline.meta;
