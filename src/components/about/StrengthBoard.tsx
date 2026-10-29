"use client";

import {
  Boxes,
  Cable,
  CodeXml,
  Compass,
  Database,
  Gauge,
  KeyRound,
  Layers,
  Network,
  PanelsTopLeft,
  ShieldCheck,
  Sparkles,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { m } from "motion/react";
import { useRef, type PointerEvent } from "react";

import { stagger, viewportOnce } from "@/components/motion/motion-variants";
import { RevealItem } from "@/components/motion/Reveal";
import { useFinePointer } from "@/hooks/use-media-query";
import { pad } from "@/i18n/format";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import type { Strength, StrengthIcon } from "@/types/portfolio";

const icons: Record<StrengthIcon, LucideIcon> = {
  code: CodeXml,
  architecture: Layers,
  api: Webhook,
  database: Database,
  modules: Boxes,
  scale: Network,
  auth: KeyRound,
  security: ShieldCheck,
  integrations: Cable,
  performance: Gauge,
  leadership: Compass,
  frontend: PanelsTopLeft,
  ai: Sparkles,
};

/** Pixels from the pointer within which a tile is lit. */
const LIGHT_RADIUS = 320;

/*
 * Key strengths as a board of tiles. One light follows the pointer across
 * the whole board: every tile near it glows from the pointer's direction,
 * so the light appears to pass from tile to tile. The first strength is the
 * core specialism and takes a larger, always-lit tile. Positions are written
 * to CSS variables, so moving the pointer never re-renders React.
 */
export interface StrengthBoardProps {
  strengths: readonly Strength[];
  coreLabel: string;
  /** Short supporting line for the core tile, e.g. "8+ years of professional programming". */
  coreMeta: string;
}

export function StrengthBoard({ strengths, coreLabel, coreMeta }: StrengthBoardProps) {
  const locale = useLocale();
  const boardRef = useRef<HTMLUListElement>(null);
  const finePointer = useFinePointer();

  function light(clientX: number | null, clientY: number | null) {
    const board = boardRef.current;
    if (!board) return;
    for (const tile of board.querySelectorAll<HTMLElement>(".strength-tile")) {
      if (clientX === null || clientY === null) {
        tile.style.setProperty("--spot-a", "0");
        continue;
      }
      const rect = tile.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      // Distance from the pointer to the nearest edge of the tile.
      const dx = Math.max(rect.left - clientX, 0, clientX - rect.right);
      const dy = Math.max(rect.top - clientY, 0, clientY - rect.bottom);
      const distance = Math.hypot(dx, dy);
      const strength = Math.max(0, 1 - distance / LIGHT_RADIUS);
      tile.style.setProperty("--spot-x", `${x}px`);
      tile.style.setProperty("--spot-y", `${y}px`);
      tile.style.setProperty("--spot-a", (strength * strength).toFixed(3));
    }
  }

  function handleMove(event: PointerEvent<HTMLUListElement>) {
    if (!finePointer || event.pointerType !== "mouse") return;
    light(event.clientX, event.clientY);
  }

  return (
    <m.ul
      ref={boardRef}
      onPointerMove={handleMove}
      onPointerLeave={() => light(null, null)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={stagger(0.04)}
      className="grid grid-cols-2 gap-3 sm:auto-rows-fr sm:grid-cols-3 lg:grid-cols-4"
    >
      {strengths.map((strength, index) => {
        const Icon = icons[strength.icon];
        const core = index === 0;
        return (
          <RevealItem
            as="li"
            variant="pop"
            key={strength.label}
            className={cn(
              "strength-tile group relative overflow-hidden rounded-md border border-line bg-tint/[0.02] p-4 sm:p-5",
              core && "col-span-2 border-accent/35 bg-accent-soft/60 sm:row-span-2",
            )}
          >
            {core ? (
              <>
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_70%_30%,#000,transparent_70%)]"
                  style={{ backgroundImage: "radial-gradient(circle, rgb(var(--t-dot) / 0.45) 1px, transparent 1.4px)", backgroundSize: "18px 18px" }}
                />
                <span aria-hidden className="absolute -end-10 -top-10 size-48 rounded-full border border-accent/30" />
                <span aria-hidden className="absolute -end-10 -top-10 size-48 rounded-full border border-accent/40 orbit-core-pulse" />
              </>
            ) : null}

            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center rounded-sm ring-1 transition-[background-color,color,rotate,box-shadow,ring-color] duration-500 ease-out-expo",
                    "group-hover:-rotate-6 group-hover:bg-accent group-hover:text-ink-950 group-hover:shadow-glow group-hover:ring-accent",
                    core ? "size-14 bg-accent text-ink-950 ring-accent sm:size-16" : "size-10 bg-accent-soft text-accent ring-accent/25",
                  )}
                >
                  <Icon className={core ? "size-7 sm:size-8" : "size-[1.15rem]"} strokeWidth={1.75} />
                </span>
                <span className="label-mono text-fg-subtle transition-colors duration-300 group-hover:text-accent">
                  {pad(locale, index + 1)}
                </span>
              </div>

              <div className="mt-auto pt-6 sm:pt-8">
                {core ? <span className="label-mono mb-3 block text-accent">{coreLabel}</span> : null}
                <p
                  className={cn(
                    "leading-snug font-medium text-balance text-fg/90 transition-colors duration-300 group-hover:text-fg",
                    core ? "text-xl sm:text-2xl" : "text-sm sm:text-[0.9375rem]",
                  )}
                >
                  {strength.label}
                </p>
                {core ? <p className="mt-3 font-mono text-xs text-fg-subtle">{coreMeta}</p> : null}
              </div>
            </div>
          </RevealItem>
        );
      })}
    </m.ul>
  );
}
