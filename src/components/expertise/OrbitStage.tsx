"use client";

import { AnimatePresence, m } from "motion/react";

import { ease } from "@/components/motion/motion-variants";
import { Tilt } from "@/components/motion/Tilt";
import { cn } from "@/lib/utils";
import type { SkillGroup } from "@/types/portfolio";

/*
 * The active skill group as a small system: the group at the core, each
 * capability a satellite on an alternating inner/outer orbit, spokes tying
 * them together. The orbit turns slowly (satellites stay upright), a radar
 * sweep passes underneath and the whole stage tilts toward the pointer.
 * Everything is still under reduced motion.
 */

interface Satellite {
  label: string;
  /** Percent of the stage, from the top-left corner. */
  x: number;
  y: number;
}

function placeSatellites(items: readonly string[]): Satellite[] {
  const count = items.length;
  return items.map((label, index) => {
    const angle = (-90 + (index * 360) / count) * (Math.PI / 180);
    const radius = count <= 4 ? 34 : index % 2 === 0 ? 28 : 39;
    return { label, x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
  });
}

const stageVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: { transition: { staggerChildren: 0.025, staggerDirection: -1 } },
};

const satelliteVariants = {
  hidden: { opacity: 0, scale: 0.55 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: ease.outExpo } },
  exit: { opacity: 0, scale: 0.7, transition: { duration: 0.22, ease: ease.outQuart } },
};

const coreVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: ease.outExpo } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

export interface OrbitStageProps {
  group: SkillGroup;
  /** e.g. "03.02" */
  code: string;
  /** e.g. "02 / 06" */
  position: string;
  moduleLabel: string;
  capabilitiesLabel: string;
  panelId: string;
  tabId: string;
  ariaLabel: string;
}

export function OrbitStage({ group, code, position, moduleLabel, capabilitiesLabel, panelId, tabId, ariaLabel }: OrbitStageProps) {
  const satellites = placeSatellites(group.items);

  return (
    <Tilt max={5} className="mx-auto w-full max-w-[36rem]">
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId}
        aria-label={ariaLabel}
        className="orbit-stage glass-card relative aspect-square w-full overflow-hidden rounded-lg"
      >
        {/* Atmosphere */}
        <div aria-hidden className="hairline-grid absolute inset-0 opacity-60 [background-size:40px_40px] [mask-image:radial-gradient(circle_at_center,#000_20%,transparent_72%)]" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(130_87_255/0.22),rgb(130_87_255/0.05)_38%,transparent_62%)]" />
        <div aria-hidden className="orbit-sweep absolute inset-0" />

        {/* Orbits */}
        <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 size-full">
          <circle cx={50} cy={50} r={28} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth={0.25} strokeDasharray="0.6 1.2" />
          <circle cx={50} cy={50} r={39} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth={0.25} strokeDasharray="0.6 1.2" />
          <circle cx={50} cy={50} r={46} fill="none" stroke="rgb(155 123 255 / 0.2)" strokeWidth={0.2} />
        </svg>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={group.id}
            className="absolute inset-0"
            variants={stageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Rotating layer: spokes and satellites. Satellites counter-rotate to stay upright. */}
            <div className="orbit-layer absolute inset-0">
              <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 size-full">
                {satellites.map((satellite) => (
                  <line
                    key={satellite.label}
                    x1={50}
                    y1={50}
                    x2={satellite.x}
                    y2={satellite.y}
                    stroke="rgb(155 123 255 / 0.35)"
                    strokeWidth={0.2}
                    className="flow-line"
                  />
                ))}
              </svg>

              <ul className="contents">
                {satellites.map((satellite, index) => (
                  <m.li
                    key={satellite.label}
                    variants={satelliteVariants}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${satellite.x}%`, top: `${satellite.y}%` }}
                  >
                    <span
                      className={cn(
                        "orbit-node glass-card block max-w-[12rem] rounded-full px-3.5 py-1.5 text-center text-[0.8125rem] leading-snug font-medium text-balance text-fg transition-[border-color,background-color,box-shadow,scale] duration-500 ease-out-quart hover:scale-105 hover:border-accent/60 hover:bg-accent-soft hover:shadow-glow",
                        index % 2 === 0 ? "border-line-strong" : "border-line",
                      )}
                    >
                      {satellite.label}
                    </span>
                  </m.li>
                ))}
              </ul>
            </div>

            {/* Core */}
            <m.div
              variants={coreVariants}
              className="absolute top-1/2 left-1/2 flex size-[10.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-accent/40 bg-ink-950/85 p-5 text-center shadow-glow backdrop-blur-md"
            >
              <span aria-hidden className="orbit-core-pulse absolute inset-0 rounded-full border border-accent/50" />
              <span className="label-mono text-accent">{code}</span>
              <span className="mt-2 text-[0.9375rem] leading-snug font-medium text-balance">{group.title}</span>
            </m.div>
          </m.div>
        </AnimatePresence>

        {/* Corner readouts */}
        <div aria-hidden className="label-mono pointer-events-none absolute inset-x-5 top-5 flex justify-between text-fg-subtle">
          <span>
            {moduleLabel} <span className="text-fg">{code}</span>
          </span>
          <span>{capabilitiesLabel}</span>
        </div>
        <div aria-hidden className="label-mono pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between text-fg-subtle">
          <span className="max-w-[60%] text-pretty">{group.annotation}</span>
          <span className="flex items-center gap-2">
            <span className="status-dot relative inline-block size-1.5 rounded-full bg-signal text-signal" />
            {position}
          </span>
        </div>
      </div>
    </Tilt>
  );
}
