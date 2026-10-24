"use client";

import { m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Vertical timeline whose accent line fills as the visitor reads through it.
 * The line sits on the left on mobile and between columns from `md`.
 */
export function TimelineTrack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} className="relative">
      <div aria-hidden className="absolute top-2 bottom-0 left-[5px] w-px bg-line md:left-[calc(25%+4px)]">
        <m.div
          className="absolute inset-0 origin-top bg-gradient-to-b from-accent via-accent to-indigo"
          style={{ scaleY: reduceMotion ? 1 : scaleY }}
        />
      </div>
      {children}
    </div>
  );
}
