"use client";

import { useEffect, useRef } from "react";

import { useStageProgress } from "@/components/about/AboutStage";
import { localizeDigits } from "@/i18n/format";
import { useLocale } from "@/i18n/LocaleProvider";

export interface OdometerStat {
  /** ASCII digits, e.g. "8" or "06". */
  value: string;
  suffix?: string;
  label: string;
}

/** How much of the progress each stat takes; the rest staggers them. */
const STAT_SPAN = 0.62;

/*
 * Figures on mechanical counter wheels, turned by the scroll: scrolling on
 * rolls them forward to their values, scrolling back rolls them back. Lower
 * digits make extra turns, like a real odometer, and the rule above each
 * figure fills as it counts.
 */
export function StatOdometer({ stats }: { stats: readonly OdometerStat[] }) {
  const locale = useLocale();
  const ref = useRef<HTMLUListElement>(null);
  const progress = useStageProgress(ref, 0.46, 0.82, ["start 0.95", "start 0.5"]);
  const strip = Array.from({ length: 10 }, (_, digit) => localizeDigits(locale, digit));

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>("[data-stat]"));
    const apply = (value: number) => {
      items.forEach((item, index) => {
        const share = Math.min(1, Math.max(0, (value - (index * (1 - STAT_SPAN)) / Math.max(1, items.length - 1)) / STAT_SPAN));
        const eased = 1 - (1 - share) ** 3;
        item.style.setProperty("--fill", share.toFixed(3));
        for (const wheel of item.querySelectorAll<HTMLElement>("[data-wheel]")) {
          const stop = Number(wheel.dataset.wheel);
          wheel.style.transform = `translate3d(0, ${(-eased * stop).toFixed(3)}em, 0)`;
        }
      });
    };
    apply(progress.get());
    return progress.on("change", apply);
  }, [progress]);

  return (
    <ul ref={ref} className="grid grid-cols-3">
      {stats.map((stat) => {
        const digits = stat.value.split("");
        return (
          <li
            key={stat.label}
            data-stat=""
            className="odometer-stat relative pe-4 pt-6 [&:not(:first-child)]:border-s [&:not(:first-child)]:border-line [&:not(:first-child)]:ps-4"
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" />
            <span aria-hidden className="odometer-rule absolute inset-x-0 top-0 h-px bg-accent" />
            <p className="flex text-[clamp(2.25rem,4.4vw,3.75rem)] leading-none font-semibold tracking-[-0.05em]">
              <span className="sr-only">{localizeDigits(locale, stat.value)}</span>
              <span aria-hidden dir="ltr" className="flex">
                {digits.map((char, position) => {
                  const digit = Number(char);
                  // Lower digits turn more: units twice round, tens once, and so on.
                  const turns = digits.length - 1 - position + 1;
                  const stop = turns * 10 + digit;
                  return (
                    <span key={position} className="relative block h-[1em] overflow-hidden tabular-nums">
                      <span data-wheel={stop} className="block will-change-transform">
                        {Array.from({ length: stop + 1 }, (_, index) => (
                          <span key={index} className="block h-[1em]">
                            {strip[index % 10]}
                          </span>
                        ))}
                      </span>
                    </span>
                  );
                })}
              </span>
              {stat.suffix ? (
                <span aria-hidden className="text-accent">
                  {stat.suffix}
                </span>
              ) : null}
            </p>
            <p className="mt-3 text-xs leading-snug text-pretty text-fg-subtle sm:text-sm">{stat.label}</p>
          </li>
        );
      })}
    </ul>
  );
}
