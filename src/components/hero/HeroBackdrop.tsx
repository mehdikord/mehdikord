"use client";

import { m, useTransform } from "motion/react";

import { HeroLayer, useHeroMotion } from "@/components/hero/hero-motion";
import { HeroField } from "@/components/hero/HeroField";
import { ease } from "@/components/motion/motion-variants";

/**
 * Atmosphere behind the hero: two slowly breathing auras, a perspective floor
 * grid rolling toward the viewer, the interactive point field and a spotlight
 * that follows the pointer. Layers drift against the pointer for depth and
 * lag behind the page on scroll.
 */
export function HeroBackdrop() {
  const { progress, reduceMotion } = useHeroMotion();
  const y = useTransform(progress, [0, 1], [0, 240]);

  return (
    <m.div
      aria-hidden
      className="absolute inset-0 -z-10 overflow-hidden bg-ink-950"
      style={reduceMotion ? undefined : { y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8, ease: ease.outQuart }}
    >
      <HeroLayer depth={-1.6} className="absolute inset-0">
        <div className="hero-aurora absolute top-[-18%] start-[-6%] h-[78%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgb(130_87_255/0.30),rgb(130_87_255/0.08)_48%,transparent_100%)]" />
        <div className="hero-aurora absolute top-[16%] end-[-14%] h-[70%] w-[52%] rounded-full bg-[radial-gradient(closest-side,rgb(109_107_255/0.24),rgb(109_107_255/0.06)_50%,transparent_100%)] [animation-delay:-8s]" />
      </HeroLayer>

      <HeroLayer
        depth={-0.7}
        className="absolute inset-x-0 bottom-0 h-[54%] [mask-image:linear-gradient(to_right,transparent,#000_22%,#000_78%,transparent)]"
      >
        <div className="hero-floor" />
      </HeroLayer>

      <HeroField className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_75%_at_50%_45%,#000_35%,transparent_100%)]" />

      <div className="hero-spot absolute inset-0" />

      {/* Legibility: shade under the navigation and a fade into the next section. */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink-950/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
    </m.div>
  );
}
