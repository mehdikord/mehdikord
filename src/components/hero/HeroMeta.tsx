"use client";

import { m } from "motion/react";

import { heroMetaDelay } from "@/components/hero/HeroContent";
import { ease } from "@/components/motion/motion-variants";
import { content } from "@/data/content";

/** Bottom rail of the hero: scroll cue and a compact signature line. */
export function HeroMeta({ years, signature }: { years: number; signature: readonly string[] }) {
  return (
    <m.div
      className="container-page relative z-10 flex items-end justify-between gap-6 pb-6 md:pb-8"
      data-reveal=""
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: ease.outQuart, delay: heroMetaDelay }}
    >
      <a href="#about" className="group label-mono flex items-center gap-3 text-fg-subtle transition-colors hover:text-fg">
        <span aria-hidden className="scroll-cue-line relative block h-9 w-px overflow-hidden bg-line-strong" />
        {content.hero.scrollCue}
      </a>
      <p className="label-mono hidden text-right text-fg-subtle sm:block">
        <span className="text-fg">{years}+</span> {content.hero.yearsSuffix}
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
