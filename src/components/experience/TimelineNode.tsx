"use client";

import { m } from "motion/react";

/** Timeline marker that lights up when its entry enters the reading band. */
export function TimelineNode({ current }: { current: boolean }) {
  return (
    <m.span
      aria-hidden
      className="absolute start-0 top-2 block size-[11px] rounded-full border border-accent bg-ink-950 md:start-[25%]"
      initial={{ backgroundColor: "#050507", boxShadow: "0 0 0 0 rgb(155 123 255 / 0)" }}
      whileInView={{
        backgroundColor: "#9b7bff",
        boxShadow: current ? "0 0 0 6px rgb(155 123 255 / 0.16)" : "0 0 0 4px rgb(155 123 255 / 0.08)",
      }}
      viewport={{ once: true, margin: "0px 0px -35% 0px" }}
      transition={{ duration: 0.6 }}
    />
  );
}
