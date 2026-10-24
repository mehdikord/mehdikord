"use client";

import { m, useScroll, useSpring } from "motion/react";

/** Hairline reading-progress indicator along the bottom edge of the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  return (
    <m.div
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-accent/0 via-accent to-indigo"
      style={{ scaleX }}
    />
  );
}
