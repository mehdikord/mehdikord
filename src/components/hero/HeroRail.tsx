"use client";

import { m } from "motion/react";

import { heroTimeline } from "@/components/hero/HeroCopy";
import { ease } from "@/components/motion/motion-variants";

export interface HeroRailProps {
  /** Pre-formatted, e.g. "8+" or "۸+". */
  years: string;
  yearsSuffix: string;
  signature: readonly string[];
  scrollCue: string;
}

/** Bottom rail of the hero: scroll cue and a compact signature line. */
export function HeroRail({ years, yearsSuffix, signature, scrollCue }: HeroRailProps) {
  return (
    <m.div
      className="container-page flex items-end justify-between gap-6 pb-6 md:pb-8"
      data-reveal=""
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: ease.outQuart, delay: heroTimeline.rail }}
    >
      <a href="#about" className="group label-mono flex items-center gap-3 text-fg-subtle transition-colors hover:text-fg">
        <span aria-hidden className="scroll-cue-line relative block h-9 w-px overflow-hidden bg-line-strong" />
        {scrollCue}
      </a>
      <p className="label-mono hidden text-end text-fg-subtle sm:block">
        <span className="text-fg">{years}</span> {yearsSuffix}
        {signature.map((item) => (
          <span key={item}>
            <span aria-hidden className="mx-2.5 text-accent">
              /
            </span>
            {item}
          </span>
        ))}
      </p>
    </m.div>
  );
}
