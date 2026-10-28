"use client";

import { m } from "motion/react";

import { ease } from "@/components/motion/motion-variants";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusDot } from "@/components/ui/StatusDot";
import { cn } from "@/lib/utils";
import type { HeadlineLine, LinkAction, Profile } from "@/types/portfolio";

/** Entrance timeline in seconds (navigation joins at ~0.65s from the Navbar). */
export const heroTimeline = {
  kicker: 0.1,
  firstLine: 0.2,
  lineStep: 0.14,
  copy: 0.7,
  ctas: 0.85,
  scene: 0.75,
  rail: 1.3,
};

const settle = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: ease.outExpo, delay },
});

export interface HeroCopyProps {
  /** Role line above the headline, e.g. the profile title. */
  kicker: string;
  headline: readonly HeadlineLine[];
  description: string;
  primaryCta: LinkAction;
  secondaryCta: LinkAction;
  availability: Profile["availability"];
}

export function HeroCopy({ kicker, headline, description, primaryCta, secondaryCta, availability }: HeroCopyProps) {
  return (
    <div className="flex flex-col items-start text-start">
      <m.p {...settle(heroTimeline.kicker)} data-reveal="" className="label-mono flex items-center gap-3 text-fg-muted">
        <span aria-hidden className="h-px w-8 bg-gradient-to-r from-accent to-indigo rtl:bg-gradient-to-l" />
        {kicker}
      </m.p>

      <h1 id="hero-title" className="hero-title mt-6 max-w-[14ch] text-balance md:mt-7">
        {headline.map((line, lineIndex) => (
          <span key={lineIndex} className="mask-line">
            <m.span
              className="block"
              data-reveal=""
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 1.15,
                ease: ease.outExpo,
                delay: heroTimeline.firstLine + lineIndex * heroTimeline.lineStep,
              }}
            >
              {line.map((segment, segmentIndex) => (
                <span key={segment.text} className={cn(segment.emphasis && "text-accent-serif text-[1.08em] leading-[0.9]")}>
                  {segment.text}
                  {segmentIndex < line.length - 1 ? " " : null}
                </span>
              ))}
            </m.span>
          </span>
        ))}
      </h1>

      <m.p
        {...settle(heroTimeline.copy)}
        data-reveal=""
        className="text-lead mt-7 max-w-[32rem] text-pretty text-fg-muted md:mt-8"
      >
        {description}
      </m.p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <m.div {...settle(heroTimeline.ctas)} data-reveal="">
          <ButtonLink href={primaryCta.href} icon="down">
            {primaryCta.label}
          </ButtonLink>
        </m.div>
        <m.div {...settle(heroTimeline.ctas + 0.08)} data-reveal="">
          <ButtonLink href={secondaryCta.href} variant="secondary" icon="none">
            {secondaryCta.label}
          </ButtonLink>
        </m.div>
        <m.p
          {...settle(heroTimeline.ctas + 0.16)}
          data-reveal=""
          className="label-mono ms-1 inline-flex items-center gap-2.5 py-2 text-fg-subtle"
        >
          <StatusDot active={availability.available} />
          {availability.label}
        </m.p>
      </div>
    </div>
  );
}
