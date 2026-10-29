"use client";

import { m } from "motion/react";

/** Timeline marker that lights up when its entry enters the reading band. */
export function TimelineNode({ current }: { current: boolean }) {
  return (
    <span
      aria-hidden
      className="absolute start-0 top-2 block size-[11px] rounded-full border border-accent bg-ink-950 md:start-[25%]"
    >
      <m.span
        className={current ? "absolute inset-0 rounded-full bg-accent shadow-[0_0_0_6px_var(--color-accent-soft)]" : "absolute inset-0 rounded-full bg-accent shadow-[0_0_0_4px_var(--color-accent-soft)]"}
        initial={{ opacity: 0, scale: 0.4 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -35% 0px" }}
        transition={{ duration: 0.6 }}
      />
    </span>
  );
}
