"use client";

import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type PointerEvent } from "react";

import { useFinePointer, useMediaQuery } from "@/hooks/use-media-query";
import { pad } from "@/i18n/format";
import { useLocale } from "@/i18n/LocaleProvider";
import type { Principle } from "@/types/portfolio";

/*
 * Engineering principles laid out as a drafting sheet. A CAD cursor —
 * hairlines across the sheet and a live coordinate readout — follows the
 * pointer; the column under it is measured out by a dimension line while
 * the others recede. Scrolling through fills each outlined numeral in turn
 * and lets the numerals drift at different depths.
 */
export interface PrincipleBlueprintProps {
  principles: readonly Principle[];
  label: string;
}

export function PrincipleBlueprint({ principles, label }: PrincipleBlueprintProps) {
  const locale = useLocale();
  const sheetRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const finePointer = useFinePointer();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { scrollYProgress } = useScroll({ target: sheetRef, offset: ["start end", "end 0.4"] });

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (!finePointer || event.pointerType !== "mouse") return;
    const sheet = event.currentTarget;
    const rect = sheet.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    sheet.style.setProperty("--cx", `${x}px`);
    sheet.style.setProperty("--cy", `${y}px`);
    sheet.style.setProperty("--ca", "1");
    if (coordsRef.current) {
      coordsRef.current.textContent = `X ${String(Math.round(x)).padStart(4, "0")} · Y ${String(Math.round(y)).padStart(4, "0")}`;
    }
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--ca", "0");
  }

  return (
    <div
      ref={sheetRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="blueprint-sheet relative isolate overflow-hidden rounded-md border border-line bg-ink-900/50"
    >
      <span
        aria-hidden
        className="hairline-grid pointer-events-none absolute inset-0 -z-10 opacity-70 [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_80%)]"
      />
      {/* CAD cursor */}
      <span aria-hidden className="blueprint-cursor pointer-events-none absolute inset-0 z-20">
        <span className="blueprint-hair-x" />
        <span className="blueprint-hair-y" />
        <span className="blueprint-reticle" />
      </span>

      <div className="label-mono flex items-center justify-between gap-4 border-b border-line px-5 py-4 text-fg-subtle sm:px-8">
        <span className="flex items-center gap-3">
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          <span>{label}</span>
        </span>
        <span ref={coordsRef} aria-hidden dir="ltr" className="hidden tabular-nums text-accent sm:inline">
          X 0000 · Y 0000
        </span>
      </div>

      <ol className="blueprint-list grid sm:grid-cols-3">
        {principles.map((principle, index) => (
          <PrincipleColumn
            key={principle.title}
            index={index}
            total={principles.length}
            numeral={pad(locale, index + 1)}
            principle={principle}
            progress={scrollYProgress}
            still={reduceMotion}
          />
        ))}
      </ol>
    </div>
  );
}

interface PrincipleColumnProps {
  index: number;
  total: number;
  numeral: string;
  principle: Principle;
  progress: MotionValue<number>;
  still: boolean;
}

function PrincipleColumn({ index, total, numeral, principle, progress, still }: PrincipleColumnProps) {
  const start = 0.18 + (index / Math.max(1, total)) * 0.4;
  const fill = useTransform(progress, [start, start + 0.3], ["100%", "0%"]);
  const clip = useTransform(fill, (value) => `inset(${value} 0 0 0)`);
  const drift = useTransform(progress, [0, 1], [36 + index * 26, -24 - index * 14]);
  const rule = useTransform(progress, [start - 0.1, start + 0.2], [0, 1]);

  return (
    <li className="blueprint-col group relative flex flex-col px-5 pt-8 pb-9 transition-opacity duration-500 ease-out-quart sm:px-8 sm:pt-10 sm:pb-12 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-line sm:[&:not(:first-child)]:border-s sm:[&:not(:first-child)]:border-t-0">
      {/* Dimension line across the column */}
      <span aria-hidden dir="ltr" className="pointer-events-none absolute inset-x-5 top-4 flex items-center sm:inset-x-8">
        <span className="h-2 w-px bg-fg-subtle/60" />
        <m.span
          className="blueprint-dim h-px flex-1 origin-center bg-line-strong"
          style={still ? undefined : { scaleX: rule }}
        />
        <span className="h-2 w-px bg-fg-subtle/60" />
      </span>

      <m.span aria-hidden className="relative block w-fit" style={still ? undefined : { y: drift }}>
        <span className="blueprint-numeral block">{numeral}</span>
        <m.span
          className="blueprint-numeral blueprint-numeral-fill absolute inset-0"
          style={still ? undefined : { clipPath: clip }}
        >
          {numeral}
        </m.span>
      </m.span>

      <h4 className="mt-8 text-xl font-medium tracking-tight text-balance transition-colors duration-300 sm:mt-10">
        {principle.title}
      </h4>
      <p className="mt-3 text-sm text-pretty text-fg-muted transition-colors duration-300 group-hover:text-fg/80">
        {principle.body}
      </p>
    </li>
  );
}
