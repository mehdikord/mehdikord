"use client";

import { AnimatePresence, m } from "motion/react";

import { ease } from "@/components/motion/motion-variants";
import { cn } from "@/lib/utils";

const CIRCUMFERENCE = 2 * Math.PI * 8;

/** Ring that fills with `--section-p` (how far the reader is through the current section). */
export function ProgressRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={cn("size-5 shrink-0 -rotate-90", className)}>
      <circle cx={10} cy={10} r={8} fill="none" strokeWidth={1.5} style={{ stroke: "var(--color-line-strong)" }} />
      <circle
        cx={10}
        cy={10}
        r={8}
        fill="none"
        strokeWidth={1.75}
        strokeLinecap="round"
        style={{
          stroke: "var(--color-accent)",
          strokeDasharray: CIRCUMFERENCE,
          strokeDashoffset: `calc(${CIRCUMFERENCE.toFixed(2)}px * (1 - var(--section-p, 0)))`,
        }}
      />
    </svg>
  );
}

interface SectionReadoutProps {
  /** Changes key the rolling label. */
  id: string;
  index: string;
  label: string;
  className?: string;
  ring?: boolean;
}

/** "02 · Selected Work" — the section being read, rolling to the next one as it changes. */
export function SectionReadout({ id, index, label, className, ring = false }: SectionReadoutProps) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      {ring ? <ProgressRing /> : null}
      <span className="relative flex h-5 min-w-0 items-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={id}
            className="flex min-w-0 items-center gap-2 whitespace-nowrap"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-110%", opacity: 0 }}
            transition={{ duration: 0.55, ease: ease.outExpo }}
          >
            <span className="font-mono text-[0.6875rem] text-accent">{index}</span>
            <span className="truncate text-[0.8125rem] font-medium text-fg">{label}</span>
          </m.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
